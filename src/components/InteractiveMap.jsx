"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapCategoryIcon, MapControlIcon } from "@/components/MapIcons";

const DATA_PATHS = {
  maps: "/data/palworld-map/map.json",
  bosses: "/data/palworld-map/bosses.json",
  locations: "/data/palworld-map/locations.json",
  exploration: "/data/palworld-map/exploration.json",
};

const CATEGORY_META = {
  "alpha-pal": { label: "Alpha Pals", shortLabel: "Alpha", tone: "amber" },
  "human-boss": { label: "Human bosses", shortLabel: "Human", tone: "coral" },
  special: { label: "Special regions", shortLabel: "Special", tone: "water" },
  quest: { label: "Quest objectives", shortLabel: "Quest", tone: "violet" },
  "wild-spawn": { label: "Wild habitats", shortLabel: "Habitat", tone: "leaf" },
  "fast-travel": { label: "Fast travel", shortLabel: "Travel", tone: "sky" },
  dungeon: { label: "Dungeon entrances", shortLabel: "Dungeon", tone: "slate" },
  chest: { label: "Treasure chests", shortLabel: "Chest", tone: "gold" },
  egg: { label: "Pal eggs", shortLabel: "Egg", tone: "rose" },
  effigy: { label: "Lifmunk Effigies", shortLabel: "Effigy", tone: "lime" },
  "skill-fruit": { label: "Skill Fruit trees", shortLabel: "Skill Fruit", tone: "mint" },
  note: { label: "Journal notes", shortLabel: "Note", tone: "ink" },
  resource: { label: "Resource nodes", shortLabel: "Resource", tone: "copper" },
  merchant: { label: "Merchants", shortLabel: "Merchant", tone: "orange" },
  npc: { label: "NPC locations", shortLabel: "NPC", tone: "teal" },
  "map-cluster": { label: "Nearby records", shortLabel: "Cluster", tone: "mixed" },
};

const MAP_META = {
  main: { label: "Palpagos", description: "Main world" },
  tree: { label: "World Tree", description: "Endgame region" },
};

const DEFAULT_CATEGORIES = new Set(["alpha-pal", "human-boss", "special", "fast-travel", "dungeon", "resource", "merchant"]);
const CATEGORY_GROUPS = [
  {
    key: "encounters",
    label: "Encounters",
    note: "Bosses and habitats",
    categories: ["alpha-pal", "human-boss", "special", "wild-spawn"],
  },
  {
    key: "navigation",
    label: "Navigation",
    note: "Travel and objectives",
    categories: ["fast-travel", "dungeon", "quest"],
  },
  {
    key: "collection",
    label: "Collection",
    note: "High-density finds",
    categories: ["chest", "egg", "effigy", "skill-fruit", "note"],
  },
  {
    key: "supply",
    label: "Supply & people",
    note: "Resources and services",
    categories: ["resource", "merchant", "npc"],
  },
];
const INITIAL_VIEW = { scale: 0.1, x: 0, y: 0 };
const MAX_ZOOM = 5;
const CLUSTER_CATEGORIES = new Set([
  "fast-travel",
  "dungeon",
  "quest",
  "chest",
  "egg",
  "effigy",
  "skill-fruit",
  "note",
  "resource",
  "merchant",
  "npc",
]);

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
    marker.subtype,
    marker.actorClass,
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
  if (marker.subtype) {
    return `${marker.subtype} · ${marker.precision?.startsWith("Exact") ? "Exact point" : CATEGORY_META[marker.category].shortLabel}`;
  }
  return `Lv.${marker.level ?? "?"} · ${CATEGORY_META[marker.category].shortLabel}${profile?.element ? ` · ${profile.element}` : ""}`;
}

function clusterMarkers(markers, activeMap, scale, query) {
  if (!activeMap || query) return markers;
  const width = activeMap.displayWidth || activeMap.width;
  const gridSize = Math.max(0.004, Math.min(0.11, 68 / (width * Math.max(scale, 0.01))));
  const buckets = new Map();
  const unclustered = [];

  for (const marker of markers) {
    if (!CLUSTER_CATEGORIES.has(marker.category)) {
      unclustered.push(marker);
      continue;
    }
    const key = `${Math.floor(marker.map.x / gridSize)}:${Math.floor(marker.map.y / gridSize)}`;
    const bucket = buckets.get(key) || [];
    bucket.push(marker);
    buckets.set(key, bucket);
  }

  for (const [key, members] of buckets) {
    if (members.length === 1) {
      unclustered.push(members[0]);
      continue;
    }
    const memberCategories = new Set(members.map((marker) => marker.category));
    const category = memberCategories.size === 1 ? members[0].category : "map-cluster";
    unclustered.push({
      id: `ui-cluster:${key}`,
      category,
      mapId: members[0].mapId,
      map: {
        x: members.reduce((sum, marker) => sum + marker.map.x, 0) / members.length,
        y: members.reduce((sum, marker) => sum + marker.map.y, 0) / members.length,
      },
      name: {
        en: category === "map-cluster"
          ? `${members.length} nearby map records`
          : `${members.length} ${CATEGORY_META[category].label}`,
      },
      memberCount: members.length,
      members,
      memberCategories: [...memberCategories],
      isUiCluster: true,
      precision: "Visual cluster of exact coordinates",
    });
  }

  return unclustered;
}

