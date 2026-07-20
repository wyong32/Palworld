import payload from "@/data/databaseCreatures.json";

export const databaseCreatureProvenance = payload.provenance;
export const databaseCreatureCoverage = payload.coverage;
export const databaseCreatures = payload.records;
export const databaseCreatureDetails = Object.fromEntries(payload.records.map((record) => [record.title, record.gameData]));
