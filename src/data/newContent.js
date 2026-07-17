import { getDatabaseItemPath } from "@/data/database";
import { items } from "@/data/items";
import { mapMarkers } from "@/data/mapMarkers";
import { pals } from "@/data/pals";

function findPal(title) {
  return pals.find((pal) => pal.title === title);
}

function findItem(title) {
  return items.find((item) => item.title === title);
}

function palCard(title, note) {
  const pal = findPal(title);

  if (!pal) {
    return null;
  }

  return {
    title: pal.title,
    href: `/pals/${pal.addressBar}`,
    imageUrl: pal.imageUrl,
    imageAlt: pal.imageAlt,
    note,
    element: pal.element,
    section: pal.section,
  };
}

function itemCard(title, note) {
  const item = findItem(title);

  if (!item) {
    return null;
  }

  return {
    title: item.title,
    href: getDatabaseItemPath(item),
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    note,
    category: item.category,
  };
}

export const onePointZeroCoverage = [
  {
    label: "New roster",
    title: "72 new Pals and variants",
    body: "Version 1.0 expands the roster with new species and variants that can change capture goals, work coverage, team roles, and breeding routes.",
    href: "/pals",
  },
  {
    label: "New regions",
    title: "Sunreach and World Tree routes",
    body: "Sunreach and the World Tree add new travel goals, tower progression, materials, habitats, and endgame preparation checks.",
    href: "/map",
  },
  {
    label: "New boss path",
    title: "Auri, Shaolong, Zenara, and Astralym",
    body: "The 1.0 boss path adds the Sunreach tower pair and a final World Tree fight, so old tower checklists need a new endgame branch.",
    href: "/updates",
  },
  {
    label: "New systems",
    title: "Awakening, Mutation, and new item pressure",
    body: "Late-game Pal investment now depends more on potential checks, breeding batches, special cakes, rare materials, and stronger route planning.",
    href: "/breeding",
  },
];

export const newPalHighlights = [
  palCard("Pupperai", "1.0 Pal to compare for early route planning."),
  palCard("Dupin", "New Pal entry useful for Paldeck and team comparison."),
  palCard("Braloha", "Featured 1.0 Pal with local image and detail page."),
  palCard("Shaolong", "Sunreach tower-partner Pal tied to the Auri boss route."),
  palCard("Panthalus", "Whale Pal tied to World Tree unlock planning."),
  palCard("Astralym", "World Tree final-boss Pal entry for endgame checks."),
  palCard("Aegidron", "Late-route Pal entry for post-1.0 comparison."),
  palCard("Eye of Cthulhu", "Terraria Monsters entry for crossover tracking."),
].filter(Boolean);

export const specialMonsterHighlights = pals
  .filter((pal) => pal.section === "Terraria Monsters")
  .slice(0, 6)
  .map((pal) => ({
    title: pal.title,
    href: `/pals/${pal.addressBar}`,
    imageUrl: pal.imageUrl,
    imageAlt: pal.imageAlt,
    note: `${pal.element} crossover creature`,
  }));

export const unreleasedArchiveHighlights = pals
  .filter((pal) => pal.section === "Unreleased")
  .slice(0, 5)
  .map((pal) => ({
    title: pal.title,
    href: `/pals/${pal.addressBar}`,
    imageUrl: pal.imageUrl,
    imageAlt: pal.imageAlt,
    note: `${pal.element} archive entry`,
  }));

export const newItemHighlights = [
  itemCard("Ability Glasses", "Check HP, Attack, and Defense potential before long-term Pal investment."),
  itemCard("Ancient Civilization Core", "Rare progression material for late crafting and unlock planning."),
  itemCard("Predator Core", "1.0 material that belongs in rare-route and combat reward checks."),
  itemCard("Crude Oil", "Late-game resource pressure for advanced crafting and base planning."),
  itemCard("Dog Coin", "Currency route tied to merchants and long-term upgrade planning."),
  itemCard("Cake", "Breeding route item that supports parent-pair and Mutation planning."),
].filter(Boolean);

export const bossRouteHighlights = [
  {
    title: "Auri and Shaolong",
    href: "/pals/shaolong",
    region: "Sunreach",
    level: "Lv.68 tower route",
    body: "Use the Sunreach tower branch after the older tower chain is stable. Prepare high-end armor, repair materials, food, and strong Electric pressure before entering.",
  },
  {
    title: "Zenara and Astralym",
    href: "/pals/astralym",
    region: "World Tree",
    level: "Lv.80 final route",
    body: "Treat the World Tree fight as an endgame route rather than a normal tower stop. Bring your strongest team, upgraded gear, and enough supplies for a long boss phase.",
  },
  {
    title: "Panthalus unlock chain",
    href: "/pals/panthalus",
    region: "Palpagos to World Tree",
    level: "Story unlock route",
    body: "Panthalus sits in the World Tree preparation chain, so the Pal page should be checked before planning final-boss travel and Awakening resource goals.",
  },
  {
    title: "Classic tower reset",
    href: "/map",
    region: "Palpagos, Sakurajima, and Feybreak",
    level: `${mapMarkers.filter((marker) => marker.category === "tower").length} mapped tower notes`,
    body: "The older tower order still matters, but 1.0 adds a new branch after Feybreak and changes how players should read old boss routes.",
  },
];
