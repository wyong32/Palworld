"use client";

import Link from "next/link";
import { useState } from "react";

const updateImpacts = [
  {
    key: "pals",
    label: "Pals",
    title: "72 new Pals change capture and breeding priorities",
    playerAction: "Re-scan your Paldeck, then mark missing habitats before committing to old breeding calculators.",
    editorAction: "Recheck variants, habitats, and team roles before trusting old tier lists.",
    links: [
      { label: "All Pals", href: "/pals" },
      { label: "Update notes", href: "/updates" },
    ],
  },
  {
    key: "map",
    label: "Map",
    title: "Sunreach, World Tree, new islands, and watchtowers expand routing",
    playerAction: "Unlock watchtowers first, then chain fast travel, resources, settlements, dungeons, and towers.",
    editorAction: "Treat exact pins differently from broad region scouting notes.",
    links: [
      { label: "Interactive Map", href: "/map" },
      { label: "Guides", href: "/guides" },
    ],
  },
  {
    key: "breeding",
    label: "Breeding",
    title: "Mutation and new Cake variants add a second breeding layer",
    playerAction: "Keep normal breeding pairs separate from mutation-testing farms so clean passive lines are not lost.",
    editorAction: "Record Cake variant, parent pair, child, passives, and mutation result for every test batch.",
    links: [
      { label: "Breeding", href: "/breeding" },
      { label: "Database", href: "/database" },
    ],
  },
  {
    key: "dungeons",
    label: "Dungeons",
    title: "Dungeon layouts, rewards, and entrances were rebalanced",
    playerAction: "Check old entrance loops again and prioritize fast travel unlocks near high-value cave routes.",
    editorAction: "Separate currently open entrances from long-term dungeon route planning.",
    links: [
      { label: "Map", href: "/map" },
      { label: "Patch Notes", href: "/updates" },
    ],
  },
  {
    key: "database",
    label: "Database",
    title: "New ores, structures, recipes, and materials affect base planning",
    playerAction: "Rebuild old storage categories and add bins for specialized ores, Cake variants, and new crafting chains.",
    editorAction: "Recheck item categories, recipe paths, and storage priorities after large patches.",
    links: [
      { label: "Items", href: "/database" },
      { label: "Guides", href: "/guides" },
    ],
  },
];

export default function UpdateImpactBoard() {
  const [activeKey, setActiveKey] = useState(updateImpacts[0].key);
  const activeImpact = updateImpacts.find((impact) => impact.key === activeKey) || updateImpacts[0];

  return (
    <section className="guide-tool-shell update-impact-board" aria-labelledby="update-impact-title">
      <div className="tool-section-head">
        <span>Version Tool</span>
        <h2 id="update-impact-title">Palworld 1.0 Player Impact Board</h2>
        <p>
          Turn patch notes into concrete player actions: what to check, what to farm, and which guide page helps next.
        </p>
      </div>

      <div className="update-tabs" aria-label="Update impact sections">
        {updateImpacts.map((impact) => (
          <button
            type="button"
            key={impact.key}
            className={activeKey === impact.key ? "is-active" : ""}
            onClick={() => setActiveKey(impact.key)}
          >
            {impact.label}
          </button>
        ))}
      </div>

      <div className="update-impact-layout">
        <article className="update-impact-feature">
          <span>{activeImpact.label}</span>
          <h3>{activeImpact.title}</h3>
          <div className="update-action-pair">
            <div>
              <strong>Player action</strong>
              <p>{activeImpact.playerAction}</p>
            </div>
            <div>
              <strong>Next check</strong>
              <p>{activeImpact.editorAction}</p>
            </div>
          </div>
          <div className="update-link-row">
            {activeImpact.links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </article>

        <div className="update-impact-list">
          {updateImpacts.map((impact) => (
            <button
              type="button"
              key={impact.key}
              className={activeKey === impact.key ? "is-active" : ""}
              onClick={() => setActiveKey(impact.key)}
            >
              <strong>{impact.label}</strong>
              <span>{impact.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
