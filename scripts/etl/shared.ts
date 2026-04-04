import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/** Season label for raw snapshot layout (e.g. ss12). */
export const SEASON = "ss12";

/** Bump when fetch/link parsing logic changes meaningfully. */
export const PARSER_VERSION = "1";

/** Bump when normalize (HTML → JSON) logic changes. */
export const NORMALIZE_PARSER_VERSION = "1";

export const USER_AGENT = "tob-etl/1.0 (offline skill snapshot; +local)";

export type SkillKind = "active" | "support" | "passive";

export type ManifestStatus = "ok" | "error" | "skipped";

export type ManifestEntry = {
  sourceUrl: string;
  kind: string;
  locale: string;
  season: string;
  fetchedAt: string;
  status: ManifestStatus;
  outputPath: string;
  parseCandidateName?: string;
  contentSha256?: string;
  error?: string;
  parserVersion?: string;
};

export type ManifestFile = {
  season: string;
  parserVersion: string;
  generatedAt: string;
  entries: ManifestEntry[];
};

export const repoRoot = process.cwd();

export function rawRoot(): string {
  return path.join(repoRoot, "data", "raw", SEASON);
}

export function indexesDir(): string {
  return path.join(rawRoot(), "indexes");
}

export function pagesDir(locale: string): string {
  return path.join(rawRoot(), "pages", locale);
}

export function normalizedRoot(): string {
  return path.join(repoRoot, "data", "normalized", SEASON);
}

export function normalizedDir(season: string): string {
  return path.join(repoRoot, "data", "normalized", season);
}

export function effectiveDir(season: string): string {
  return path.join(repoRoot, "data", "effective", season);
}

export function overridesDir(season: string): string {
  return path.join(repoRoot, "data", "overrides", season);
}

/** Bump when `types/override.ts` skill/global patch shape changes. */
export const OVERRIDES_SCHEMA_VERSION = "1";

/** Mirrors fetchSkillPages filename sanitization. */
export function safeFilenameSegment(slug: string): string {
  return slug.replace(/[<>:"/\\|?*]/g, "_");
}

export function skillPageHtmlPath(locale: string, slug: string): string {
  return path.join(pagesDir(locale), `${safeFilenameSegment(slug)}.html`);
}

export function manifestsDir(): string {
  return path.join(rawRoot(), "manifests");
}

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export function sha256Hex(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

export async function httpGetText(url: string): Promise<{ text: string; ok: boolean; status: number }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
    },
    redirect: "follow",
  });
  const text = await res.text();
  return { text, ok: res.ok, status: res.status };
}

export async function writeSnapshot(
  outHtmlPath: string,
  html: string,
  meta: { sourceUrl: string; fetchedAt: string; season: string; locale: string; parserVersion: string },
  markdownBody?: string,
): Promise<void> {
  await ensureDir(path.dirname(outHtmlPath));
  await writeFile(outHtmlPath, html, "utf8");
  if (markdownBody !== undefined) {
    const mdPath = outHtmlPath.replace(/\.html$/i, ".md");
    const header =
      [
        `sourceUrl: ${meta.sourceUrl}`,
        `fetchedAt: ${meta.fetchedAt}`,
        `season: ${meta.season}`,
        `locale: ${meta.locale}`,
        `parserVersion: ${meta.parserVersion}`,
        "",
        "---",
        "",
      ].join("\n");
    await writeFile(mdPath, header + markdownBody + "\n", "utf8");
  }
}

export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/** Relative path from repo root, POSIX-style for manifests. */
export function toRepoRelative(absPath: string): string {
  const rel = path.relative(repoRoot, absPath);
  return rel.split(path.sep).join("/");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const a of argv) {
    if (a === "--force") {
      out.force = true;
      continue;
    }
    const m = /^--([^=]+)=(.*)$/.exec(a);
    if (m) {
      out[m[1]] = m[2];
      continue;
    }
    if (a.startsWith("--")) {
      out[a.slice(2)] = true;
    }
  }
  return out;
}
