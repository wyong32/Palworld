import { getDatabaseCategoryGroups, getDatabaseItemPath } from "@/data/database";
import { buildPalMapHref, getPalFixedEncounters } from "@/data/bossMap";
import { guides } from "@/data/guides";
import { databaseRecords } from "@/data/databaseRecords";
import { pals } from "@/data/pals";
import { getPalGameDetails } from "@/data/gameDetails";
import { getPalPublicationStatus } from "@/data/palStatus";
import { getPalSkillVerification } from "@/data/skillVerification";

function cleanText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function itemText(item) {
  return [
    item.title,
    item.category,
    item.role,
    item.guideSummary,
    item.guide?.intent,
    item.guide?.howToUse,
    item.tags?.join(" "),
  ].filter(Boolean).join(" ");
}

function palSearchFacts(pal) {
  const game = getPalGameDetails(pal.title);
  const skills = getPalSkillVerification(pal.title);
  const status = getPalPublicationStatus(pal);
  const work = (game?.work || []).map((entry) => `${entry.type} Lv.${entry.level}`).join(" ");
  const activeSkills = (skills?.activeSkills || []).map((skill) => `${skill.name} ${skill.element}`).join(" ");
  const innateTraits = (skills?.innateTraits || []).map((trait) => `${trait.name} ${trait.description}`).join(" ");
  return {
    status,
    work,
    partnerSkill: skills?.partnerSkill?.name || "",
    partnerEffect: skills?.partnerSkill?.description || "",
    activeSkills,
    innateTraits,
  };
}

export function buildSearchIndex() {
  const databaseCategories = getDatabaseCategoryGroups(databaseRecords).map((group) => ({
    type: "Database Category",
    title: `Palworld Database - ${group.category}`,
    href: `/database/${group.slug}`,
    summary: `Palworld Database category with ${group.items.length} ${group.category.toLowerCase()} entries for player planning.`,
    keywords: `Palworld Database ${group.category} ${group.category} items materials weapons armor accessories structures recipes`,
  }));
  const fixedAlphaLocations = pals.flatMap((pal) => {
    const encounters = getPalFixedEncounters(pal.addressBar);
    if (encounters.length === 0) {
      return [];
    }

    const regions = Array.from(new Set(encounters.map((encounter) => encounter.regionLabel)));
    const levels = Array.from(new Set(encounters.map((encounter) => encounter.level).filter(Number.isFinite)));
    return [{
      type: "Map Location",
      title: `${pal.title} fixed Alpha location`,
      href: buildPalMapHref(pal.addressBar),
      summary: `${encounters.length} validated Alpha point${encounters.length === 1 ? "" : "s"} on ${regions.join(" and ")} at level ${levels.join(" / ")}.`,
      keywords: [
        "Palworld Map",
        pal.title,
        pal.element,
        pal.habitat,
        regions.join(" "),
        encounters.map((encounter) => `${encounter.world.x} ${encounter.world.y}`).join(" "),
      ].filter(Boolean).join(" "),
      imageUrl: pal.imageUrl,
      imageAlt: pal.imageAlt,
    }];
  });

  return [
    ...pals.map((pal) => {
      const facts = palSearchFacts(pal);
      return {
        type: facts.status.key === "current"
          ? "Pal"
          : facts.status.key === "boss-only"
            ? "Boss-only Paldeck Entry"
            : facts.status.key === "crossover-creature"
              ? "Crossover Creature"
              : "Pal Archive",
        title: `Palworld Pals - ${pal.title}`,
        href: `/pals/${pal.addressBar}`,
        summary: cleanText(
          facts.status.key === "current"
            ? `${pal.element} Pal${facts.work ? ` with ${facts.work}` : ""}. ${facts.partnerSkill ? `Partner Skill: ${facts.partnerSkill}.` : ""}`
            : `${facts.status.label}. ${facts.status.note}`,
        ),
        keywords: ["Palworld Pals", pal.title, pal.element, facts.partnerSkill, facts.partnerEffect, facts.work, facts.activeSkills, facts.innateTraits, pal.drops, pal.roles?.join(" ")].filter(Boolean).join(" "),
        imageUrl: pal.imageUrl,
        imageAlt: pal.imageAlt,
      };
    }),
    ...fixedAlphaLocations,
    ...databaseCategories,
    ...databaseRecords.map((item) => ({
      type: item.recordType === "creature" ? "Database Creature" : "Database Item",
      title: `Palworld Database - ${item.title}`,
      href: getDatabaseItemPath(item),
      summary: cleanText(item.guideSummary || `${item.title} item entry in ${item.category}.`),
      keywords: `Palworld Database ${itemText(item)}`,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
    })),
    ...guides.map((guide) => ({
      type: "Guide",
      title: guide.seo?.title || guide.title,
      href: `/guides/${guide.addressBar}`,
      summary: cleanText(guide.summary),
      keywords: [guide.title, guide.summary, guide.tags?.join(" "), cleanText(guide.detailsHtml)].filter(Boolean).join(" "),
      imageUrl: guide.imageUrl,
      imageAlt: guide.imageAlt,
    })),
    {
      type: "Map",
      title: "Palworld Map - Fixed Boss and Alpha Locations",
      href: "/map#interactive-map-title",
      summary: "Search fixed bosses, exact quest objectives, and clustered wild habitats across Palpagos and the World Tree.",
      keywords: "Palworld Map interactive map fixed boss locations alpha pals human bosses world tree pal guides item drops",
    },
    {
      type: "Breeding",
      title: "Palworld Breeding Guide and Planner",
      href: "/breeding",
      summary: "Palworld Breeding Guide helps players plan parent pairs, Cake production, egg hatching, passive chains, and Mutation batches.",
      keywords: "Palworld Breeding Guide breeding calculator cake eggs parent pairs mutation passive skills breeding farm incubator",
    },
    {
      type: "Breeding Calculator",
      title: "Palworld Breeding Calculator - 1.0 Combos and Paths",
      href: "/breeding/calculator",
      summary: "Check Palworld 1.0 parent pairs, target Pal combinations, path planning, passive routes, and linked Pal detail pages.",
      keywords: "Palworld Breeding Calculator breeding combos parent pairs target Pal path calculator passive skill breeding 1.0",
    },
    {
      type: "Guide Hub",
      title: "Palworld Guides - Progression and World Tree",
      href: "/guides",
      summary: "Open progression and World Tree preparation guides.",
      keywords: "Palworld Guides progression world tree checklist beginner endgame",
    },
    {
      type: "Updates",
      title: "Palworld Updates - 1.0.1 and 1.0 Patch Notes",
      href: "/updates",
      summary: "Review current patch changes, new Pals, map changes, breeding updates, and player tasks.",
      keywords: "Palworld Updates patch notes version history 1.0.1 save fix burning bug 1.0 new pals sunreach world tree awakening mutation",
    },
  ];
}

export function searchSite(query, limit = 60) {
  const terms = cleanText(query).toLowerCase().split(/\s+/).filter(Boolean);
  const index = buildSearchIndex();

  if (terms.length === 0) {
    return index.slice(0, 24);
  }

  return index
    .map((entry) => {
      const haystack = `${entry.title} ${entry.summary} ${entry.keywords}`.toLowerCase();
      const score = terms.reduce((total, term) => {
        if (entry.title.toLowerCase().includes(term)) {
          return total + 8;
        }
        if (haystack.includes(term)) {
          return total + 2;
        }
        return total;
      }, 0);

      return { ...entry, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}
