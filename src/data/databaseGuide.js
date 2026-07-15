import { databaseCategorySlug, getDatabaseItemPath } from "@/data/database";
import { fitDescription, fitTitle } from "@/seo/tdk";

export const databaseSourceRefs = [
  {
    label: "Fandom Category:Items",
    href: "https://palworld.fandom.com/wiki/Category:Items",
    note: "Primary local import source for item membership, source URLs, and available item images.",
  },
  {
    label: "Game8 item guide",
    href: "https://game8.co/games/Palworld/archives/439563",
    note: "Reviewed for player-facing item categories, inventory routing, and how-to-use framing.",
  },
  {
    label: "Game8 materials guide",
    href: "https://game8.co/games/Palworld/archives/445030",
    note: "Reviewed for material acquisition patterns such as Pal drops, merchants, gathering, crafting, and refining.",
  },
  {
    label: "Fandom weapons",
    href: "https://palworld.fandom.com/wiki/Weapons",
    note: "Reviewed for weapon grouping into melee, ranged, grenades, Pal weapons, and collaboration weapons.",
  },
  {
    label: "Palworld.gg item database",
    href: "https://palworld.gg/items",
    note: "Reviewed for database UX patterns: search, type filters, rarity filters, recipes, price, tech level, and dropped-by links.",
  },
  {
    label: "Paldb items",
    href: "https://paldb.cc/Items",
    note: "Reviewed for item detail patterns including descriptions, stats, resistances, rarity-style grouping, and progression comparisons.",
  },
];

