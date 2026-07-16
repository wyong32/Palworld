const mapgenieEmbedUrl = "https://mapgenie.io/palworld/maps/palpagos-islands?embed=light";

export default function InteractiveMap() {
  return (
    <section className="pal-map-embed-tool" aria-labelledby="interactive-map-title">
      <div className="pal-map-embed-head">
        <div>
          <span>Interactive Map</span>
          <h2 id="interactive-map-title">Palpagos Islands Interactive Map</h2>
        </div>
        <p>
          Search, filter, and inspect map markers, then use the route notes below to prepare captures,
          boss fights, material runs, and new bases.
        </p>
      </div>

      <div className="pal-map-embed-frame">
        <iframe
          title="Palworld Palpagos Islands interactive map"
          src={mapgenieEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen"
        />
      </div>
    </section>
  );
}
