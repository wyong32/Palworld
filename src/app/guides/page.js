import { guides } from "@/data/guides";
import GuidesPage from "@/page/GuidesPage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.guides, "/guides");

export default function Page() {
  return <GuidesPage guides={guides} />;
}
