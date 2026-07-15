import { items } from "@/data/items";
import DatabasePage from "@/page/DatabasePage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.database, "/database");

export default function Page() {
  return <DatabasePage items={items} />;
}