export const categoryGuides = {
  Accessories: {
    role: "Player build tuning",
    intent: "Compare passive stat boosts, resistances, carrying capacity, and build-specific utility before boss runs or long resource loops.",
    howToUse: "Equip accessories as build modifiers. Treat them as loadout pieces rather than crafting materials, and compare them against your weapon, armor, mount, and route objective.",
    acquisition: "Accessories are usually checked through exploration, merchants, boss rewards, schematics, or route-specific rewards. Confirm the route before farming one loop heavily.",
    priority: "Boss prep, mobility planning, carry-weight routes, and late-game stat tuning.",
  },
  Ammo: {
    role: "Weapon supply chain",
    intent: "Keep ranged weapons stocked and plan the materials that feed bows, guns, launchers, and special weapons.",
    howToUse: "Match ammo to the weapon family before leaving base. Build a repeatable production loop for the ammo type you burn fastest.",
    acquisition: "Ammo is commonly crafted from metals, gunpowder, organs, oils, or late-game materials depending on weapon tier.",
    priority: "Tower bosses, dungeon routes, raid prep, and high-volume combat farming.",
  },
  Armor: {
    role: "Survival and resistance",
    intent: "Choose defensive gear for biome temperature, boss pressure, and progression tier.",
    howToUse: "Upgrade armor when enemy damage or heat/cold pressure starts forcing food, accessory, or mount compromises.",
    acquisition: "Armor is usually crafted through technology progression, schematics, or specialized workbench tiers.",
    priority: "New biomes, tower attempts, dungeon scouting, and oil rig or endgame routes.",
  },
  Consumables: {
    role: "Field sustain",
    intent: "Plan food, medicine, bait, potions, and one-use items that keep routes running.",
    howToUse: "Carry consumables for the route length and climate. Keep base production separate from emergency stock so crafting does not drain travel supplies.",
    acquisition: "Consumables may come from cooking, farming, crafting, merchants, fishing, or Pal-related drops.",
    priority: "Breeding loops, dungeon runs, recovery stock, and long exploration sessions.",
  },
  Ingredients: {
    role: "Cooking and breeding inputs",
    intent: "Track food chain materials used in meals, Cake, bait, and base sustain.",
    howToUse: "Treat ingredients as production-chain inputs. Put recurring ingredients near farms, ranches, cookers, refrigerators, and breeding bases.",
    acquisition: "Ingredients often come from farming, ranch output, cooking chains, merchants, or Pals.",
    priority: "Cake automation, food buffs, medicine prep, and bait routes.",
  },
  Materials: {
    role: "Crafting backbone",
    intent: "Find the materials that unlock weapons, armor, structures, spheres, ammo, and Pal Gear.",
    howToUse: "Track materials by production lane: gathered, refined, crafted, dropped, purchased, or rare route reward.",
    acquisition: "Materials can be dropped by Pals, purchased from merchants, mined or gathered, crafted, refined, or earned from bosses and events.",
    priority: "Every base upgrade, technology unlock, weapon tier, armor tier, and late-game farming loop.",
  },
  "Pal Gear": {
    role: "Partner skill unlocks",
    intent: "Unlock mount riding, Pal-specific weapons, gliders, and partner-skill actions.",
    howToUse: "Craft Pal Gear after catching or breeding the matching Pal. Check the linked Pal before investing in a gear route.",
    acquisition: "Pal Gear is usually unlocked through technology progression tied to a Pal species and crafted at the proper bench.",
    priority: "Flying mounts, ground mounts, water mounts, gliders, and Pal-specific combat tools.",
  },
  Schematics: {
    role: "Rare recipe upgrades",
    intent: "Track recipe unlocks and higher-grade equipment plans.",
    howToUse: "Use schematics as upgrade targets. Before farming, confirm the exact route because schematic drops can be boss-, chest-, dungeon-, ruin-, rig-, or region-specific.",
    acquisition: "Schematics are commonly associated with chests, Alpha Pal routes, dungeons, oil rig-style areas, or rare rewards.",
    priority: "Legendary weapons, high-tier armor, late-game loadout optimization, and repeated boss routes.",
  },
  Spheres: {
    role: "Capture progression",
    intent: "Choose the correct capture tier before scouting rare Pals, Alpha Pals, dungeons, or late-game regions.",
    howToUse: "Carry a tier that matches the route. Save higher-grade spheres for rare or dangerous targets, and produce lower tiers in bulk for routine captures.",
    acquisition: "Spheres are crafted through technology progression and consume materials that scale with capture tier.",
    priority: "Paldeck completion, rare Pal scouting, Alpha routes, breeding parent capture, and new-region exploration.",
  },
  Structures: {
    role: "Base systems",
    intent: "Plan production buildings, storage, utilities, workstations, defenses, and automation pieces.",
    howToUse: "Place structures around worker flow. Keep storage, power, cooling, cooking, farming, and crafting chains close enough that Pals do not waste time pathing.",
    acquisition: "Structures are usually unlocked through technology and built from materials, refined metals, electronics, or specialized parts.",
    priority: "Production bases, breeding bases, resource outposts, and late-game automation.",
  },
  Furniture: {
    role: "Base decoration and comfort",
    intent: "Browse cosmetic and base-interior pieces without mixing them into critical production planning.",
    howToUse: "Use furniture after core production, storage, and Pal pathing are stable. Decoration should not block workstations or Pal routes.",
    acquisition: "Furniture is generally built from common or refined materials after technology or set unlocks.",
    priority: "Base theming, settlement polish, and non-critical construction.",
  },
  Utility: {
    role: "Exploration tools",
    intent: "Track non-combat tools such as bags, gliders, lanterns, grappling tools, and route helpers.",
    howToUse: "Upgrade utility items when travel friction becomes the limiting factor. Utility items often save more time than raw combat stats.",
    acquisition: "Utility tools are usually unlocked through technology and crafted from progression-tier materials.",
    priority: "Exploration, dungeon scouting, mountain routes, night travel, and inventory routing.",
  },
  Weapons: {
    role: "Combat loadout",
    intent: "Compare melee, ranged, grenade, special, Pal-specific, and collaboration weapon entries.",
    howToUse: "Match weapons with ammo supply, armor tier, accessory plan, and boss route. A stronger weapon is not reliable if its ammo chain is unstable.",
    acquisition: "Weapons are commonly crafted through technology, schematics, special unlocks, or Pal-specific gear routes.",
    priority: "Tower bosses, Alpha routes, raid fights, dungeon clearing, and endgame farming.",
  },
  Items: {
    role: "General index",
    intent: "Catch cross-category pages and miscellaneous entries that do not cleanly fit one production lane yet.",
    howToUse: "Use these as reference pages, then move through related categories once a clearer item role is known.",
    acquisition: "Acquisition depends on the item and may involve crafting, merchants, exploration, drops, technology, or event rewards.",
    priority: "General lookup, item routing, and miscellaneous planning.",
  },
};

const materialDropWords = [
  "Organ",
  "Pal Fluids",
  "Leather",
  "Bone",
  "Wool",
  "Soul",
  "Horn",
  "Plume",
  "Feather",
  "Claw",
  "Pelt",
  "Entrails",
  "Core",
  "Fragment",
  "Ribbon",
  "Tentacle",
  "Hair",
  "Crest",
];

const craftedWords = [
  "Ingot",
  "Cloth",
  "Cement",
  "Gunpowder",
  "Polymer",
  "Carbon Fiber",
  "Circuit Board",
  "Computer",
  "Nail",
  "Flour",
  "Oil",
  "Ammo",
  "Sphere",
  "Armor",
  "Helmet",
  "Schematic",
];

