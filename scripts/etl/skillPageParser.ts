/**
 * MAINTENANCE-ONLY — not a production or `next build` dependency.
 * Skill detail HTML → NormalizedSkillRecord (offline parser).
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
  let idx = 0;
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
  const reIncDmg = /被輔助技能額外\s*\+?\s*(\d+(?:\.\d+)?)\s*%?\s*(?:近戰)?傷害/g;
  let dm: RegExpExecArray | null;
  while ((dm = reIncDmg.exec(modText)) !== null) {
    idx++;
    mods.push({
      id: `sup-inc-dmg-${idx}`,
      selector: { kind: "supportedSkill" },
      operation: "mul",
      stat: "damage.increased",
      value: parseFloat(dm[1]),
      valueKind: "increased",
      sourceText: dm[0],
    });
  }
  const pct = /額外\s*\+?\s*(\d+(?:\.\d+)?)\s*%?\s*傷害/;
  const m2 = pct.exec(modText);
  if (m2 && mods.every((m) => m.sourceText !== m2[0])) {
    mods.push({
      selector: { kind: "supportedSkill" },
      operation: "mul",
      stat: "damage.increased",
      value: parseFloat(m2[1]),
      valueKind: "increased",
      sourceText: m2[0],
    });
  }
  const atkCast = /被輔助技能額外\s*\+?\s*(\d+(?:\.\d+)?)\s*%\s*攻擊和施法速度/;
  const m3 = atkCast.exec(modText);
  if (m3) {
    mods.push({
      selector: { kind: "supportedSkill" },
      operation: "add",
      stat: "skill.attackSpeedIncreased",
      value: parseFloat(m3[1]),
      valueKind: "flat",
      sourceText: m3[0],
    });
  }
  const minusAtkSpd = /被輔助技能\s*([\-\u2212]?\d+(?:\.\d+)?)\s*%?\s*攻擊速度/;
  const m4 = minusAtkSpd.exec(modText);
  if (m4) {
    mods.push({
      selector: { kind: "supportedSkill" },
      operation: "add",
      stat: "skill.attackSpeedIncreased",
      value: parseFloat(m4[1].replace("\u2212", "-")),
      valueKind: "flat",
      sourceText: m4[0],
    });
  }
  const reAdded = /被輔助技能附加\s*(\d+)\s*[-–~至到]\s*(\d+)\s*點[^。\n]*/g;
  let ad: RegExpExecArray | null;
  while ((ad = reAdded.exec(modText)) !== null) {
    const mid = (parseInt(ad[1], 10) + parseInt(ad[2], 10)) / 2;
    mods.push({
      selector: { kind: "supportedSkill" },
      operation: "add",
      stat: "skill.addedBaseDamage",
      value: mid,
      valueKind: "flat",
      sourceText: ad[0],
    });
  }
  const ramp = /傷害遞增\s*(\d+(?:\.\d+)?)\s*%/;
  const mr = ramp.exec(modText);
  if (mr) {
    mods.push({
      selector: { kind: "supportedSkill" },
      operation: "mul",
      stat: "damage.increased",
      value: parseFloat(mr[1]),
      valueKind: "increased",
      sourceText: mr[0],
    });
  }
  return mods;
}

function mergeAllowedTags(rule: SupportRule, tags: string[]): void {
  if (!tags.length) return;
  rule.allowedSkillTags = [...new Set([...(rule.allowedSkillTags ?? []), ...tags])];
}

/**
 * TLIDB support text → SupportRule. Does not invent tags from the support gem's own 輔助 label.
 * Unknown clauses stay in rawRequirementLines only (partial trace).
 */
