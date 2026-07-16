export const breedingHub = {
  eyebrow: "Breeding Guide",
  title: "Palworld Breeding Guide",
  summary:
    "A complete Palworld breeding reference for 1.0: Breeding Farm setup, Cake production, Egg Incubators, parent selection, passive inheritance, mutation planning, and route building.",
  heroImage: "/images/palworld/screenshot-4.jpg",
  version: "Palworld 1.0",
  lastVerified: "2026-07-13",
  authorNote:
    "Built as a practical breeding guide for players who need mechanics, setup order, Cake planning, and 1.0 update notes in one place.",
  statCards: [
    { value: "Lv 19", label: "Breeding Farm technology tier" },
    { value: "1 Cake", label: "Required per breeding cycle" },
    { value: "5 min", label: "Base egg production interval" },
    { value: "1.0", label: "Mutation system added" },
  ],
  sections: [
    {
      title: "How Breeding Works",
      badge: "Core",
      lede:
        "Breeding in Palworld is not only a way to fill the Paldeck. It is the main long-term system for chasing passive skills, creating subspecies, improving base workers, and preparing combat teams.",
      body: [
        "The basic loop is simple: build a Breeding Farm, assign one male and one female Pal, place Cake into the farm box, wait for the egg, then move the egg to an Egg Incubator. The important strategic layer is choosing parents. Community wiki data documents a hidden breeding power value behind each Pal, and the child is selected by comparing the parents' values rather than by visible element alone.",
        "For SEO and player usefulness, this page separates the breeding workflow into setup, parent choice, path planning, egg handling, and 1.0-specific changes. A future calculator can use this structure without rewriting the guide."
      ],
      facts: [
        "Breeding Farm requires a male Pal, a female Pal, and Cake.",
        "The resulting egg must be hatched in an Egg Incubator.",
        "Hidden breeding power determines most regular offspring results.",
        "Special combinations can override the normal result formula."
      ],
      checklist: ["Choose target Pal", "Pick parent pair", "Prepare Cake", "Incubate egg", "Evaluate passives"],
    },
    {
      title: "Breeding Farm Setup",
      badge: "Build",
      lede:
        "The Breeding Farm is the station that turns parent selection into eggs. A professional guide should give the unlock, materials, and base-planning implications in one place.",
      body: [
        "Fandom lists the Breeding Farm as a tier 19 technology item costing 2 technology points, with a recipe of Wood, Stone, and Fiber. That makes it a mid-game system: you should already have basic resource automation, food production, and enough base space before trying to run multiple farms.",
        "Because assigned Pals are removed from normal work while breeding, treat the farm like a dedicated production line. Keep parent storage, Cake storage, incubators, and feed access nearby. For large breeding projects, a separate breeding base is cleaner than mixing parent pairs into a mining or manufacturing base."
      ],
      facts: [
        "Technology tier: 19.",
        "Unlock cost: 2 technology points.",
        "Listed materials: 100 Wood, 20 Stone, 50 Fiber.",
        "Egg output depends on Cake availability and assigned parent pair."
      ],
      checklist: ["Flat farm space", "Parent storage", "Cake box access", "Nearby incubators", "Spare worker Pals"],
    },
    {
      title: "Cake Production",
      badge: "Food",
      lede:
        "Cake is the bottleneck most breeding bases underestimate. If Cake is missing, the pair will not convert time into eggs.",
      body: [
        "Fandom's Cake page lists Flour, Red Berries, Milk, Egg, and Honey as crafting materials. That means a stable Cake line usually needs Wheat farming and milling, Berry farming, Chikipi or merchant access for eggs, Mozzarina or merchant access for milk, and Beegarde-style honey production.",
        "For a real wiki page, Cake deserves its own planning block because it links breeding to farming, ranching, cooking workload, and base worker assignment. Players searching for breeding help often fail here, not at the parent-selection stage."
      ],
      facts: [
        "Cake is placed in the box attached to the Breeding Farm.",
        "Fandom lists Cake materials as Flour, Red Berries, Milk, Egg, and Honey.",
        "Cake has a high workload cost, so cooking capacity matters.",
        "A dedicated Cake base should prioritize farming, ranching, transport, and kindling."
      ],
      checklist: ["Wheat farm", "Mill Flour", "Berry supply", "Milk and Egg source", "Honey source", "Cooking worker"],
    },
    {
      title: "Parent Selection and Path Finder",
      badge: "Path",
      lede:
        "A breeding path finder should answer the player's real question: from the Pals I own, what is the shortest reliable route to the Pal I want?",
      body: [
        "The regular breeding system uses parent values to choose a child near the averaged result. That makes path planning possible: a strong or rare parent can be walked toward nearby results through repeated pairings, but normal breeding does not simply let every weak pair jump straight into the rarest Pal.",
        "The future tool should support forward lookup, reverse lookup, and multi-step pathing. This page now sets the UX expectations for that tool: show parent pair, expected child, route length, special-combo warnings, and whether the result is better pursued by capture, breeding, or an update-specific mechanic."
      ],
      facts: [
        "Forward lookup: two parents to expected child.",
        "Reverse lookup: target Pal to possible parents.",
        "Path finding: owned Pal list to target route.",
        "Special combos should be flagged separately from formula results."
      ],
      checklist: ["Target role", "Available parents", "Passive goals", "Route length", "Backup capture route"],
    },
    {
      title: "Passive Skills, IVs, and Mutation",
      badge: "1.0",
      lede:
        "Version 1.0 changed the breeding conversation because Mutation adds a low-chance way for eggs to produce stronger-than-normal results.",
      body: [
        "The official 1.0 changelog adds Mutation as a breeding-related mechanic: mutated eggs can produce Pals with higher stats and a unique passive skill. The same changelog also introduces Mushroom Cake and Vegetable Cake effects, which makes the Cake system more than a simple on/off requirement.",
        "Keep confirmed mechanics separate from practical planning notes. Mutation and special cakes are current 1.0 mechanics; exact optimization paths should stay conservative until the local calculator imports current 1.0 breeding tables."
      ],
      facts: [
        "Mutation is a 1.0 mechanic tied to breeding.",
        "Mutated eggs can have higher stats and a unique passive skill.",
        "Mushroom Cake and Vegetable Cake are listed in the official 1.0 changelog.",
        "Passive inheritance strategy should be revisited after each major patch."
      ],
      checklist: ["Separate normal eggs", "Track mutated results", "Record passive skills", "Retest after patches"],
    },
    {
      title: "Egg Incubation and Hatch Review",
      badge: "Eggs",
      lede:
        "Egg management is the bridge between breeding theory and usable Pals. A clean workflow prevents good eggs from being lost in storage noise.",
      body: [
        "Eggs may come from Breeding Farm output or from world exploration. The hatch step should record parent pair, target, passive skills, element, and whether the hatch is kept, condensed, assigned to base work, or moved into a combat build.",
        "A professional wiki should eventually expose egg categories, incubation conditions, and item links. Until that data is fully verified, the page gives players a practical audit workflow that still supports the future database."
      ],
      facts: [
        "Breeding eggs and field eggs should be tracked separately.",
        "Incubator capacity becomes a bottleneck in large breeding bases.",
        "Temperature and incubation speed belong in the future Egg detail page.",
        "Final hatch review should connect to Pal, Database, Breeding, and Map detail checks."
      ],
      checklist: ["Label egg source", "Incubate", "Check passives", "Assign outcome", "Update target list"],
    },
  ],
  workflow: [
    "Define the target Pal, target role, and required passive skills before breeding.",
    "Build a Breeding Farm at tier 19 and stage parent storage, Cake, and incubators nearby.",
    "Use normal pair lookup for predictable results and separate special combinations from formula results.",
    "After 1.0, track Mutation attempts and special Cake use separately from ordinary breeding logs.",
    "Move successful hatches into build pages, base worker lists, or mount planning pages."
  ],
  faqs: [
    {
      question: "What do I need to start breeding in Palworld?",
      answer:
        "You need a Breeding Farm, one male Pal, one female Pal, Cake in the farm box, and an Egg Incubator for the egg after it is produced.",
    },
    {
      question: "Why is Cake so important for breeding?",
      answer:
        "Cake is the required farm input. Without Cake, the assigned pair will not produce usable eggs, so Flour, Berries, Milk, Eggs, Honey, cooking workload, and transport all affect breeding throughput.",
    },
    {
      question: "Did Palworld 1.0 change breeding?",
      answer:
        "Yes. The official 1.0 changelog adds Mutation and special cakes, which means breeding strategy should now track ordinary results and mutation attempts separately.",
    },
  ],
  sources: [
    {
      label: "Fandom Breeding",
      href: "https://palworld.fandom.com/wiki/Breeding",
      note: "Breeding overview, hidden breeding power explanation, combination count, and special-combo structure.",
    },
    {
      label: "Fandom Breeding Farm",
      href: "https://palworld.fandom.com/wiki/Breeding_Farm",
      note: "Technology tier, unlock cost, materials, male/female assignment, Cake requirement, and egg output notes.",
    },
    {
      label: "Fandom Cake",
      href: "https://palworld.fandom.com/wiki/Cake",
      note: "Cake material requirements and crafting context.",
    },
    {
      label: "SteamDB 1.0 Changelog",
      href: "https://steamdb.info/patchnotes/24088745/",
      note: "Mutation, special cakes, new Pals, and 1.0 system changes mirrored from Steam news.",
    },
  ],
};

