"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MATRIX_API_PATH = "/api/breeding-matrix";
const PAIR_LIMIT_STEP = 36;

function findDefaultIndex(records, name, fallback = 0) {
  const index = records.findIndex((record) => record.name.toLowerCase() === name.toLowerCase());
  return index >= 0 ? index : fallback;
}

function getChildIndex(matrixData, parentAIndex, parentBIndex) {
  const rowIndex = Math.max(parentAIndex, parentBIndex);
  const columnIndex = Math.min(parentAIndex, parentBIndex);
  return matrixData.rows?.[rowIndex]?.[columnIndex];
}

function getSearchText(record) {
  return [
    record.name,
    record.id,
    record.element,
    record.elements?.join(" "),
    record.workSuitability,
    record.drops,
    record.partnerSkill,
  ].filter(Boolean).join(" ").toLowerCase();
}

function comboPalRecord(pal, fallback) {
  if (!pal) {
    return {
      name: fallback,
      element: "Pal record",
    };
  }

  return {
    name: pal.name || pal.title || fallback,
    href: pal.href || (pal.addressBar ? `/pals/${pal.addressBar}` : undefined),
    imageUrl: pal.imageUrl,
    imageAlt: pal.imageAlt,
    element: pal.element,
    elements: pal.elements || [],
  };
}

function RecordImage({ record, size = 58 }) {
  if (!record?.imageUrl) {
    return (
      <span className="calculator-pal-fallback" aria-hidden="true">
        {record?.name?.slice(0, 2) || "PW"}
      </span>
    );
  }

  return (
    <Image
      src={record.imageUrl}
      alt={record.imageAlt || `${record.name} Palworld Pal`}
      width={size}
      height={size}
      sizes={`${size}px`}
    />
  );
}

function PalSummaryCard({ record, label, emphasis = false }) {
  if (!record) {
    return null;
  }

  const content = (
    <>
      <RecordImage record={record} size={emphasis ? 78 : 58} />
      <span>
        <small>{label}</small>
        <strong>{record.name}</strong>
        <em>{record.element || "Pal record"}</em>
      </span>
    </>
  );

  if (!record.href) {
    return <div className="calculator-pal-summary">{content}</div>;
  }

  return (
    <Link className="calculator-pal-summary" href={record.href}>
      {content}
    </Link>
  );
}