function inferSupportRule(tags: string[], modBlob: string): SupportRule {
  const rule: SupportRule = {};
  const auditLines: string[] = [];
  const blob = modBlob.replace(/\s+/g, " ");

  const forbidden: string[] = [];
  const addForb = (...canon: string[]) => forbidden.push(...canon);
  if (/無法輔助[^。]*投射物|不能輔助[^。]*投射物/.test(blob)) addForb("Projectile");
  if (/無法輔助[^。]*攻擊技能|不能輔助[^。]*攻擊技能/.test(blob)) addForb("Attack");
  if (/無法輔助[^。]*法術技能|不能輔助[^。]*法術技能/.test(blob)) addForb("Spell");
  if (/無法輔助[^。]*引導|不能輔助[^。]*引導/.test(blob)) addForb("Channeled");
  if (/無法輔助[^。]*位移|不能輔助[^。]*位移/.test(blob)) addForb("Mobility");
  if (/無法輔助[^。]*召喚|不能輔助[^。]*召喚/.test(blob)) addForb("Summon");
  if (/無法輔助[^。]*哨衛/.test(blob)) addForb("Sentinel");
  if (forbidden.length) {
    rule.forbiddenSkillTags = [...new Set(forbidden)];
    auditLines.push(`forbidden:${rule.forbiddenSkillTags.join(",")}`);
  }

  if (/輔助投射物技能|輔助\s*投射物技能/.test(blob)) {
    rule.requiresProjectile = true;
    mergeAllowedTags(rule, ["Projectile"]);
  }
  if (/輔助近戰攻擊技能|輔助\s*近戰攻擊/.test(blob)) {
    rule.requiresAttack = true;
    rule.requiresMelee = true;
    mergeAllowedTags(rule, ["Melee", "Attack"]);
  } else if (/輔助攻擊或法術技能|輔助攻擊、法術技能/.test(blob)) {
    mergeAllowedTags(rule, ["Attack", "Spell"]);
  } else if (/輔助攻擊技能/.test(blob)) {
    rule.requiresAttack = true;
    mergeAllowedTags(rule, ["Attack"]);
  }

  const forbidsSpellSkill = /無法輔助[^。]*法術技能|不能輔助[^。]*法術技能/.test(blob);
  if (!forbidsSpellSkill && (/輔助主動法術技能/.test(blob) || /輔助法術技能/.test(blob))) {
    rule.requiresSpell = true;
    mergeAllowedTags(rule, ["Spell"]);
  }

  if (!/無法輔助[^。]*引導|不能輔助[^。]*引導/.test(blob) && /輔助引導/.test(blob)) {
    rule.requiresChanneled = true;
    mergeAllowedTags(rule, ["Channeled"]);
  }

  if (/輔助範圍技能/.test(blob)) {
    mergeAllowedTags(rule, ["Area"]);
  }

  if (/輔助擊中敵人/.test(blob) && !(rule.allowedSkillTags?.length)) {
    mergeAllowedTags(rule, ["Attack", "Spell"]);
    auditLines.push("TLIDB: 輔助擊中敵人 → Attack|Spell");
  }

  if (rule.requiresProjectile) mergeAllowedTags(rule, ["Projectile"]);
  if (rule.requiresAttack) mergeAllowedTags(rule, ["Attack"]);
  if (rule.requiresSpell) mergeAllowedTags(rule, ["Spell"]);
  if (rule.requiresChanneled) mergeAllowedTags(rule, ["Channeled"]);
  if (rule.requiresMelee) mergeAllowedTags(rule, ["Melee"]);

  rule.allowedSkillTags = rule.allowedSkillTags?.filter((t) => t !== "Support");
  if (rule.allowedSkillTags?.length === 0) delete rule.allowedSkillTags;

  const unresolved =
    /輔助主動技能(?!。)/.test(blob) ||
    /輔助激發技能/.test(blob) ||
    /只能安裝/.test(blob) ||
    /糾纏/.test(blob);
  if (unresolved) {
    auditLines.push("TLIDB: partial — extra conditions not fully mapped to booleans; see skill text.");
  }

  if (auditLines.length) {
    rule.rawRequirementLines = [...(rule.rawRequirementLines ?? []), ...auditLines];
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

function mergeLevelTableRecords(
  target: Record<number, SkillLevelEntry>,
  chunk: Record<number, SkillLevelEntry>,
): void {
  for (const [ks, row] of Object.entries(chunk)) {
    const lv = Number(ks);
    const existing = target[lv];
    if (!existing) {
      target[lv] = row;
      continue;
    }
    target[lv] = {
      ...existing,
      ...row,
      textLines: [...(existing.textLines ?? []), ...(row.textLines ?? [])],
      level: lv,
    };
  }
}

function finalizeLevelEntryPartial(entry: SkillLevelEntry): void {
  const hasNumeric =
    (entry.weaponDamagePct != null && Number.isFinite(entry.weaponDamagePct)) ||
    (entry.baseDamage != null && typeof entry.baseDamage === "number") ||
    (entry.supportMoreDamageIncreasedPct != null && Number.isFinite(entry.supportMoreDamageIncreasedPct)) ||
    (entry.addedDamageEffectiveness != null && Number.isFinite(entry.addedDamageEffectiveness)) ||
    (entry.manaCost != null && Number.isFinite(entry.manaCost)) ||
    (entry.castTime != null && Number.isFinite(entry.castTime)) ||
    (entry.cooldown != null && Number.isFinite(entry.cooldown)) ||
    (entry.projectileCount != null && Number.isFinite(entry.projectileCount));
  const hasLines = (entry.textLines?.length ?? 0) > 0;
  entry.partial = !(hasNumeric || hasLines);
}

function enrichLevelEntryFromCombined(entry: SkillLevelEntry, combined: string): void {
  const wm = /造成\s*(\d+(?:\.\d+)?)\s*%\s*武器攻擊傷害/.exec(combined);
  if (wm && entry.weaponDamagePct == null) {
    entry.weaponDamagePct = parseFloat(wm[1]);
  }
  if (!entry.baseDamage) {
    const rangeM =
      /造成\s*(\d+)\s*[-–~至到]\s*(\d+)\s*法術[^。]*傷害/.exec(combined) ||
      /造成\s*(\d+)\s*[-–~至到]\s*(\d+)\s*點[^。]*傷害/.exec(combined);
    if (rangeM) {
      const a = parseInt(rangeM[1], 10);
      const b = parseInt(rangeM[2], 10);
      entry.baseDamage = (a + b) / 2;
    }
  }
  const pm =
    /(?:連續發射|基礎發射|基礎落下|發射)\s*(\d+)\s*個/.exec(combined) ||
    /(\d+)\s*個(?:冰錐|投射物)/.exec(combined);
  if (pm && entry.projectileCount == null) {
    entry.projectileCount = parseInt(pm[1], 10);
  }
  const ae =
    /附加傷害效用[^+\d]*\+?\s*(\d+(?:\.\d+)?)\s*%/.exec(combined) ||
    /傷害效用[^+\d]*(\d+(?:\.\d+)?)\s*%/.exec(combined);
  if (ae && entry.addedDamageEffectiveness == null) {
    const v = parseFloat(ae[1]);
    entry.addedDamageEffectiveness = v > 4 ? v / 100 : v;
  }
}

function parseFourColumnGrowthTable(
  $: cheerio.CheerioAPI,
  table: cheerio.Cheerio<any>,
  headers: string[],
): Record<number, SkillLevelEntry> {
  const out: Record<number, SkillLevelEntry> = {};
  const joined = headers.join(" ");
  table.find("tbody tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 4) return;
    const lv = parseInt(normText($(tds[0]).text()), 10);
    if (!Number.isFinite(lv)) return;
    const pctText = normText($(tds[1]).text());
    const dmgText = normText($(tds[2]).text());
    const descText = normText($(tds[3]).text());
    const combined = `${dmgText} ${descText}`;

    const entry: SkillLevelEntry = {
      level: lv,
      textLines: [combined.length > 280 ? combined.slice(0, 277) + "…" : combined],
    };

    const pctOnly = /(\d+(?:\.\d+)?)\s*%/.exec(pctText);
    const weaponInCombo = /武器攻擊傷害/.test(combined);
    enrichLevelEntryFromCombined(entry, combined);
    if (weaponInCombo && entry.weaponDamagePct == null && pctOnly) {
      entry.weaponDamagePct = parseFloat(pctOnly[1]);
    } else if (!weaponInCombo && !/法術/.test(combined) && entry.weaponDamagePct == null && pctOnly && entry.baseDamage == null) {
      entry.weaponDamagePct = parseFloat(pctOnly[1]);
    }

    finalizeLevelEntryPartial(entry);
    out[lv] = entry;
  });
  return out;
}

function parseTwoColumnGrowthTable($: cheerio.CheerioAPI, table: cheerio.Cheerio<any>, headers: string[]): Record<number, SkillLevelEntry> {
  const out: Record<number, SkillLevelEntry> = {};
  const colName = headers[1] ?? "value";
  table.find("tbody tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 2) return;
    const lv = parseInt(normText($(tds[0]).text()), 10);
    if (!Number.isFinite(lv)) return;
    const v = normText($(tds[1]).text());
    out[lv] = {
      level: lv,
      textLines: [`${colName}: ${v}`],
      partial: false,
    };
  });
  return out;
}

