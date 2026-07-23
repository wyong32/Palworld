"use client";

import { useEffect } from "react";
import { Gt } from "@/utils/gptAds";

export default function GptAdSlot({ elementId, unit = 1 }) {
  useEffect(() => {
    Gt(elementId, unit);
  }, [elementId, unit]);

  return (
    // GPT 页面 Banner 占位：具体广告单元由 unit 属性决定。
    <aside
      className="gpt-ad-container"
      aria-label="Advertisement"
      style={{ width: "100%", margin: "0 auto", padding: "1rem", textAlign: "center" }}
    >
      <div id={elementId} style={{ minWidth: "300px", minHeight: "250px" }} />
    </aside>
  );
}
