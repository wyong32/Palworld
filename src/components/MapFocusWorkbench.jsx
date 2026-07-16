import InteractiveMap from "@/components/InteractiveMap";

export default function MapFocusWorkbench({ categories, markers }) {
  return (
    <section className="map-workbench-stage" aria-label="Interactive Palworld map">
      <div className="map-workbench-map">
        <InteractiveMap categories={categories} markers={markers} />
      </div>
    </section>
  );
}
