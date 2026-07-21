export const siteConfig = {
  name: "Palworld Wiki",
  domain: "palworldwiki.org",
  url: "https://palworldwiki.org",
  logoImage: "/images/logo.png",
  iconImage: "/images/ico.ico",
  defaultImage: "/images/og-image.png",
  defaultImageWidth: 1254,
  defaultImageHeight: 1254,
  defaultImageAlt: "Palworld Wiki social preview image",
  description:
    "Palworld Wiki for Pals, Database items, breeding routes, interactive map planning, update checks, and practical player guides.",
};

export const pageSeo = {
  home: {
    title: "Palworld Wiki - Pals, Breeding, Map and Database",
    description:
      "Palworld Wiki gives players searchable Pal roles, item and gear data, current breeding tools, an interactive map, patch guides, and progression help.",
    keywords:
      "Palworld Wiki, Palworld Pals, Palworld Database, Palworld Breeding Guide, Palworld Map, Palworld Guides",
  },
  pals: {
    title: "Palworld Pals - Paldeck, Best Workers, Combat, and Mounts",
    description:
      "Palworld Pals compares Paldeck entries by work suitability, element, combat role, mount type, partner skill, drops, breeding value, and capture planning.",
    keywords:
      "Palworld Pals, Palworld Paldeck, Palworld work suitability, Palworld mounts, Palworld drops",
  },
  guides: {
    title: "Palworld Guides - Complete Player Strategy Hub",
    description:
      "Palworld Guides help players plan progression, bases, teams, breeding, maps, updates, resources, bosses, and long routes with practical checklists.",
    keywords: "Palworld Guides, Palworld strategy guide, Palworld progression guide, Palworld base guide, Palworld map guide, Palworld endgame guide",
  },
  breeding: {
    title: "Palworld Breeding Guide - Calculator, Cake and Eggs",
    description:
      "Palworld Breeding Guide includes a parent calculator, reverse target lookup, Cake production, egg incubation, passive inheritance, and Mutation planning.",
    keywords:
      "Palworld Breeding Guide, Palworld breeding calculator, Palworld Cake, Palworld Breeding Farm, Palworld Mutation, Palworld eggs",
  },
  breedingCalculator: {
    title: "Palworld Breeding Calculator - 1.0 Combos and Paths",
    description:
      "Palworld Breeding Calculator checks 1.0 parent pairs, target Pal combos, path planning, passive routes, Cake prep, and linked Pal detail pages.",
    keywords:
      "Palworld Breeding Calculator, Palworld breeding combos, Palworld parent pairs, Palworld breeding path calculator, Palworld passive skill breeding",
  },
    database: {
      title: "Palworld Database - Items, Bosses, Predators and Enemies",
      description:
        "Palworld Database organizes weapons, ammo, armor, consumables, recipes, Bosses, Predators, hostile enemies, map links, drops, and connected Pal pages.",
      keywords:
        "Palworld Database, Palworld weapons, Palworld items, Palworld bosses, Palworld predators, Palworld enemies",
  },
  map: {
    title: "Palworld Map - Bosses, Quests and Wild Pal Habitats",
    description:
      "Palworld Map searches fixed bosses, fast travel, dungeons, resources, collectibles, quest objectives, and clustered wild Pal habitats across both world maps.",
    keywords:
      "Palworld Map, Palworld interactive map, Palworld boss locations, Palworld dungeons, Palworld resources, Palworld collectibles, Palworld habitats",
  },
  updates: {
    title: "Palworld Updates - 1.0.1 Patch Notes and Player Guide",
    description:
      "Palworld Updates tracks the verified 1.0.1 hotfix and turns 1.0 changes into player actions for Pals, World Tree, breeding, routes, saves, and gear.",
    keywords:
      "Palworld Updates, Palworld 1.0.1 patch notes, Palworld 1.0 patch notes, Palworld Sunreach, Palworld World Tree, Palworld Mutation",
  },
  search: {
    title: "Palworld Wiki Search - Find Pals, Items and Guides",
    description:
      "Palworld Wiki Search finds Pal guides, item records, materials, breeding tools, map locations, progression guides, and update pages from one focused index.",
    keywords:
      "Palworld Wiki Search, Palworld Pals search, Palworld item search, Palworld guide search, Palworld Database search",
  },
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export function buildBaseJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: absoluteUrl(siteConfig.logoImage),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function buildMetadata(seo, path = "/", options = {}) {
  const title = seo.title;
  const description = seo.description;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(options.image || seo.image || siteConfig.defaultImage);
  const imageWidth = options.imageWidth || seo.imageWidth || siteConfig.defaultImageWidth;
  const imageHeight = options.imageHeight || seo.imageHeight || siteConfig.defaultImageHeight;
  const imageAlt = options.imageAlt || seo.imageAlt || siteConfig.defaultImageAlt;
  const type = options.type || seo.type || "website";
  const publishedTime = options.publishedTime || seo.publishDate;
  const modifiedTime = options.modifiedTime || seo.lastModified || seo.publishDate;
  const shouldIndex = options.index !== false;
  const shouldFollow = options.follow !== false;
  const openGraph = {
    title,
    description,
    url,
    siteName: siteConfig.name,
    images: [
      {
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: imageAlt,
      },
    ],
    locale: "en_US",
    type,
  };

  if (type === "article") {
    if (publishedTime) {
      openGraph.publishedTime = publishedTime;
    }

    if (modifiedTime) {
      openGraph.modifiedTime = modifiedTime;
    }

    openGraph.authors = [siteConfig.name];
  }

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title,
    description,
    keywords: seo.keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Game wiki",
    icons: {
      icon: [{ url: siteConfig.iconImage, type: "image/x-icon" }],
      shortcut: [{ url: siteConfig.iconImage, type: "image/x-icon" }],
      apple: [{ url: siteConfig.logoImage, type: "image/png" }],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: shouldIndex,
      follow: shouldFollow,
      googleBot: {
        index: shouldIndex,
        follow: shouldFollow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph,
    twitter: {
      card: imageWidth / imageHeight >= 1.7 ? "summary_large_image" : "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}
