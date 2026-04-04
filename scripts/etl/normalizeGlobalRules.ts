/**
 * MAINTENANCE-ONLY — not a production or `next build` dependency.
 * Raw Skill_Level + Character_Build index pages → normalized global rule JSON.
 */
import * as cheerio from "cheerio";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { NormalizedGlobalRulesFile, NormalizedManifest } from "../../types/normalized";
import type { CharacterBuildRuleSection, GlobalCombatRuleSet, Post20SkillScalingRule } from "../../types/rules";
import {
  NORMALIZE_PARSER_VERSION,
  SEASON,
  ensureDir,
  indexesDir,
  normalizedRoot,
  writeJsonFile,
} from "./shared";

function extractSkillLevelRules(html: string): GlobalCombatRuleSet {
  const $ = cheerio.load(html);
  const paragraphs: string[] = [];
  $("RichText").each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim().replace(/%%/g, "%");
    if (t.length) paragraphs.push(t);
  });
  const unique = [...new Set(paragraphs)];

  const post20Lines = unique.filter((p) => /(21|30|31)|超過\s*20|20\s*級/.test(p));

  const post20Scaling: Post20SkillScalingRule[] = [
    {
      id: "tlidb-skill-level-post20-more-mDamage",
      labels: ["post-20", "tiered-more-damage"],
      description: post20Lines,
      fromLevel: 21,
      toLevel: null,
      textLines: post20Lines,
    },
  ];

  return {
    id: "tlidb-skill-level-ss12",
    season: SEASON,
    version: "1.0.0",
    locale: "tw",
    sourceUrls: ["https://tlidb.com/tw/Skill_Level"],
    post20Scaling,
    extensions: {
      wikiRichTextParagraphs: unique,
    },
  };
}

function extractCharacterBuildRules(html: string): GlobalCombatRuleSet {
  const $ = cheerio.load(html);
  const characterBuildRules: CharacterBuildRuleSection[] = [];

  $(".tab-pane").each((_, pane) => {
    const $pane = $(pane);
    const sectionId = $pane.attr("id") ?? `section-${characterBuildRules.length}`;
    const title = $pane.find(".card-header").first().text().replace(/\s+/g, " ").trim();
    const text = $pane
      .find(".card-text")
      .first()
      .text()
      .replace(/\r\n/g, "\n")
      .trim();
    const bullets = text
      .split(/\n\s*\n+/)
      .map((b) => b.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    characterBuildRules.push({
      sectionId,
      title: title || undefined,
      bullets: bullets.length ? bullets : undefined,
    });
  });

  return {
    id: "tlidb-character-build-ss12",
    season: SEASON,
    version: "1.0.0",
    locale: "en",
    sourceUrls: ["https://tlidb.com/en/Character_Build"],
    characterBuildRules,
    extensions: {
      tabSectionCount: characterBuildRules.length,
    },
  };
}

export type NormalizeGlobalRulesResult = {
  artifacts: NormalizedManifest["artifacts"];
};

export async function runNormalizeGlobalRules(): Promise<NormalizeGlobalRulesResult> {
  await ensureDir(normalizedRoot());
  const generatedAt = new Date().toISOString();

  const skillLevelPath = path.join(indexesDir(), "Skill_Level.html");
  const charBuildPath = path.join(indexesDir(), "Character_Build.html");

  const skillHtml = await readFile(skillLevelPath, "utf8");
  const buildHtml = await readFile(charBuildPath, "utf8");

  const skillRules = extractSkillLevelRules(skillHtml);
  const buildRules = extractCharacterBuildRules(buildHtml);

  const skillDoc: NormalizedGlobalRulesFile = {
    meta: {
      season: SEASON,
      locale: "tw",
      generatedAt,
      parserVersion: NORMALIZE_PARSER_VERSION,
      sourceCount: 1,
      warningsCount: 0,
    },
    rules: skillRules,
  };

  const combatDoc: NormalizedGlobalRulesFile = {
    meta: {
      season: SEASON,
      locale: "en",
      generatedAt,
      parserVersion: NORMALIZE_PARSER_VERSION,
      sourceCount: buildRules.characterBuildRules?.length ?? 0,
      warningsCount: 0,
    },
    rules: buildRules,
  };

  await writeJsonFile(path.join(normalizedRoot(), "skill-level-rules.json"), skillDoc);
  await writeJsonFile(path.join(normalizedRoot(), "combat-rules.json"), combatDoc);

  const artifacts: NormalizedManifest["artifacts"] = [
    {
      path: `data/normalized/${SEASON}/skill-level-rules.json`,
      kind: "skill-level-rules",
      recordCount: 1,
      warningsCount: 0,
    },
    {
      path: `data/normalized/${SEASON}/combat-rules.json`,
      kind: "combat-rules",
      recordCount: buildRules.characterBuildRules?.length ?? 0,
      warningsCount: 0,
    },
  ];

  return { artifacts };
}

async function main(): Promise<void> {
  const { artifacts } = await runNormalizeGlobalRules();
  console.log("[normalizeGlobalRules] wrote skill-level-rules.json, combat-rules.json");
  console.log(artifacts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
