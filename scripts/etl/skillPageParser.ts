/**
 * TLIDB skill detail HTML → NormalizedSkillRecord.
 * Relies on stable class names (card / explicitMod / tag); when layout shifts, expect more partials.
 */
import * as cheerio from "cheerio";
import type { NormalizedSkillRecord, ParseStatus } from "../../types/normalized";
import type {
  ModifierDefinition,
  SkillDefinition,
  SkillFamily,
  SkillLevelEntry,
  SupportRule,
} from "../../types/skillData";
import type { SkillKind } from "./shared";

const HIGH_TIER_ACTIVE = new Set([
  "Leap_Attack",
  "Ice_Shot",
  "Hammer_of_Ash",
  "Chromatic_Shot",
  "Resurrection_Warcry",
  "Whirlwind",
  "Blink",
  "Bombard",
  "Split_Firebolt",
  "Blizzard",
  "Chain_Lightning",
  "Ring_of_Ice",
  "Rain_of_Arrows",
  "Black_Hole",
  "Summon_Machine_Guard",
  "Lightning_Shot",
  "Frost_Impact",
  "Path_of_Flames",
  "Double_Thrusts",
  "Mind_Control",
]);

const HIGH_TIER_SUPPORT = new Set([
  "Multiple_Projectiles",
  "Multistrike",
  "Projectile_Split",
  "Increased_Area",
  "Melee_Knockback",
  "Overload",
  "Tendonslicer",
  "Glacial_Freeze",
  "Additional_Ignite",
  "High_Voltage",
  "Quick_Mobility",
  "Extended_Duration",
  "Spell_Concentration",
  "Added_Erosion_Damage",
  "Critical_Strike_Rating_Increase",
  "Critical_Strike_Damage_Increase",
  "Physical_to_Fire",
  "Lightning_to_Cold",
  "Deep_Wounds",
  "Improved_Corrosion",
]);

const HIGH_TIER_PASSIVE = new Set([
  "Fearless",
  "Weapon_Amplification",
  "Rejuvenation",
  "Frigid_Domain",
  "Electric_Conversion",
  "Nimbleness",
  "Spell_Amplification",
  "Steadfast",
  "Erosion_Amplification",
  "Deep_Pain",
]);

export function isHighTierSample(kind: SkillKind, slug: string): boolean {
  if (kind === "active") return HIGH_TIER_ACTIVE.has(slug);
  if (kind === "support") return HIGH_TIER_SUPPORT.has(slug);
  return HIGH_TIER_PASSIVE.has(slug);
}

function normText(s: string): string {
  return s.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

function parseLevelBreakpointsFromDescription(html: string): SkillLevelEntry[] {
  const re = /\(Lv(\d+):([^)]+)\)/g;
  const out: SkillLevelEntry[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const level = parseInt(m[1], 10);
    const rest = normText(m[2]);
    out.push({ level, textLines: [rest], partial: true });
  }
  return out;
}

function extractSupportModifiers(modText: string): ModifierDefinition[] {
  const mods: ModifierDefinition[] = [];
  const proj = /\+(\d+)\s*投射物/;
  const m1 = proj.exec(modText);
  if (m1) {
    mods.push({
      selector: { kind: "supportedSkill" },
      operation: "add",
      stat: "projectileCount",
      value: parseInt(m1[1], 10),
      valueKind: "flat",
      sourceText: m1[0],
    });
  }
  const pct = /額外\s*\+?(\d+(?:\.\d+)?)\s*%?\s*傷害/;
  const m2 = pct.exec(modText);
  if (m2) {
    mods.push({
      selector: { kind: "supportedSkill" },
      operation: "mul",
      stat: "damage.increased",
      value: parseFloat(m2[1]),
      valueKind: "increased",
      sourceText: m2[0],
    });
  }
  return mods;
}

