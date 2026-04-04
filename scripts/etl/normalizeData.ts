/**
 * One-shot: skills + global rules + aggregate manifest.json
 */
import path from "node:path";
import type { NormalizedManifest } from "../../types/normalized";
import { NORMALIZE_PARSER_VERSION, SEASON, ensureDir, normalizedRoot, writeJsonFile } from "./shared";
import { runNormalizeGlobalRules } from "./normalizeGlobalRules";
import { runNormalizeSkills } from "./normalizeSkills";

async function main(): Promise<void> {
  await ensureDir(normalizedRoot());

  const [skills, globals] = await Promise.all([runNormalizeSkills(), runNormalizeGlobalRules()]);

  const manifest: NormalizedManifest = {
    season: SEASON,
    generatedAt: new Date().toISOString(),
    parserVersion: NORMALIZE_PARSER_VERSION,
    artifacts: [...skills.artifacts, ...globals.artifacts],
  };

  await writeJsonFile(path.join(normalizedRoot(), "manifest.json"), manifest);
  console.log("[normalizeData] manifest.json written, artifacts:", manifest.artifacts.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