/** True when a 成長 column is clearly "extra % damage" for the supported skill (not proc, duration, speed, crit rating, …). */
function supportGrowthHeaderIsExtraDamageIncreased(header: string): boolean {
  if (/%\s*機率/.test(header)) return false;
  if (!/傷害/.test(header)) return false;
  if (/點燃|暴擊值|持續時間|攻擊和施法速度|施法速度|攻擊速度|召喚|哨衛/.test(header)) return false;
  return /額外|被輔助技能\s*額外/.test(header);
}

/** Support 成長 table: value column header + cell → structured level row fields. */
function parseSupportGrowthCell(raw: string, valueColumnHeader: string): Partial<SkillLevelEntry> {
  const header = valueColumnHeader;
  const v = normText(raw).replace(/，/g, ",");
  const tight = v.replace(/\s/g, "");

  /** Proc-chance column (e.g. Multistrike "+% 機率觸發") — not support damage increased %. */
  if (/%\s*機率/.test(header)) {
    return {};
  }

  const commaPair = /^(\d+)\s*,\s*(\d+)$/.exec(tight);
  if (commaPair) {
    const isFlatAddedGrowth =
      /被輔助技能附加/.test(header) ||
      /附加\s*\d+\s*[-–]/.test(header) ||
      /點\s*閃電|點\s*火焰|點\s*冰冷|點\s*物理|點\s*腐蝕/.test(header);
    if (!isFlatAddedGrowth) {
      return {};
    }
    const a = parseInt(commaPair[1], 10);
    const b = parseInt(commaPair[2], 10);
    if (Number.isFinite(a) && Number.isFinite(b)) {
      return { baseDamage: (a + b) / 2 };
    }
  }

  const slashInt = /^(\d+)\s*\/\s*(\d+)$/.exec(tight);
  if (slashInt && supportGrowthHeaderIsExtraDamageIncreased(header)) {
    const num = parseInt(slashInt[1], 10);
    const den = parseInt(slashInt[2], 10);
    if (den !== 0) {
      return { supportMoreDamageIncreasedPct: num / den };
    }
  }

  if (supportGrowthHeaderIsExtraDamageIncreased(header)) {
    const pct = /(\d+(?:\.\d+)?)\s*%/.exec(v);
    if (pct) return { supportMoreDamageIncreasedPct: parseFloat(pct[1]) };
  }

  const pctInline = /(\d+(?:\.\d+)?)\s*%/.exec(v);
  if (pctInline && supportGrowthHeaderIsExtraDamageIncreased(header)) {
    return { supportMoreDamageIncreasedPct: parseFloat(pctInline[1]) };
  }

  const plain = /^(\d+(?:\.\d+)?)$/.exec(tight);
  if (plain) {
    const n = parseFloat(plain[1]);
    if (/附加|點.*傷害|閃電|火焰|冰冷|物理|腐蝕/.test(header) && !/%/.test(header)) {
      return { baseDamage: n };
    }
    if (supportGrowthHeaderIsExtraDamageIncreased(header)) {
      return { supportMoreDamageIncreasedPct: n };
    }
    return {};
  }

  return {};
}

