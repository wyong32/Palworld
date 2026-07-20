import bossMapPayload from "../../public/data/palworld-map/bosses.json";

export const bossMapRegions = {
  main: "Palpagos",
  tree: "World Tree",
};

const fixedAlphaEncounters = bossMapPayload.bosses
  .filter((boss) => boss.category === "alpha-pal" && boss.palHref)
  .sort((left, right) => {
    const mapOrder = Number(left.mapId === "tree") - Number(right.mapId === "tree");
    return mapOrder || left.name.en.localeCompare(right.name.en) || (left.level ?? 0) - (right.level ?? 0);
  });

const encountersByPalSlug = fixedAlphaEncounters.reduce((groups, encounter) => {
  const slug = encounter.palHref.split("/").filter(Boolean).at(-1);
  if (!slug) {
    return groups;
  }

  groups[slug] = [...(groups[slug] || []), encounter];
  return groups;
}, {});

export function buildPalMapHref(addressBar) {
  return `/map?pal=${encodeURIComponent(addressBar)}#interactive-map-title`;
}

export function buildMarkerMapHref(markerId) {
  return `/map?marker=${encodeURIComponent(markerId)}#interactive-map-title`;
}

export function getPalFixedEncounters(addressBar) {
  return (encountersByPalSlug[addressBar] || []).map((encounter) => ({
    ...encounter,
    regionLabel: bossMapRegions[encounter.mapId] || encounter.mapId,
    mapHref: buildMarkerMapHref(encounter.id),
  }));
}

export function getMapLinkedPalCount() {
  return Object.keys(encountersByPalSlug).length;
}
