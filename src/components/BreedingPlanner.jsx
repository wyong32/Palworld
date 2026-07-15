"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MATRIX_PATH = "/data/current-breeding-matrix.json";
const INITIAL_PAIR_LIMIT = 30;

function getChildIndex(data, parentAIndex, parentBIndex) {
  const rowIndex = Math.max(parentAIndex, parentBIndex);
  const columnIndex = Math.min(parentAIndex, parentBIndex);
  return data?.rows?.[rowIndex]?.[columnIndex];
}

function MatrixPalLink({ record }) {
  if (!record) {
    return null;
  }

  return record.href ? <Link href={record.href}>{record.name}</Link> : <strong>{record.name}</strong>;
}

function PalBadge({ pal, fallback }) {
  if (!pal) {
    return (
      <div className="breeding-pal-badge is-missing">
        <span>{fallback}</span>
      </div>
    );
  }

  return (
    <Link className="breeding-pal-badge" href={`/pals/${pal.addressBar}`}>
      <Image src={pal.imageUrl} alt={pal.imageAlt || pal.title} width={72} height={72} />
      <span>{pal.title}</span>
    </Link>
  );
}

function ItemChip({ item, fallback, href }) {
  const content = (
    <>
      {item?.imageUrl && <Image src={item.imageUrl} alt={item.imageAlt || item.title} width={44} height={44} />}
      <span>{item?.title || fallback}</span>
    </>
  );

  if (!href) {
    return <span className="breeding-item-chip">{content}</span>;
  }

  return (
    <Link className="breeding-item-chip" href={href}>
      {content}
    </Link>
  );
}

