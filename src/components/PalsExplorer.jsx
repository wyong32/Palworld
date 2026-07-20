"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const allValue = "All";

function filterMatches(value, selected) {
  return selected === allValue || value === selected;
}

function ButtonPill({ active, children, onClick }) {
  return (
    <button
      className={`pal-filter-pill${active ? " is-active" : ""}`}
      type="button"
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function WorkBadge({ work }) {
  if (!work) {
    return <span className="pal-work-badge">No work role</span>;
  }

  return (
    <span className="pal-work-badge is-primary">
      {work.type} Lv.{work.level}
    </span>
  );
}

export default function PalsExplorer({ data }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState(allValue);
  const [element, setElement] = useState(allValue);
  const [workType, setWorkType] = useState(allValue);
  const [sortBy, setSortBy] = useState("number");

  const filteredPals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return data.pals
      .filter((pal) => {
        const queryMatch =
          !normalizedQuery ||
          pal.title.toLowerCase().includes(normalizedQuery) ||
          pal.number.toLowerCase().includes(normalizedQuery) ||
          pal.element.toLowerCase().includes(normalizedQuery) ||
          pal.roles.some((entry) => entry.toLowerCase().includes(normalizedQuery)) ||
          pal.work.some((entry) => entry.type.toLowerCase().includes(normalizedQuery));

        const roleMatch = role === allValue || pal.roles.includes(role);
        const elementMatch = element === allValue || pal.elements.includes(element);
        const workMatch = workType === allValue || pal.work.some((entry) => entry.type === workType);

        return queryMatch && roleMatch && elementMatch && workMatch;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.title.localeCompare(b.title);
        }

        if (sortBy === "work") {
          return b.maxWorkLevel - a.maxWorkLevel || a.title.localeCompare(b.title);
        }

        if (sortBy === "combat") {
          return Number(b.roles.includes("Combat Candidate")) - Number(a.roles.includes("Combat Candidate")) || a.title.localeCompare(b.title);
        }

        return a.id - b.id;
      });
  }, [data.pals, element, query, role, sortBy, workType]);

  return (
    <div className="pals-explorer">
      <section className="pal-explorer-stats" aria-label="Pal index role counts">
        <article>
          <strong>{data.stats.total}</strong>
          <span>Indexed entries</span>
        </article>
        <article>
          <strong>{data.stats.workers}</strong>
          <span>Base workers</span>
        </article>
        <article>
          <strong>{data.stats.topWorkers}</strong>
          <span>High-level workers</span>
        </article>
        <article>
          <strong>{data.stats.flyingMounts}</strong>
          <span>Flying mounts</span>
        </article>
        <article>
          <strong>{data.stats.combat}</strong>
          <span>Combat picks</span>
        </article>
        <article className="is-map-linked">
          <Link href="/map#interactive-map-title">
            <strong>{data.stats.mapLinked}</strong>
            <span>Map-linked Alpha Pals</span>
          </Link>
        </article>
      </section>

      <div className="listing-toolbar">
        <strong>Pal index coverage</strong>
        <span>204 regular Pals, 84 subspecies, 11 crossover creatures, and 5 unreleased archive entries</span>
      </div>

      <section className="pal-spotlight-grid" aria-label="Recommended Pal categories">
        {data.spotlights.map((spotlight) => (
          <article className="pal-spotlight-card" key={spotlight.key}>
            <div className="pal-spotlight-head">
              <span>{spotlight.label}</span>
              <h2>{spotlight.title}</h2>
              <p>{spotlight.description}</p>
            </div>
            <div className="pal-spotlight-row">
              {spotlight.pals.map((pal) => (
                <Link href={pal.href} className="pal-mini-card" key={`${spotlight.key}-${pal.title}`}>
                  <Image src={pal.imageUrl} alt={`${pal.title} Palworld icon`} width={78} height={78} sizes="54px" />
                  <span>
                    <strong>{pal.title}</strong>
                    <small>{pal.roles.join(" / ") || pal.element}</small>
                  </span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="pal-filter-panel" id="work-filters" aria-label="Pal filters">
        <div className="pal-search-row">
          <label>
            <span>Search Pals</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Anubis, Fire, Mining, Flying Mount..."
            />
          </label>
          <label>
            <span>Sort by</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="number">Paldeck number</option>
              <option value="name">Name</option>
              <option value="work">Highest work level</option>
              <option value="combat">Combat first</option>
            </select>
          </label>
        </div>

        <div className="pal-filter-group">
          <strong>Role</strong>
          <div className="pal-filter-scroll">
            <ButtonPill active={role === allValue} onClick={() => setRole(allValue)}>
              All roles
            </ButtonPill>
            {data.roles.map((entry) => (
              <ButtonPill active={filterMatches(entry, role)} key={entry} onClick={() => setRole(entry)}>
                {entry}
              </ButtonPill>
            ))}
          </div>
        </div>

        <div className="pal-filter-group">
          <strong>Work suitability</strong>
          <div className="pal-filter-scroll">
            <ButtonPill active={workType === allValue} onClick={() => setWorkType(allValue)}>
              All work
            </ButtonPill>
            {data.workTypes.map((entry) => (
              <ButtonPill active={filterMatches(entry.type, workType)} key={entry.type} onClick={() => setWorkType(entry.type)}>
                {entry.type} <span>{entry.count}</span>
              </ButtonPill>
            ))}
          </div>
        </div>

        <div className="pal-filter-group">
          <strong>Element</strong>
          <div className="pal-filter-scroll">
            <ButtonPill active={element === allValue} onClick={() => setElement(allValue)}>
              All elements
            </ButtonPill>
            {data.elements.map((entry) => (
              <ButtonPill active={filterMatches(entry, element)} key={entry} onClick={() => setElement(entry)}>
                {entry}
              </ButtonPill>
            ))}
          </div>
        </div>
      </section>

      <div className="listing-toolbar">
        <strong>Palworld Paldeck</strong>
        <span>{filteredPals.length} matching entries</span>
      </div>

      <section className="pal-card-grid" aria-label="Filtered Pal results">
        {filteredPals.map((pal) => (
          <article className="pal-result-card" key={pal.id}>
            <Link href={`/pals/${pal.addressBar}`} className="pal-result-image" aria-label={`Open ${pal.title} guide`}>
              <Image src={pal.imageUrl} alt={pal.imageAlt} width={180} height={180} sizes="(max-width: 768px) 112px, 160px" />
            </Link>
            <div className="pal-result-body">
              <div className="pal-result-title">
                <span>No. {pal.number}</span>
                <h2>
                  <Link href={`/pals/${pal.addressBar}`}>{pal.title}</Link>
                </h2>
              </div>
              <p>
                <strong>Recommended for:</strong> {pal.decisionSummary || "Paldeck collection and species comparison"}.
              </p>
              <div className="pal-chip-row" aria-label={`${pal.title} elements`}>
                {pal.elements.map((entry) => (
                  <span className={`pal-element-chip pal-element-${entry.toLowerCase().replace(/\s+/g, "-")}`} key={entry}>
                    {entry}
                  </span>
                ))}
              </div>
              <div className="pal-chip-row">
                <WorkBadge work={pal.primaryWork} />
                {pal.roles.slice(0, 4).map((entry) => (
                  <span className="pal-role-badge" key={entry}>
                    {entry}
                  </span>
                ))}
              </div>
              {pal.linkedDrops.length > 0 && (
                <div className="pal-drop-links">
                  <strong>Database drops</strong>
                  <div>
                    {pal.linkedDrops.map((drop) => (
                      <Link href={drop.href} key={drop.href}>
                        {drop.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="pal-result-actions">
                <Link className="pal-result-link" href={`/pals/${pal.addressBar}`}>
                  Open Pal guide
                </Link>
                {pal.mapHref && (
                  <Link className="pal-map-result-link" href={pal.mapHref}>
                    {pal.mapPointCount} fixed Alpha point{pal.mapPointCount === 1 ? "" : "s"} · {pal.mapRegions.join(" / ")}
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
        {filteredPals.length === 0 && (
          <div className="search-empty-panel">
            <h2>No Pals match these filters</h2>
            <p>Clear one role, work, or element filter, or search with a shorter Pal name.</p>
          </div>
        )}
      </section>
    </div>
  );
}
