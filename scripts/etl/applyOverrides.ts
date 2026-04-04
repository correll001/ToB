/**
 * MAINTENANCE-ONLY — not a production or `next build` dependency.
 * Merge `data/overrides/{season}` onto `data/normalized/{season}` → `data/effective/{season}`.
 * Does not modify normalized files.
 */
import { access, constants } from "node:fs/promises";
import path from "node:path";
import type { NormalizedGlobalRulesFile, NormalizedManifest, NormalizedSkillsFile } from "../../types/normalized";
import type { GlobalRulesOverrideDocument, OverrideApplyReport, SkillsOverrideDocument } from "../../types/override";
import { DATA_MERGE_ORDER } from "../../types/override";
import type { GlobalCombatRuleSet } from "../../types/rules";
import {
  OVERRIDES_SCHEMA_VERSION,
  SEASON,
  effectiveDir,
  ensureDir,
  normalizedDir,
  overridesDir,
  readJsonFile,
  writeJsonFile,
  repoRoot,
  parseArgs,
} from "./shared";
import { deepMerge } from "./deepMerge";
import { applySkillOverrideRecord, mergeOverrideEntriesForSameId, normalizeSkillId } from "./applySkillOverride";

async function pathExists(p: string): Promise<boolean> {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function groupSkillOverrides(doc: SkillsOverrideDocument): Map<string, ReturnType<typeof mergeOverrideEntriesForSameId>> {
  const byId = new Map<string, SkillsOverrideDocument["entries"]>();
  for (const e of doc.entries) {
    const id = normalizeSkillId(e.id);
    const arr = byId.get(id) ?? [];
    arr.push({ ...e, id });
    byId.set(id, arr);
  }
  const out = new Map<string, ReturnType<typeof mergeOverrideEntriesForSameId>>();
  for (const [id, arr] of byId) {
    out.set(id, mergeOverrideEntriesForSameId(arr));
  }
  return out;
}

async function applySkillFile(
  normPath: string,
  overridePath: string | null,
  family: "active" | "support" | "passive",
): Promise<{ file: string; data: NormalizedSkillsFile; report: OverrideApplyReport["skillFiles"][0] }> {
  const norm = await readJsonFile<NormalizedSkillsFile>(normPath);
  if (!norm) {
    throw new Error(`Missing normalized file: ${normPath}`);
  }

  const report: OverrideApplyReport["skillFiles"][0] = {
    file: path.basename(normPath),
    overrideSource: overridePath ? path.relative(process.cwd(), overridePath) : null,
    touchedIds: [],
    notesById: {},
  };

  const doc = overridePath ? await readJsonFile<SkillsOverrideDocument>(overridePath) : null;
  if (!overridePath || !doc) {
    return {
      file: report.file,
      data: norm,
      report: { ...report, overrideSource: null },
    };
  }

  if (doc.family !== family) {
    console.warn(`[applyOverrides] ${overridePath} family=${doc.family} expected ${family}`);
  }

  const byId = groupSkillOverrides(doc);
  const skills = norm.skills.map((rec) => {
    const id = rec.definition.id;
    const entry = byId.get(id);
    if (!entry) return rec;
    report.touchedIds.push(id);
    if (entry.notes?.length) {
      report.notesById[id] = entry.notes;
    }
    return applySkillOverrideRecord(rec, entry);
  });

  const warningsCount = skills.reduce((n, s) => n + (s.warnings?.length ?? 0), 0);
  const data: NormalizedSkillsFile = {
    ...norm,
    meta: {
      ...norm.meta,
      warningsCount,
      effectiveLayer: `overrides@${doc.version}`,
    },
    skills,
  };

  return { file: report.file, data, report };
}

function mergeGlobalRules(
  norm: NormalizedGlobalRulesFile,
  patch: Partial<GlobalCombatRuleSet> | undefined,
  layerLabel: string,
): NormalizedGlobalRulesFile {
  if (!patch || Object.keys(patch).length === 0) {
    return norm;
  }
  const mergedRules = deepMerge(
    norm.rules as unknown as Record<string, unknown>,
    patch as unknown as Record<string, unknown>,
  ) as GlobalCombatRuleSet;
  return {
    ...norm,
    meta: {
      ...norm.meta,
      effectiveLayer: layerLabel,
    },
    rules: mergedRules,
  };
}

export async function runApplyOverrides(season: string = SEASON): Promise<OverrideApplyReport> {
  const nDir = normalizedDir(season);
  const oDir = overridesDir(season);
  const eDir = effectiveDir(season);
  await ensureDir(eDir);
  const generatedAt = new Date().toISOString();

  const skillPairs: Array<{
    norm: string;
    ovr: string;
    family: "active" | "support" | "passive";
    outName: string;
  }> = [
    {
      norm: path.join(nDir, "active-skills.json"),
      ovr: path.join(oDir, "active-skills.json"),
      family: "active",
      outName: "active-skills.json",
    },
    {
      norm: path.join(nDir, "support-skills.json"),
      ovr: path.join(oDir, "support-skills.json"),
      family: "support",
      outName: "support-skills.json",
    },
    {
      norm: path.join(nDir, "passive-skills.json"),
      ovr: path.join(oDir, "passive-skills.json"),
      family: "passive",
      outName: "passive-skills.json",
    },
  ];

  const skillReports: OverrideApplyReport["skillFiles"] = [];
  for (const pair of skillPairs) {
    const ovrPath = (await pathExists(pair.ovr)) ? pair.ovr : null;
    const r = await applySkillFile(pair.norm, ovrPath, pair.family);
    await writeJsonFile(path.join(eDir, pair.outName), r.data);
    skillReports.push(r.report);
  }

  const skillLevelPath = path.join(nDir, "skill-level-rules.json");
  const combatPath = path.join(nDir, "combat-rules.json");
  let skillLevel = await readJsonFile<NormalizedGlobalRulesFile>(skillLevelPath);
  let combat = await readJsonFile<NormalizedGlobalRulesFile>(combatPath);
  if (!skillLevel) {
    throw new Error(`Missing normalized file: ${skillLevelPath}`);
  }
  if (!combat) {
    throw new Error(`Missing normalized file: ${combatPath}`);
  }

  const globalOvrPath = path.join(oDir, "global-rules.json");
  const globalDoc = (await pathExists(globalOvrPath)) ? await readJsonFile<GlobalRulesOverrideDocument>(globalOvrPath) : null;

  let skillLevelTouched = false;
  let combatTouched = false;
  const layer = globalDoc ? `overrides@${globalDoc.version}` : "";

  if (globalDoc?.skillLevelRulesMerge && Object.keys(globalDoc.skillLevelRulesMerge).length > 0) {
    skillLevel = mergeGlobalRules(skillLevel, globalDoc.skillLevelRulesMerge, layer);
    skillLevelTouched = true;
  }
  if (globalDoc?.combatRulesMerge && Object.keys(globalDoc.combatRulesMerge).length > 0) {
    combat = mergeGlobalRules(combat, globalDoc.combatRulesMerge, layer);
    combatTouched = true;
  }

  await writeJsonFile(path.join(eDir, "skill-level-rules.json"), skillLevel);
  await writeJsonFile(path.join(eDir, "combat-rules.json"), combat);

  const normManifestPath = path.join(nDir, "manifest.json");
  const normManifest = await readJsonFile<NormalizedManifest>(normManifestPath);
  if (normManifest) {
    await writeJsonFile(path.join(eDir, "manifest-source.json"), normManifest);
    const prefixNorm = `data/normalized/${season}`;
    const prefixEff = `data/effective/${season}`;
    const effManifest: NormalizedManifest = {
      ...normManifest,
      generatedAt,
      artifacts: normManifest.artifacts.map((a) => ({
        ...a,
        path: a.path.startsWith(prefixNorm) ? a.path.replace(prefixNorm, prefixEff) : a.path,
      })),
    };
    await writeJsonFile(path.join(eDir, "manifest.json"), effManifest);
  }

  const report: OverrideApplyReport = {
    season,
    generatedAt,
    overridesSchemaVersion: OVERRIDES_SCHEMA_VERSION,
    mergeOrder: [...DATA_MERGE_ORDER],
    skillFiles: skillReports,
    globalRules: {
      skillLevelTouched,
      combatTouched,
      globalOverrideSource: globalDoc ? path.relative(repoRoot, globalOvrPath) : null,
    },
  };
  await writeJsonFile(path.join(eDir, "override-report.json"), report);
  console.log(
    `[applyOverrides] ${season} → ${path.relative(repoRoot, eDir)}; touched skills: ${skillReports.reduce((n, s) => n + s.touchedIds.length, 0)}`,
  );
  return report;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const season = typeof args.season === "string" ? args.season : SEASON;
  await runApplyOverrides(season);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
