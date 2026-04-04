/**
 * 4F-2: Every active must have levelTable / levelBreakpoints / unsupportedLevelDataReason;
 * damaging + calculationConfidence ready must have structural damage evidence.
 *
 *   npm run verify:active-skill-structural
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { EffectiveRuntimeBundle } from "@/lib/data/types";
import { computeSkillInstance } from "@/lib/formula/skills/computeSkillInstance";
import { hasStructuralDamageEvidence, inferSkillCombatRole } from "@/lib/formula/skills/inferDamageRole";
import { modifiersFromSkillLevelRow } from "@/lib/formula/skills/levelRowModifiers";
import { bundledGlobalCombatRuleLayer } from "@/lib/runtime/runtimeRulesLookup";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "lib", "gameData", "generated", "effective-runtime-bundle.json");

function main(): void {
  if (!existsSync(BUNDLE)) {
    console.error(`[verify:active-skill-structural] missing ${path.relative(ROOT, BUNDLE)}`);
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, "utf8")) as EffectiveRuntimeBundle;
  const layer = bundledGlobalCombatRuleLayer();
  const fails: string[] = [];

  let ready = 0;
  let partial = 0;
  let unsupported = 0;

  for (const rec of bundle.activeSkills.skills) {
    const def = rec.definition;
    const lt = def.levelTable;
    const ltKeys = lt && typeof lt === "object" ? Object.keys(lt) : [];
    const bp = def.levelBreakpoints?.length ?? 0;
    const unsup = def.unsupportedLevelDataReason;

    if (ltKeys.length === 0 && bp === 0 && !unsup) {
      fails.push(`${def.id}: missing levelTable, breakpoints, and unsupportedLevelDataReason`);
    }

    const inst = computeSkillInstance({
      active: def,
      level: 20,
      supports: [],
      globalLayer: layer,
      activeParse: { status: rec.parseStatus, warnings: rec.warnings },
    });

    const c = inst.calculationConfidence;
    if (c === "ready") ready++;
    else if (c === "partial") partial++;
    else unsupported++;

    if (inst.damageRole === "damaging" && c === "ready") {
      const mods = modifiersFromSkillLevelRow(def, 20);
      if (!hasStructuralDamageEvidence(def, 20, mods)) {
        fails.push(`${def.id}: damaging+ready without structural damage evidence`);
      }
    }
  }

  const roleTally: Record<string, number> = {};
  for (const rec of bundle.activeSkills.skills) {
    const def = rec.definition;
    const role = inferSkillCombatRole(def, 20, { parseStatus: rec.parseStatus });
    roleTally[role] = (roleTally[role] ?? 0) + 1;
  }

  console.log("[verify:active-skill-structural] instance confidence @ Lv20:", { ready, partial, unsupported });
  console.log("[verify:active-skill-structural] damage roles @ Lv20:", roleTally);

  if (fails.length) {
    console.error("[verify:active-skill-structural] FAILED:\n  - " + fails.slice(0, 50).join("\n  - "));
    if (fails.length > 50) console.error(`  ... +${fails.length - 50} more`);
    process.exit(1);
  }

  console.log("[verify:active-skill-structural] OK", bundle.activeSkills.skills.length, "actives");
}

main();
