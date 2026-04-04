/**
 * Offline ETL: batch-fetch skill detail pages from skill-urls.json.
 * Resumable: skips unchanged snapshots (local hash vs manifest) unless --force.
 */
import { access, constants, readFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import type { SkillUrlRecord } from "./fetchSkillIndexes";
import {
  ensureDir,
  httpGetText,
  manifestsDir,
  pagesDir,
  parseArgs,
  PARSER_VERSION,
  SEASON,
  sha256Hex,
  readJsonFile,
  safeFilenameSegment,
  sleep,
  toRepoRelative,
  writeJsonFile,
  writeSnapshot,
  type ManifestEntry,
  type ManifestFile,
} from "./shared";

type SkillUrlsFile = {
  skills: SkillUrlRecord[];
};

function markdownFromPageHtml(html: string): string {
  const $ = cheerio.load(html);
  const root = $("#mw-content-text").length ? $("#mw-content-text") : $("body");
  return root.text().replace(/\u00a0/g, " ").replace(/\s+\n/g, "\n").trim();
}

function buildPrevHashMap(entries: ManifestEntry[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const e of entries) {
    if ((e.status === "ok" || e.status === "skipped") && e.contentSha256) {
      m.set(e.sourceUrl, e.contentSha256);
    }
  }
  return m;
}

async function fileSha256(filePath: string): Promise<string | null> {
  try {
    const text = await readFile(filePath, "utf8");
    return sha256Hex(text);
  } catch {
    return null;
  }
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const force = args.force === true;
  const delayMs = Math.max(0, parseInt(String(args["delay-ms"] ?? "250"), 10) || 250);
  const limit = args.limit ? parseInt(String(args.limit), 10) : undefined;

  const skillListPath = path.join(manifestsDir(), "skill-urls.json");
  const skillFile = await readJsonFile<SkillUrlsFile>(skillListPath);
  if (!skillFile?.skills?.length) {
    console.error("Missing or empty manifests/skill-urls.json — run fetchSkillIndexes.ts first.");
    process.exit(1);
  }

  let skills = skillFile.skills;
  if (limit && limit > 0) {
    skills = skills.slice(0, limit);
    console.log(`[pages] limit=${limit} (testing)`);
  }

  const manifestPath = path.join(manifestsDir(), "pages.manifest.json");
  const prevManifest = await readJsonFile<ManifestFile>(manifestPath);
  const prevByUrl = buildPrevHashMap(prevManifest?.entries ?? []);

  await ensureDir(manifestsDir());

  const entries: ManifestEntry[] = [];
  let ok = 0;
  let errors = 0;
  let skipped = 0;

  for (let i = 0; i < skills.length; i++) {
    const s = skills[i]!;
    const fetchedAt = new Date().toISOString();
    const slugSafe = safeFilenameSegment(s.slug);
    const outDir = pagesDir(s.locale);
    const htmlPath = path.join(outDir, `${slugSafe}.html`);
    const relPath = toRepoRelative(htmlPath);

    const prevHash = prevByUrl.get(s.sourceUrl);
    if (!force && prevHash) {
      const localHash = await fileSha256(htmlPath);
      if (localHash === prevHash) {
        entries.push({
          sourceUrl: s.sourceUrl,
          kind: s.kind,
          locale: s.locale,
          season: SEASON,
          fetchedAt,
          status: "skipped",
          outputPath: relPath,
          parseCandidateName: s.parseCandidateName,
          contentSha256: prevHash,
          parserVersion: PARSER_VERSION,
        });
        skipped++;
        if ((i + 1) % 50 === 0) {
          console.log(`[pages] ${i + 1}/${skills.length} (skipped unchanged)`);
        }
        continue;
      }
    }

    const res = await httpGetText(s.sourceUrl);
    if (!res.ok) {
      errors++;
      entries.push({
        sourceUrl: s.sourceUrl,
        kind: s.kind,
        locale: s.locale,
        season: SEASON,
        fetchedAt,
        status: "error",
        outputPath: relPath,
        parseCandidateName: s.parseCandidateName,
        error: `HTTP ${res.status}`,
        parserVersion: PARSER_VERSION,
      });
      console.error(`[pages] ERR ${s.slug}: HTTP ${res.status}`);
      await sleep(delayMs);
      continue;
    }

    const html = res.text;
    const hash = sha256Hex(html);

    if (!force && prevHash === hash && (await pathExists(htmlPath))) {
      entries.push({
        sourceUrl: s.sourceUrl,
        kind: s.kind,
        locale: s.locale,
        season: SEASON,
        fetchedAt,
        status: "skipped",
        outputPath: relPath,
        parseCandidateName: s.parseCandidateName,
        contentSha256: hash,
        parserVersion: PARSER_VERSION,
      });
      skipped++;
    } else {
      const mdBody = markdownFromPageHtml(html);
      await writeSnapshot(
        htmlPath,
        html,
        {
          sourceUrl: s.sourceUrl,
          fetchedAt,
          season: SEASON,
          locale: s.locale,
          parserVersion: PARSER_VERSION,
        },
        mdBody,
      );
      ok++;
      entries.push({
        sourceUrl: s.sourceUrl,
        kind: s.kind,
        locale: s.locale,
        season: SEASON,
        fetchedAt,
        status: "ok",
        outputPath: relPath,
        parseCandidateName: s.parseCandidateName,
        contentSha256: hash,
        parserVersion: PARSER_VERSION,
      });
    }

    if ((i + 1) % 25 === 0) {
      console.log(`[pages] ${i + 1}/${skills.length} ok=${ok} skip=${skipped} err=${errors}`);
    }

    await sleep(delayMs);
  }

  const processed = new Set(skills.map((s) => s.sourceUrl));
  const mergedEntries =
    limit && prevManifest?.entries?.length
      ? [...prevManifest.entries.filter((e) => !processed.has(e.sourceUrl)), ...entries]
      : entries;

  const outManifest: ManifestFile = {
    season: SEASON,
    parserVersion: PARSER_VERSION,
    generatedAt: new Date().toISOString(),
    entries: mergedEntries,
  };
  await writeJsonFile(manifestPath, outManifest);

  console.log(`[pages] done ok=${ok} skipped=${skipped} errors=${errors} total=${skills.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