export default function InteractiveMap({ preset, palProfiles = {} }) {
  const viewportRef = useRef(null);
  const stageRef = useRef(null);
  const markerLayerRef = useRef(null);
  const fitScaleRef = useRef(0.1);
  const dragRef = useRef(null);
  const pendingTargetRef = useRef(null);
  const viewRef = useRef(INITIAL_VIEW);
  const viewFrameRef = useRef(null);
  const [maps, setMaps] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [coverage, setCoverage] = useState(null);
  const [renderScale, setRenderScale] = useState(INITIAL_VIEW.scale);
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [mapId, setMapId] = useState(preset?.mapId || "main");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState(() => new Set(preset?.categories || DEFAULT_CATEGORIES));
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [appliedPresetKey, setAppliedPresetKey] = useState(preset?.key);

  if (preset?.key !== appliedPresetKey) {
    setAppliedPresetKey(preset?.key);
    setMapId(preset.mapId);
    setCategories(new Set(preset.categories));
    setQuery("");
    setSelectedId(null);
    setSelectedCluster(null);
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

  const renderedMarkers = useMemo(() => {
    const clusteredMarkers = clusterMarkers(visibleMarkers, activeMap, renderScale, normalizedQuery);
    const focusedIds = selectedCluster
      ? new Set(selectedCluster.members.map((member) => member.id))
      : selectedId
        ? new Set([selectedId])
        : null;

    if (!focusedIds) {
      return clusteredMarkers;
    }

    return clusteredMarkers.flatMap((marker) => {
      if (!marker.isUiCluster || !marker.members.some((member) => focusedIds.has(member.id))) {
        return marker;
      }

      return marker.members;
    });
  }, [activeMap, normalizedQuery, renderScale, selectedCluster, selectedId, visibleMarkers]);

  const selectedMarker = useMemo(
    () => markers.find((marker) => marker.id === selectedId) || null,
    [markers, selectedId],
  );

  const selectedDetail = selectedCluster || selectedMarker;
  const selectedProfile = selectedDetail?.palHref ? palProfiles[selectedDetail.palHref] : null;
  const selectedHabitatSpecies = useMemo(() => {
    if (selectedDetail?.category !== "wild-spawn") return [];
    if (!normalizedQuery) return selectedDetail.species;
    const matches = [];
    const remaining = [];
    for (const pal of selectedDetail.species) {
      (normalizeSpeciesSearch(pal).includes(normalizedQuery) ? matches : remaining).push(pal);
    }
    return [...matches, ...remaining];
  }, [normalizedQuery, selectedDetail]);

  const renderView = useCallback(() => {
    viewFrameRef.current = null;
    const stage = stageRef.current;
    const markerLayer = markerLayerRef.current;
    if (!stage || !markerLayer) {
      return;
    }

    const { scale, x, y } = viewRef.current;
    const transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    stage.style.transform = transform;
    markerLayer.style.transform = transform;
    markerLayer.style.setProperty("--marker-inverse-scale", String(1 / scale));
  }, []);

  const updateView = useCallback((nextView, immediate = false) => {
    viewRef.current = nextView;
    setRenderScale((current) => Math.abs(current - nextView.scale) / Math.max(current, 0.01) > 0.12 ? nextView.scale : current);

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
    const nextScale = Math.min(Math.max(current.scale * factor, fitScaleRef.current * 0.82), MAX_ZOOM);
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
    setSelectedCluster(null);
    setSelectedId(marker.id);
  }, [activeMap, updateView]);

  const zoomIntoCluster = useCallback((cluster) => {
    const viewport = viewportRef.current;
    if (!viewport || !activeMap) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const width = activeMap.displayWidth || activeMap.width;
    const height = activeMap.displayHeight || activeMap.height;
    const nextScale = Math.min(
      Math.max(viewRef.current.scale * 2.2, fitScaleRef.current * 4.4),
      MAX_ZOOM,
    );
    updateView({
      scale: nextScale,
      x: rect.width / 2 - cluster.map.x * width * nextScale,
      y: rect.height / 2 - cluster.map.y * height * nextScale,
    });
    setSelectedCluster(cluster);
    setSelectedId(null);
  }, [activeMap, updateView]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMapData() {
      try {
        const [mapResponse, bossResponse, locationResponse, explorationResponse] = await Promise.all([
          fetch(DATA_PATHS.maps, { signal: controller.signal }),
          fetch(DATA_PATHS.bosses, { signal: controller.signal }),
          fetch(DATA_PATHS.locations, { signal: controller.signal }),
          fetch(DATA_PATHS.exploration, { signal: controller.signal }),
        ]);

        if (!mapResponse.ok || !bossResponse.ok || !locationResponse.ok || !explorationResponse.ok) {
          throw new Error(`Map data request failed (${mapResponse.status}/${bossResponse.status}/${locationResponse.status}/${explorationResponse.status}).`);
        }

        const [mapData, bossData, locationData, explorationData] = await Promise.all([
          mapResponse.json(),
          bossResponse.json(),
          locationResponse.json(),
          explorationResponse.json(),
        ]);
        if (!Array.isArray(mapData.maps) || !Array.isArray(bossData.bosses) || !Array.isArray(locationData.markers) || !Array.isArray(explorationData.markers)) {
          throw new Error("Map data is not in the expected format.");
        }
        const allMarkers = [...bossData.bosses, ...locationData.markers, ...explorationData.markers];

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
        setCoverage({ ...locationData.coverage, ...explorationData.coverage });
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
    setSelectedCluster(null);
  }

  function closeMarkerDetail() {
    setSelectedId(null);
    setSelectedCluster(null);
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
    setSelectedCluster(null);
  }

  function showCoreLayers() {
    setCategories(new Set(DEFAULT_CATEGORIES));
    setSelectedId(null);
    setSelectedCluster(null);
  }

  function clearLayers() {
    setCategories(new Set());
    setSelectedId(null);
    setSelectedCluster(null);
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
          <span>01 / INTERACTIVE FIELD ATLAS</span>
          <h2 id="interactive-map-title">Palworld 1.0 Interactive Map</h2>
          <p>Exact locations, fixed encounters, and clearly labeled habitat clusters across both 1.0 world projections.</p>
        </div>
        <div className="local-boss-map-proof" aria-label="Map data status">
          <small>{coverage ? "MAP LAYERS READY" : "PREPARING LAYERS"}</small>
          <strong>{(markers.length || 126).toLocaleString("en-US")}</strong>
          <span>searchable records</span>
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
            <span>Search this projection</span>
            <div>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedCluster(null);
                }}
                placeholder="Pal, dungeon, coal, egg…"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedCluster(null);
                  }}
                  aria-label="Clear map search"
                >
                  <MapControlIcon name="close" />
                </button>
              )}
            </div>
          </label>

          <fieldset className="local-boss-map-filters">
            <legend>Map layers</legend>
            <div className="local-boss-map-filter-actions">
              <button type="button" onClick={showCoreLayers}>Core layers</button>
              <button type="button" onClick={clearLayers}>Clear all</button>
            </div>
            {CATEGORY_GROUPS.map((group) => (
              <div className="local-boss-map-filter-group" key={group.key}>
                <header><strong>{group.label}</strong><small>{group.note}</small></header>
                <div>
                  {group.categories.map((category) => {
                    const meta = CATEGORY_META[category];
                    const count = categoryCounts[category] || 0;
                    return (
                      <label key={category}>
                        <input
                          type="checkbox"
                          checked={categories.has(category)}
                          disabled={count === 0}
                          onChange={() => toggleCategory(category)}
                        />
                        <span className={`map-layer-icon is-${meta.tone}`} aria-hidden="true">
                          <MapCategoryIcon category={category} />
                        </span>
                        <span>{meta.label}</span>
                        <b>{count.toLocaleString("en-US")}</b>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </fieldset>

          <div className="local-boss-map-count" aria-live="polite">
            <strong>{visibleMarkers.length.toLocaleString("en-US")}</strong>
            <span>visible on {MAP_META[activeMap?.id]?.label || "map"}</span>
          </div>

          <details className="local-boss-map-results-panel" open={Boolean(query)}>
            <summary>Browse visible records <span>{Math.min(visibleMarkers.length, 18)} / {visibleMarkers.length.toLocaleString("en-US")}</span></summary>
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
                    <span className={`map-layer-icon is-${CATEGORY_META[marker.category].tone}`} aria-hidden="true">
                      <MapCategoryIcon category={marker.category} />
                    </span>
                    <span>
                      <strong>{marker.name.en}</strong>
                      <small>{markerSummary(marker, profile)}</small>
                    </span>
                  </button>
                );
              })}
              {visibleMarkers.length > 18 && <p>Search to narrow {visibleMarkers.length - 18} more records.</p>}
              {visibleMarkers.length === 0 && <p>No record matches. Try another map or enable more layers.</p>}
            </div>
          </details>
        </aside>

        <div
          ref={viewportRef}
          className="local-boss-map-viewport"
          role="application"
          aria-label={`${MAP_META[activeMap?.id]?.label || "Palworld"} interactive map`}
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
              <strong>The interactive atlas could not load.</strong>
              <span>{loadError}</span>
            </div>
          )}
          {loadState === "ready" && activeMap && (
            <>
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
              </div>
              <div ref={markerLayerRef} className="local-boss-marker-layer" style={stageStyle}>
                {renderedMarkers.map((marker) => {
                  const markerMeta = CATEGORY_META[marker.category];
                  const profile = palProfiles[marker.palHref];
                  const isSelected = marker.id === selectedId || marker.id === selectedCluster?.id;
                  const tooltipText = marker.isUiCluster
                    ? "Zoom in to separate these UI-grouped records"
                    : markerSummary(marker, profile);

                  return (
                    <button
                      type="button"
                      key={marker.id}
                      className={`local-boss-marker is-${markerMeta.tone}${marker.isUiCluster ? " is-cluster" : ""}${isSelected ? " is-active" : ""}`}
                      style={{
                        left: `${marker.map.x * 100}%`,
                        top: `${marker.map.y * 100}%`,
                      }}
                      aria-label={marker.isUiCluster
                        ? `${marker.name.en}. Zoom in and expand every record in this visual cluster.`
                        : `${marker.name.en}, ${markerMeta.label}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (marker.isUiCluster) {
                          zoomIntoCluster(marker);
                        } else {
                          centerOnMarker(marker);
                        }
                      }}
                    >
                      <span className="local-boss-marker-shape" aria-hidden="true" />
                      <span className="local-boss-marker-glyph" aria-hidden="true">
                        <MapCategoryIcon category={marker.category} />
                      </span>
                      {marker.isUiCluster && (
                        <span className="local-boss-marker-count" aria-hidden="true">
                          {marker.memberCount > 99 ? "99+" : marker.memberCount}
                        </span>
                      )}
                      <span className="local-boss-marker-tooltip" aria-hidden="true">
                        <strong>{marker.name.en}</strong>
                        <small>{tooltipText}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="local-boss-map-density" aria-live="polite">
            <strong>{renderedMarkers.length.toLocaleString("en-US")}</strong>
            <span>map symbols</span>
            <small>{visibleMarkers.length.toLocaleString("en-US")} records in active layers</small>
          </div>

          <div className="local-boss-map-tools" aria-label="Map zoom controls">
            <button type="button" onClick={() => zoomAt(1.32)} aria-label="Zoom in">
              <MapControlIcon name="plus" />
            </button>
            <button type="button" onClick={() => zoomAt(1 / 1.32)} aria-label="Zoom out">
              <MapControlIcon name="minus" />
            </button>
            <button type="button" className="is-fit" onClick={fitMap}>
              <MapControlIcon name="fit" />
              <span>Fit map</span>
            </button>
          </div>

          <div className="local-boss-map-legend" aria-label="Map symbol key">
            <span>
              <i className="is-exact" aria-hidden="true"><MapCategoryIcon category="alpha-pal" /></i>
              Exact point
            </span>
            <span>
              <i className="is-cluster" aria-hidden="true"><MapCategoryIcon category="map-cluster" /></i>
              Nearby records
            </span>
            <small>Drag to pan · Select a cluster to zoom and expand</small>
          </div>

          {selectedDetail && (
            <article className={`local-boss-map-detail${selectedDetail.isUiCluster ? " is-cluster-detail" : ""}`} aria-live="polite">
              <button type="button" className="local-boss-map-detail-close" onClick={closeMarkerDetail} aria-label="Close map details">
                <MapControlIcon name="close" />
              </button>
              <span>{CATEGORY_META[selectedDetail.category].label}</span>
              <h3>{selectedDetail.name.en}</h3>
              {selectedDetail.name.zhHans && selectedDetail.name.zhHans !== selectedDetail.name.en && <p>{selectedDetail.name.zhHans}</p>}
              <dl>
                {selectedDetail.level != null && <div><dt>Level</dt><dd>Lv.{selectedDetail.level}</dd></div>}
                <div><dt>Map</dt><dd>{MAP_META[selectedDetail.mapId]?.label || selectedDetail.mapId}</dd></div>
                {selectedDetail.isUiCluster ? (
                  <>
                    <div><dt>Records</dt><dd>{selectedDetail.memberCount}</dd></div>
                    <div><dt>Types</dt><dd>{selectedDetail.memberCategories.length}</dd></div>
                  </>
                ) : selectedDetail.category === "wild-spawn" ? (
                  <>
                    <div><dt>Anchors</dt><dd>{selectedDetail.memberCount}</dd></div>
                    <div><dt>Species</dt><dd>{selectedDetail.speciesCount}</dd></div>
                  </>
                ) : (
                  <>
                    <div><dt>World X</dt><dd>{formatCoordinate(selectedDetail.world?.x)}</dd></div>
                    <div><dt>World Y</dt><dd>{formatCoordinate(selectedDetail.world?.y)}</dd></div>
                    {selectedDetail.world?.z != null && <div><dt>World Z</dt><dd>{formatCoordinate(selectedDetail.world.z)}</dd></div>}
                  </>
                )}
              </dl>
              <small>{selectedDetail.precision || "Fixed map coordinate"} · Palworld 1.0</small>
              {selectedDetail.isUiCluster && (
                <div className="local-boss-map-record-list is-cluster-records">
                  <strong>All {selectedDetail.memberCount} records in this visual cluster</strong>
                  <small>Select any record to center it and open its individual details.</small>
                  {selectedDetail.members.map((member) => (
                    <button type="button" key={member.id} onClick={() => centerOnMarker(member)}>
                      <span>{member.name.en}</span>
                      <small>
                        {CATEGORY_META[member.category].shortLabel} · X {formatCoordinate(member.world?.x)} · Y {formatCoordinate(member.world?.y)}
                      </small>
                    </button>
                  ))}
                </div>
              )}
              {selectedDetail.category === "quest" && !selectedDetail.isUiCluster && (
                <div className="local-boss-map-record-list">
                  <strong>{selectedDetail.questType}</strong>
                  {selectedDetail.objectives.slice(0, 5).map((objective) => (
                    <span key={objective.id}>{objective.label}</span>
                  ))}
                </div>
              )}
              {selectedDetail.category === "wild-spawn" && (
                <div className="local-boss-map-record-list">
                  <strong>Species recorded in this UI cluster</strong>
                  {selectedHabitatSpecies.slice(0, 8).map((pal) => (
                    pal.href
                      ? <Link href={pal.href} key={pal.id}>{pal.title} · Lv.{pal.levelMin}–{pal.levelMax}{pal.times.length ? ` · ${pal.times.join("/")}` : ""}</Link>
                      : <span key={pal.id}>{pal.title} · Lv.{pal.levelMin}–{pal.levelMax}</span>
                  ))}
                  {selectedDetail.speciesCount > 8 && <small>Search a Pal name to narrow the habitat layer.</small>}
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
                {selectedDetail.category === "human-boss" && !selectedDetail.isUiCluster && (
                  <Link href="/guides/palworld-1-0-progression-guide">Boss preparation guide</Link>
                )}
                {selectedDetail.category === "special" && !selectedDetail.isUiCluster && <Link href="/database/materials">Route materials</Link>}
                {selectedDetail.category === "quest" && !selectedDetail.isUiCluster && <Link href="/guides">Quest preparation guides</Link>}
                {selectedDetail.category === "resource" && !selectedDetail.isUiCluster && (
                  <Link href={`/database/materials/${({ Ore: "ore", Coal: "coal", Sulfur: "sulfur", "Pure Quartz": "pure-quartz", "Nightstar Sand": "nightstar-sand", "Crude Oil": "crude-oil" })[selectedDetail.subtype] || ""}`.replace(/\/$/, "")}>Open material data</Link>
                )}
                {selectedDetail.category === "dungeon" && !selectedDetail.isUiCluster && <Link href="/guides">Dungeon preparation guides</Link>}
                {selectedDetail.category === "fast-travel" && !selectedDetail.isUiCluster && <Link href="/guides/palworld-1-0-progression-guide">Progression route</Link>}
                {["chest", "egg", "effigy", "skill-fruit", "note"].includes(selectedDetail.category) && !selectedDetail.isUiCluster && <Link href="/database">Browse the database</Link>}
                {["merchant", "npc"].includes(selectedDetail.category) && !selectedDetail.isUiCluster && <Link href="/database/creatures">Browse characters</Link>}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
