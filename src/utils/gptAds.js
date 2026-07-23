import { GPT_UNITS } from "@/config/gpt";

// GPT 页面广告：数字单元与 GAM banner_1 / banner_2 / banner_3 对应。
const UNIT_PATH = {
  1: GPT_UNITS.banner1,
  2: GPT_UNITS.banner2,
  3: GPT_UNITS.banner3,
};

function getSlotMap() {
  window.__gptSlotMap = window.__gptSlotMap || {};
  return window.__gptSlotMap;
}

export function Gt(elementId, unit) {
  const path = UNIT_PATH[unit] ?? UNIT_PATH[Number(unit)];
  if (!path || !elementId || typeof window === "undefined") return;

  window.googletag = window.googletag || { cmd: [] };
  const gpt = window.googletag;
  gpt.cmd.push(() => {
    const slotMap = getSlotMap();
    let slot = slotMap[elementId];

    if (!slot) {
      // 与 fun.caocjj.com 相同：桌面支持 970x250，移动端固定 300x250。
      const mapping = gpt
        .sizeMapping()
        .addSize([1024, 768], [[970, 250], [300, 250]])
        .addSize([0, 0], [300, 250])
        .build();

      slot = gpt
        .defineSlot(path, [[300, 250], [970, 250]], elementId)
        ?.defineSizeMapping(mapping)
        ?.addService(gpt.pubads());

      if (!slot) return;
      slotMap[elementId] = slot;
    }

    if (!document.getElementById(elementId)) return;
    gpt.display(elementId);
    gpt.pubads().refresh([slot]);
  });
}

export function mountGptPageAds(entries) {
  for (const [elementId, unit] of entries) Gt(elementId, unit);
}
