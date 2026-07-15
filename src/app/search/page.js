import SearchPageView from "@/page/SearchPage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.search, "/search", { index: false });

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params?.q) ? params.q[0] : params?.q;
  const query = String(rawQuery || "").trim();

  return <SearchPageView query={query} />;
}
