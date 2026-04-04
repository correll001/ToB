/**
 * Non-prod smoke checks for skill engine (run: npm run check:skill-engine).
 */
import type { SkillDefinition } from "@/types/skillData"
import { computeSkillInstance } from "./computeSkillInstance"
import { post20MoreMultiplier, TLIDB_DEFAULT_POST20 } from "./applyPost20Scaling"

function sk(
  partial: Pick<SkillDefinition, "id" | "name" | "family" | "tags"> &
    Partial<Omit<SkillDefinition, "id" | "name" | "family" | "tags">>,
): SkillDefinition {
  return {
    sourceUrl: "",
    locale: "tw",
    season: "ss12",
    version: "1.0.0",
    ...partial,
  }
}

const leap = sk({
  id: "skill:Leap_Attack",
  name: "躍擊",
  family: "active",
  tags: ["位移", "攻擊", "近戰", "物理", "破擊", "範圍"],
  modifiers: [
    { selector: { kind: "skill" }, operation: "add", stat: "skill.weaponDamagePct", value: 228 },
  ],
})

const iceShot = sk({
  id: "skill:Ice_Shot",
  name: "寒冰射擊",
  family: "active",
  tags: ["冰冷", "投射物", "攻擊", "遠程", "範圍", "直射", "敏捷"],
  modifiers: [
    { selector: { kind: "skill" }, operation: "add", stat: "skill.weaponDamagePct", value: 313 },
  ],
})

const scatter = sk({
  id: "skill:Multiple_Projectiles",
  name: "散射",
  family: "support",
  tags: ["投射物", "輔助"],
  supportRules: {
    requiresProjectile: true,
    allowedSkillTags: ["Projectile"],
  },
  modifiers: [
    {
      selector: { kind: "supportedSkill" },
      operation: "add",
      stat: "projectileCount",
      value: 2,
      valueKind: "flat",
    },
    {
      selector: { kind: "supportedSkill" },
      operation: "mul",
      stat: "damage.increased",
      value: 7.4,
      valueKind: "increased",
    },
    {
      selector: { kind: "supportedSkill" },
      operation: "mul",
      stat: "skill.manaCostMultiplier",
      value: 1.1,
    },
  ],
})

const multistrike = sk({
  id: "skill:Multistrike",
  name: "連續攻擊",
  family: "support",
  tags: ["攻擊", "輔助"],
  supportRules: { requiresAttack: true },
  modifiers: [
    {
      selector: { kind: "supportedSkill" },
      operation: "mul",
      stat: "damage.increased",
      value: 27,
      valueKind: "increased",
    },
  ],
})

function main(): void {
  const cases: Array<{ name: string; ok: boolean }> = []

  const a = computeSkillInstance({ active: leap, level: 25, supports: [scatter] })
  cases.push({ name: "Leap+Scatter_skipped", ok: !a.supports[0].applied })

  const b = computeSkillInstance({ active: iceShot, level: 25, supports: [scatter] })
  cases.push({
    name: "IceShot+Scatter_applies",
    ok: b.supports[0].applied && (b.computedStats["damage.increased"] ?? 0) > 0,
  })

  const c = computeSkillInstance({ active: leap, level: 25, supports: [multistrike] })
  cases.push({ name: "Leap+Multistrike_applies", ok: c.supports[0].applied })

  const d = computeSkillInstance({ active: iceShot, level: 32, supports: [scatter] })
  const exp = post20MoreMultiplier(32, TLIDB_DEFAULT_POST20)
  cases.push({
    name: "Post20_L32",
    ok: Math.abs(d.post20MoreMultiplier - exp) < 1e-10 && exp > 1,
  })

  const e = computeSkillInstance({
    active: iceShot,
    level: 20,
    supports: [],
    externalModifiers: [
      {
        selector: { kind: "skill", skillId: "skill:Ice_Shot" },
        operation: "mul",
        stat: "damage.increased",
        value: 12,
        valueKind: "increased",
      },
    ],
  })
  cases.push({ name: "External_modifier", ok: (e.computedStats["damage.increased"] ?? 0) >= 12 })

  const failed = cases.filter((c) => !c.ok)
  if (failed.length) {
    console.error("[skillEngineSmokeTest] FAILED", failed)
    process.exit(1)
  }
  console.log("[skillEngineSmokeTest] OK:", cases.map((c) => c.name).join(", "))
}

main()
