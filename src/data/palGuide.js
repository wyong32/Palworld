import { getDatabaseItemPath } from "@/data/database";
import { featuredBreedingCombos } from "@/data/breedingTools";
import { buildPalMapHref, getMapLinkedPalCount, getPalFixedEncounters } from "@/data/bossMap";
import { currentWorkSuitability } from "@/data/currentWorkSuitability";
import { breedingMatrix, getBreedingTargetPairs } from "@/data/breedingMatrix";
import { gameDataProvenance, getPalGameDetails } from "@/data/gameDetails";
import { fitDescription, fitTitle } from "@/seo/tdk";

export const workTypes = [
  "Kindling",
  "Watering",
  "Planting",
  "Generating Electricity",
  "Handiwork",
  "Gathering",
  "Lumbering",
  "Mining",
  "Medicine Production",
  "Cooling",
  "Transporting",
  "Farming",
];

export const elementMatchups = {
  Dark: { strong: ["Neutral"], weak: ["Dragon"] },
  Dragon: { strong: ["Dark"], weak: ["Ice"] },
  Electric: { strong: ["Water"], weak: ["Ground"] },
  Fire: { strong: ["Grass", "Ice"], weak: ["Water"] },
  Grass: { strong: ["Ground"], weak: ["Fire"] },
  Ground: { strong: ["Electric"], weak: ["Grass"] },
  Ice: { strong: ["Dragon"], weak: ["Fire"] },
  Neutral: { strong: [], weak: ["Dark"] },
  Water: { strong: ["Fire"], weak: ["Electric"] },
};

export const palSourceRefs = [
  {
    label: "Palpedia source data",
    href: "https://palworld.fandom.com/wiki/Palpedia",
    note: "Local Pal entries use Palpedia facts, images, drops, partner skill, work suitability, and habitat fields.",
  },
  {
    label: "Work Suitability",
    href: "https://palworld.fandom.com/wiki/Work_Suitability",
    note: "Work suitability governs task efficiency and role assignment at bases.",
  },
  {
    label: "Elements",
    href: "https://palworld.fandom.com/wiki/Elements",
    note: "Element matchups drive damage advantages and team planning.",
  },
  {
    label: "Rideable Pals",
    href: "https://palworld.fandom.com/wiki/Rideable_Pals",
    note: "Mount pages distinguish ground, swimming, flying, and glider roles.",
  },
  {
    label: "Partner Skills",
    href: "https://palworld.fandom.com/wiki/Partner_Skills",
    note: "Partner Skills define species abilities and can be improved with condensation.",
  },
];

const flyingMountNames = new Set([
  "Nitewing",
  "Elphidran",
  "Vanwyrm",
  "Vanwyrm Cryst",
  "Helzephyr",
  "Beakon",
  "Elphidran Aqua",
  "Ragnahawk",
  "Faleris",
  "Suzaku",
  "Suzaku Aqua",
  "Astegon",
  "Jetragon",
  "Helzephyr Lux",
  "Selyne",
  "Faleris Aqua",
  "Xenolord",
  "Quivern",
  "Shadowbeak",
  "Frostallion",
  "Frostallion Noct",
  "Panthalus",
  "Quivern Botan",
  "Dynamoff",
  "Eidrolon",
  "Eidrolon Ignis",
  "Beakon Cryst",
  "Roujay",
]);

const groundMountNames = new Set([
  "Rushoar",
  "Melpaca",
  "Direhowl",
  "Chillet",
  "Eikthyrdeer",
  "Univolt",
  "Arsox",
  "Grintale",
  "Sweepa",
  "Broncherry",
  "Kingpaca",
  "Dazemu",
  "Maraith",
  "Mossanda",
  "Eikthyrdeer Terra",
  "Surfent Terra",
  "Mossanda Lux",
  "Fenglope",
  "Rayhound",
  "Broncherry Aqua",
  "Tarantriss",
  "Reindrix",
  "Mammorest",
  "Pyrin",
  "Kitsun",
  "Reptyro",
  "Blazehowl",
  "Pyrin Noct",
  "Blazamut",
  "Paladius",
  "Necromus",
  "Bastigor",
]);

const waterMountNames = new Set(["Surfent", "Azurobe", "Jormuntide"]);
const gliderNames = new Set(["Celaray", "Killamari", "Hangyu", "Galeclaw", "Hangyu Cryst"]);

