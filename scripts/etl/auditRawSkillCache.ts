/**
 * MAINTENANCE-ONLY — offline audit of raw skill HTML cache vs manifests.
 */
import { access, constants, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import type { SkillUrlRecord } from "./fetchSkillIndexes";
import {
  manifestsDir,
  readJsonFile,
  repoRoot,
  writeJsonFile,
  type ManifestEntry,
  type ManifestFile,
} from "./shared";

type SkillUrlsFile = {
  skills: SkillUrlRecord[];
  stats?: Record<string, unknown>;
  count?: number;
};

function looksLikeStubOrErrorPage(html: string): boolean {
  const $ = cheerio.load(html);
  if ($('.noarticletext, .mw-empty-elt, #noarticletext').length > 0) return true;
  const title = $("title").text().toLowerCase();
  if (title.includes("404") || title.includes("not found")) return true;
  const body = $("#mw-content-text").text() || $("body").text() || "";
  const t = body.replace(/\s+/g, " ").trim();
  if (t.length < 80 && /不存在|尚未建立|還沒有|建立此頁|does not exist|no such page/i.test(t)) {
    return true;
  }
  return false;
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function latestEntryByUrl(entries: ManifestEntry[]): Map<string, ManifestEntry> {
  const m = new Map<string, ManifestEntry>();
  for (const e of entries) {
    m.set(e.sourceUrl, e);
  }
  return m;
}

function countDuplicateUrlsInManifest(entries: ManifestEntry[]): number {
  const seen = new Map<string, number>();
  for (const e of entries) {
    seen.set(e.sourceUrl, (seen.get(e.sourceUrl) ?? 0) + 1);
  }
  let d = 0;
  for (const n of seen.values()) {
    if (n > 1) d += n - 1;
  }
  return d;
}

async function main(): Promise<void> {
  const skillPath = path.join(manifestsDir(), "skill-urls.json");
  const manifestPath = path.join(manifestsDir(), "pages.manifest.json");
  const auditJsonPath = path.join(manifestsDir(), "raw-cache-audit.json");
  const docPath = path.join(repoRoot, "docs", "4f-raw-cache-audit.md");

  const skillFile = await readJsonFile<SkillUrlsFile>(skillPath);
  const pagesManifest = await readJsonFile<ManifestFile>(manifestPath);
  if (!skillFile?.skills?.length) {
    console.error("Missing manifests/skill-urls.json — run etl:skills:index first.");
    process.exit(1);
  }

  const entries = pagesManifest?.entries ?? [];
  const byUrl = latestEntryByUrl(entries);
  const manifestDupExtraRows = countDuplicateUrlsInManifest(entries);

  type Row = {
    sourceUrl: string;
    slug: string;
    kind: string;
    bucket:
      | "ok"
      | "missing_manifest"
      | "manifest_http_error"
      | "missing_file"
      | "suspicious_content";
  };

  const rows: Row[] = [];
  const byKind = { active: 0, support: 0, passive: 0 };
  const missingManifest: string[] = [];
  const manifestHttpError: { url: string; error?: string }[] = [];
  const missingFile: string[] = [];
  const suspiciousContent: string[] = [];

  for (const s of skillFile.skills) {
    byKind[s.kind] = (byKind[s.kind] ?? 0) + 1;
    const e = byUrl.get(s.sourceUrl);
    if (!e) {
      missingManifest.push(s.sourceUrl);
      rows.push({
        sourceUrl: s.sourceUrl,
        slug: s.slug,
        kind: s.kind,
        bucket: "missing_manifest",
      });
      continue;
    }
    if (e.status === "error") {
      manifestHttpError.push({ url: s.sourceUrl, error: e.error });
      rows.push({
        sourceUrl: s.sourceUrl,
        slug: s.slug,
        kind: s.kind,
        bucket: "manifest_http_error",
      });
      continue;
    }

    const absHtml = path.join(repoRoot, e.outputPath.replace(/\//g, path.sep));
    if (!(await fileExists(absHtml))) {
      missingFile.push(s.sourceUrl);
      rows.push({
        sourceUrl: s.sourceUrl,
        slug: s.slug,
        kind: s.kind,
        bucket: "missing_file",
      });
      continue;
    }

    let stub = false;
    try {
      const html = await readFile(absHtml, "utf8");
      stub = looksLikeStubOrErrorPage(html);
    } catch {
      missingFile.push(s.sourceUrl);
      rows.push({
        sourceUrl: s.sourceUrl,
        slug: s.slug,
        kind: s.kind,
        bucket: "missing_file",
      });
      continue;
    }

    if (stub) {
      suspiciousContent.push(s.sourceUrl);
      rows.push({
        sourceUrl: s.sourceUrl,
        slug: s.slug,
        kind: s.kind,
        bucket: "suspicious_content",
      });
    } else {
      rows.push({
        sourceUrl: s.sourceUrl,
        slug: s.slug,
        kind: s.kind,
        bucket: "ok",
      });
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    indexSkillUrlsDeclared: skillFile.skills.length,
    indexStatsFromFile: skillFile.stats ?? null,
    pagesManifestEntryRows: entries.length,
    duplicateManifestRowsForSameUrl: manifestDupExtraRows,
    uniqueUrlsInManifest: byUrl.size,
    byKindExpectedFromIndex: byKind,
    detailPagesOk: rows.filter((r) => r.bucket === "ok").length,
    missingManifest: missingManifest.length,
    manifestHttpError: manifestHttpError.length,
    missingFile: missingFile.length,
    suspiciousStubHtml: suspiciousContent.length,
    readyForNormalize:
      missingManifest.length === 0 &&
      manifestHttpError.length === 0 &&
      missingFile.length === 0 &&
      suspiciousContent.length === 0,
  };

  const auditOut = {
    summary,
    missingManifest,
    manifestHttpError,
    missingFile,
    suspiciousContent,
    sampleProblemRows: rows.filter((r) => r.bucket !== "ok").slice(0, 80),
  };

  await writeJsonFile(auditJsonPath, auditOut);

  const st = skillFile.stats as
    | {
        rawExtractedBeforeDedupe?: number;
        dedupeDroppedDuplicateUrls?: number;
        kindConflictOnDuplicateUrl?: number;
      }
    | undefined;

  const lines = [
    `# 4F-1 技能原始頁快取稽核`,
    ``,
    `> 維護用文件。數字來自 \`data/raw/ss12/manifests/raw-cache-audit.json\`（由 \`npm run etl:skills:audit-cache\` 產生）。\`skill-urls.json\` 與 \`pages.manifest.json\` 路徑為 \`data/raw/ss12/manifests/\`。抓取索引與頁面：\`npm run etl:skills:index\`、\`npm run etl:skills:pages\`。`,
    ``,
    `## 索引（manifest / skill-urls）`,
    ``,
    `- **skill-urls 筆數（詳細頁 URL 清單，已 dedupe）**：${summary.indexSkillUrlsDeclared}`,
    `- **依 kind（dedupe 後寫入 skill-urls 的分類）**：active ${byKind.active} · support ${byKind.support} · passive ${byKind.passive}`,
    `- **索引頁抽出的原始連結總數（dedupe 前）**：${st?.rawExtractedBeforeDedupe ?? "—"}（與上列差值 **${st?.dedupeDroppedDuplicateUrls ?? "—"}** 筆為同源 URL 重複；其中跨 kind 第一次保留，另外記 **kind 衝突次數 ${st?.kindConflictOnDuplicateUrl ?? "—"}**）`,
    `- **pages.manifest.json 列數**：${summary.pagesManifestEntryRows}（同源多列視為重複列：**+${summary.duplicateManifestRowsForSameUrl}** 條冗餘）`,
    ``,
    `## 詳細頁（raw HTML）`,
    ``,
    `- **檔案齊備且內容非明顯 stub**：${summary.detailPagesOk}`,
    `- **缺 manifest 列**：${summary.missingManifest}`,
    `- **manifest 標記 HTTP error**：${summary.manifestHttpError}`,
    `- **缺本機 .html 檔**：${summary.missingFile}`,
    `- **疑為錯頁 / 空頁（啟發式）**：${summary.suspiciousStubHtml}`,
    ``,
    `## 是否可進入 normalize`,
    ``,
    summary.readyForNormalize
      ? `- **是** — 索引 URL 均有成功快取且無缺檔。後續 normalize / parse / override 應只讀 \`data/raw/ss12/pages/**\` 與 manifests。`
      : `- **否** — 請先 \`npm run etl:skills:pages\`（必要時加 \`--force\`）修復 HTTP error / 缺檔，並手動複查「疑為 stub」清單。`,
    ``,
    `## 索引涵蓋範圍（fetchSkillIndexes）`,
    ``,
    `已固定抓取：**Active_Skill**、**Support_Skill**、**Passive_Skill**（抽出 skill 連結並 dedupe）、**Skill_Level**、**Character_Build**（索引頁儲存，不抽取 skill grid）。詳見 \`scripts/etl/fetchSkillIndexes.ts\` 的 \`TARGETS\`。`,
    ``,
    `## 安全邊界`,
    ``,
    `- ETL 僅寫入 \`data/raw/**\` 與本文件；**不增加 runtime 遠端抓取**。`,
  ];

  await writeFile(docPath, lines.join("\n") + "\n", "utf8");

  console.log("[audit:raw-skill-cache]", summary);
  console.log(`[audit:raw-skill-cache] wrote ${path.relative(repoRoot, auditJsonPath)}`);
  console.log(`[audit:raw-skill-cache] wrote ${path.relative(repoRoot, docPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
