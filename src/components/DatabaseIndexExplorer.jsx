"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const pageSize = 36;

export default function DatabaseIndexExplorer({ items, categories }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [relation, setRelation] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [visible, setVisible] = useState(pageSize);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items
      .filter((item) => !needle || `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(needle))
      .filter((item) => category === "All" || item.category === category)
      .filter((item) => {
        if (relation === "Recipes") return item.recipeCount > 0;
        if (relation === "Components") return item.usedInCount > 0;
        if (relation === "Combat") return item.kind === "creature";
        if (relation === "Mapped") return item.encounterCount > 0;
        if (relation === "Drops") return item.dropCount > 0;
        if (relation === "Matched") return item.matched;
        if (relation === "Unmatched") return !item.matched;
        if (relation === "Current") return item.publicationStatus?.indexable;
        if (relation === "Legacy") return item.publicationStatus?.key === "legacy-disabled";
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "used-in") return b.usedInCount - a.usedInCount || a.title.localeCompare(b.title);
        if (sortBy === "tech") return (a.technologyLevel ?? 999) - (b.technologyLevel ?? 999) || a.title.localeCompare(b.title);
        if (sortBy === "level") return b.maxEncounterLevel - a.maxEncounterLevel || a.title.localeCompare(b.title);
        if (sortBy === "combat") return b.combatPower - a.combatPower || a.title.localeCompare(b.title);
        return a.title.localeCompare(b.title);
      });
  }, [category, items, query, relation, sortBy]);

  function updateFilter(setter, value) {
    setter(value);
    setVisible(pageSize);
  }

  return (
    <div className="database-ledger-explorer">
      <div className="database-ledger-controls">
        <label className="database-ledger-search">
          <span>Find a record</span>
          <input type="search" value={query} onChange={(event) => updateFilter(setQuery, event.target.value)} placeholder="Assault Rifle, Aegidron, Syndicate…" />
        </label>
        <label>
          <span>Category</span>
          <select value={category} onChange={(event) => updateFilter(setCategory, event.target.value)}>
            <option>All</option>
            {categories.map((entry) => <option key={entry}>{entry}</option>)}
          </select>
        </label>
        <label>
          <span>Data filter</span>
          <select value={relation} onChange={(event) => updateFilter(setRelation, event.target.value)}>
            <option>All</option>
            <option>Recipes</option>
            <option>Components</option>
            <option value="Combat">Combat records</option>
            <option value="Mapped">Exact map point</option>
            <option value="Drops">Has drops</option>
            <option>Matched</option>
            <option>Unmatched</option>
            <option>Current</option>
            <option>Legacy</option>
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="name">Name</option>
            <option value="used-in">Most uses</option>
            <option value="tech">Technology level</option>
            <option value="level">Encounter level</option>
            <option value="combat">Combat power</option>
          </select>
        </label>
      </div>

      <div className="database-ledger-toolbar" aria-live="polite">
        <strong>{filtered.length} records</strong>
        <span>Showing {Math.min(visible, filtered.length)}</span>
      </div>

      <div className="database-ledger-list">
        {filtered.slice(0, visible).map((item, index) => (
          <article className="database-ledger-row" key={item.id}>
            <span className="database-ledger-row-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <Link href={item.href} className="database-ledger-image" aria-label={`Open ${item.title}`}>
              <Image src={item.imageUrl} alt={item.imageAlt} width={88} height={66} sizes="64px" />
            </Link>
            <div className="database-ledger-identity">
              <span>{item.category}</span>
              <h3><Link href={item.href}>{item.title}</Link></h3>
              <p>{item.description}</p>
            </div>
            <dl className="database-ledger-relations" aria-label={`${item.title} data relationships`}>
              <div className={item.matched ? "is-confirmed" : "is-unmatched"}><dt>Data</dt><dd>{item.matched ? "Matched" : "Site only"}</dd></div>
              <div><dt>Status</dt><dd>{item.publicationStatus?.shortLabel || "Unclassified"}</dd></div>
              <div><dt>{item.kind === "creature" ? "Map points" : "Recipes"}</dt><dd>{item.kind === "creature" ? item.encounterCount || "—" : item.recipeCount || "—"}</dd></div>
              <div><dt>{item.kind === "creature" ? "Drops" : "Used in"}</dt><dd>{item.kind === "creature" ? item.dropCount || "—" : item.usedInCount || "—"}</dd></div>
              <div><dt>{item.kind === "creature" ? "Level" : item.unlockCount > 0 ? "Unlocks" : "Tech"}</dt><dd>{item.kind === "creature" ? item.maxEncounterLevel || "—" : item.unlockCount || item.technologyLevel || "—"}</dd></div>
            </dl>
            <Link href={item.href} className="database-ledger-open" aria-label={`View ${item.title} record`}><span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </div>

      {visible < filtered.length && (
        <button className="database-ledger-more" type="button" onClick={() => setVisible((count) => count + pageSize)}>
          Show {Math.min(pageSize, filtered.length - visible)} more records
        </button>
      )}
      {filtered.length === 0 && <p className="database-ledger-empty">No record matches these filters. Clear a filter or search by a shorter item name.</p>}
    </div>
  );
}
