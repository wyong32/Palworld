"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPinned,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";

const mapgenieEmbedUrl = "https://mapgenie.io/palworld/maps/palpagos-islands";
const loadingFallbackMs = 3200;

export default function InteractiveMap() {
  const shellRef = useRef(null);
  const [frameVersion, setFrameVersion] = useState(0);
  const [loadState, setLoadState] = useState("loading");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === shellRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setLoadState("ready");
    }, loadingFallbackMs);

    return () => window.clearTimeout(fallbackTimer);
  }, [frameVersion]);

  function reloadMap() {
    setLoadState("loading");
    setFrameVersion((version) => version + 1);
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement === shellRef.current) {
      await document.exitFullscreen();
      return;
    }

    await shellRef.current?.requestFullscreen();
  }

  function handleFrameLoad() {
    window.setTimeout(() => setLoadState("ready"), 250);
  }

  return (
    <section ref={shellRef} className="pal-map-embed-tool" aria-labelledby="interactive-map-title">
      <h2 id="interactive-map-title" className="sr-only">
        Palpagos Islands Interactive Map
      </h2>

      <div className="pal-map-toolbar" aria-label="Interactive map utilities">
        <div className="pal-map-toolbar-intro">
          <MapPinned aria-hidden="true" />
          <div>
            <strong>Palpagos map controls</strong>
            <span>{loadState === "loading" ? "Preparing the map canvas..." : "Use the left map sidebar to control visible markers"}</span>
          </div>
        </div>

        <div className="pal-map-toolbar-actions">
          <button type="button" title="Reload interactive map" onClick={reloadMap}>
            <RefreshCw aria-hidden="true" />
            <span>Reload</span>
          </button>
          <button type="button" title={isFullscreen ? "Exit full screen" : "Open full screen"} onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
            <span>{isFullscreen ? "Exit" : "Full screen"}</span>
          </button>
        </div>
      </div>

      <div className="pal-map-embed-frame">
        <iframe
          key={frameVersion}
          title="Palworld Palpagos Islands interactive map"
          src={mapgenieEmbedUrl}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="fullscreen"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          onLoad={handleFrameLoad}
        />

        {loadState === "loading" ? (
          <div className="pal-map-loading" role="status">
            <RefreshCw aria-hidden="true" />
            <span>Loading Palpagos map...</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