const gatheredWords = ["Wood", "Stone", "Ore", "Coal", "Sulfur", "Quartz", "Mushroom", "Berry", "Flower", "Lotus"];

function normalize(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function itemInText(item, text) {
  const title = normalize(item.title);
  const body = ` ${normalize(text)} `;
  return title.length > 3 && body.includes(` ${title} `);
}

function wordsMatchTitle(title, words) {
  return words.some((word) => title.includes(word));
}

export function getItemRole(item) {
  return categoryGuides[item.category]?.role || categoryGuides.Items.role;
}

export function getItemAcquisitionHints(item) {
  const hints = [];
  const title = item.title;
  const category = item.category;

  if (category === "Materials" && wordsMatchTitle(title, materialDropWords)) {
    hints.push("Check Pal drops and Alpha routes first.");
  }
  if (category === "Materials" && wordsMatchTitle(title, gatheredWords)) {
    hints.push("Route through mining, lumbering, gathering, or region-specific nodes.");
  }
  if (wordsMatchTitle(title, craftedWords) || ["Ammo", "Armor", "Weapons", "Structures", "Spheres", "Pal Gear"].includes(category)) {
    hints.push("Plan the crafting bench, technology unlock, and material chain before farming.");
  }
  if (category === "Schematics") {
    hints.push("Confirm the exact chest, dungeon, Ancient Ruin, Alpha, rig, or boss route before repeated farming.");
  }
  if (category === "Consumables" || category === "Ingredients") {
    hints.push("Check cooking, farming, merchant, ranch, and drop routes.");
  }
  if (category === "Accessories") {
    hints.push("Compare against boss-route needs, carry weight, defense, attack, or elemental resistance.");
  }

  return hints.length > 0 ? hints : [categoryGuides[category]?.acquisition || categoryGuides.Items.acquisition];
}

export function getItemUsageSteps(item) {
  const guide = categoryGuides[item.category] || categoryGuides.Items;
  const steps = [
    `Identify whether ${item.title} is needed for ${guide.role.toLowerCase()}.`,
    guide.howToUse,
  ];

  if (["Materials", "Ingredients", "Ammo", "Spheres"].includes(item.category)) {
    steps.push("Add it to a base stockpile target so repeated crafting does not drain route supplies.");
  }
  if (["Weapons", "Armor", "Accessories"].includes(item.category)) {
    steps.push("Compare it with your current boss, dungeon, or biome route before replacing a working loadout.");
  }
  if (item.category === "Pal Gear") {
    steps.push("Open the connected Pal page and confirm the Pal is already caught, bred, or assigned to the route.");
  }
  if (item.category === "Structures") {
    steps.push("Place it after checking Pal pathing, power, storage, cooling, and work suitability coverage.");
  }

  return Array.from(new Set(steps));
}

export function getRelatedPalsForItem(item, pals) {
  const title = normalize(item.title);

  if (!title) {
    return [];
  }

  return pals
    .map((pal) => {
      let score = 0;
      const reasons = [];

      if (itemInText(item, pal.drops || "")) {
        score += 5;
        reasons.push("drops");
      }
      if (itemInText(item, pal.facts?.["Tech Needed"] || "")) {
        score += 5;
        reasons.push("gear unlock");
      }
      if (item.category === "Pal Gear" && normalize(item.title).includes(normalize(pal.title))) {
        score += 6;
        reasons.push("matching Pal Gear");
      }

      return { pal, score, reasons };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.pal.title.localeCompare(b.pal.title))
    .slice(0, 8)
    .map(({ pal, reasons }) => ({
      title: pal.title,
      href: `/pals/${pal.addressBar}`,
      imageUrl: pal.imageUrl,
      element: pal.element,
      reasons,
    }));
}

export function getRelatedItems(item, items) {
  const category = item.category;
  const ownTokens = normalize(item.title).split(" ").filter((token) => token.length > 3);

  return items
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => {
      const tokenScore = ownTokens.filter((token) => normalize(candidate.title).includes(token)).length;
      const categoryScore = candidate.category === category ? 2 : 0;
      const listedCategoryScore = candidate.categories.some((entry) => item.categories.includes(entry)) ? 1 : 0;
      return { candidate, score: tokenScore * 3 + categoryScore + listedCategoryScore };
    })
    .filter((entry) => entry.score > 1)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title))
    .slice(0, 8)
    .map(({ candidate }) => ({
      title: candidate.title,
      href: getDatabaseItemPath(candidate),
      imageUrl: candidate.imageUrl,
      category: candidate.category,
    }));
}

