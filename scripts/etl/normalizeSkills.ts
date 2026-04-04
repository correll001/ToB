/**
 * Raw HTML skill pages → normalized JSON (active / support / passive).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { NormalizedManifest, NormalizedSkillsFile, ParseStatus } from "../../types/normalized";
import type { SkillUrlRecord } from "./fetchSkillIndexes";
import { missingRawPageRecord, parseSkillPageHtml } from "./skillPageParser";
import {
  NORMALIZE_PARSER_VERSION,
  PARSER_VERSION,
  SEASON,
  ensureDir,
  manifestsDir,
  normalizedRoot,
  readJsonFile,
  skillPageHtmlPath,
  writeJsonFile,
} from "./shared";

export type NormalizeSkillsResult = {
  artifacts: NormalizedManifest["artifacts"];
};

function countByStatus(records: { parseStatus: ParseStatus }[]): Record<ParseStatus, number> {
  const o: Record<ParseStatus, number> = { ok: 0, partial: 0, failed: 0 };
  for (const r of records) {
    o[r.parseStatus]++;
  }
  return o;
}

function warningsTotal(records: { warnings?: string[] }[]): number {
  return records.reduce((n, r) => n + (r.warnings?.length ?? 0), 0);
}

export async function runNormalizeSkills(): Promise<NormalizeSkillsResult> {
  const skillListPath = path.join(manifestsDir(), "skill-urls.json");
  const data = await readJsonFile<{ skills: SkillUrlRecord[] }>(skillListPath);
  if (!data?.skills?.length) {
    throw new Error("Missing or empty data/raw/ss12/manifests/skill-urls.json — run etl:skills:index && etl:skills:pages first.");
  }

  await ensureDir(normalizedRoot());

  const active: NormalizedSkillsFile["skills"] = [];
  const support: NormalizedSkillsFile["skills"] = [];
  const passive: NormalizedSkillsFile["skills"] = [];

  for (const s of data.skills) {
    const htmlPath = skillPageHtmlPath(s.locale, s.slug);
    let html = "";
    try {
      html = await readFile(htmlPath, "utf8");
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e);
      const rec = missingRawPageRecord({
        slug: s.slug,
        sourceUrl: s.sourceUrl,
        locale: s.locale,
        season: SEASON,
        kind: s.kind,
        parseCandidateName: s.parseCandidateName,
        reason,
      });
      rec.definition.parserVersion = `${PARSER_VERSION}/${NORMALIZE_PARSER_VERSION}`;
      if (s.kind === "active") active.push(rec);
      else if (s.kind === "support") support.push(rec);
      else passive.push(rec);
      continue;
    }

    const rec = parseSkillPageHtml(html, {
      slug: s.slug,
      sourceUrl: s.sourceUrl,
      locale: s.locale,
      season: SEASON,
      kind: s.kind,
      parseCandidateName: s.parseCandidateName,
    });
    rec.definition.parserVersion = `${PARSER_VERSION}/${NORMALIZE_PARSER_VERSION}`;

    if (s.kind === "active") active.push(rec);
    else if (s.kind === "support") support.push(rec);
    else passive.push(rec);
  }

  const generatedAt = new Date().toISOString();

  const writeSkillsFile = async (
    fname: string,
    skills: NormalizedSkillsFile["skills"],
    kind: NormalizedManifest["artifacts"][0]["kind"],
  ) => {
    const w = warningsTotal(skills);
    const doc: NormalizedSkillsFile = {
      meta: {
        season: SEASON,
        locale: "tw",
        generatedAt,
        parserVersion: NORMALIZE_PARSER_VERSION,
        sourceCount: skills.length,
        warningsCount: w,
      },
      skills,
    };
    await writeJsonFile(path.join(normalizedRoot(), fname), doc);
    return {
      path: `data/normalized/${SEASON}/${fname}`,
      kind,
      recordCount: skills.length,
      parseStatusSummary: countByStatus(skills),
      warningsCount: w,
    } satisfies NormalizedManifest["artifacts"][0];
  };

  const artifacts: NormalizedManifest["artifacts"] = [
    await writeSkillsFile("active-skills.json", active, "active-skills"),
    await writeSkillsFile("support-skills.json", support, "support-skills"),
    await writeSkillsFile("passive-skills.json", passive, "passive-skills"),
  ];

  return { artifacts };
}

async function main(): Promise<void> {
  const { artifacts } = await runNormalizeSkills();
  console.log("[normalizeSkills] wrote:", artifacts.map((a) => `${a.kind} ${a.recordCount} records`).join(", "));
  for (const a of artifacts) {
    console.log(`  ${a.path}`, a.parseStatusSummary, `warnings=${a.warningsCount}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
