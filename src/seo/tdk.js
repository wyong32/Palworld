export const tdkLimits = {
  titleMin: 40,
  titleMax: 60,
  descriptionMin: 140,
  descriptionMax: 160,
};

export function normalizeSpaces(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function trimWords(value, maxLength) {
  const text = normalizeSpaces(value);
  if (text.length <= maxLength) {
    return text;
  }

  const cut = text.slice(0, maxLength);
  const boundary = cut.lastIndexOf(" ");
  const trimmed = boundary > maxLength - 24 ? cut.slice(0, boundary) : cut;
  return trimmed.replace(/[\s,;:-]+$/, "").trim();
}

export function fitDescription(value, fallbackSentence) {
  let text = normalizeSpaces(value);
  const fallback = normalizeSpaces(fallbackSentence);

  if (text.length < tdkLimits.descriptionMin && fallback) {
    text = normalizeSpaces(`${text} ${fallback}`);
  }

  if (text.length > tdkLimits.descriptionMax) {
    text = trimWords(text, tdkLimits.descriptionMax);
  }

  if (text.length < tdkLimits.descriptionMin && fallback && !text.includes(fallback)) {
    text = trimWords(`${text} ${fallback}`, tdkLimits.descriptionMax);
  }

  if (!/[.!?]$/.test(text) && text.length < tdkLimits.descriptionMax) {
    text = `${text}.`;
  }

  return text;
}

export function fitTitle(prefix, name, suffix = "") {
  const cleanPrefix = normalizeSpaces(prefix);
  const cleanName = normalizeSpaces(name);
  const cleanSuffix = normalizeSpaces(suffix);
  const suffixText = cleanSuffix ? ` ${cleanSuffix}` : "";
  const maxNameLength = tdkLimits.titleMax - cleanPrefix.length - suffixText.length - 1;
  const titleName = trimWords(cleanName, Math.max(16, maxNameLength));
  return normalizeSpaces(`${cleanPrefix} ${titleName}${suffixText}`);
}