const combatPickNames = new Set([
  "Selyne",
  "Xenogard",
  "Blazamut Ryu",
  "Knocklem",
  "Helzephyr Lux",
  "Menasting Terra",
  "Paladius",
  "Fenglope",
  "Gorirat",
  "Jormuntide Ignis",
  "Blazamut",
  "Incineram",
  "Warsect",
  "Lyleen",
  "Quivern Botan",
  "Verdash",
  "Anubis",
  "Orserk",
  "Frostallion",
  "Frostallion Noct",
  "Jetragon",
  "Shadowbeak",
  "Necromus",
  "Bellanoir",
  "Bellanoir Libero",
  "Bastigor",
]);

const breedingTargetNames = new Set(featuredBreedingCombos.map((combo) => combo.target));

const specialDropWords = [
  "Manual",
  "Diamond",
  "Soul",
  "Organ",
  "Oil",
  "Quartz",
  "Polymer",
  "Carbon",
  "Coal",
  "Ore",
  "Pal Fluids",
  "Leather",
  "Bone",
  "Venom",
  "Wool",
  "Milk",
  "Egg",
  "Honey",
];

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function parseWorkSuitability(value = "") {
  return Array.from(value.matchAll(/([A-Za-z ]+?)\s+(\d)/g)).map((match) => ({
    type: match[1].trim(),
    level: Number(match[2]),
  }));
}

function getCurrentWork(pal) {
  return getPalGameDetails(pal.title)?.work || currentWorkSuitability[pal.title] || parseWorkSuitability(pal.workSuitability);
}

function formatWorkSuitability(work) {
  return work.map((entry) => `${entry.type} ${entry.level}`).join(", ");
}

export function getPalWorkSuitability(pal) {
  return formatWorkSuitability(getCurrentWork(pal));
}

function itemMatchesDrop(dropText, itemTitle) {
  const normalizedDrop = ` ${normalize(dropText)} `;
  const normalizedTitle = normalize(itemTitle);

  if (!normalizedTitle || normalizedTitle.length < 4) {
    return false;
  }

  return normalizedDrop.includes(` ${normalizedTitle} `);
}

export function getLinkedDrops(pal, items) {
  if (!pal.drops) {
    return [];
  }

  return items
    .filter((item) => itemMatchesDrop(pal.drops, item.title))
    .sort((a, b) => b.title.length - a.title.length)
    .slice(0, 8)
    .map((item) => ({
      title: item.title,
      href: getDatabaseItemPath(item),
      imageUrl: item.imageUrl,
      category: item.category,
    }));
}

export function getLinkedTech(pal, items) {
  const tech = pal.facts?.["Tech Needed"];
  if (!tech) {
    return null;
  }

  const match = items.find((item) => normalize(item.title) === normalize(tech));
  return match
    ? {
        title: match.title,
        href: getDatabaseItemPath(match),
        imageUrl: match.imageUrl,
        category: match.category,
      }
    : { title: tech };
}

export function getTravelType(pal) {
  if (flyingMountNames.has(pal.title)) {
    return "Flying Mount";
  }
  if (waterMountNames.has(pal.title)) {
    return "Water Mount";
  }
  if (groundMountNames.has(pal.title)) {
    return "Ground Mount";
  }
  if (gliderNames.has(pal.title)) {
    return "Glider Pal";
  }
  if (pal.facts?.["Tech Needed"]?.toLowerCase().includes("saddle")) {
    return "Mount";
  }
  return "";
}

export function getPalRoles(pal) {
  const work = getCurrentWork(pal);
  const maxWork = Math.max(0, ...work.map((entry) => entry.level));
  const roles = [];
  const travelType = getTravelType(pal);

  if (maxWork >= 4) {
    roles.push("Top Worker");
  } else if (work.length > 0) {
    roles.push("Base Worker");
  }

  if (work.some((entry) => entry.type === "Farming")) {
    roles.push("Ranch");
  }

  if (travelType) {
    roles.push(travelType);
  }

  if (combatPickNames.has(pal.title) || pal.elements?.length > 1 || /attack|missile|launcher|cannon|damage|dragon|thunder|steed/i.test(pal.partnerSkill || "")) {
    roles.push("Combat Candidate");
  }

  if (breedingTargetNames.has(pal.title)) {
    roles.push("Breeding Target");
  }

  if (pal.section && pal.section !== "Regular") {
    roles.push(pal.section);
  }

  if (pal.drops && specialDropWords.some((word) => pal.drops.includes(word))) {
    roles.push("Resource Drops");
  }

  return Array.from(new Set(roles));
}

