/**
 * MAINTENANCE-ONLY — not a production or `next build` dependency.
 * Compare two normalized-style skill JSON files (or roots) for season drift / override verification.
 */
import path from "node:path";
import type { NormalizedSkillRecord, NormalizedSkillsFile } from "../../types/normalized";
import type { OverrideApplyReport, SkillListDiffReport } from "../../types/override";
import { parseArgs, readJsonFile, repoRoot, SEASON, writeJsonFile } from "./shared";

function indexById(file: NormalizedSkillsFile): Map<string, NormalizedSkillRecord> {
  return new Map(file.skills.map((s) => [s.definition.id, s]));
}

function changedFields(a: NormalizedSkillRecord, b: NormalizedSkillRecord): string[] {
  const fields: string[] = [];
  if (a.parseStatus !== b.parseStatus) fields.push("parseStatus");
  if (JSON.stringify(a.unparsedText) !== JSON.stringify(b.unparsedText)) fields.push("unparsedText");
  if (JSON.stringify(a.warnings) !== JSON.stringify(b.warnings)) fields.push("warnings");

  const da = a.definition;
  const db = b.definition;
  if (da.name !== db.name) fields.push("definition.name");
  if (da.family !== db.family) fields.push("definition.family");
  if (JSON.stringify(da.tags) !== JSON.stringify(db.tags)) fields.push("definition.tags");
  if (JSON.stringify(da.modifiers) !== JSON.stringify(db.modifiers)) fields.push("definition.modifiers");
  if (JSON.stringify(da.levelTable) !== JSON.stringify(db.levelTable)) fields.push("definition.levelTable");
  if (JSON.stringify(da.supportRules) !== JSON.stringify(db.supportRules)) fields.push("definition.supportRules");
  if (JSON.stringify(da.mechanics) !== JSON.stringify(db.mechanics)) fields.push("definition.mechanics");
  if (JSON.stringify(da.summaryText) !== JSON.stringify(db.summaryText)) fields.push("definition.summaryText");
  if (JSON.stringify(da.detailText) !== JSON.stringify(db.detailText)) fields.push("definition.detailText");
  return fields;
}

export function diffSkillLists(
  left: NormalizedSkillsFile,
  right: NormalizedSkillsFile,
  leftLabel: string,
  rightLabel: string,
): SkillListDiffReport {
  const L = indexById(left);
  const R = indexById(right);
  const leftIds = new Set(L.keys());
  const rightIds = new Set(R.keys());
  const added = [...rightIds].filter((id) => !leftIds.has(id)).sort();
  const removed = [...leftIds].filter((id) => !rightIds.has(id)).sort();
  const changed: SkillListDiffReport["changed"] = [];
  for (const id of leftIds) {
    if (!rightIds.has(id)) continue;
    const cf = changedFields(L.get(id)!, R.get(id)!);
    if (cf.length) changed.push({ id, changedFields: cf });
  }
  changed.sort((a, b) => a.id.localeCompare(b.id));
  return { leftLabel, rightLabel, added, removed, changed };
}

function resolvePath(maybe: string | boolean | undefined, fallback: string): string {
  return typeof maybe === "string" ? maybe : fallback;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const season = typeof args.season === "string" ? args.season : SEASON;
  const fileName = typeof args.file === "string" ? args.file : "active-skills.json";

  const defaultLeft = path.join(repoRoot, "data", "normalized", season, fileName);
  const defaultRight = path.join(repoRoot, "data", "effective", season, fileName);

  const leftPath = resolvePath(args.left, defaultLeft);
  const rightPath = resolvePath(args.right, defaultRight);

  const left = await readJsonFile<NormalizedSkillsFile>(leftPath);
  const right = await readJsonFile<NormalizedSkillsFile>(rightPath);
  if (!left || !right) {
    console.error("[diffSeasonData] Missing or invalid JSON:", { leftPath, rightPath });
    process.exit(1);
  }

  const report = diffSkillLists(left, right, leftPath, rightPath);

  const out: Record<string, unknown> = {
    skillsDiff: report,
    summary: {
      addedCount: report.added.length,
      removedCount: report.removed.length,
      changedCount: report.changed.length,
    },
  };

  if (args["with-override-report"] === true || args["with-override-report"] === "") {
    const ovrPath =
      typeof args.overrideReport === "string"
        ? args.overrideReport
        : path.join(repoRoot, "data", "effective", season, "override-report.json");
    const ovr = await readJsonFile<OverrideApplyReport>(ovrPath);
    if (ovr) {
      const touchedIds = [...new Set(ovr.skillFiles.flatMap((s) => s.touchedIds))].sort();
      const notesById: Record<string, string[]> = {};
      for (const sf of ovr.skillFiles) {
        for (const [id, notes] of Object.entries(sf.notesById)) {
          notesById[id] = [...(notesById[id] ?? []), ...notes];
        }
      }
      out.overrideTouches = { source: ovrPath, touchedIds, notesById };
    } else {
      out.overrideTouches = { source: ovrPath, error: "file not found" };
    }
  }

  const text = JSON.stringify(out, null, 2);
  console.log(text);

  if (typeof args.out === "string") {
    await writeJsonFile(args.out, out);
    console.error(`[diffSeasonData] wrote ${args.out}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
