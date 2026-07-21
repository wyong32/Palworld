import { mapHub } from "@/data/hubDetails";
import { items } from "@/data/items";
import { mapCategories, mapGuidance, mapMarkers, mapSourceStats } from "@/data/mapMarkers";
import { buildMapPalProfiles } from "@/data/palGuide";
import { pals } from "@/data/pals";
import MapPageView from "@/page/MapPage";
import { buildMetadata, pageSeo } from "@/seo/site";
import bossMapData from "../../../public/data/palworld-map/bosses.json";
import explorationMapSummary from "../../../public/data/palworld-map/exploration-summary.json";
import locationMapData from "../../../public/data/palworld-map/locations.json";

export const metadata = buildMetadata(pageSeo.map, "/map", {
  type: "article",
  publishedTime: "2026-07-13",
  modifiedTime: "2026-07-21",
});

export default function MapPage() {
  const explorationStats = [
    { label: "Palpagos fast travel", value: explorationMapSummary.mapCoverage.main["fast-travel"]?.toLocaleString("en-US") || "0" },
    { label: "Current dungeon entrances", value: explorationMapSummary.mapCoverage.main.dungeon?.toLocaleString("en-US") || "0" },
    { label: "Palpagos treasure chests", value: explorationMapSummary.mapCoverage.main.chest?.toLocaleString("en-US") || "0" },
    { label: "Palpagos Pal eggs", value: explorationMapSummary.mapCoverage.main.egg?.toLocaleString("en-US") || "0" },
  ];
  const mapRecordCount = bossMapData.bosses.length + locationMapData.markers.length + explorationMapSummary.markerCount;

  return (
    <MapPageView
      hub={mapHub}
      markers={mapMarkers}
      categories={mapCategories}
      sourceStats={[...explorationStats, ...mapSourceStats]}
      mapRecordCount={mapRecordCount}
      guidance={mapGuidance}
      palProfiles={buildMapPalProfiles(pals, items)}
    />
  );
}