function inferSupportRule(tags: string[], modBlob: string): SupportRule {
  const rule: SupportRule = {};
  const tagStr = tags.join(" ");
  const has = (t: string) => tags.includes(t) || modBlob.includes(t);
  if (has("投射物")) rule.requiresProjectile = true;
  if (modBlob.includes("輔助攻擊") || modBlob.includes("攻擊技能")) rule.requiresAttack = true;
  if (modBlob.includes("輔助法術") || modBlob.includes("法術技能")) rule.requiresSpell = true;
  if (modBlob.includes("引導")) rule.requiresChanneled = true;
  const allowed: string[] = [];
  if (tagStr.includes("投射物")) allowed.push("Projectile");
  if (tagStr.includes("輔助")) allowed.push("Support");
  if (tagStr.includes("近戰")) allowed.push("Melee");
  if (tagStr.includes("法術")) allowed.push("Spell");
  if (tagStr.includes("攻擊")) allowed.push("Attack");
  if (allowed.length) rule.allowedSkillTags = [...new Set(allowed)];
  if (rule.requiresProjectile || rule.requiresAttack || rule.requiresSpell) {
    const lines: string[] = [];
    if (rule.requiresProjectile) lines.push("Inferred: requires projectile skill");
    if (rule.requiresAttack) lines.push("Inferred: requires attack skill");
    if (rule.requiresSpell) lines.push("Inferred: requires spell skill");
    if (rule.requiresChanneled) lines.push("Inferred: requires channeled skill");
    rule.rawRequirementLines = lines;
  }
  return rule;
}

function extractActiveWeaponPct(modText: string): ModifierDefinition[] {
  const mods: ModifierDefinition[] = [];
  const re = /造成\s*(\d+(?:\.\d+)?)\s*%\s*武器攻擊傷害/g;
  let m: RegExpExecArray | null;
  let idx = 0;
  while ((m = re.exec(modText)) !== null) {
    idx++;
    mods.push({
      id: `weaponDamagePct-${idx}`,
      selector: { kind: "skill" },
      operation: "add",
      stat: "skill.weaponDamagePct",
      value: parseFloat(m[1]),
      valueKind: "flat",
      sourceText: m[0],
    });
  }
  return mods;
}