function parseSupportTwoColumnGrowthTable($: cheerio.CheerioAPI, table: cheerio.Cheerio<any>, headers: string[]): Record<number, SkillLevelEntry> {
  const out: Record<number, SkillLevelEntry> = {};
  const colName = headers[1] ?? "value";
  table.find("tbody tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 2) return;
    const lv = parseInt(normText($(tds[0]).text()), 10);
    if (!Number.isFinite(lv)) return;
    const cell = normText($(tds[1]).text());
    const entry: SkillLevelEntry = {
      level: lv,
      textLines: [`${colName}: ${cell}`],
      partial: false,
    };
    const parsed = parseSupportGrowthCell(cell, colName);
    if (parsed.baseDamage != null) entry.baseDamage = parsed.baseDamage;
    if (parsed.supportMoreDamageIncreasedPct != null) entry.supportMoreDamageIncreasedPct = parsed.supportMoreDamageIncreasedPct;
    finalizeLevelEntryPartial(entry);
    out[lv] = entry;
  });
  return out;
}

function parseSupportFourColumnGrowthTable($: cheerio.CheerioAPI, table: cheerio.Cheerio<any>, headers: string[]): Record<number, SkillLevelEntry> {
  const out: Record<number, SkillLevelEntry> = {};
  table.find("tbody tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 4) return;
    const lv = parseInt(normText($(tds[0]).text()), 10);
    if (!Number.isFinite(lv)) return;
    const pctText = normText($(tds[1]).text());
    const dmgText = normText($(tds[2]).text());
    const descText = normText($(tds[3]).text());
    const combined = `${dmgText} ${descText}`;
    const entry: SkillLevelEntry = {
      level: lv,
      textLines: [combined.length > 280 ? combined.slice(0, 277) + "…" : combined],
    };
    const fromDmg = parseSupportGrowthCell(dmgText, headers[2] ?? combined);
    const fromPct = parseSupportGrowthCell(pctText, headers[1] ?? combined);
    if (fromDmg.baseDamage != null) entry.baseDamage = fromDmg.baseDamage;
    if (fromDmg.supportMoreDamageIncreasedPct != null) entry.supportMoreDamageIncreasedPct = fromDmg.supportMoreDamageIncreasedPct;
    if (entry.supportMoreDamageIncreasedPct == null && fromPct.supportMoreDamageIncreasedPct != null) {
      entry.supportMoreDamageIncreasedPct = fromPct.supportMoreDamageIncreasedPct;
    }
    if (entry.baseDamage == null && fromPct.baseDamage != null) entry.baseDamage = fromPct.baseDamage;
    enrichLevelEntryFromCombined(entry, combined);
    finalizeLevelEntryPartial(entry);
    out[lv] = entry;
  });
  return out;
}