export function enrichDatabaseItem(item, { items = [], pals = [] } = {}) {
  const guide = categoryGuides[item.category] || categoryGuides.Items;
  const relatedPals = getRelatedPalsForItem(item, pals);
  const relatedItems = getRelatedItems(item, items);
  const acquisitionHints = getItemAcquisitionHints(item);
  const usageSteps = getItemUsageSteps(item);

  return {
    ...item,
    guide,
    role: getItemRole(item),
    acquisitionHints,
    usageSteps,
    relatedPals,
    relatedItems,
    categoryHref: `/database/${databaseCategorySlug(item.category)}`,
    guideSummary: `${item.title} belongs to Palworld ${item.category} and supports ${guide.role.toLowerCase()}. Use this guide to decide when it matters, how to plan acquisition, and which Pals or items connect to the same goal.`,
  };
}

export function buildDatabaseExplorerData(items) {
  const categories = Object.values(
    items.reduce((acc, item) => {
      acc[item.category] ||= {
        category: item.category,
        slug: databaseCategorySlug(item.category),
        items: [],
        guide: categoryGuides[item.category] || categoryGuides.Items,
      };
      acc[item.category].items.push(item);
      return acc;
    }, {}),
  ).sort((a, b) => a.category.localeCompare(b.category));

  const featured = [
    "Pal Sphere",
    "Ancient Sphere",
    "Pal Metal Ingot",
    "High Quality Pal Oil",
    "Ancient Civilization Parts",
    "Cake",
    "Rocket Ammo",
    "Refined Ingot",
    "Jetragon's Missile Launcher",
    "Ability Glasses",
    "Metal Armor",
    "Assault Rifle Ammo",
  ]
    .map((title) => items.find((item) => item.title === title))
    .filter(Boolean)
    .map((item) => enrichDatabaseItem(item, { items }));

  return {
    stats: {
      total: items.length,
      categories: categories.length,
      images: items.filter((item) => item.imageSourceUrl).length,
      fallbacks: items.filter((item) => !item.imageSourceUrl).length,
    },
    categories: categories.map((group) => ({
      ...group,
      sampleItems: group.items.slice(0, 6).map((item) => ({
        title: item.title,
        href: getDatabaseItemPath(item),
        imageUrl: item.imageUrl,
      })),
      count: group.items.length,
    })),
    featured: featured.map((item) => ({
      title: item.title,
      href: getDatabaseItemPath(item),
      imageUrl: item.imageUrl,
      category: item.category,
      role: item.role,
      summary: item.guideSummary,
    })),
    sourceRefs: databaseSourceRefs,
  };
}

export function buildDatabaseCategoryData(group, allItems, pals) {
  const enriched = group.items.map((item) => enrichDatabaseItem(item, { items: allItems, pals }));
  const guide = categoryGuides[group.category] || categoryGuides.Items;

  return {
    category: group.category,
    slug: group.slug,
    guide,
    items: enriched.map((item) => ({
      id: item.id,
      title: item.title,
      href: getDatabaseItemPath(item),
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      category: item.category,
      categories: item.categories,
      role: item.role,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      lastChecked: item.lastChecked,
      guideSummary: item.guideSummary,
      acquisitionHints: item.acquisitionHints,
      relatedPalCount: item.relatedPals.length,
      relatedItemCount: item.relatedItems.length,
    })),
    stats: {
      total: enriched.length,
      linkedPals: enriched.filter((item) => item.relatedPals.length > 0).length,
      sourcedImages: enriched.filter((item) => item.imageSourceUrl).length,
      multiCategory: enriched.filter((item) => item.categories.length > 1).length,
    },
    sourceRefs: databaseSourceRefs,
  };
}

export function buildDatabaseSeo(item) {
  const guide = categoryGuides[item.category] || categoryGuides.Items;
  const title =
    item.title.length <= 14
      ? `Palworld Database - ${item.title} Item Guide and Uses`
      : item.title.length <= 34
        ? `Palworld Database - ${item.title} Guide`
        : fitTitle("Palworld Database - ", item.title);
  const description = fitDescription(
    `Palworld Database ${item.title} guide explains how to get and use it, its ${item.category} role, related Pals, connected items, and ${guide.role.toLowerCase()} routes.`,
    "Use it before crafting, farming, upgrading gear, or planning a route.",
  );

  return {
    title,
    description,
    keywords: `Palworld Database ${item.title}, Palworld ${item.title} guide, Palworld ${item.category}, ${item.title} how to get, ${item.title} how to use`,
  };
}
