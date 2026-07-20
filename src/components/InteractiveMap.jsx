"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DATA_PATHS = {
  maps: "/data/palworld-map/map.json",
  bosses: "/data/palworld-map/bosses.json",
  locations: "/data/palworld-map/locations.json",
};

const CATEGORY_META = {
  "alpha-pal": { label: "Alpha Pals", shortLabel: "Alpha", tone: "amber" },
  "human-boss": { label: "Human bosses", shortLabel: "Human", tone: "coral" },
  special: { label: "Special regions", shortLabel: "Special", tone: "water" },
  quest: { label: "Quest objectives", shortLabel: "Quest", tone: "violet" },
  "wild-spawn": { label: "Wild habitats", shortLabel: "Habitat", tone: "leaf" },
};

const MAP_META = {
  main: { label: "Palpagos", description: "Main world" },
  tree: { label: "World Tree", description: "Endgame region" },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_META);
const DEFAULT_CATEGORIES = ALL_CATEGORIES.filter((category) => category !== "wild-spawn");
const INITIAL_VIEW = { scale: 0.1, x: 0, y: 0 };

function matchesQuery(marker, query, profile) {
  if (!query) {
    return true;
  }

  return [
    marker.name?.en,
    marker.name?.zhHans,
    marker.spawnerId,
    marker.palId,
    marker.searchText,
    marker.questType,
    ...(marker.species || []).flatMap((pal) => [pal.title, pal.id]),
    profile?.element,
    ...(profile?.elements || []),
    profile?.habitat,
    profile?.primaryWork?.type,
    ...(profile?.linkedDrops || []).map((drop) => drop.title),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function formatCoordinate(value) {
  return Number.isFinite(value) ? Math.round(value).toLocaleString("en-US") : "Unknown";
}

function normalizeSpeciesSearch(pal) {
  return `${pal.title || ""} ${pal.id || ""}`.toLowerCase();
}

function markerSummary(marker, profile) {
  if (marker.category === "wild-spawn") {
    return `${marker.memberCount} anchor${marker.memberCount === 1 ? "" : "s"} · ${marker.speciesCount} species`;
  }
  if (marker.category === "quest") {
    return `${marker.questType} · ${marker.objectives.length} objective${marker.objectives.length === 1 ? "" : "s"}`;
  }
  return `Lv.${marker.level ?? "?"} · ${CATEGORY_META[marker.category].shortLabel}${profile?.element ? ` · ${profile.element}` : ""}`;
}

export default function InteractiveMap({ preset, palProfiles = {} }) {
  const viewportRef = useRef(null);
  const stageRef = useRef(null);
  const fitScaleRef = useRef(0.1);
  const dragRef = useRef(null);
  const pendingTargetRef = useRef(null);
  const viewRef = useRef(INITIAL_VIEW);
  const viewFrameRef = useRef(null);
  const [maps, setMaps] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [coverage, setCoverage] = useState(null);
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [mapId, setMapId] = useState(preset?.mapId || "main");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState(() => new Set(preset?.categories || DEFAULT_CATEGORIES));
  const [selectedId, setSelectedId] = useState(null);
  const [appliedPresetKey, setAppliedPresetKey] = useState(preset?.key);

  if (preset?.key !== appliedPresetKey) {
    setAppliedPresetKey(preset?.key);
    setMapId(preset.mapId);
    setCategories(new Set(preset.categories));
    setQuery("");
    setSelectedId(null);
  }

  const activeMap = useMemo(
    () => maps.find((map) => map.id === mapId) || maps[0] || null,
    [mapId, maps],
  );

  const mapMarkers = useMemo(
    () => markers.filter((marker) => marker.mapId === activeMap?.id),
    [activeMap?.id, markers],
  );

  const categoryCounts = useMemo(
    () =>
      mapMarkers.reduce((counts, marker) => {
        counts[marker.category] = (counts[marker.category] || 0) + 1;
        return counts;
      }, {}),
    [mapMarkers],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const visibleMarkers = useMemo(
    () =>
      mapMarkers
        .filter(
          (marker) =>
            categories.has(marker.category) &&
            matchesQuery(marker, normalizedQuery, palProfiles[marker.palHref]),
        )
        .sort((left, right) => left.name.en.localeCompare(right.name.en)),
    [categories, mapMarkers, normalizedQuery, palProfiles],
  );

  const selectedMarker = useMemo(
    () => markers.find((marker) => marker.id === selectedId) || null,
    [markers, selectedId],
  );

  const selectedProfile = selectedMarker?.palHref ? palProfiles[selectedMarker.palHref] : null;
  const selectedHabitatSpecies = useMemo(() => {
    if (selectedMarker?.category !== "wild-spawn") return [];
    if (!normalizedQuery) return selectedMarker.species;
    const matches = [];
    const remaining = [];
    for (const pal of selectedMarker.species) {
      (normalizeSpeciesSearch(pal).includes(normalizedQuery) ? matches : remaining).push(pal);
    }
    return [...matches, ...remaining];
  }, [normalizedQuery, selectedMarker]);

  const renderView = useCallback(() => {
    viewFrameRef.current = null;
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const { scale, x, y } = viewRef.current;
    stage.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    stage.style.setProperty("--marker-inverse-scale", String(1 / scale));
  }, []);

  const updateView = useCallback((nextView, immediate = false) => {
    viewRef.current = nextView;

    if (immediate) {
      if (viewFrameRef.current !== null) {
        cancelAnimationFrame(viewFrameRef.current);
        viewFrameRef.current = null;
      }
      renderView();
      return;
    }

    if (viewFrameRef.current === null) {
      viewFrameRef.current = requestAnimationFrame(renderView);
    }
  }, [renderView]);

  const fitMap = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || !activeMap) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const width = activeMap.displayWidth || activeMap.width;
    const height = activeMap.displayHeight || activeMap.height;
    const scale = Math.min((rect.width - 28) / width, (rect.height - 28) / height) * 0.96;
    fitScaleRef.current = scale;
    updateView({
      scale,
      x: (rect.width - width * scale) / 2,
      y: (rect.height - height * scale) / 2,
    }, true);
  }, [activeMap, updateView]);

  const zoomAt = useCallback((factor, clientX, clientY) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const pointX = (clientX ?? rect.left + rect.width / 2) - rect.left;
    const pointY = (clientY ?? rect.top + rect.height / 2) - rect.top;

    const current = viewRef.current;
    const nextScale = Math.min(Math.max(current.scale * factor, fitScaleRef.current * 0.82), 1.6);
    if (Math.abs(nextScale - current.scale) < 0.00001) {
      return;
    }

    const ratio = nextScale / current.scale;
    updateView({
      scale: nextScale,
      x: pointX - (pointX - current.x) * ratio,
      y: pointY - (pointY - current.y) * ratio,
    });
  }, [updateView]);

  const centerOnMarker = useCallback((marker) => {
    const viewport = viewportRef.current;
    if (!viewport || !activeMap) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const width = activeMap.displayWidth || activeMap.width;
    const height = activeMap.displayHeight || activeMap.height;
    const nextScale = Math.min(Math.max(viewRef.current.scale, fitScaleRef.current * 3.2), 1.1);
    updateView({
      scale: nextScale,
      x: rect.width / 2 - marker.map.x * width * nextScale,
      y: rect.height / 2 - marker.map.y * height * nextScale,
    });
    setSelectedId(marker.id);
  }, [activeMap, updateView]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMapData() {
      try {
        const [mapResponse, bossResponse, locationResponse] = await Promise.all([
          fetch(DATA_PATHS.maps, { signal: controller.signal }),
          fetch(DATA_PATHS.bosses, { signal: controller.signal }),
          fetch(DATA_PATHS.locations, { signal: controller.signal }),
        ]);

        if (!mapResponse.ok || !bossResponse.ok || !locationResponse.ok) {
          throw new Error(`Map data request failed (${mapResponse.status}/${bossResponse.status}/${locationResponse.status}).`);
        }

        const [mapData, bossData, locationData] = await Promise.all([
          mapResponse.json(),
          bossResponse.json(),
          locationResponse.json(),
        ]);
        if (!Array.isArray(mapData.maps) || !Array.isArray(bossData.bosses) || !Array.isArray(locationData.markers)) {
          throw new Error("Map data is not in the expected format.");
        }
        const allMarkers = [...bossData.bosses, ...locationData.markers];

        const params = new URLSearchParams(window.location.search);
        const markerId = params.get("marker");
        const palSlug = params.get("pal");
        const palMatches = palSlug
          ? allMarkers.filter((marker) => marker.palHref === `/pals/${palSlug}`)
          : [];
        const targetMarker =
          allMarkers.find((marker) => marker.id === markerId) ||
          palMatches.find((boss) => boss.mapId === "main") ||
          palMatches[0] ||
          null;

        setMaps(mapData.maps);
        setMarkers(allMarkers);
        setCoverage(locationData.coverage);
        if (targetMarker) {
          pendingTargetRef.current = targetMarker;
          setMapId(targetMarker.mapId);
          setCategories(new Set([targetMarker.category]));
          setSelectedId(targetMarker.id);
        }
        setLoadState("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          setLoadError(error.message);
          setLoadState("error");
        }
      }
    }

    loadMapData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!activeMap || loadState !== "ready") {
      return;
    }

    let targetFrame;
    const frame = requestAnimationFrame(() => {
      fitMap();
      if (pendingTargetRef.current?.mapId === activeMap.id) {
        targetFrame = requestAnimationFrame(() => {
          centerOnMarker(pendingTargetRef.current);
          pendingTargetRef.current = null;
        });
      }
    });
    const observer = new ResizeObserver(fitMap);
    if (viewportRef.current) {
      observer.observe(viewportRef.current);
    }

    return () => {
      cancelAnimationFrame(frame);
      if (targetFrame) {
        cancelAnimationFrame(targetFrame);
      }
      observer.disconnect();
    };
  }, [activeMap, centerOnMarker, fitMap, loadState]);

  useEffect(() => {
    return () => {
      if (viewFrameRef.current !== null) {
        cancelAnimationFrame(viewFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    function handleWheel(event) {
      event.preventDefault();
      const deltaMultiplier = event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? viewport.clientHeight
          : 1;
      const normalizedDelta = Math.min(Math.max(event.deltaY * deltaMultiplier, -120), 120);
      zoomAt(Math.exp(-normalizedDelta * 0.0018), event.clientX, event.clientY);
    }

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [zoomAt]);

  function selectMap(nextMapId) {
    setMapId(nextMapId);
    setQuery("");
    setSelectedId(null);
  }

  function closeMarkerDetail() {
    setSelectedId(null);
  }

  function toggleCategory(category) {
    setCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });

    if (selectedMarker?.category === category && categories.has(category)) {
      setSelectedId(null);
    }
  }

  function handlePointerDown(event) {
    if (event.target.closest("button, a, input")) {
      return;
    }

    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const nativeEvent = event.nativeEvent;
    const coalescedEvents = nativeEvent?.getCoalescedEvents?.();
    const pointer = coalescedEvents?.[coalescedEvents.length - 1] || event;
    const deltaX = pointer.clientX - drag.x;
    const deltaY = pointer.clientY - drag.y;
    dragRef.current = { ...drag, x: pointer.clientX, y: pointer.clientY };
    const current = viewRef.current;
    updateView({ ...current, x: current.x + deltaX, y: current.y + deltaY });
  }

  function handlePointerUp(event) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.classList.remove("is-dragging");
    }
  }

  function handleKeyDown(event) {
    const panStep = event.shiftKey ? 80 : 36;
    const panKeys = {
      ArrowLeft: [panStep, 0],
      ArrowRight: [-panStep, 0],
      ArrowUp: [0, panStep],
      ArrowDown: [0, -panStep],
    };

    if (panKeys[event.key]) {
      event.preventDefault();
      const [x, y] = panKeys[event.key];
      const current = viewRef.current;
      updateView({ ...current, x: current.x + x, y: current.y + y });
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomAt(1.32);
    } else if (event.key === "-") {
      event.preventDefault();
      zoomAt(1 / 1.32);
    } else if (event.key === "Home") {
      event.preventDefault();
      fitMap();
    }
  }

  const stageStyle = activeMap
    ? {
        width: activeMap.displayWidth || activeMap.width,
        height: activeMap.displayHeight || activeMap.height,
        transform: `translate3d(${INITIAL_VIEW.x}px, ${INITIAL_VIEW.y}px, 0) scale(${INITIAL_VIEW.scale})`,
        "--marker-inverse-scale": 1 / INITIAL_VIEW.scale,
      }
    : undefined;

  return (
    <section className="local-boss-map" aria-labelledby="interactive-map-title">
      <header className="local-boss-map-head">
        <div>
          <span>Game-data location atlas</span>
          <h2 id="interactive-map-title">Palworld 1.0 Interactive Map</h2>
          <p>
            Search fixed bosses, exact quest objectives, and habitat clusters built from unpacked 1.0 spawn-area anchors.
            {coverage
              ? ` The habitat layer groups ${coverage.habitatAnchors.toLocaleString("en-US")} anchors into ${coverage.habitatClusters.toLocaleString("en-US")} readable clusters.`
              : ""} Random dungeon interiors are intentionally excluded.
          </p>
        </div>
        <div className="local-boss-map-proof" aria-label="Map data status">
          <strong>{markers.length || 126}</strong>
          <span>searchable map records</span>
        </div>
      </header>

      <div className="local-boss-map-shell">
        <aside className="local-boss-map-controls" aria-label="Map layer controls">
          <div className="local-boss-map-field">
            <span>Map region</span>
            <div className="local-boss-map-tabs">
              {maps.map((map) => (
                <button
                  type="button"
                  key={map.id}
                  className={map.id === activeMap?.id ? "is-active" : ""}
                  aria-pressed={map.id === activeMap?.id}
                  onClick={() => selectMap(map.id)}
                >
                  <strong>{MAP_META[map.id]?.label || map.id}</strong>
                  <small>{markers.filter((marker) => marker.mapId === map.id).length} records</small>
                </button>
              ))}
            </div>
          </div>

          <label className="local-boss-map-search">
            <span>Find a boss, Pal habitat, or quest</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Jetragon, Anubis, or World Tree"
            />
          </label>

          <fieldset className="local-boss-map-filters">
            <legend>Game-data layers</legend>
            {ALL_CATEGORIES.map((category) => {
              const meta = CATEGORY_META[category];
              return (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={categories.has(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <i className={`map-dot is-${meta.tone}`} aria-hidden="true" />
                  <span>{meta.label}</span>
                  <b>{categoryCounts[category] || 0}</b>
                </label>
              );
            })}
          </fieldset>

          <div className="local-boss-map-count" aria-live="polite">
            <strong>{visibleMarkers.length}</strong>
            <span>visible on {MAP_META[activeMap?.id]?.label || "map"}</span>
          </div>

          <div className="local-boss-map-results" aria-label="Visible map records">
            {visibleMarkers.slice(0, 18).map((marker) => {
              const profile = palProfiles[marker.palHref];
              return (
                <button
                  type="button"
                  key={marker.id}
                  className={marker.id === selectedId ? "is-active" : ""}
                  onClick={() => centerOnMarker(marker)}
                >
                  <i className={`map-dot is-${CATEGORY_META[marker.category].tone}`} aria-hidden="true" />
                  <span>
                    <strong>{marker.name.en}</strong>
                    <small>{markerSummary(marker, profile)}</small>
                  </span>
                </button>
              );
            })}
            {visibleMarkers.length > 18 && <p>Refine the search to narrow {visibleMarkers.length - 18} more records.</p>}
            {visibleMarkers.length === 0 && <p>No map record matches these filters. Try another map or enable more layers.</p>}
          </div>
        </aside>

        <div
          ref={viewportRef}
          className="local-boss-map-viewport"
          role="application"
          aria-label={`${MAP_META[activeMap?.id]?.label || "Palworld"} game-data map`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {loadState === "loading" && <div className="local-boss-map-message">Loading local map data…</div>}
          {loadState === "error" && (
            <div className="local-boss-map-message is-error">
              <strong>The local game-data atlas could not load.</strong>
              <span>{loadError}</span>
            </div>
          )}
          {loadState === "ready" && activeMap && (
            <div ref={stageRef} className="local-boss-map-stage" style={stageStyle}>
              <Image
                key={activeMap.id}
                src={activeMap.image}
                alt={`${MAP_META[activeMap.id]?.label || activeMap.id} game map`}
                width={activeMap.displayWidth || activeMap.width}
                height={activeMap.displayHeight || activeMap.height}
                sizes="(max-width: 768px) 100vw, 900px"
                loading="eager"
                draggable={false}
                unoptimized
              />
              <div className="local-boss-marker-layer">
                {visibleMarkers.map((marker) => (
                  <button
                    type="button"
                    key={marker.id}
                    className={`local-boss-marker is-${CATEGORY_META[marker.category].tone}${marker.id === selectedId ? " is-active" : ""}`}
                    style={{
                      left: `${marker.map.x * 100}%`,
                      top: `${marker.map.y * 100}%`,
                    }}
                    aria-label={`${marker.name.en}, ${CATEGORY_META[marker.category].label}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      centerOnMarker(marker);
                    }}
                  >
                    <span aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="local-boss-map-tools" aria-label="Map zoom controls">
            <button type="button" onClick={() => zoomAt(1.32)} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => zoomAt(1 / 1.32)} aria-label="Zoom out">−</button>
            <button type="button" onClick={fitMap}>Fit map</button>
          </div>

          <div className="local-boss-map-legend" aria-hidden="true">
            Drag to pan · Wheel or buttons to zoom
          </div>

          {selectedMarker && (
            <article className="local-boss-map-detail" aria-live="polite">
              <button type="button" className="local-boss-map-detail-close" onClick={closeMarkerDetail} aria-label="Close map details">×</button>
              <span>{CATEGORY_META[selectedMarker.category].label}</span>
              <h3>{selectedMarker.name.en}</h3>
              {selectedMarker.name.zhHans && selectedMarker.name.zhHans !== selectedMarker.name.en && <p>{selectedMarker.name.zhHans}</p>}
              <dl>
                {selectedMarker.level != null && <div><dt>Level</dt><dd>Lv.{selectedMarker.level}</dd></div>}
                <div><dt>Map</dt><dd>{MAP_META[selectedMarker.mapId]?.label || selectedMarker.mapId}</dd></div>
                {selectedMarker.category === "wild-spawn" ? (
                  <>
                    <div><dt>Anchors</dt><dd>{selectedMarker.memberCount}</dd></div>
                    <div><dt>Species</dt><dd>{selectedMarker.speciesCount}</dd></div>
                  </>
                ) : (
                  <>
                    <div><dt>World X</dt><dd>{formatCoordinate(selectedMarker.world?.x)}</dd></div>
                    <div><dt>World Y</dt><dd>{formatCoordinate(selectedMarker.world?.y)}</dd></div>
                  </>
                )}
              </dl>
              <small>{selectedMarker.precision || "Fixed game-data coordinate"} · Palworld 1.0</small>
              {selectedMarker.category === "quest" && (
                <div className="local-boss-map-record-list">
                  <strong>{selectedMarker.questType}</strong>
                  {selectedMarker.objectives.slice(0, 5).map((objective) => (
                    <span key={objective.id}>{objective.label}</span>
                  ))}
                </div>
              )}
              {selectedMarker.category === "wild-spawn" && (
                <div className="local-boss-map-record-list">
                  <strong>Species recorded in this UI cluster</strong>
                  {selectedHabitatSpecies.slice(0, 8).map((pal) => (
                    pal.href
                      ? <Link href={pal.href} key={pal.id}>{pal.title} · Lv.{pal.levelMin}–{pal.levelMax}{pal.times.length ? ` · ${pal.times.join("/")}` : ""}</Link>
                      : <span key={pal.id}>{pal.title} · Lv.{pal.levelMin}–{pal.levelMax}</span>
                  ))}
                  {selectedMarker.speciesCount > 8 && <small>Search a Pal name to narrow the habitat layer.</small>}
                </div>
              )}
              {selectedProfile && (
                <div className="local-boss-map-pal-profile">
                  <Image
                    src={selectedProfile.imageUrl}
                    alt={selectedProfile.imageAlt}
                    width={72}
                    height={72}
                    sizes="56px"
                  />
                  <div>
                    <strong>{selectedProfile.element}</strong>
                    <span>
                      {selectedProfile.primaryWork
                        ? `${selectedProfile.primaryWork.type} Lv.${selectedProfile.primaryWork.level}`
                        : selectedProfile.habitat || "No base work role recorded"}
                    </span>
                    {selectedProfile.mapPointCount > 1 && (
                      <small>{selectedProfile.mapPointCount} fixed Alpha points across {selectedProfile.mapRegions.join(" and ")}</small>
                    )}
                  </div>
                </div>
              )}
              <div className="local-boss-map-related-links" aria-label="Related website pages">
                {selectedProfile && <Link href={selectedProfile.href}>Open {selectedProfile.title} guide</Link>}
                {selectedProfile?.linkedDrops.slice(0, 2).map((drop) => (
                  <Link href={drop.href} key={drop.href}>{drop.title}</Link>
                ))}
                {selectedProfile && <Link href="/breeding/calculator">Breeding planner</Link>}
                {selectedMarker.category === "human-boss" && (
                  <Link href="/guides/palworld-1-0-progression-guide">Boss preparation guide</Link>
                )}
                {selectedMarker.category === "special" && <Link href="/database/materials">Route materials</Link>}
                {selectedMarker.category === "quest" && <Link href="/guides">Quest preparation guides</Link>}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
