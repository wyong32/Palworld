import UpdatesPageView from "@/page/UpdatesPage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.updates, "/updates", {
  type: "article",
  publishedTime: "2026-07-13",
  modifiedTime: "2026-07-15",
});

export default function UpdatesPage() {
  return <UpdatesPageView />;
}
