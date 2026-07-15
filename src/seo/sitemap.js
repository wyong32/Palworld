import { databaseCategorySlug, getDatabaseCategoryGroups, getDatabaseItemPath } from "@/data/database";
import { guides } from "@/data/guides";
import { items } from "@/data/items";
import { pals } from "@/data/pals";
import { siteConfig } from "@/seo/site";
import { legalRoutes } from "@/app/legal/_content";

const STATIC_PAGE_LASTMOD = {
  "/": "2026-07-15",
  "/pals": "2026-07-15",
  "/database": "2026-07-15",
  "/breeding": "2026-07-15",
  "/guides": "2026-07-15",
  "/map": "2026-07-15",
  "/updates": "2026-07-15",
  "/legal": "2026-07-15",
  "/legal/privacy-policy": "2026-07-15",
  "/legal/terms-of-service": "2026-07-15",
  "/legal/copyright": "2026-07-15",
  "/legal/about-us": "2026-07-15",
  "/legal/contact-us": "2026-07-15",
};

const FALLBACK_LASTMOD = {
  pals: "2026-07-13",
  database: "2026-07-13",
  guides: "2026-07-14",
};

function normalizePath(path) {
  return path === "/" ? "" : path;
}

function getEntryDate(entry, fallback) {
  return entry.lastModified || entry.updatedAt || entry.lastChecked || entry.publishDate || fallback;
}

function getLatestDate(entries, fallback) {
  return entries
    .map((entry) => getEntryDate(entry, fallback))
    .filter(Boolean)
    .sort()
    .at(-1) || fallback;
}

function makeSitemapEntry(path, options = {}) {
  return {
    url: `${siteConfig.url}${normalizePath(path)}`,
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency || "weekly",
    priority: options.priority ?? 0.7,
  };
}

export function buildSitemapEntries() {
  const staticEntries = [
    makeSitemapEntry("/", {
      lastModified: STATIC_PAGE_LASTMOD["/"],
      changeFrequency: "daily",
      priority: 1,
    }),
    ...[
      "/pals",
      "/database",
      "/breeding",
      "/guides",
      "/map",
      "/updates",
    ].map((path) =>
      makeSitemapEntry(path, {
        lastModified: STATIC_PAGE_LASTMOD[path],
        changeFrequency: path === "/updates" ? "daily" : "weekly",
        priority: 0.9,
      }),
    ),
    makeSitemapEntry("/legal", {
      lastModified: STATIC_PAGE_LASTMOD["/legal"],
      changeFrequency: "yearly",
      priority: 0.35,
    }),
    ...legalRoutes.map((route) =>
      makeSitemapEntry(route.href, {
        lastModified: STATIC_PAGE_LASTMOD[route.href],
        changeFrequency: "yearly",
        priority: 0.3,
      }),
    ),
  ];

  const palEntries = pals.map((pal) =>
    makeSitemapEntry(`/pals/${pal.addressBar}`, {
      lastModified: getEntryDate(pal, FALLBACK_LASTMOD.pals),
      changeFrequency: "monthly",
      priority: 0.74,
    }),
  );

  const databaseCategoryEntries = getDatabaseCategoryGroups(items).map((group) =>
    makeSitemapEntry(`/database/${databaseCategorySlug(group.category)}`, {
      lastModified: getLatestDate(group.items, FALLBACK_LASTMOD.database),
      changeFrequency: "weekly",
      priority: 0.78,
    }),
  );

  const databaseItemEntries = items.map((item) =>
    makeSitemapEntry(getDatabaseItemPath(item), {
      lastModified: getEntryDate(item, FALLBACK_LASTMOD.database),
      changeFrequency: "monthly",
      priority: 0.68,
    }),
  );

  const guideEntries = guides.map((guide) =>
    makeSitemapEntry(`/guides/${guide.addressBar}`, {
      lastModified: getEntryDate(guide, FALLBACK_LASTMOD.guides),
      changeFrequency: "monthly",
      priority: 0.72,
    }),
  );

  return [
    ...staticEntries,
    ...palEntries,
    ...databaseCategoryEntries,
    ...databaseItemEntries,
    ...guideEntries,
  ];
}