export const mapHub = {
  eyebrow: "World Map Guide",
  title: "Palworld Interactive Map Guide",
  summary:
    "A professional Palworld interactive map hub for 1.0: live map search, Sunreach, World Tree, Pal locations, Alpha Pals, dungeons, towers, merchants, resources, base spots, and route planning.",
  heroImage: "/images/palworld/screenshot-1.jpg",
  version: "Palworld 1.0",
  lastVerified: "2026-07-14",
  authorNote:
    "Map guidance is version-aware. 1.0 changed the world layout, Pal habitats, towers, settlements, and exploration priorities, so pre-1.0 routes should be treated as stale until rechecked.",
  statCards: [
    { value: "Sunreach", label: "1.0 floating island region" },
    { value: "World Tree", label: "1.0 story destination" },
    { value: "72", label: "New Pals in 1.0 changelog" },
    { value: "7+", label: "Tower and boss-route focus" },
  ],
  sections: [
    {
      title: "Interactive Map Strategy",
      badge: "Map",
      lede:
        "A map page should help players choose what to do next, not simply display a static list of labels.",
      body: [
        "The professional layout should support map intent clusters: Pal spawns, Alpha Pals, dungeons, towers, resources, merchants, settlements, fast travel, and base candidates. Each cluster answers a different player task.",
        "The hub tells players which map category to use for each goal, which routes are likely affected by 1.0, and which local pages should be checked after location data updates."
      ],
      facts: [
        "Map pages should be filtered by player goal, not only by region.",
        "Location pages should expose source and last-verified dates.",
        "1.0 habitat rebalance makes old fixed-spawn advice risky.",
        "Fast travel and base planning should connect back to Map, Database, and Breeding where relevant."
      ],
      checklist: ["Pick goal", "Choose category", "Check version date", "Open related route", "Verify in-game"],
    },
    {
      title: "Sunreach and World Tree",
      badge: "1.0",
      lede:
        "The biggest current SEO opportunity is Palworld 1.0 map coverage because Sunreach and the World Tree reshape progression.",
      body: [
        "Pocketpair's 1.0 messaging confirms new regions, new Pals, and the long-awaited World Tree. The Steam changelog adds more detail: Sunreach is a floating island area, the World Tree becomes central to the story, and new islands, settlements, watchtowers, ruins, and enemy bases expand exploration.",
        "For a wiki, these are not just news items. They should drive new map filters, new guide pages, new resource routes, and updated Pal location checks. The page now marks Sunreach and World Tree as first-class map sections instead of burying them under generic 'regions'."
      ],
      facts: [
        "Sunreach is a new floating island region in 1.0.",
        "The World Tree opens as a major story destination.",
        "Watchtowers reveal surrounding map and serve as fast travel points.",
        "New settlements are listed for Bamboo Groves, Snowy Mountains, Sakurajima, and Sunreach."
      ],
      checklist: ["Sunreach route", "World Tree prep", "Watchtower unlocks", "Settlement checks", "New ore notes"],
    },
    {
      title: "Pal and Alpha Locations",
      badge: "Pals",
      lede:
        "Pal location pages need version markers because 1.0 rebalanced Pal habitats and added many new Pals.",
      body: [
        "The Steam changelog states that Pal habitats and spawn levels were reviewed, which means routes copied from older guides may point to the wrong place. A professional wiki should show last checked date and whether a location was checked after 1.0.",
        "Alpha Pal locations are separate from ordinary spawns because they affect Ancient Civilization Parts, boss farming, route difficulty, and map markers. Alpha routes should link to tower, dungeon, and breeding pages where relevant."
      ],
      facts: [
        "1.0 adds 72 Pals, including 47 new Pals and 25 variants.",
        "Pal habitats and spawn levels were rebalanced in 1.0.",
        "Alpha routes are different from normal spawn routes.",
        "Location pages should link back to Pal detail pages."
      ],
      checklist: ["Normal spawn", "Alpha spawn", "Level band", "Element prep", "Source date"],
    },
    {
      title: "Dungeons, Towers, and Boss Routes",
      badge: "Combat",
      lede:
        "Dungeons and towers are map content, combat content, and progression content at the same time.",
      body: [
        "Fandom describes dungeons as biome-dependent locations with Alpha Pals and guaranteed rewards at the end. Tower pages should focus on boss order, team preparation, time limits, unlock rewards, and story route context.",
        "The map hub should not try to fully duplicate every boss guide. It should provide the index layer: where the content belongs, why it matters, what preparation to bring, and which detail pages need expansion."
      ],
      facts: [
        "Dungeons have biome-dependent Alpha Pal pools.",
        "Dungeon endings include Alpha encounters and reward chests.",
        "Towers are tied to faction leaders and progression.",
        "1.0 adds and revises world exploration targets."
      ],
      checklist: ["Biome", "Dungeon tier", "Alpha pool", "Tower order", "Team counter"],
    },
    {
      title: "Resources, Merchants, and Bases",
      badge: "Routes",
      lede:
        "Most players use map content for practical farming: where to get materials, where to trade, and where to build.",
      body: [
        "Resource route notes should connect to Database categories: ore, coal, sulfur, oil, hardwood, late-game materials, and new 1.0 ores. Merchant routes should separate wandering merchants, Pal merchants, black marketeers, settlement vendors, and update-specific shops.",
        "Best base location pages should explain tradeoffs: nearby resources, flat terrain, raid exposure, fast travel distance, worker transport, and post-1.0 route value. A base spot is only 'best' for a goal, not universally best for every player."
      ],
      facts: [
        "Wandering merchants buy and sell items for Gold Coins.",
        "Merchant types and inventories vary by NPC/location.",
        "Resource routes should link to database item pages.",
        "Base spots should be evaluated by role: mining, breeding, production, oil, or travel."
      ],
      checklist: ["Resource goal", "Merchant type", "Fast travel", "Base role", "Raid risk"],
    },
  ],
  workflow: [
    "Start by choosing the map job: spawn check, boss route, dungeon, merchant, resource, or base.",
    "Confirm whether the route has been verified after Palworld 1.0.",
    "Open the matching Pal, Database, Route, or Base page for details.",
    "Record route gaps and add them to the data import backlog.",
    "Update sitemap and internal links whenever a new location detail page is created."
  ],
  faqs: [
    {
      question: "Why do Palworld location guides need a 1.0 verification date?",
      answer:
        "The 1.0 changelog says Pal habitats and spawn levels were reviewed, so older spawn routes may be inaccurate. A last-verified date protects players from stale route advice.",
    },
    {
      question: "Should Alpha Pal locations be listed with normal Pal spawns?",
      answer:
        "They should be cross-linked but not merged. Alpha routes affect boss farming, Ancient Technology materials, difficulty, and map markers differently from ordinary Pal spawns.",
    },
    {
      question: "What makes a base location good?",
      answer:
        "A good base location depends on role: mining wants resource density, breeding wants clean layout and food flow, production wants transport, and late-game routes need fast travel access.",
    },
  ],
  sources: [
    {
      label: "SteamDB 1.0 Changelog",
      href: "https://steamdb.info/patchnotes/24088745/",
      note: "Sunreach, World Tree, watchtowers, settlements, habitat rebalance, and new Pal count.",
    },
    {
      label: "Pocketpair 1.0 Announcement",
      href: "https://www.pocketpair.jp/en/game-news/palworld-1-0-july-10-cinematic-trailer-revealed/",
      note: "Official 1.0 date, new regions, new Pals, and World Tree messaging.",
    },
    {
      label: "Fandom Dungeons",
      href: "https://palworld.fandom.com/wiki/Dungeons",
      note: "Dungeon biome and Alpha Pal reward structure.",
    },
    {
      label: "Fandom Wandering Merchant",
      href: "https://palworld.fandom.com/wiki/Wandering_Merchant",
      note: "Merchant roles, item buying/selling, merchant types, and location behavior.",
    },
    {
      label: "MapGenie Palpagos Islands",
      href: "https://mapgenie.io/palworld/maps/palpagos-islands",
      note: "Referenced for interactive map UX patterns such as category layers, search, marker inspection, and found-location tracking. Proprietary tiles and marker data are not copied.",
    },
    {
      label: "Paldb Map",
      href: "https://paldb.cc/en/Map",
      note: "External map reference for location category planning.",
    },
  ],
};