export function getPrimaryWork(work) {
  return [...work].sort((a, b) => b.level - a.level || a.type.localeCompare(b.type))[0] || null;
}

function getPalInvestmentCards(pal, { primaryWork, travelType, roles, linkedDrops, linkedTech }) {
  const hasCombatRole = roles.includes("Combat Candidate");
  const strongestDrop = linkedDrops[0];
  const buildAround = primaryWork
    ? `${pal.title} is easiest to justify when ${primaryWork.type} Lv.${primaryWork.level} is the job you need filled right now. Keep the assignment narrow so the Pal does not wander between lower-impact stations.`
    : travelType
      ? `${pal.title} is most useful when ${travelType.toLowerCase()} movement solves a route problem faster than another combat or base worker would.`
      : hasCombatRole
        ? `${pal.title} is worth testing when ${pal.element || "its element"} coverage matches the boss, dungeon, or Alpha Pal you are preparing for.`
        : `${pal.title} works best as a Paldeck, comparison, or parent-check entry until a stronger base, travel, or combat reason appears.`;
  const investWhen = hasCombatRole
    ? `Invest once the matchup, Partner Skill, and passive line all support the same fight plan. Avoid spending rare upgrades before checking the target encounter.`
    : primaryWork && primaryWork.level >= 4
      ? `Invest when this worker removes a real production bottleneck, especially if the base already has food, beds, transport, and storage pathing under control.`
      : linkedTech
        ? `Invest after the matching Pal Gear is useful to your route; catching the Pal alone is not enough if the gear action will sit unused.`
        : `Invest only after the Pal fills a repeatable task in your base, team, or breeding plan.`;
  const delayWhen = primaryWork
    ? `Delay extra copies when another Pal already covers ${primaryWork.type} at the same or higher level and your base bottleneck is storage, transport, food, or power instead.`
    : linkedDrops.length > 0
      ? `Delay training if you only need ${strongestDrop.title}; a dedicated farming route can be faster than building a permanent team slot around this Pal.`
      : `Delay investment when the page does not show a clear work, travel, drop, or combat reason for your current route.`;

  return [
    {
      label: "Build around",
      title: "Use it when the job is clear",
      text: buildAround,
    },
    {
      label: "Worth investing",
      title: "Commit after the route checks out",
      text: investWhen,
    },
    {
      label: "Hold resources",
      title: "Skip extra upgrades when the need is weak",
      text: delayWhen,
    },
  ];
}

function getAlternativePals(pal, { allPals, work, primaryWork, roles, travelType }) {
  const fallbackRole = travelType || (roles.includes("Combat Candidate") ? "Combat Candidate" : "");

  return allPals
    .filter((candidate) => candidate.addressBar !== pal.addressBar)
    .map((candidate) => {
      const candidateWork = getCurrentWork(candidate);
      const sameWork = primaryWork
        ? candidateWork.find((entry) => entry.type === primaryWork.type)
        : null;
      const candidateRoles = getPalRoles(candidate);
      const sameRole = fallbackRole && candidateRoles.includes(fallbackRole);
      const sameElements = candidate.elements?.filter((element) => pal.elements?.includes(element)).length || 0;
      const score =
        (sameWork ? sameWork.level * 4 : 0) +
        (sameRole ? 6 : 0) +
        (sameElements * 2);

      return { candidate, score, sameWork, sameRole };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title))
    .slice(0, 4)
    .map(({ candidate, sameWork, sameRole }) => ({
      title: candidate.title,
      href: `/pals/${candidate.addressBar}`,
      imageUrl: candidate.imageUrl,
      element: candidate.element,
      note: sameWork
        ? `${sameWork.type} Lv.${sameWork.level}`
        : sameRole
          ? travelType || "Combat role"
          : candidate.element,
    }));
}

