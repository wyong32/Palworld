import { getItemGameDetails } from "@/data/gameDetails";

export function getDatabasePublicationStatus(item) {
  const game = getItemGameDetails(item.title);
  if (game?.kind === "creature") {
    return { key: "current-creature", label: "Current 1.0 combat record", shortLabel: "Current", note: "Base combat values and scenario variants are kept separate.", indexable: true };
  }
  if (game?.gameplayEnabled === false) {
    return { key: "legacy-disabled", label: "Disabled 1.0 definition", shortLabel: "Disabled", note: "The definition exists in the current table, but bLegalInGame is false. Treat it as a legacy or internal record.", indexable: false };
  }
  if (game) {
    return { key: "current-item", label: "Current 1.0 item record", shortLabel: "Current", note: "Matched to an enabled item or structure definition.", indexable: true };
  }
  if (item.title === "Dark Kingferno Saddle") {
    return { key: "unmatched-item", label: "Unmatched item record", shortLabel: "Unmatched", note: "No exact 1.0 item or structure definition was found. Do not treat this page as a confirmed current item.", indexable: false };
  }
  return { key: "editorial-category", label: "Editorial category record", shortLabel: "Editorial", note: "This site-maintained umbrella page has no one-to-one 1.0 item definition. Use it for navigation, not exact item stats.", indexable: false };
}

export function isIndexableDatabaseRecord(item) {
  return getDatabasePublicationStatus(item).indexable;
}
