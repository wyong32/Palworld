import skillVerification from "@/data/skillVerification.json";

export const skillVerificationProvenance = skillVerification.provenance;
export const skillVerificationCoverage = skillVerification.coverage;

export function getPalSkillVerification(title) {
  return skillVerification.pals[title] || null;
}