function getSharedDropPals(pal, { allPals, linkedDrops }) {
  const dropTitles = linkedDrops.map((drop) => drop.title);

  if (dropTitles.length === 0) {
    return [];
  }

  return allPals
    .filter((candidate) => candidate.addressBar !== pal.addressBar)
    .map((candidate) => {
      const matches = dropTitles.filter((title) => itemMatchesDrop(candidate.drops || "", title));
      return { candidate, matches };
    })
    .filter((entry) => entry.matches.length > 0)
    .sort((a, b) => b.matches.length - a.matches.length || a.candidate.title.localeCompare(b.candidate.title))
    .slice(0, 4)
    .map(({ candidate, matches }) => ({
      title: candidate.title,
      href: `/pals/${candidate.addressBar}`,
      imageUrl: candidate.imageUrl,
      element: candidate.element,
      note: matches.slice(0, 2).join(", "),
    }));
}

export function getPalGuideSummary(pal) {
  const work = getCurrentWork(pal);
  const primaryWork = getPrimaryWork(work);
  const travelType = getTravelType(pal);
  const roles = getPalRoles(pal);
  const use = [];

  if (primaryWork) {
    use.push(`${primaryWork.type} Lv.${primaryWork.level}`);
  }
  if (travelType) {
    use.push(travelType);
  }
  if (roles.includes("Combat Candidate")) {
    use.push("combat team option");
  }
  if (pal.drops) {
    use.push("drop farming");
  }

  return `${pal.title} is a ${pal.element || "multi-role"} Pal for ${use.slice(0, 4).join(", ") || "collection and Paldeck completion"}. Use this page to compare work roles, element matchups, drops, partner skill, breeding links, and related Pals.`;
}