function PalPicker({ label, records, value, onChange, query, onQueryChange }) {
  const selected = records.find((record) => record.index === value);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((record) => !normalized || getSearchText(record).includes(normalized));
  }, [records, query]);

  return (
    <div className="calculator-picker">
      <div className="calculator-picker-head">
        <span>{label}</span>
        <PalSummaryCard record={selected} label="Selected" />
      </div>
      <label className="tool-search">
        <span>Search Pal</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name, element, work role, or drop"
        />
      </label>
      <p className="calculator-picker-count">
        Showing all {filteredRecords.length} matching Pals.
      </p>
      <div className="calculator-picker-options" aria-label={`${label} options`}>
        {filteredRecords.map((record) => (
          <button
            type="button"
            key={`${label}-${record.id}-${record.index}`}
            className={record.index === value ? "is-active" : ""}
            onClick={() => onChange(record.index)}
          >
            <RecordImage record={record} size={44} />
            <span>
              <strong>{record.name}</strong>
              <small>{record.element || record.id}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PairCard({ pair, target }) {
  return (
    <article className="calculator-pair-card">
      <div className="calculator-pair-pals">
        <PalSummaryCard record={pair.parentA} label="Parent A" />
        <span>+</span>
        <PalSummaryCard record={pair.parentB} label="Parent B" />
      </div>
      <p>
        This pair produces <strong>{target.name}</strong>. Open each Pal before committing rare passives so you can
        compare element, work role, and capture value.
      </p>
    </article>
  );
}

function planOwnedRoute(matrixData, ownedIndices, targetIndex) {
  if (ownedIndices.length === 0) return { status: "empty", steps: [] };
  const generations = new Array(matrixData.records.length).fill(Number.POSITIVE_INFINITY);
  const parents = new Map();
  ownedIndices.forEach((index) => { generations[index] = 0; });
  if (generations[targetIndex] === 0) return { status: "owned", generations, steps: [] };

  for (let pass = 0; pass < matrixData.records.length; pass += 1) {
    let changed = false;
    for (let rowIndex = 0; rowIndex < matrixData.rows.length; rowIndex += 1) {
      if (!Number.isFinite(generations[rowIndex]) || matrixData.records[rowIndex]?.breedable === false) continue;
      for (let columnIndex = 0; columnIndex < matrixData.rows[rowIndex].length; columnIndex += 1) {
        if (!Number.isFinite(generations[columnIndex]) || matrixData.records[columnIndex]?.breedable === false) continue;
        const childIndex = matrixData.rows[rowIndex][columnIndex];
        if (matrixData.records[childIndex]?.breedable === false) continue;
        const childGeneration = Math.max(generations[rowIndex], generations[columnIndex]) + 1;
        if (childGeneration >= generations[childIndex]) continue;
        generations[childIndex] = childGeneration;
        parents.set(childIndex, [rowIndex, columnIndex]);
        changed = true;
      }
    }
    if (!changed) break;
  }

  if (!Number.isFinite(generations[targetIndex])) return { status: "unreachable", generations, steps: [] };
  const steps = [];
  const visited = new Set();
  function trace(childIndex) {
    if (visited.has(childIndex) || !parents.has(childIndex)) return;
    const [parentAIndex, parentBIndex] = parents.get(childIndex);
    trace(parentAIndex);
    trace(parentBIndex);
    visited.add(childIndex);
    steps.push({
      generation: generations[childIndex],
      parentA: matrixData.records[parentAIndex],
      parentB: matrixData.records[parentBIndex],
      child: matrixData.records[childIndex],
    });
  }
  trace(targetIndex);
  return { status: "found", generations, steps, targetGeneration: generations[targetIndex] };
}

function OwnedPalPicker({ records, selected, onToggle, query, onQueryChange }) {
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((record) => !normalized || getSearchText(record).includes(normalized));
  }, [query, records]);
  return (
    <div className="calculator-owned-picker">
      <div className="calculator-picker-head"><span>Owned Pal species</span><strong>{selected.length} selected</strong></div>
      <label className="tool-search"><span>Search owned Pals</span><input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search your box by Pal name or role" /></label>
      <div className="calculator-picker-options" aria-label="Owned Pal species options">
        {filtered.map((record) => (
          <button type="button" key={`owned-${record.id}-${record.index}`} className={selected.includes(record.index) ? "is-active" : ""} aria-pressed={selected.includes(record.index)} onClick={() => onToggle(record.index)}>
            <RecordImage record={record} size={44} />
            <span><strong>{record.name}</strong><small>{selected.includes(record.index) ? "Owned" : record.element || record.id}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ComboCard({ combo }) {
  const parentA = comboPalRecord(combo.parentARef, combo.parentA);
  const parentB = comboPalRecord(combo.parentBRef, combo.parentB);
  const target = comboPalRecord(combo.targetRef, combo.target);

  return (
    <article className="breeding-combo-card">
      <div className="breeding-combo-pals">
        <PalSummaryCard record={parentA} label="Parent A" />
        <span className="breeding-combo-symbol">+</span>
        <PalSummaryCard record={parentB} label="Parent B" />
        <span className="breeding-combo-symbol">=</span>
        <PalSummaryCard record={target} label="Child" emphasis />
      </div>
      <div className="breeding-combo-copy">
        <span>{combo.role}</span>
        <h3>{combo.target}</h3>
        <p>{combo.why}</p>
        <strong>{combo.action}</strong>
      </div>
    </article>
  );
}

export default function BreedingCalculatorTool({ combos = [] }) {
  const [matrixData, setMatrixData] = useState(null);
  const [matrixError, setMatrixError] = useState("");
  const [mode, setMode] = useState("parents");
  const [parentAIndex, setParentAIndex] = useState(0);
  const [parentBIndex, setParentBIndex] = useState(1);
  const [targetIndex, setTargetIndex] = useState(0);
  const [parentAQuery, setParentAQuery] = useState("");
  const [parentBQuery, setParentBQuery] = useState("");
  const [targetQuery, setTargetQuery] = useState("");
  const [pairQuery, setPairQuery] = useState("");
  const [pairLimit, setPairLimit] = useState(PAIR_LIMIT_STEP);
  const [comboQuery, setComboQuery] = useState("");
  const [comboRole, setComboRole] = useState("All");
  const [ownedQuery, setOwnedQuery] = useState("");
  const [ownedIndices, setOwnedIndices] = useState([]);
  const [ownedRoute, setOwnedRoute] = useState(null);

  useEffect(() => {
    let active = true;

    fetch(MATRIX_API_PATH)
      .then((response) => {
        if (!response.ok) {
          throw new Error("The Palworld breeding table could not be loaded.");
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;

        setMatrixData(data);
        setParentAIndex(findDefaultIndex(data.records, "Blazamut"));
        setParentBIndex(findDefaultIndex(data.records, "Dualith", 1));
        setTargetIndex(findDefaultIndex(data.records, "Anubis"));
      })
      .catch((error) => {
        if (active) setMatrixError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const records = useMemo(() => matrixData?.records || [], [matrixData]);
  const availableRecords = useMemo(() => records.filter((record) => record.breedable !== false), [records]);
  const parentA = records[parentAIndex];
  const parentB = records[parentBIndex];
  const child = matrixData ? records[getChildIndex(matrixData, parentAIndex, parentBIndex)] : null;
  const target = records[targetIndex];

  const targetPairs = useMemo(() => {
    if (!matrixData) return [];

    const normalizedQuery = pairQuery.trim().toLowerCase();
    const pairs = [];

    for (let rowIndex = 0; rowIndex < matrixData.rows.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < matrixData.rows[rowIndex].length; columnIndex += 1) {
        if (matrixData.rows[rowIndex][columnIndex] !== targetIndex) continue;

        const pair = {
          parentA: records[rowIndex],
          parentB: records[columnIndex],
        };
        if (pair.parentA.breedable === false || pair.parentB.breedable === false) continue;
        const haystack = `${pair.parentA.name} ${pair.parentB.name} ${pair.parentA.element} ${pair.parentB.element}`.toLowerCase();

        if (!normalizedQuery || haystack.includes(normalizedQuery)) {
          pairs.push(pair);
        }
      }
    }

    return pairs.sort((a, b) =>
      `${a.parentA.name} ${a.parentB.name}`.localeCompare(`${b.parentA.name} ${b.parentB.name}`),
    );
  }, [matrixData, pairQuery, records, targetIndex]);

  const comboRoles = useMemo(() => {
    const roleSet = new Set(combos.map((combo) => combo.role).filter(Boolean));
    return ["All", ...Array.from(roleSet)];
  }, [combos]);

  const filteredCombos = useMemo(() => {
    const normalizedQuery = comboQuery.trim().toLowerCase();

    return combos.filter((combo) => {
      const roleMatch = comboRole === "All" || combo.role === comboRole;
      const searchText = [
        combo.parentA,
        combo.parentB,
        combo.target,
        combo.role,
        combo.why,
        combo.action,
        combo.parentARef?.element,
        combo.parentBRef?.element,
        combo.targetRef?.element,
      ].filter(Boolean).join(" ").toLowerCase();

      return roleMatch && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
  }, [comboQuery, comboRole, combos]);

  const changeTarget = (index) => {
    setTargetIndex(index);
    setPairLimit(PAIR_LIMIT_STEP);
    setOwnedRoute(null);
  };

  const toggleOwned = (index) => {
    setOwnedIndices((current) => current.includes(index) ? current.filter((entry) => entry !== index) : [...current, index]);
    setOwnedRoute(null);
  };

  return (
    <section className="breeding-calculator-tool" aria-label="Palworld Breeding Calculator tool">
      <div className="breeding-calculator-tabs" aria-label="Calculator modes">
        <button type="button" className={mode === "parents" ? "is-active" : ""} onClick={() => setMode("parents")}>
          Parents to Child
        </button>
        <button type="button" className={mode === "target" ? "is-active" : ""} onClick={() => setMode("target")}>
          Target to Parents
        </button>
        <button type="button" className={mode === "owned" ? "is-active" : ""} onClick={() => setMode("owned")}>
          Owned Pals to Target
        </button>
      </div>

      {!matrixData && !matrixError && (
        <p className="calculator-status" role="status">
          Loading the Palworld 1.0 breeding table...
        </p>
      )}

      {matrixError && (
        <p className="calculator-status" role="alert">
          {matrixError}
        </p>
      )}

      {matrixData && mode === "parents" && (
        <div className="calculator-workbench">
          <div className="calculator-parent-grid">
            <PalPicker
              label="Parent A"
              records={availableRecords}
              value={parentAIndex}
              onChange={setParentAIndex}
              query={parentAQuery}
              onQueryChange={setParentAQuery}
            />
            <PalPicker
              label="Parent B"
              records={availableRecords}
              value={parentBIndex}
              onChange={setParentBIndex}
              query={parentBQuery}
              onQueryChange={setParentBQuery}
            />
          </div>

          <article className="calculator-result-panel">
            <span>Calculated Child</span>
            <div className="calculator-result-equation">
              <PalSummaryCard record={parentA} label="Parent A" />
              <strong>+</strong>
              <PalSummaryCard record={parentB} label="Parent B" />
              <strong>=</strong>
              <PalSummaryCard record={child} label="Child" emphasis />
            </div>
            <div className="calculator-result-detail">
              <h2>{child?.name || "Choose two parents"}</h2>
              <p>
                {parentA?.name} and {parentB?.name} produce {child?.name} in the current Palworld 1.0 breeding table.
                Use the linked Pal page to compare work suitability, drops, partner skill, and route value before
                turning this child into the next parent.
              </p>
              {child && (
                <dl>
                  <div>
                    <dt>Element</dt>
                    <dd>{child.element || "Not listed"}</dd>
                  </div>
                  <div>
                    <dt>Work Suitability</dt>
                    <dd>{child.workSuitability || "Check the Pal detail page"}</dd>
                  </div>
                  <div>
                    <dt>Drops</dt>
                    <dd>{child.drops || "No local drops listed"}</dd>
                  </div>
                </dl>
              )}
            </div>
          </article>
        </div>
      )}

      {matrixData && mode === "target" && (
        <div className="calculator-workbench">
          <div className="calculator-target-row">
            <PalPicker
              label="Target Pal"
              records={availableRecords}
              value={targetIndex}
              onChange={changeTarget}
              query={targetQuery}
              onQueryChange={setTargetQuery}
            />
            <div className="calculator-target-summary">
              <PalSummaryCard record={target} label="Target" emphasis />
              <label className="tool-search">
                <span>Filter parent names</span>
                <input
                  type="search"
                  value={pairQuery}
                  onChange={(event) => {
                    setPairQuery(event.target.value);
                    setPairLimit(PAIR_LIMIT_STEP);
                  }}
                  placeholder="Filter Anubis pairs by parent name or element"
                />
              </label>
              <p>
                {targetPairs.length} parent pair{targetPairs.length === 1 ? "" : "s"} currently produce{" "}
                <strong>{target.name}</strong>. Start with pairs you can capture or already own, then use the Pal
                detail links to check whether the parents are worth keeping.
              </p>
            </div>
          </div>

          <div className="calculator-pair-grid">
            {targetPairs.slice(0, pairLimit).map((pair) => (
              <PairCard key={`${pair.parentA.id}-${pair.parentB.id}`} pair={pair} target={target} />
            ))}
          </div>

          {targetPairs.length > pairLimit && (
            <div className="tool-filter-row">
              <button type="button" onClick={() => setPairLimit((limit) => limit + PAIR_LIMIT_STEP)}>
                Show more parent pairs
              </button>
            </div>
          )}
        </div>
      )}

      {matrixData && mode === "owned" && (
        <div className="calculator-workbench calculator-owned-workbench">
          <div className="calculator-owned-grid">
            <OwnedPalPicker records={availableRecords} selected={ownedIndices} onToggle={toggleOwned} query={ownedQuery} onQueryChange={setOwnedQuery} />
            <div className="calculator-owned-target">
              <PalPicker label="Target Pal" records={availableRecords} value={targetIndex} onChange={changeTarget} query={targetQuery} onQueryChange={setTargetQuery} />
              <div className="calculator-owned-actions">
                <button type="button" onClick={() => setOwnedRoute(planOwnedRoute(matrixData, ownedIndices, targetIndex))}>Find shortest generation path</button>
                <button type="button" onClick={() => { setOwnedIndices([]); setOwnedRoute(null); }}>Clear owned list</button>
              </div>
            </div>
          </div>

          {ownedRoute?.status === "empty" && <p className="calculator-status">Select at least one owned Pal species before calculating.</p>}
          {ownedRoute?.status === "owned" && <p className="calculator-status"><strong>{target.name}</strong> is already in your owned list; no breeding step is required.</p>}
          {ownedRoute?.status === "unreachable" && <p className="calculator-status">No route from the selected species reaches <strong>{target.name}</strong> in the current 1.0 matrix.</p>}
          {ownedRoute?.status === "found" && (
            <section className="calculator-owned-route" aria-live="polite">
              <div className="breeding-results-head">
                <div><span className="eyebrow">Shortest matrix path</span><h2>{target.name} in {ownedRoute.targetGeneration} generation{ownedRoute.targetGeneration === 1 ? "" : "s"}</h2><p>Breed the listed child before any later step that uses it as a parent. Species-level planning assumes you have a compatible male/female pair when the same species appears on both sides.</p></div>
                <strong>{ownedRoute.steps.length} breeding step{ownedRoute.steps.length === 1 ? "" : "s"}</strong>
              </div>
              <div className="calculator-route-steps">
                {ownedRoute.steps.map((step, index) => (
                  <article key={`${step.child.id}-${index}`}>
                    <span>Generation {step.generation} · Step {index + 1}</span>
                    <div className="calculator-result-equation"><PalSummaryCard record={step.parentA} label="Parent" /><strong>+</strong><PalSummaryCard record={step.parentB} label="Parent" /><strong>=</strong><PalSummaryCard record={step.child} label="Child" emphasis /></div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {combos.length > 0 && (
        <section className="calculator-combo-section" aria-labelledby="calculator-combo-title">
          <div className="breeding-results-head calculator-combo-head">
            <div>
              <span className="eyebrow">Featured routes</span>
              <h2 id="calculator-combo-title">Breeding combinations</h2>
              <p>
                Use these curated Palworld 1.0 combo routes after checking the full calculator result. Each route links
                parents and child pages so you can compare work roles, drops, elements, and passive-chain value.
              </p>
            </div>
            <strong>
              {filteredCombos.length} of {combos.length} routes
            </strong>
          </div>

          <div className="tool-control-bar" aria-label="Breeding combination filters">
            <label className="tool-search">
              <span>Search combos</span>
              <input
                type="search"
                value={comboQuery}
                onChange={(event) => setComboQuery(event.target.value)}
                placeholder="Search Anubis, Jormuntide, fixed pair, or same-species"
              />
            </label>
            <div className="tool-filter-row" aria-label="Combination route type">
              {comboRoles.map((role) => (
                <button
                  type="button"
                  key={role}
                  className={comboRole === role ? "is-active" : ""}
                  aria-pressed={comboRole === role}
                  onClick={() => setComboRole(role)}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="breeding-combo-grid">
            {filteredCombos.map((combo) => (
              <ComboCard key={`${combo.parentA}-${combo.parentB}-${combo.target}`} combo={combo} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
