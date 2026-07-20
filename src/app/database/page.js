import { databaseRecords } from "@/data/databaseRecords";
import DatabasePage from "@/page/DatabasePage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.database, "/database");

export default function Page() {
  return <DatabasePage items={databaseRecords} />;
}
