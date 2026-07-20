import gameDetails from "@/data/gameDetails.json";
import { databaseCreatureDetails } from "@/data/databaseCreatures";

export const gameDataProvenance = gameDetails.provenance;
export const gameDataCoverage = gameDetails.coverage;

export function getPalGameDetails(title) {
  return gameDetails.pals[title] || null;
}

export function getItemGameDetails(title) {
  return gameDetails.items[title] || databaseCreatureDetails[title] || null;
}
