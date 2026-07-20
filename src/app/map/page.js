import { mapHub } from "@/data/hubDetails";
import { items } from "@/data/items";
import { mapCategories, mapGuidance, mapMarkers, mapSourceStats } from "@/data/mapMarkers";
import { buildMapPalProfiles } from "@/data/palGuide";
import { pals } from "@/data/pals";
import MapPageView from "@/page/MapPage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.map, "/map", {
  type: "article",
  publishedTime: "2026-07-13",
  modifiedTime: "2026-07-20",
});

export default function MapPage() {
  return (
    <MapPageView
      hub={mapHub}
      markers={mapMarkers}
      categories={mapCategories}
      sourceStats={mapSourceStats}
      guidance={mapGuidance}
      palProfiles={buildMapPalProfiles(pals, items)}
    />
  );
}
