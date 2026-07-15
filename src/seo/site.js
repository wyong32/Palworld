export const siteConfig = {
  name: "Palworld Wiki",
  domain: "palworldwiki.org",
  url: "https://palworldwiki.org",
  logoImage: "/images/logo.png",
  iconImage: "/images/ico.ico",
  defaultImage: "/images/og-image.png",
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
    title: "Palworld Guides - 1.0 Progression and World Tree",
    description:
      "Palworld Guides provide practical 1.0 progression and World Tree checklists for base setup, Pal teams, gear, resources, Awakening, routes, and endgame prep.",
    keywords: "Palworld Guides, Palworld 1.0 progression guide, Palworld World Tree guide, Palworld endgame checklist",
  },
  breeding: {
    title: "Palworld Breeding Guide - Calculator, Cake and Eggs",
    description:
      "Palworld Breeding Guide includes a parent calculator, reverse target lookup, Cake production, egg incubation, passive inheritance, and Mutation planning.",
    keywords:
      "Palworld Breeding Guide, Palworld breeding calculator, Palworld Cake, Palworld Breeding Farm, Palworld Mutation, Palworld eggs",
  },
  database: {
    title: "Palworld Database - Items, Gear, Materials and Structures",
    description:
      "Palworld Database organizes items, weapons, armor, materials, structures, Pal Gear, acquisition routes, practical uses, and connected Pal pages for planning.",
    keywords:
      "Palworld Database, Palworld items, Palworld materials, Palworld gear, Palworld structures, Palworld weapons",
  },
  map: {
    title: "Palworld Map - Pals, Bosses, Dungeons and Resources",
    description:
      "Palworld Map combines interactive location layers with Pal, Alpha boss, dungeon, tower, resource, merchant, base, Sunreach, and World Tree route planning.",
    keywords:
      "Palworld Map, Palworld interactive map, Palworld locations, Palworld Alpha Pals, Palworld dungeon map, Palworld resources, best base locations",
  },
  updates: {
    title: "Palworld Updates - 1.0 Patch Notes and Player Guide",
    description:
      "Palworld Updates turns 1.0 patch notes into clear player actions for new Pals, Sunreach, World Tree, Awakening, Mutation, breeding, map routes, and gear.",
    keywords:
      "Palworld Updates, Palworld 1.0 patch notes, Palworld new Pals, Palworld Sunreach, Palworld World Tree, Palworld Mutation",
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
        width: 1200,
        height: 630,
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
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