/** Support gems: numeric 成長 table (level → increased % / added flat). */
function parseSupportChengzhangLevelTables($: cheerio.CheerioAPI): Record<number, SkillLevelEntry> {
  const merged: Record<number, SkillLevelEntry> = {};
  $(".card.mb-2").each((_, cardNode) => {
    const card = $(cardNode);
    const header = normText(card.find(".card-header").first().text());
    if (!header.includes("成長")) return;
    const table = card.find("table.DataTable").first();
    if (!table.length) return;
    const headers = table
      .find("thead th")
      .map((_, th) => normText($(th).text()))
      .get();
    if (headers.length < 2) return;
    const h0 = headers[0]!.toLowerCase().replace(/\s+/g, "");
    if (!h0.includes("level")) return;

    const joined = headers.join(" ");
    const isFour =
      headers.length >= 4 &&
      (joined.includes("Descript") || joined.toLowerCase().includes("damage") || joined.includes("傷害"));

    const chunk = isFour
      ? parseSupportFourColumnGrowthTable($, table, headers)
      : parseSupportTwoColumnGrowthTable($, table, headers);
    mergeLevelTableRecords(merged, chunk);
  });

  const levels = Object.keys(merged)
    .map((k) => parseInt(k, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  const refLv = merged[20] ? 20 : levels.filter((n) => n <= 20).sort((a, b) => b - a)[0];
  if (refLv && merged[refLv]) propagateNumericLevelsFromRef(merged, refLv);

  return merged;
}

function propagateNumericLevelsFromRef(table: Record<number, SkillLevelEntry>, refLevel: number): void {
  const ref = table[refLevel];
  if (!ref) return;
  for (let lv = 1; lv <= 40; lv++) {
    if (lv === refLevel) continue;
    const row = table[lv];
    if (!row) continue;
    if (row.weaponDamagePct == null && ref.weaponDamagePct != null) row.weaponDamagePct = ref.weaponDamagePct;
    if (row.baseDamage == null && typeof ref.baseDamage === "number") row.baseDamage = ref.baseDamage;
    if (row.supportMoreDamageIncreasedPct == null && ref.supportMoreDamageIncreasedPct != null) {
      row.supportMoreDamageIncreasedPct = ref.supportMoreDamageIncreasedPct;
    }
    if (row.projectileCount == null && ref.projectileCount != null) row.projectileCount = ref.projectileCount;
    if (row.addedDamageEffectiveness == null && ref.addedDamageEffectiveness != null) {
      row.addedDamageEffectiveness = ref.addedDamageEffectiveness;
    }
  }
}

/** Only tables under a `成長` card — avoids minion / skill_level tables in other tabs. */
function parseChengzhangLevelTables($: cheerio.CheerioAPI): Record<number, SkillLevelEntry> {
  const merged: Record<number, SkillLevelEntry> = {};
  $(".card.mb-2").each((_, cardNode) => {
    const card = $(cardNode);
    const header = normText(card.find(".card-header").first().text());
    if (!header.includes("成長")) return;
    const table = card.find("table.DataTable").first();
    if (!table.length) return;
    const headers = table
      .find("thead th")
      .map((_, th) => normText($(th).text()))
      .get();
    if (headers.length < 2) return;
    const h0 = headers[0]!.toLowerCase().replace(/\s+/g, "");
    if (!h0.includes("level")) return;

    const joined = headers.join(" ");
    const isFour =
      headers.length >= 4 &&
      (joined.includes("Descript") || joined.toLowerCase().includes("damage") || joined.includes("傷害倍率"));

    const chunk = isFour ? parseFourColumnGrowthTable($, table, headers) : parseTwoColumnGrowthTable($, table, headers);
    mergeLevelTableRecords(merged, chunk);
  });

  const levels = Object.keys(merged)
    .map((k) => parseInt(k, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  const refLv = merged[20] ? 20 : levels.filter((n) => n <= 20).sort((a, b) => b - a)[0];
  if (refLv && merged[refLv]) propagateNumericLevelsFromRef(merged, refLv);

  return merged;
}

function applyCardResourceStatsToLevelTable(
  $: cheerio.CheerioAPI,
  cardEl: cheerio.Cheerio<any>,
  definition: SkillDefinition,
): void {
  const lt = definition.levelTable;
  if (!lt || Object.keys(lt).length === 0) return;

  const lvRaw = parseInt(normText(cardEl.find(".level").first().text()), 10);
  const cardLevel = Number.isFinite(lvRaw) ? Math.min(40, Math.max(1, lvRaw)) : 20;

  let mana: number | undefined;
  let castTime: number | undefined;
  let cooldown: number | undefined;

  cardEl.find(".d-flex.justify-content-center").each((_, el) => {
    const t = normText($(el).text());
    if (t.includes("魔力消耗") && !t.includes("魔力消耗倍率")) {
      const flat = t.replace(/\s/g, "");
      const m = /(\d+)$/.exec(flat) || /魔力消耗\D*(\d+)/.exec(t);
      if (m) mana = parseInt(m[1], 10);
    }
    if (t.includes("施法速度") || t.includes("攻擊速度")) {
      const m = /([\d.]+)\s*s\b/i.exec(t);
      if (m) castTime = parseFloat(m[1]);
    }
    if (t.includes("冷卻") && t.includes("秒")) {
      const m = /([\d.]+)\s*秒/.exec(t);
      if (m) cooldown = parseFloat(m[1]);
    }
  });

  const row = lt[cardLevel];
  if (!row) return;
  if (mana != null && row.manaCost == null) row.manaCost = mana;
  if (castTime != null && row.castTime == null) row.castTime = castTime;
  if (cooldown != null && row.cooldown == null) row.cooldown = cooldown;
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

  let levelScalingMode: SkillDefinition["levelScalingMode"] = "unknown";
  const allSmall = cardEl.find("small.description").text();
  const breakpoints = parseLevelBreakpointsFromDescription(allSmall);
  if (breakpoints.length) {
    definition.levelBreakpoints = breakpoints;
    levelScalingMode = "breakpoints";
  }

  if (input.kind === "active") {
    const growthTable = parseChengzhangLevelTables($);
    if (growthTable && Object.keys(growthTable).length > 0) {
      definition.levelTable = growthTable;
      levelScalingMode = "table";
    } else if (!breakpoints.length) {
      definition.unsupportedLevelDataReason = "no_growth_table_in_snapshot";
      warnings.push("active_no_growth_table");
    }
    applyCardResourceStatsToLevelTable($, cardEl, definition);
    const anyWeaponRow =
      definition.levelTable &&
      Object.values(definition.levelTable).some(
        (r) => r.weaponDamagePct != null && Number.isFinite(r.weaponDamagePct) && r.weaponDamagePct > 0,
      );
    if (!anyWeaponRow) {
      const am = extractActiveWeaponPct(modBlob);
      if (am.length) definition.modifiers = [...(definition.modifiers ?? []), ...am];
    }
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
    const growthTable = parseSupportChengzhangLevelTables($);
    if (growthTable && Object.keys(growthTable).length > 0) {
      definition.levelTable = growthTable;
      levelScalingMode = "table";
    } else if (!breakpoints.length) {
      definition.unsupportedLevelDataReason = "no_growth_table_in_snapshot";
      warnings.push("support_no_growth_table");
    }

    const sr = inferSupportRule(tags, modBlob);
    if (Object.keys(sr).length > 0) definition.supportRules = sr;

    let sm = extractSupportModifiers(modBlob);
    const lt = definition.levelTable;
    if (lt) {
      const hasLeveledBase = Object.values(lt).some((r) => typeof r.baseDamage === "number" && Number.isFinite(r.baseDamage));
      const hasLeveledInc = Object.values(lt).some(
        (r) => r.supportMoreDamageIncreasedPct != null && Number.isFinite(r.supportMoreDamageIncreasedPct),
      );
      if (hasLeveledBase) {
        sm = sm.filter((m) => m.stat !== "skill.addedBaseDamage");
      }
      if (hasLeveledInc) {
        sm = sm.filter((m) => !(m.stat === "damage.increased" && m.valueKind === "increased"));
      }
    }
    if (sm.length) definition.modifiers = [...(definition.modifiers ?? []), ...sm];
  }

  if (levelScalingMode !== "unknown") {
    definition.levelScalingMode = levelScalingMode;
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
  const ltCount = definition.levelTable ? Object.keys(definition.levelTable).length : 0;
  const hasActiveLevelCoverage =
    ltCount > 0 || bpCount > 0 || Boolean(definition.unsupportedLevelDataReason);

  if (uniqueDetail.length === 0 && tags.length === 0) {
    status = "failed";
  } else if (input.kind === "active") {
    if (hasActiveLevelCoverage && tags.length >= 1) {
      status = "ok";
    } else {
      status = "partial";
    }
  } else if (high) {
    const supportOk =
      input.kind === "support" &&
      (modsCount >= 1 ||
        bpCount >= 1 ||
        ltCount > 0 ||
        (definition.supportRules != null && Object.keys(definition.supportRules).length > 0));
    const passiveInjectable = modsCount > 0 || ltCount > 0;
    const passiveOk = input.kind === "passive" && uniqueDetail.length >= 2 && passiveInjectable;
    if (supportOk || passiveOk) {
      status = "ok";
    } else {
      status = "partial";
      warnings.push("high_tier_expectation_not_met");
    }
  } else if (input.kind === "passive") {
    const passiveInjectable = modsCount > 0 || ltCount > 0;
    if (uniqueDetail.length === 0 && tags.length === 0) {
      status = "failed";
    } else if (!passiveInjectable) {
      status = "partial";
      warnings.push("passive_no_injectable_modifiers");
    } else if (uniqueDetail.length >= 1 && tags.length >= 1) {
      status = "ok";
    } else {
      status = "partial";
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