export function enrichPal(pal, { items = [], allPals = [] } = {}) {
  const gameData = getPalGameDetails(pal.title);
  const work = getCurrentWork(pal);
  const roles = getPalRoles(pal);
  const primaryWork = getPrimaryWork(work);
  const travelType = getTravelType(pal);
  const linkedDrops = getLinkedDrops(pal, items);
  const linkedTech = getLinkedTech(pal, items);
  const strongAgainst = Array.from(new Set((pal.elements || []).flatMap((element) => elementMatchups[element]?.strong || [])));
  const weakAgainst = Array.from(new Set((pal.elements || []).flatMap((element) => elementMatchups[element]?.weak || [])));
  const rankedWork = work.map((entry) => {
    const comparable = allPals
      .flatMap((candidate) => getCurrentWork(candidate))
      .filter((candidateWork) => candidateWork.type === entry.type);
    const topLevel = Math.max(entry.level, ...comparable.map((candidateWork) => candidateWork.level));
    const higherLevels = Array.from(
      new Set(comparable.filter((candidateWork) => candidateWork.level > entry.level).map((candidateWork) => candidateWork.level)),
    ).length;

    return {
      ...entry,
      topLevel,
      tier: higherLevels + 1,
    };
  });
  const breedingCombos = featuredBreedingCombos
    .filter((combo) => combo.target === pal.title || combo.parentA === pal.title || combo.parentB === pal.title)
    .map((combo) => ({
      ...combo,
      parentAHref: `/pals/${allPals.find((candidate) => candidate.title === combo.parentA)?.addressBar || ""}`,
      parentBHref: `/pals/${allPals.find((candidate) => candidate.title === combo.parentB)?.addressBar || ""}`,
      targetHref: `/pals/${allPals.find((candidate) => candidate.title === combo.target)?.addressBar || ""}`,
    }));
  const relatedPals = allPals
    .filter((candidate) => candidate.addressBar !== pal.addressBar)
    .map((candidate) => {
      const sameElements = candidate.elements?.filter((element) => pal.elements?.includes(element)).length || 0;
      const candidateWork = getCurrentWork(candidate);
      const sameWork = candidateWork.filter((entry) => work.some((own) => own.type === entry.type)).length;
      const sameRole = getPalRoles(candidate).filter((role) => roles.includes(role)).length;
      return { candidate, score: sameElements * 3 + sameWork * 2 + sameRole };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title))
    .slice(0, 6)
    .map(({ candidate }) => ({
      title: candidate.title,
      href: `/pals/${candidate.addressBar}`,
      imageUrl: candidate.imageUrl,
      element: candidate.element,
      workSuitability: formatWorkSuitability(getCurrentWork(candidate)),
    }));
  const breedingTarget = breedingMatrix.records.find((record) => record.pal?.addressBar === pal.addressBar);
  const breedingRoutes = breedingTarget
    ? getBreedingTargetPairs(breedingTarget.index)
        .filter(({ parentA, parentB }) => parentA.pal && parentB.pal)
        .slice(0, 6)
        .map(({ parentA, parentB }) => ({
          parentA: parentA.name,
          parentAHref: parentA.href,
          parentB: parentB.name,
          parentBHref: parentB.href,
        }))
    : [];
  const investmentCards = getPalInvestmentCards(pal, {
    primaryWork,
    travelType,
    roles,
    linkedDrops,
    linkedTech,
  });
  const alternativePals = getAlternativePals(pal, {
    allPals,
    work,
    primaryWork,
    roles,
    travelType,
  });
  const sharedDropPals = getSharedDropPals(pal, { allPals, linkedDrops });
  const mapEncounters = getPalFixedEncounters(pal.addressBar);

  return {
    ...pal,
    gameData,
    gameDataProvenance,
    workSuitability: formatWorkSuitability(work),
    guideSummary: getPalGuideSummary(pal),
    work: rankedWork,
    primaryWork,
    maxWorkLevel: Math.max(0, ...work.map((entry) => entry.level)),
    roles,
    travelType,
    linkedDrops,
    linkedTech,
    strongAgainst,
    weakAgainst,
    relatedPals,
    investmentCards,
    alternativePals,
    sharedDropPals,
    mapEncounters,
    mapPointCount: mapEncounters.length,
    mapHref: mapEncounters.length > 0 ? buildPalMapHref(pal.addressBar) : null,
    mapRegions: Array.from(new Set(mapEncounters.map((encounter) => encounter.regionLabel))),
    breedingCombos,
    breedingRoutes,
    recommendations: {
      base:
        !primaryWork
          ? "Not currently rated for a base work role"
          : primaryWork.level >= 6
            ? `Endgame ${primaryWork.type} specialist`
            : primaryWork.level >= 4
              ? `High-value ${primaryWork.type} specialist`
              : primaryWork.level >= 3
                ? `Reliable ${primaryWork.type} worker`
                : `Early-base ${primaryWork.type} support`,
      combat: roles.includes("Combat Candidate")
        ? `${pal.element || "Multi-element"} combat candidate`
        : `Situational ${pal.element || "Neutral"} team option`,
      travel: travelType || "No mount role recorded",
      breeding:
        breedingCombos.length > 0
          ? `${breedingCombos.length} curated combo${breedingCombos.length === 1 ? "" : "s"} recorded`
          : "Use as a parent when its species or passives fit the target line",
    },
    decisionSummary: [
      primaryWork ? `${primaryWork.type} Lv.${primaryWork.level}` : null,
      travelType || null,
      roles.includes("Combat Candidate") ? `${pal.element} combat coverage` : null,
      pal.drops ? `drops ${pal.drops}` : null,
    ].filter(Boolean).join("; "),
  };
}

export function buildMapPalProfiles(pals, items) {
  return Object.fromEntries(
    pals
      .map((pal) => {
        const mapEncounters = getPalFixedEncounters(pal.addressBar);
        if (mapEncounters.length === 0) {
          return null;
        }

        const primaryWork = getPrimaryWork(getCurrentWork(pal));
        return [
          `/pals/${pal.addressBar}`,
          {
            title: pal.title,
            href: `/pals/${pal.addressBar}`,
            imageUrl: pal.imageUrl,
            imageAlt: pal.imageAlt,
            element: pal.element,
            elements: pal.elements,
            habitat: pal.habitat,
            partnerSkill: pal.partnerSkill,
            primaryWork,
            linkedDrops: getLinkedDrops(pal, items).slice(0, 3),
            mapPointCount: mapEncounters.length,
            mapRegions: Array.from(new Set(mapEncounters.map((encounter) => encounter.regionLabel))),
          },
        ];
      })
      .filter(Boolean),
  );
}

