import currentBreedingMatrix from "@/data/currentBreedingMatrix.json";
import { pals } from "@/data/pals";

const palsBySlug = new Map(pals.map((pal) => [pal.addressBar, pal]));
const palsByTitle = new Map(pals.map((pal) => [pal.title.toLowerCase(), pal]));

function slugFromHref(href) {
  return href?.split("/").filter(Boolean).at(-1);
}

function normalizeRecordName(name) {
  return String(name || "")
    .replace(/\s+\(special\)$/i, "")
    .trim()
    .toLowerCase();
}

export function getPalForBreedingRecord(record) {
  const slug = slugFromHref(record?.href);
  return palsBySlug.get(slug) || palsByTitle.get(normalizeRecordName(record?.name)) || null;
}

export function enrichBreedingRecord(record, index) {
  const pal = getPalForBreedingRecord(record);

  return {
    ...record,
    index,
    pal,
    name: pal?.title || record.name,
    href: pal ? `/pals/${pal.addressBar}` : record.href,
    imageUrl: pal?.imageUrl || null,
    imageAlt: pal?.imageAlt || `${record.name} Palworld breeding record`,
    element: pal?.element || "",
    elements: pal?.elements || [],
    drops: pal?.drops || "",
    workSuitability: pal?.workSuitability || "",
    partnerSkill: pal?.partnerSkill || "",
  };
}

export const breedingMatrix = {
  ...currentBreedingMatrix,
  records: currentBreedingMatrix.records.map(enrichBreedingRecord),
};

export function getBreedingChildIndex(parentAIndex, parentBIndex) {
  const rowIndex = Math.max(parentAIndex, parentBIndex);
  const columnIndex = Math.min(parentAIndex, parentBIndex);
  return breedingMatrix.rows?.[rowIndex]?.[columnIndex];
}

export function getBreedingChild(parentAIndex, parentBIndex) {
  return breedingMatrix.records[getBreedingChildIndex(parentAIndex, parentBIndex)] || null;
}

export function getBreedingTargetPairs(targetIndex) {
  const pairs = [];

  for (let rowIndex = 0; rowIndex < breedingMatrix.rows.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < breedingMatrix.rows[rowIndex].length; columnIndex += 1) {
      if (breedingMatrix.rows[rowIndex][columnIndex] !== targetIndex) continue;

      pairs.push({
        parentA: breedingMatrix.records[rowIndex],
        parentB: breedingMatrix.records[columnIndex],
      });
    }
  }

  return pairs.sort((a, b) =>
    `${a.parentA.name} ${a.parentB.name}`.localeCompare(`${b.parentA.name} ${b.parentB.name}`),
  );
}

export const breedingMatrixStats = {
  version: breedingMatrix.version,
  updatedAt: breedingMatrix.updatedAt,
  palCount: breedingMatrix.records.length,
  possiblePairCount: breedingMatrix.rows.reduce((total, row) => total + row.length, 0),
};
