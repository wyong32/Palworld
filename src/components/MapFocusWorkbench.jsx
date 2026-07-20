"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InteractiveMap from "@/components/InteractiveMap";

const mapFocuses = [
  {
    key: "alpha",
    label: "Alpha Pals",
    title: "Scout fixed Alpha encounters",
    note: "90 exact Alpha Pal points with direct links into the matching Pal guide.",
    mapId: "main",
    categories: ["alpha-pal"],
  },
  {
    key: "human",
    label: "Human bosses",
    title: "Inspect fixed human encounters",
    note: "33 game-data locations for named and internal human boss spawners.",
    mapId: "main",
    categories: ["human-boss"],
  },
  {
    key: "special",
    label: "Special regions",
    title: "Check the oil-rig points",
    note: "Three exact special-area records kept separate from creature encounters.",
    mapId: "main",
    categories: ["special"],
  },
  {
    key: "world-tree",
    label: "World Tree",
    title: "Open the endgame boss map",
    note: "Seven fixed Alpha encounters projected onto the separate World Tree map.",
    mapId: "tree",
    categories: ["alpha-pal"],
  },
];

export default function MapFocusWorkbench({ palProfiles }) {
  const [activeKey, setActiveKey] = useState("alpha");
  const stageRef = useRef(null);
  const active = useMemo(
    () => mapFocuses.find((item) => item.key === activeKey) || mapFocuses[0],
    [activeKey]
  );

  useEffect(() => {
    function onClick(event) {
      const target = event.target.closest?.("[data-map-focus]");
      if (!target) {
        return;
      }

      const focusKey = target.getAttribute("data-map-focus");
      if (!mapFocuses.some((item) => item.key === focusKey)) {
        return;
      }

      event.preventDefault();
      setActiveKey(focusKey);
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <section ref={stageRef} className="map-workbench-stage" aria-label="Interactive Palworld map and linked tasks">
      <aside className="map-workbench-tasks" aria-label="Map player tasks">
        <div>
          <span className="wiki-kicker">Quick map presets</span>
          <h2>Start with the fixed-point layer you need.</h2>
        </div>
        {mapFocuses.map((action) => (
          <button
            type="button"
            key={action.key}
            className={action.key === activeKey ? "is-active" : ""}
            aria-pressed={action.key === activeKey}
            onClick={() => setActiveKey(action.key)}
          >
            <span>{action.label}</span>
            <strong>{action.title}</strong>
            <small>{action.note}</small>
          </button>
        ))}
      </aside>

      <div className="map-workbench-map">
        <InteractiveMap preset={active} palProfiles={palProfiles} />
      </div>
    </section>
  );
}
