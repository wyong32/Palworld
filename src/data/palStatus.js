import { getPalGameDetails } from "@/data/gameDetails";

export function getPalPublicationStatus(pal) {
  if (pal.title === "Astralym") {
    return {
      key: "boss-only",
      label: "Current boss-only Paldeck entry",
      note: "Astralym is the 1.0 final-boss Paldeck entry, but it cannot currently be captured, bred, owned, or deployed. It is kept separate from the 287-Pal roster count.",
      indexable: true,
    };
  }

  if (pal.section === "Terraria Monsters") {
    return {
      key: "crossover-creature",
      label: "Current Terraria crossover creature",
      note: "This active crossover creature is indexed separately and is not counted in Pocketpair's 287-Pal launch roster.",
      indexable: true,
    };
  }

  if (pal.section !== "Unreleased") {
    return {
      key: "current",
      label: "Current 1.0 roster",
      note: "Matched to the current player-facing Pal roster.",
      indexable: true,
    };
  }

  if (getPalGameDetails(pal.title)) {
    return {
      key: "internal-unreleased",
      label: "Unreleased internal record",
      note: "A 1.0 internal species record exists, but this Pal is not part of the confirmed current roster.",
      indexable: false,
    };
  }

  return {
    key: "archive-unverified",
    label: "Unverified archive entry",
    note: "No matching 1.0 species record was found. Keep this page as an archive entry, not a current Pal recommendation.",
    indexable: false,
  };
}

export function getPalRosterStats(pals) {
  const statuses = pals.map(getPalPublicationStatus);
  return {
    current: statuses.filter((status) => status.key === "current").length,
    bossOnly: statuses.filter((status) => status.key === "boss-only").length,
    crossoverCreatures: statuses.filter((status) => status.key === "crossover-creature").length,
    internalUnreleased: statuses.filter((status) => status.key === "internal-unreleased").length,
    archiveUnverified: statuses.filter((status) => status.key === "archive-unverified").length,
    total: statuses.length,
  };
}

export function isCurrentPal(pal) {
  return getPalPublicationStatus(pal).key === "current";
}

export function isIndexablePal(pal) {
  return getPalPublicationStatus(pal).indexable;
}
