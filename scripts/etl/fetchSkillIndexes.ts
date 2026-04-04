/**
 * Offline ETL: fetch TLIDB skill index pages + reference pages, extract detail URLs.
 * Does not run in the Next.js frontend.
 */
import * as cheerio from "cheerio";
import path from "node:path";
import {
  ensureDir,
  httpGetText,
  indexesDir,
  manifestsDir,
  PARSER_VERSION,
  SEASON,
  sha256Hex,
  SkillKind,
  toRepoRelative,
  writeJsonFile,
  writeSnapshot,
  type ManifestEntry,
  type ManifestFile,
} from "./shared";

const INDEX_SLUG_BLOCK = new Set([
  "Active_Skill",
  "Support_Skill",
  "Passive_Skill",
  "Skill_Level",
  "Character_Build",
  "Main_Page",
  "Torchlight_Infinite_Wiki",
  "Item",
]);

const URL_BLOCK_PREFIX = [
  "Special:",
  "File:",
  "Category:",
  "Template:",
  "MediaWiki:",
  "Help:",
  "User:",
  "Talk:",
];

type IndexTarget = {
  key: string;
  sourceUrl: string;
  locale: string;
  manifestName: string;
  indexKind: string;
  extractSkills: boolean;
  skillKind?: SkillKind;
};

const TARGETS: IndexTarget[] = [
  {
    key: "Active_Skill",
    sourceUrl: "https://tlidb.com/tw/Active_Skill",
    locale: "tw",
    manifestName: "active-index.manifest.json",
    indexKind: "active",
    extractSkills: true,
    skillKind: "active",
  },
  {
    key: "Support_Skill",
    sourceUrl: "https://tlidb.com/tw/Support_Skill",
    locale: "tw",
    manifestName: "support-index.manifest.json",
    indexKind: "support",
    extractSkills: true,
    skillKind: "support",
  },
  {
    key: "Passive_Skill",
    sourceUrl: "https://tlidb.com/tw/Passive_Skill",
    locale: "tw",
    manifestName: "passive-index.manifest.json",
    indexKind: "passive",
    extractSkills: true,
    skillKind: "passive",
  },
  {
    key: "Skill_Level",
    sourceUrl: "https://tlidb.com/tw/Skill_Level",
    locale: "tw",
    manifestName: "skill-level-index.manifest.json",
    indexKind: "skill-level",
    extractSkills: false,
  },
  {
    key: "Character_Build",
    sourceUrl: "https://tlidb.com/en/Character_Build",
    locale: "en",
    manifestName: "character-build-index.manifest.json",
    indexKind: "character-build",
    extractSkills: false,
  },
];

export type SkillUrlRecord = {
  sourceUrl: string;
  kind: SkillKind;
  locale: string;
  parseCandidateName: string;
  slug: string;
};

function normalizeWikiHref(href: string, pageLocale: string): URL | null {
  try {
    if (href.startsWith("//")) {
      return new URL("https:" + href);
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return new URL(href);
    }
    if (href.startsWith("/")) {
      return new URL("https://tlidb.com" + href);
    }
    return new URL(href, `https://tlidb.com/${pageLocale}/`);
  } catch {
    return null;
  }
}

function slugBlocked(slug: string): boolean {
  if (!slug || slug === "") return true;
  if (INDEX_SLUG_BLOCK.has(slug)) return true;
  for (const p of URL_BLOCK_PREFIX) {
    if (slug.startsWith(p)) return true;
  }
  if (slug.includes("#")) return true;
  return false;
}

function markdownFromIndexHtml(html: string): string {
  const $ = cheerio.load(html);
  const root = $("#mw-content-text").length ? $("#mw-content-text") : $("body");
  const text = root.text().replace(/\u00a0/g, " ").replace(/\s+\n/g, "\n").trim();
  return text;
}

const ITEMBASE_HOVER = "Torchlight_ItemBase_hover";

