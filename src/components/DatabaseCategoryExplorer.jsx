"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function DatabaseCategoryExplorer({ data }) {
  const [query, setQuery] = useState("");
  const [relationship, setRelationship] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return data.items
      .filter((item) => !needle || `${item.title} ${item.guideSummary} ${item.type} ${item.subtype} ${item.organization} ${item.weapon}`.toLowerCase().includes(needle))
      .filter((item) => {
        if (relationship === "Recipe") return item.recipeCount > 0;
        if (relationship === "Component") return item.usedInCount > 0;
        if (relationship === "Pal") return item.relatedPalCount > 0;
        if (relationship === "Map") return item.encounterCount > 0;
        if (relationship === "Drops") return item.dropCount > 0;
        if (relationship === "Variants") return item.variantCount > 1;
        if (relationship === "Unmatched") return !item.matched;
        if (relationship === "Current") return item.publicationStatus?.indexable;
        if (relationship === "Legacy") return item.publicationStatus?.key === "legacy-disabled";
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "uses") return b.usedInCount - a.usedInCount || a.title.localeCompare(b.title);
        if (sortBy === "tech") return (a.technologyLevel ?? 999) - (b.technologyLevel ?? 999) || a.title.localeCompare(b.title);
        if (sortBy === "level") return b.maxEncounterLevel - a.maxEncounterLevel || a.title.localeCompare(b.title);
        if (sortBy === "power") return (b.attack + b.defense) - (a.attack + a.defense) || a.title.localeCompare(b.title);
        return a.title.localeCompare(b.title);
      });
  }, [data.items, query, relationship, sortBy]);

  return (
    <div className="database-category-ledger">
      <div className="database-category-toolbar">
        <div>
          <span className="wiki-kicker">{data.category} ledger</span>
          <h2>{filteredItems.length} records</h2>
        </div>
        <div className="database-category-controls">
          <label>
            <span>Search</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${data.category}`} />
          </label>
          <label>
            <span>Relationship</span>
            <select value={relationship} onChange={(event) => setRelationship(event.target.value)}>
              <option>All</option>
              {!data.isCreatureCategory && <option>Recipe</option>}
              {!data.isCreatureCategory && <option>Component</option>}
              {data.isCreatureCategory && <option>Map</option>}
              {data.isCreatureCategory && <option>Drops</option>}
              {data.isCreatureCategory && <option>Variants</option>}
              <option value="Pal">Pal-linked</option>
              {!data.isCreatureCategory && <option>Unmatched</option>}
              {!data.isCreatureCategory && <option>Current</option>}
              {!data.isCreatureCategory && <option>Legacy</option>}
            </select>
          </label>
          <label>
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="name">Name</option>
              {!data.isCreatureCategory && <option value="uses">Most uses</option>}
              {!data.isCreatureCategory && <option value="tech">Technology level</option>}
              {data.isCreatureCategory && <option value="level">Encounter level</option>}
              <option value="power">Attack / defense</option>
            </select>
          </label>
        </div>
      </div>

      <div className="database-category-column-head" aria-hidden="true">
        <span>Record</span><span>Status</span><span>Connections</span><span>Open</span>
      </div>

      <div className="database-category-rows" aria-live="polite">
        {filteredItems.map((item) => (
          <article className="database-category-row" key={item.id}>
            <Link href={item.href} className="database-category-row-image" aria-label={`Open ${item.title}`}>
              <Image src={item.imageUrl} alt={item.imageAlt} width={96} height={72} sizes="72px" />
            </Link>
            <div className="database-category-row-title">
              <span>{item.type || item.category}{item.subtype ? ` · ${item.subtype}` : ""}</span>
              <h3><Link href={item.href}>{item.title}</Link></h3>
              <p>{item.guideSummary}</p>
            </div>
            <div className="database-category-row-data">
              <span className={item.matched ? "is-confirmed" : "is-unmatched"}>{item.matched ? "Matched 1.0" : "No exact match"}</span>
              {item.publicationStatus && <span>{item.publicationStatus.shortLabel}</span>}
              {item.gameplayEnabled === false && <span>Item flag off</span>}
              {item.technologyLevel && <span>Tech Lv.{item.technologyLevel}</span>}
              {data.isCreatureCategory && item.maxEncounterLevel > 0 && <span>Encounter Lv.{item.maxEncounterLevel}</span>}
              {data.isCreatureCategory && item.hp > 0 && <span>HP {item.hp}</span>}
              {data.isCreatureCategory && item.organization && <span>{item.organization}</span>}
              {data.isCreatureCategory && item.weapon && <span>{item.weapon}</span>}
              {item.attack > 0 && <span>ATK {item.attack}</span>}
              {item.defense > 0 && <span>DEF {item.defense}</span>}
            </div>
            <div className="database-category-row-links">
              {item.recipeCount > 0 && <span>{item.recipeCount} recipe{item.recipeCount === 1 ? "" : "s"}</span>}
              {item.usedInCount > 0 && <span>Used in {item.usedInCount}</span>}
              {item.unlockCount > 0 && <span>{item.unlockCount} unlocks</span>}
              {item.encounterCount > 0 && <span>{item.encounterCount} exact map point{item.encounterCount === 1 ? "" : "s"}</span>}
              {item.dropCount > 0 && <span>{item.dropCount} drop{item.dropCount === 1 ? "" : "s"}</span>}
              {item.variantCount > 1 && <span>{item.variantCount} internal variants</span>}
              {item.relatedPalCount > 0 && <span>{item.relatedPalCount} Pal link{item.relatedPalCount === 1 ? "" : "s"}</span>}
              {item.recipeCount + item.usedInCount + item.unlockCount + item.relatedPalCount + item.encounterCount + item.dropCount === 0 && <span>No indexed relation</span>}
            </div>
            <Link href={item.href} className="database-category-row-open" aria-label={`View ${item.title}`}>→</Link>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && <p className="database-ledger-empty">No {data.category.toLowerCase()} record matches these filters.</p>}
    </div>
  );
}