export function parseSkillPageHtml(
  html: string,
  input: {
    slug: string;
    sourceUrl: string;
    locale: string;
    season: string;
    kind: SkillKind;
    parseCandidateName: string;
  },
): NormalizedSkillRecord {
  const warnings: string[] = [];
  const unparsedChunks: string[] = [];
  const $ = cheerio.load(html);
  const h1 = normText($("h1").first().text());
  const name = h1 || input.parseCandidateName || input.slug;

  const card = $(".card.ui_item.popupItem").not(".previousItem").first();
  const cardEl = card.length ? card : $(".card.ui_item.popupItem").first();

  if (!cardEl.length) {
    warnings.push("no_skill_card");
    return buildRecord(
      "failed",
      minimalDefinition(input, name, [], [], []),
      warnings,
      ["Could not find .card.ui_item"],
    );
  }

  const tags = cardEl
    .find(".tag.tlborder")
    .map((_, e) => normText($(e).text()))
    .get()
    .filter(Boolean);

  const detailLines: string[] = [];
  cardEl.find(".explicitMod").each((_, e) => {
    const t = normText($(e).text());
    if (t) detailLines.push(t);
  });

  const uniqueDetail = [...new Set(detailLines)];
  const modBlob = uniqueDetail.join("\n");

  const family: SkillFamily = input.kind;
  const definition = minimalDefinition(
    input,
    name,
    tags,
    uniqueDetail.slice(0, 1),
    uniqueDetail.slice(1),
    family,
  );

  if (uniqueDetail.length === 0) {
    warnings.push("no_explicitMod");
  }

  definition.summaryText = uniqueDetail.slice(0, 1);
  definition.detailText = uniqueDetail.slice(1);

  let levelMode: SkillDefinition["levelScalingMode"] = "unknown";
  const allSmall = cardEl.find("small.description").text();
  const breakpoints = parseLevelBreakpointsFromDescription(allSmall);
  if (breakpoints.length) {
    definition.levelBreakpoints = breakpoints;
    levelMode = "breakpoints";
  }

  let manaLine = "";
  cardEl.find(".d-flex.justify-content-center").each((_, el) => {
    const t = normText($(el).text());
    if (t.includes("魔力消耗倍率")) manaLine = t;
  });
  if (input.kind === "support" && manaLine && /魔力消耗倍率/.test(manaLine)) {
    const mm = /(\d+(?:\.\d+)?)\s*%/.exec(manaLine);
    if (mm) {
      definition.modifiers = [
        ...(definition.modifiers ?? []),
        {
          selector: { kind: "supportedSkill" },
          operation: "mul",
          stat: "skill.manaCostMultiplier",
          value: parseFloat(mm[1]) / 100,
          sourceText: manaLine,
        },
      ];
    }
  }

  if (input.kind === "support") {
    const sr = inferSupportRule(tags, modBlob);
    if (Object.keys(sr).length > 0) definition.supportRules = sr;
    const sm = extractSupportModifiers(modBlob);
    if (sm.length) definition.modifiers = [...(definition.modifiers ?? []), ...sm];
  } else if (input.kind === "active") {
    const am = extractActiveWeaponPct(modBlob);
    if (am.length) definition.modifiers = [...am];
  }

  if (levelMode !== "unknown") {
    definition.levelScalingMode = levelMode;
  }

  if (breakpoints.length === 0 && /Lv\d+:/.test(allSmall)) {
    unparsedChunks.push(allSmall.trim());
  }

  const high = isHighTierSample(input.kind, input.slug);
  let status: ParseStatus = "partial";
  if (!h1) warnings.push("missing_h1_used_fallback_name");
  if (tags.length === 0) warnings.push("no_tags");

  const modsCount = definition.modifiers?.length ?? 0;
  const bpCount = definition.levelBreakpoints?.length ?? 0;

  if (uniqueDetail.length === 0 && tags.length === 0) {
    status = "failed";
  } else if (high) {
    const supportOk =
      input.kind === "support" && (modsCount >= 1 || bpCount >= 1 || (definition.supportRules != null && Object.keys(definition.supportRules).length > 0));
    const activeOk = input.kind === "active" && modsCount >= 1;
    const passiveOk = input.kind === "passive" && uniqueDetail.length >= 2;
    if (supportOk || activeOk || passiveOk) {
      status = "ok";
    } else {
      status = "partial";
      warnings.push("high_tier_expectation_not_met");
    }
  } else if (uniqueDetail.length >= 1 && tags.length >= 1) {
    status = "ok";
  }

  return buildRecord(status, definition, warnings, unparsedChunks.length ? unparsedChunks : undefined);
}

function minimalDefinition(
  input: { slug: string; sourceUrl: string; locale: string; season: string; kind: SkillKind },
  name: string,
  tags: string[],
  summaryText: string[],
  detailText: string[],
  family?: SkillFamily,
): SkillDefinition {
  return {
    id: `skill:${input.slug}`,
    name,
    family: family ?? input.kind,
    tags,
    sourceUrl: input.sourceUrl,
    locale: input.locale,
    season: input.season,
    version: "1.0.0",
    summaryText,
    detailText,
  };
}

function buildRecord(
  parseStatus: ParseStatus,
  definition: SkillDefinition,
  warnings: string[],
  unparsedText?: string[],
): NormalizedSkillRecord {
  return {
    parseStatus,
    warnings: warnings.length ? warnings : undefined,
    unparsedText,
    definition,
  };
}

export function missingRawPageRecord(input: {
  slug: string;
  sourceUrl: string;
  locale: string;
  season: string;
  kind: SkillKind;
  parseCandidateName: string;
  reason: string;
}): NormalizedSkillRecord {
  return buildRecord(
    "failed",
    {
      id: `skill:${input.slug}`,
      name: input.parseCandidateName || input.slug,
      family: input.kind,
      tags: [],
      sourceUrl: input.sourceUrl,
      locale: input.locale,
      season: input.season,
      version: "1.0.0",
    },
    ["missing_raw_html", input.reason],
  );
}