/** Skill grid links use relative slugs + ItemBase hover payloads; navbar uses absolute /tw/ paths. */
function extractSkillUrls(html: string, pageLocale: string, skillKind: SkillKind): SkillUrlRecord[] {
  const $ = cheerio.load(html);
  const byUrl = new Map<string, SkillUrlRecord>();

  $(`a[href][data-hover*="${ITEMBASE_HOVER}"]`).each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#")) return;

    const u = normalizeWikiHref(href, pageLocale);
    if (!u || u.hostname.replace(/^www\./, "") !== "tlidb.com") return;

    const pathParts = u.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) return;

    const loc = pathParts[0];
    if (loc !== "tw" && loc !== "en") return;

    const slugEnc = pathParts[1];
    if (slugEnc.includes("/")) return;

    let slug: string;
    try {
      slug = decodeURIComponent(slugEnc);
    } catch {
      slug = slugEnc;
    }

    if (slugBlocked(slug)) return;

    const host = u.hostname.replace(/^www\./, "");
    const sourceUrl = `https://${host}/${loc}/${slugEnc}`;

    const name = $(el).text().replace(/\s+/g, " ").trim();
    const existing = byUrl.get(sourceUrl);
    const readable = name && name !== slug ? name : slug;
    if (!existing) {
      byUrl.set(sourceUrl, {
        sourceUrl,
        kind: skillKind,
        locale: loc,
        parseCandidateName: readable,
        slug,
      });
    } else if (name && name !== slug) {
      const cur = existing.parseCandidateName;
      if (cur === existing.slug || name.length > cur.length) {
        existing.parseCandidateName = name;
      }
    }
  });

  return [...byUrl.values()];
}

async function main(): Promise<void> {
  await ensureDir(indexesDir());
  await ensureDir(manifestsDir());

  const allSkills: SkillUrlRecord[] = [];
  const indexMetaManifest: ManifestFile = {
    season: SEASON,
    parserVersion: PARSER_VERSION,
    generatedAt: new Date().toISOString(),
    entries: [],
  };

  for (const t of TARGETS) {
    const fetchedAt = new Date().toISOString();
    const base = path.join(indexesDir(), t.key);
    const htmlPath = base + ".html";

    let status: ManifestEntry["status"] = "ok";
    let error: string | undefined;
    let html = "";
    let hash = "";

    const res = await httpGetText(t.sourceUrl);
    if (!res.ok) {
      status = "error";
      error = `HTTP ${res.status}`;
      const entry: ManifestEntry = {
        sourceUrl: t.sourceUrl,
        kind: t.indexKind,
        locale: t.locale,
        season: SEASON,
        fetchedAt,
        status,
        outputPath: toRepoRelative(htmlPath),
        parserVersion: PARSER_VERSION,
        error,
      };
      const singleManifest: ManifestFile = {
        season: SEASON,
        parserVersion: PARSER_VERSION,
        generatedAt: fetchedAt,
        entries: [entry],
      };
      await writeJsonFile(path.join(manifestsDir(), t.manifestName), singleManifest);
      indexMetaManifest.entries.push(entry);
      console.error(`[index] FAIL ${t.key}: ${error}`);
      continue;
    }
    html = res.text;
    hash = sha256Hex(html);
    const mdBody = markdownFromIndexHtml(html);
    await writeSnapshot(
      htmlPath,
      html,
      {
        sourceUrl: t.sourceUrl,
        fetchedAt,
        season: SEASON,
        locale: t.locale,
        parserVersion: PARSER_VERSION,
      },
      mdBody,
    );
    status = "ok";

    const entry: ManifestEntry = {
      sourceUrl: t.sourceUrl,
      kind: t.indexKind,
      locale: t.locale,
      season: SEASON,
      fetchedAt,
      status,
      outputPath: toRepoRelative(htmlPath),
      contentSha256: hash,
      parserVersion: PARSER_VERSION,
    };
    if (error) entry.error = error;

    const singleManifest: ManifestFile = {
      season: SEASON,
      parserVersion: PARSER_VERSION,
      generatedAt: fetchedAt,
      entries: [entry],
    };
    await writeJsonFile(path.join(manifestsDir(), t.manifestName), singleManifest);
    indexMetaManifest.entries.push(entry);

    if (t.extractSkills && t.skillKind) {
      const skills = extractSkillUrls(html, t.locale, t.skillKind);
      allSkills.push(...skills);
      console.log(`[index] ${t.key}: ${skills.length} skill links (${status})`);
    } else {
      console.log(`[index] ${t.key}: (${status})`);
    }
  }

  const dedupe = new Map<string, SkillUrlRecord>();
  for (const s of allSkills) {
    if (!dedupe.has(s.sourceUrl)) dedupe.set(s.sourceUrl, s);
  }
  const skillList = [...dedupe.values()];

  await writeJsonFile(path.join(manifestsDir(), "skill-urls.json"), {
    season: SEASON,
    parserVersion: PARSER_VERSION,
    generatedAt: new Date().toISOString(),
    count: skillList.length,
    skills: skillList,
  });

  await writeJsonFile(path.join(manifestsDir(), "all-indexes.manifest.json"), indexMetaManifest);

  const byKind = {
    active: skillList.filter((s) => s.kind === "active").length,
    support: skillList.filter((s) => s.kind === "support").length,
    passive: skillList.filter((s) => s.kind === "passive").length,
  };
  console.log("[index] deduped skill urls:", byKind, "total", skillList.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
