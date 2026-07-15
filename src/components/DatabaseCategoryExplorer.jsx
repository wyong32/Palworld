"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const allValue = "All";

function FilterButton({ active, children, onClick }) {
  return (
    <button className={`database-filter-pill${active ? " is-active" : ""}`} type="button" onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

export default function DatabaseCategoryExplorer({ data }) {
  const [query, setQuery] = useState("");
  const [linked, setLinked] = useState(allValue);
  const [sortBy, setSortBy] = useState("name");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return data.items
      .filter((item) => {
        const queryMatch =
          !normalizedQuery ||
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.guideSummary.toLowerCase().includes(normalizedQuery) ||
          item.acquisitionHints.some((hint) => hint.toLowerCase().includes(normalizedQuery));
        const linkMatch =
          linked === allValue ||
          (linked === "Pals" && item.relatedPalCount > 0) ||
          (linked === "Items" && item.relatedItemCount > 0) ||
          (linked === "Multi-category" && item.categories.length > 1);

        return queryMatch && linkMatch;
      })
      .sort((a, b) => {
        if (sortBy === "pal-links") {
          return b.relatedPalCount - a.relatedPalCount || a.title.localeCompare(b.title);
        }
        return a.title.localeCompare(b.title);
      });
  }, [data.items, linked, query, sortBy]);

  return (
    <div className="database-category-explorer">
      <section className="database-category-stats" aria-label={`${data.category} stats`}>
        <article>
          <strong>{data.stats.total}</strong>
          <span>Total entries</span>
        </article>
        <article>
          <strong>{data.stats.linkedPals}</strong>
          <span>Pal-linked</span>
        </article>
        <article>
          <strong>{data.stats.sourcedImages}</strong>
          <span>Illustrated entries</span>
        </article>
        <article>
          <strong>{data.stats.multiCategory}</strong>
          <span>Multi-category</span>
        </article>
      </section>

      <section className="database-filter-panel" aria-label={`${data.category} filters`}>
        <label>
          <span>Search {data.category}</span>
          <input
            type="search"
            placeholder={`Try ${data.category === "Materials" ? "Pal Metal Ingot, dropped by Pals..." : "name, usage, route..."}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="name">Name</option>
            <option value="pal-links">Pal links first</option>
          </select>
        </label>
        <div className="database-filter-options">
          <FilterButton active={linked === allValue} onClick={() => setLinked(allValue)}>
            All entries
          </FilterButton>
          <FilterButton active={linked === "Pals"} onClick={() => setLinked("Pals")}>
            Linked Pals
          </FilterButton>
          <FilterButton active={linked === "Items"} onClick={() => setLinked("Items")}>
            Related items
          </FilterButton>
          <FilterButton active={linked === "Multi-category"} onClick={() => setLinked("Multi-category")}>
            Multi-category
          </FilterButton>
        </div>
      </section>

      <div className="listing-toolbar">
        <strong>{data.category} Database List</strong>
        <span>{filteredItems.length} matching entries</span>
      </div>

      <section className="database-card-list" aria-label={`${data.category} database entries`}>
        {filteredItems.map((item) => (
          <article className="database-result-card" key={item.id}>
            <Link href={item.href} className="database-result-image" aria-label={`Open ${item.title}`}>
              <Image src={item.imageUrl} alt={item.imageAlt} width={132} height={96} />
            </Link>
            <div className="database-result-body">
              <div className="database-result-heading">
                <span>{item.role}</span>
                <h2>
                  <Link href={item.href}>{item.title}</Link>
                </h2>
              </div>
              <p>{item.guideSummary}</p>
              <div className="database-chip-row">
                {item.categories.slice(0, 4).map((category) => (
                  <span key={category}>{category}</span>
                ))}
                {item.relatedPalCount > 0 && <span>{item.relatedPalCount} Pal links</span>}
                {item.relatedItemCount > 0 && <span>{item.relatedItemCount} related items</span>}
              </div>
              <div className="database-hint-row">
                {item.acquisitionHints.slice(0, 2).map((hint) => (
                  <small key={hint}>{hint}</small>
                ))}
              </div>
              <Link className="database-result-link" href={item.href}>
                Open item guide
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