export const updatesHub = {
  eyebrow: "Patch Notes",
  title: "Palworld Updates and Patch Notes",
  summary:
    "A practical Palworld update tracker for 1.0, patch notes, new Pals, new items, version history, guide refreshes, and database work.",
  heroImage: "/images/palworld/screenshot-5.jpg",
  version: "Palworld 1.0",
  lastVerified: "2026-07-14",
  authorNote:
    "This page prioritizes official Pocketpair announcements and Steam changelog data, then uses community wiki sources only for system-level follow-up work.",
  statCards: [
    { value: "2026-07-10", label: "1.0 official release date" },
    { value: "72", label: "New Pals listed in changelog" },
    { value: "287", label: "Total Pals after 1.0" },
    { value: "850K+", label: "Steam concurrency after launch" },
  ],
  sections: [
    {
      title: "Palworld 1.0 Overview",
      badge: "Live",
      lede:
        "Palworld 1.0 is the site's main freshness event. It changes what needs to be checked across Pals, Database, Breeding, Map, Base, and Guides.",
      body: [
        "Pocketpair announced that Palworld would exit Early Access and release Version 1.0 on July 10, 2026. The official news post framed the update around new Pals, new regions, an ominous new threat, and the World Tree.",
        "The Steam changelog is much more detailed: 1.0 adds Sunreach, opens the World Tree story destination, expands the world, adds 72 Pals, introduces Awakening and Mutation, revises habitats, and changes base-building and multiplayer systems. That makes every high-traffic guide a candidate for review."
      ],
      facts: [
        "1.0 released on July 10, 2026.",
        "Pocketpair's news page lists Palworld 1.0 as out now.",
        "Steam changelog lists 72 new Pals and 287 total Pals.",
        "1.0 adds Awakening, Mutation, Sunreach, World Tree, and habitat rebalance."
      ],
      checklist: ["Confirm changelog", "Refresh Pals", "Refresh Database", "Refresh Map", "Audit guides"],
    },
    {
      title: "Patch Notes Workflow",
      badge: "Editorial",
      lede:
        "A professional wiki should treat patch notes as an editorial workflow, not a single news card.",
      body: [
        "Each update should be broken into affected systems: Pals, items, breeding, map, bases, combat, servers, and UI. The page should then link the changed system to the corresponding local dataset or guide.",
        "The current site now stores Pal and Database records locally, so patch notes should trigger a data refresh checklist: refresh records, check image coverage, rebuild sitemap, and verify affected pages in browser."
      ],
      facts: [
        "Official changelog first, community follow-up second.",
        "Each patch needs a source URL and last-checked date.",
        "Data imports should be verified with lint and build.",
        "Major patch pages should link to affected guides."
      ],
      checklist: ["Source note", "System tags", "Data refresh", "Internal links", "Verification"],
    },
    {
      title: "New Pals and Paldeck Impact",
      badge: "Pals",
      lede:
        "New Pals affect more than the Paldeck. They also affect breeding routes, map locations, work suitability, combat team planning, mounts, and tier lists.",
      body: [
        "The 1.0 changelog lists 47 new Pals and 25 variant Pals. This creates follow-up work across the site: Pal images, elements, work suitability, drops, habitat, partner skill, build roles, and map placement.",
        "The Pal explorer separates regular Pals, subspecies, Terraria entries, and unreleased entries so players can compare the current roster without mixing special rows into ordinary Paldeck planning."
      ],
      facts: [
        "1.0 changelog lists 72 new Pals.",
        "Variant Pals should be grouped with base species.",
        "New Pals require image, element, work, drop, and location verification.",
        "Breeding and map pages should link back to affected Pal detail pages."
      ],
      checklist: ["Check Palpedia", "Refresh images", "Check variants", "Map habitats", "Update guide notes"],
    },
    {
      title: "New Items, Recipes, and Technology",
      badge: "Database",
      lede:
        "Item changes affect Database SEO because players search for exact materials, recipes, technology unlocks, and where to get them.",
      body: [
        "The local Database now has 767 Category:Items entries with local images. A professional update workflow should add fields beyond category membership: unlock tier, crafting materials, source, price, weight, structure type, and recipe dependencies.",
        "When 1.0 adds new systems such as Awakening, Mutation support items, new ores, and ancient civilization technology, those terms should become database facets rather than loose guide text."
      ],
      facts: [
        "Database items now use local images, not generic screenshots.",
        "Future item pages should include recipe, unlock, source, and usage fields.",
        "New ores and special cakes should be tracked as update-sensitive records.",
        "Technology and recipe pages are currently pending deeper import."
      ],
      checklist: ["Import categories", "Import page images", "Extract infobox facts", "Link recipes", "Check sitemap"],
    },
    {
      title: "Version History and Freshness Checks",
      badge: "Freshness",
      lede:
        "A game wiki stays useful when version dates are visible and old Early Access advice is not treated as current 1.0 planning.",
      body: [
        "Every major page should make current-version status easy to understand. This is especially important after 1.0 because old Early Access map and breeding advice may be partially wrong.",
        "The update hub should help players see which systems changed first: Pals, items, breeding, map regions, towers, combat, and progression."
      ],
      facts: [
        "Release dates and version numbers should be easy to find.",
        "Mechanics pages should avoid mixing old and current advice.",
        "Game records and player planning notes should stay separate.",
        "High-traffic pages need review after every major update."
      ],
      checklist: ["Last checked date", "Version tag", "Change impact", "Player caveats"],
    },
  ],
  workflow: [
    "Read the official Pocketpair news list and Steam changelog first.",
    "Tag each change by affected area: Pals, Map, Breeding, Database, Base, Combat, Servers, or Guides.",
    "Run data importers for Pals and Database, then check local image coverage.",
    "Update affected long-form pages with source notes and last-verified dates.",
    "Run lint, build, desktop smoke checks, and mobile overflow checks before publishing."
  ],
  officialNotes: [
    {
      date: "2026.07.10",
      title: "Palworld 1.0 is OUT NOW!",
      source: "Pocketpair Palworld news list",
      href: "https://www.pocketpair.jp/en/game-news/category_game/palworld-en/",
    },
    {
      date: "2026.07.09",
      title: "Palworld 1.0 Official Launch Trailer Unveiled",
      source: "Pocketpair Palworld news list",
      href: "https://www.pocketpair.jp/en/game-news/category_game/palworld-en/",
    },
    {
      date: "2026.07.08",
      title: "Palworld Reaches 40 Million Total Players",
      source: "Pocketpair Palworld news list",
      href: "https://www.pocketpair.jp/en/game-news/category_game/palworld-en/",
    },
    {
      date: "2026.06.06",
      title: "Palworld 1.0 - July 10 cinematic trailer announcement",
      source: "Pocketpair announcement",
      href: "https://www.pocketpair.jp/en/game-news/palworld-1-0-july-10-cinematic-trailer-revealed/",
    },
  ],
  faqs: [
    {
      question: "What is the latest major Palworld update covered here?",
      answer:
        "The update hub is currently built around Palworld 1.0, released July 10, 2026, with official Pocketpair and Steam changelog sources.",
    },
    {
      question: "Why do older Palworld guides need review after 1.0?",
      answer:
        "The 1.0 changelog includes world expansion, habitat rebalance, new Pals, new systems, and base-building changes, so older Early Access advice can be incomplete or stale.",
    },
    {
      question: "How should the site handle future patch notes?",
      answer:
        "Each patch should be split into affected systems, linked to source URLs, connected to local data imports, and checked with lint, build, and browser smoke tests.",
    },
  ],
  sources: [
    {
      label: "Pocketpair Palworld News",
      href: "https://www.pocketpair.jp/en/game-news/category_game/palworld-en/",
      note: "Official news list for Palworld 1.0, trailer, player milestone, and earlier update announcements.",
    },
    {
      label: "Pocketpair 1.0 Announcement",
      href: "https://www.pocketpair.jp/en/game-news/palworld-1-0-july-10-cinematic-trailer-revealed/",
      note: "Official 1.0 date and release framing from Summer Game Fest 2026.",
    },
    {
      label: "SteamDB 1.0 Changelog",
      href: "https://steamdb.info/patchnotes/24088745/",
      note: "Full 1.0 changelog mirror with new areas, Pals, systems, and mechanics.",
    },
  ],
};
