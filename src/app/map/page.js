import { mapHub } from "@/data/hubDetails";
import { mapBounds, mapCategories, mapGuidance, mapMarkers, mapSourceStats } from "@/data/mapMarkers";
import MapPageView from "@/page/MapPage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.map, "/map", {
  type: "article",
  publishedTime: "2026-07-13",
  modifiedTime: "2026-07-15",
});

export default function MapPage() {
  return (
    <MapPageView
      hub={mapHub}
      markers={mapMarkers}
      categories={mapCategories}
      bounds={mapBounds}
      sourceStats={mapSourceStats}
      guidance={mapGuidance}
    />
  );
}
