"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InteractiveMap from "@/components/InteractiveMap";

const mapFocuses = [
  {
    key: "pals",
    label: "Pal hunting",
    title: "Find a Pal or Alpha route",
    layer: "Pals, Alpha Pals, Field Bosses",
    search: "Search the map for a Pal name, then compare the marker with that Pal's work, combat, drops, and breeding page.",
    note: "Use this when you are filling Paldeck gaps, scouting Alpha routes, or checking whether an old spawn note survived 1.0.",
  },
  {
    key: "combat",
    label: "Combat path",
    title: "Plan a tower, dungeon, or boss route",
    layer: "Towers, Dungeons, Field Bosses, Chests",
    search: "Open the combat layer first, then check route risk, climate, weapons, ammo, and return points.",
    note: "Use this when a marker is only the destination; the route still needs preparation.",
  },
  {
    key: "resources",
    label: "Materials",
    title: "Farm resources without guessing",
    layer: "Resources, Ores, Merchants, Settlements",
    search: "Filter the resource layer, then keep the route tied to the item you actually need to craft.",
    note: "Use this for ore, coal, sulfur, oil, Soralite, Paloxite, Cake ingredients, and merchant checks.",
  },
  {
    key: "bases",
    label: "Base planning",
    title: "Choose a base by job",
    layer: "Base Locations, Fast Travel, Resources",
    search: "Check terrain, nearby nodes, fast travel access, and route overlap before calling a location best.",
    note: "Use this for mining, breeding, oil, food, production, or travel-hub bases.",
  },
];

export default function MapFocusWorkbench() {
  const [activeKey, setActiveKey] = useState("pals");
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
      <div className="map-workbench-map">
        <div className="map-focus-panel" aria-live="polite">
          <div>
            <span>Current map task</span>
            <strong>{active.title}</strong>
          </div>
          <p>
            <b>Map layer:</b> {active.layer}. {active.search}
          </p>
        </div>
        <InteractiveMap />
      </div>

      <aside className="map-workbench-tasks" aria-label="Map player tasks">
        <div>
          <span className="wiki-kicker">Map focus</span>
          <h2>Choose what the map above should help with.</h2>
        </div>
        {mapFocuses.map((action) => (
          <button
            type="button"
            key={action.key}
            className={action.key === activeKey ? "is-active" : ""}
            onClick={() => setActiveKey(action.key)}
          >
            <span>{action.label}</span>
            <strong>{action.title}</strong>
            <small>{action.note}</small>
          </button>
        ))}
      </aside>
    </section>
  );
}