export function buildPalExplorerData(pals, items) {
  const enriched = pals.map((pal) => enrichPal(pal, { items, allPals: pals }));
  const byRole = (role) => enriched.filter((pal) => pal.roles.includes(role));
  const byWork = (type, minLevel = 1) => enriched.filter((pal) => pal.work.some((entry) => entry.type === type && entry.level >= minLevel));

  return {
    pals: enriched.map((pal) => ({
      id: pal.id,
      number: pal.number,
      title: pal.title,
      addressBar: pal.addressBar,
      imageUrl: pal.imageUrl,
      imageAlt: pal.imageAlt,
      element: pal.element,
      elements: pal.elements,
      section: pal.section,
      partnerSkill: pal.partnerSkill,
      workSuitability: pal.workSuitability,
      work: pal.work,
      primaryWork: pal.primaryWork,
      maxWorkLevel: pal.maxWorkLevel,
      roles: pal.roles,
      travelType: pal.travelType,
      linkedDrops: pal.linkedDrops.slice(0, 3),
      mapPointCount: pal.mapPointCount,
      mapHref: pal.mapHref,
      mapRegions: pal.mapRegions,
      guideSummary: pal.guideSummary,
      decisionSummary: pal.decisionSummary,
      recommendations: pal.recommendations,
    })),
    stats: {
      total: enriched.length,
      workers: enriched.filter((pal) => pal.work.length > 0).length,
      topWorkers: byRole("Top Worker").length,
      flyingMounts: byRole("Flying Mount").length,
      combat: byRole("Combat Candidate").length,
      mapLinked: getMapLinkedPalCount(),
      ranch: byRole("Ranch").length,
      drops: byRole("Resource Drops").length,
    },
    spotlights: [
      {
        key: "worker",
        title: "High-level Work Specialists",
        label: "Base",
        description: "Compare the highest recorded Work Suitability levels before staffing a dedicated production line.",
        pals: enriched
          .filter((pal) => pal.maxWorkLevel >= 4)
          .sort((a, b) => b.maxWorkLevel - a.maxWorkLevel || a.id - b.id)
          .slice(0, 8),
      },
      {
        key: "flight",
        title: "Flying Mount Route",
        label: "Travel",
        description: "Flying Pals help with map scouting, tower prep, dungeon loops, and safe resource routes.",
        pals: byRole("Flying Mount").slice(0, 8),
      },
      {
        key: "combat",
        title: "Combat Candidates",
        label: "Fights",
        description: "Element and partner-skill picks for towers, Alpha routes, dungeons, and raid prep.",
        pals: byRole("Combat Candidate").slice(0, 8),
      },
      {
        key: "drops",
        title: "Drop Farming Targets",
        label: "Items",
        description: "Pals whose drops connect directly into Database materials, ingredients, souls, organs, or manuals.",
        pals: byRole("Resource Drops").slice(0, 8),
      },
    ].map((spotlight) => ({
      ...spotlight,
      pals: spotlight.pals.map((pal) => ({
        title: pal.title,
        href: `/pals/${pal.addressBar}`,
        imageUrl: pal.imageUrl,
        element: pal.element,
        roles: pal.roles.slice(0, 3),
      })),
    })),
    workTypes: workTypes.map((type) => ({
      type,
      count: byWork(type).length,
      topCount: byWork(type, 4).length,
    })),
    elements: Array.from(new Set(enriched.flatMap((pal) => pal.elements || []))).sort(),
    roles: [
      "Top Worker",
      "Base Worker",
      "Combat Candidate",
      "Flying Mount",
      "Ground Mount",
      "Water Mount",
      "Glider Pal",
      "Ranch",
      "Resource Drops",
      "Breeding Target",
      "Subspecies",
      "Terraria Monsters",
      "Unreleased",
    ],
  };
}

export function buildPalSeo(pal) {
  const title = fitTitle("Palworld Pals -", `${pal.title} Stats, Work and Best Uses`);
  const description = fitDescription(
    `Palworld Pals ${pal.title} guide covers element matchups, partner skill, work suitability, drops, breeding notes, combat roles, and Database links for route planning.`,
    "Use it to compare Paldeck roles before building a team or base.",
  );

  return {
    title,
    description,
    keywords: `Palworld Pals ${pal.title}, Palworld ${pal.title} guide, ${pal.title} drops, ${pal.title} work suitability, ${pal.title} partner skill, Palworld ${pal.element} Pal`,
  };
}