export default function BreedingPlanner({ combos, steps, cakePlan, mutationCards }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [matrixData, setMatrixData] = useState(null);
  const [matrixError, setMatrixError] = useState("");
  const [calculatorMode, setCalculatorMode] = useState("parents");
  const [parentAIndex, setParentAIndex] = useState(0);
  const [parentBIndex, setParentBIndex] = useState(1);
  const [targetIndex, setTargetIndex] = useState(0);
  const [parentQuery, setParentQuery] = useState("");
  const [pairLimit, setPairLimit] = useState(INITIAL_PAIR_LIMIT);

  useEffect(() => {
    let active = true;

    fetch(MATRIX_PATH)
      .then((response) => {
        if (!response.ok) {
          throw new Error("The current breeding table could not be loaded.");
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setMatrixData(data);
        const anubisIndex = data.records.findIndex((record) => record.name === "Anubis");
        setTargetIndex(anubisIndex >= 0 ? anubisIndex : 0);
      })
      .catch((error) => {
        if (active) setMatrixError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const roles = useMemo(() => ["All", ...Array.from(new Set(combos.map((combo) => combo.role)))], [combos]);

  const filteredCombos = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return combos.filter((combo) => {
      const matchesRole = role === "All" || combo.role === role;
      const haystack = [combo.parentA, combo.parentB, combo.target, combo.role, combo.why, combo.action].join(" ").toLowerCase();
      return matchesRole && (!normalized || haystack.includes(normalized));
    });
  }, [combos, query, role]);

  const calculatorResult = useMemo(() => {
    if (!matrixData) return null;
    return matrixData.records[getChildIndex(matrixData, parentAIndex, parentBIndex)];
  }, [matrixData, parentAIndex, parentBIndex]);

  const targetPairs = useMemo(() => {
    if (!matrixData) return [];

    const normalizedQuery = parentQuery.trim().toLowerCase();
    const pairs = [];

    for (let rowIndex = 0; rowIndex < matrixData.rows.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < matrixData.rows[rowIndex].length; columnIndex += 1) {
        if (matrixData.rows[rowIndex][columnIndex] !== targetIndex) continue;

        const parentA = matrixData.records[rowIndex];
        const parentB = matrixData.records[columnIndex];
        const names = `${parentA.name} ${parentB.name}`.toLowerCase();

        if (!normalizedQuery || names.includes(normalizedQuery)) {
          pairs.push({ parentA, parentB });
        }
      }
    }

    return pairs.sort((a, b) =>
      `${a.parentA.name} ${a.parentB.name}`.localeCompare(`${b.parentA.name} ${b.parentB.name}`),
    );
  }, [matrixData, parentQuery, targetIndex]);

  const changeTarget = (value) => {
    setTargetIndex(Number(value));
    setPairLimit(INITIAL_PAIR_LIMIT);
  };

  const changeParentQuery = (value) => {
    setParentQuery(value);
    setPairLimit(INITIAL_PAIR_LIMIT);
  };

  return (
    <section className="guide-tool-shell breeding-planner" aria-labelledby="breeding-planner-title">
      <div className="tool-section-head">
        <span>Player Tool</span>
        <h2 id="breeding-planner-title">Breeding Planner and Cake Route</h2>
        <p>
          Filter parent pairs, compare the parent and target Pals, and follow the farm loop needed to keep eggs moving.
        </p>
      </div>

      <div className="tool-control-bar">
        <label className="tool-search">
          <span>Search pairs</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Anubis, Grizzbolt, Cake, Shadowbeak"
          />
        </label>
        <div className="tool-filter-row" aria-label="Breeding route filters">
          {roles.map((item) => (
            <button
              type="button"
              key={item}
              className={item === role ? "is-active" : ""}
              onClick={() => setRole(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="breeding-cake-board breeding-calculator-board">
        <div className="breeding-results-head">
          <div>
            <h3>Palworld 1.0 breeding calculator</h3>
            <p>Choose two parents to find their child, or choose a target Pal to find matching parent pairs.</p>
          </div>
          <div className="tool-filter-row" aria-label="Breeding calculator mode">
            <button
              type="button"
              className={calculatorMode === "parents" ? "is-active" : ""}
              onClick={() => setCalculatorMode("parents")}
            >
              Parents to child
            </button>
            <button
              type="button"
              className={calculatorMode === "target" ? "is-active" : ""}
              onClick={() => setCalculatorMode("target")}
            >
              Target to parents
            </button>
          </div>
        </div>

        {!matrixData && !matrixError && <p role="status">Loading the current Palworld 1.0 breeding table...</p>}
        {matrixError && <p role="alert">{matrixError}</p>}

        {matrixData && calculatorMode === "parents" && (
          <>
            <div className="tool-control-bar">
              <label className="tool-search">
                <span>Parent A</span>
                <select value={parentAIndex} onChange={(event) => setParentAIndex(Number(event.target.value))}>
                  {matrixData.records.map((record, index) => (
                    <option value={index} key={record.id}>{record.name}</option>
                  ))}
                </select>
              </label>
              <label className="tool-search">
                <span>Parent B</span>
                <select value={parentBIndex} onChange={(event) => setParentBIndex(Number(event.target.value))}>
                  {matrixData.records.map((record, index) => (
                    <option value={index} key={record.id}>{record.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <article className="breeding-combo-card">
              <div className="breeding-combo-copy">
                <span>Calculated child</span>
                <h3><MatrixPalLink record={calculatorResult} /></h3>
                <p>
                  {matrixData.records[parentAIndex].name} + {matrixData.records[parentBIndex].name} produces {calculatorResult?.name} in the current table.
                </p>
              </div>
            </article>
          </>
        )}

        {matrixData && calculatorMode === "target" && (
          <>
            <div className="tool-control-bar">
              <label className="tool-search">
                <span>Target Pal</span>
                <select value={targetIndex} onChange={(event) => changeTarget(event.target.value)}>
                  {matrixData.records.map((record, index) => (
                    <option value={index} key={record.id}>{record.name}</option>
                  ))}
                </select>
              </label>
              <label className="tool-search">
                <span>Filter parent names</span>
                <input
                  type="search"
                  value={parentQuery}
                  onChange={(event) => changeParentQuery(event.target.value)}
                  placeholder="Search a parent Pal"
                />
              </label>
            </div>
            <div className="breeding-results-head">
              <div>
                <h3>{matrixData.records[targetIndex].name} parent pairs</h3>
                <p>{targetPairs.length} combinations match this target and parent filter.</p>
              </div>
            </div>
            <div className="breeding-combo-grid">
              {targetPairs.slice(0, pairLimit).map((pair) => (
                <article className="breeding-combo-card" key={`${pair.parentA.id}-${pair.parentB.id}`}>
                  <div className="breeding-combo-copy">
                    <span>Parent pair</span>
                    <h3><MatrixPalLink record={pair.parentA} /> + <MatrixPalLink record={pair.parentB} /></h3>
                    <p>Produces {matrixData.records[targetIndex].name} in the current Palworld 1.0 table.</p>
                  </div>
                </article>
              ))}
            </div>
            {targetPairs.length > pairLimit && (
              <div className="tool-filter-row">
                <button type="button" onClick={() => setPairLimit((limit) => limit + INITIAL_PAIR_LIMIT)}>
                  Show more pairs
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="breeding-ops-grid">
        {steps.map((step, index) => (
          <article key={step.title} className="breeding-step-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.action}</p>
            <small>{step.detail}</small>
          </article>
        ))}
      </div>

      <div className="breeding-cake-board">
        <div>
          <h3>Cake automation checklist</h3>
          <p>
            Cake is the breeding bottleneck. Build this loop once, then scale parents instead of hand-farming every egg.
          </p>
        </div>
        <div className="breeding-cake-grid">
          {cakePlan.map((part) => (
            <article key={part.item} className="breeding-cake-card">
              <div className="breeding-cake-title">
                <ItemChip item={part.itemRef} fallback={part.item} href={part.itemHref} />
                <strong>x{part.quantity}</strong>
              </div>
              <p>{part.source}</p>
              <small>{part.tip}</small>
            </article>
          ))}
        </div>
      </div>

      <div className="breeding-results-head">
        <div>
          <h3>Breeding combinations</h3>
          <p>{filteredCombos.length} routes match the current filters.</p>
        </div>
      </div>

      <div className="breeding-combo-grid">
        {filteredCombos.map((combo) => (
          <article key={`${combo.parentA}-${combo.parentB}-${combo.target}`} className="breeding-combo-card">
            <div className="breeding-combo-pals">
              <PalBadge pal={combo.parentARef} fallback={combo.parentA} />
              <span className="breeding-combo-symbol">+</span>
              <PalBadge pal={combo.parentBRef} fallback={combo.parentB} />
              <span className="breeding-combo-symbol">=</span>
              <PalBadge pal={combo.targetRef} fallback={combo.target} />
            </div>
            <div className="breeding-combo-copy">
              <span>{combo.role}</span>
              <h3>{combo.target}</h3>
              <p>{combo.why}</p>
              <strong>{combo.action}</strong>
              <small>Route note: test the child result before scaling the pair.</small>
            </div>
          </article>
        ))}
      </div>

      <div className="mutation-board">
        {mutationCards.map((card) => (
          <article key={card.title}>
            <span>1.0</span>
            <h3>{card.title}</h3>
            <p>{card.playerAction}</p>
            <small>{card.note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
