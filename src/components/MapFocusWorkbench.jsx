"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InteractiveMap from "@/components/InteractiveMap";

const mapFocuses = [
  {
    key: "explore",
    index: "01",
    label: "Route essentials",
    title: "Travel, dungeons, and supplies",
    note: "Begin with the utility layer for a practical trip across Palpagos.",
    mapId: "main",
    categories: ["fast-travel", "dungeon", "resource", "skill-fruit", "merchant"],
  },
  {
    key: "alpha",
    index: "02",
    label: "Alpha Pals",
    title: "Fixed Alpha encounters",
    note: "90 exact Alpha points linked to their matching Pal guides.",
    mapId: "main",
    categories: ["alpha-pal"],
  },
  {
    key: "human",
    index: "03",
    label: "Human bosses",
    title: "Fixed human encounters",
    note: "33 locations kept separate from catchable Pal records.",
    mapId: "main",
    categories: ["human-boss"],
  },
  {
    key: "special",
    index: "04",
    label: "Special regions",
    title: "Oil-rig approach points",
    note: "Three exact special-area records, separate from creature encounters.",
    mapId: "main",
    categories: ["special"],
  },
  {
    key: "habitats",
    index: "05",
    label: "Wild habitats",
    title: "Pal spawn clusters",
    note: "Search 7,403 spawn anchors through species-aware habitat clusters.",
    mapId: "main",
    categories: ["wild-spawn"],
  },
  {
    key: "objectives",
    index: "06",
    label: "Quest objectives",
    title: "Exact objective points",
    note: "Inspect fixed quest locations without converting them into route guesses.",
    mapId: "main",
    categories: ["quest"],
  },
  {
    key: "collection",
    index: "07",
    label: "Collectibles",
    title: "Eggs, chests, Effigies, and notes",
    note: "Use UI clustering to scan thousands of retained exact actor points.",
    mapId: "main",
    categories: ["chest", "egg", "effigy", "skill-fruit", "note"],
  },
  {
    key: "world-tree",
    index: "08",
    label: "World Tree",
    title: "Open the endgame projection",
    note: "Bosses, travel, collectibles, and actors stay inside World Tree bounds.",
    mapId: "tree",
    categories: ["alpha-pal", "fast-travel", "chest", "egg", "effigy", "skill-fruit", "note", "npc"],
  },
];

export default function MapFocusWorkbench({ palProfiles }) {
  const [activeKey, setActiveKey] = useState("explore");
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
      <header className="map-preset-header">
        <div>
          <span>EXPEDITION MODE</span>
          <h2>Start with the fixed-point layer you need.</h2>
        </div>
        <p>{active.note}</p>
      </header>

      <nav className="map-workbench-tasks" aria-label="Map player tasks">
        {mapFocuses.map((action) => (
          <button
            type="button"
            key={action.key}
            className={action.key === activeKey ? "is-active" : ""}
            aria-pressed={action.key === activeKey}
            onClick={() => setActiveKey(action.key)}
          >
            <span className="map-task-index">{action.index}</span>
            <span className="map-task-copy"><small>{action.label}</small><strong>{action.title}</strong></span>
          </button>
        ))}
      </nav>

      <div className="map-workbench-map">
        <InteractiveMap preset={active} palProfiles={palProfiles} />
      </div>
    </section>
  );
}
