import { databaseCategorySlug, getDatabaseCategoryBySlug, getDatabaseItemPath } from "@/data/database";
import { buildDatabaseSeo, enrichDatabaseItem } from "@/data/databaseGuide";
import { items } from "@/data/items";
import { pals } from "@/data/pals";
import DatabaseDetailPage from "@/page/DatabaseDetailPage";
import { buildMetadata } from "@/seo/site";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return items.map((item) => ({
    addressBar: databaseCategorySlug(item.category),
    itemAddressBar: item.addressBar,
  }));
}

export async function generateMetadata({ params }) {
  const { addressBar, itemAddressBar } = await params;
  const group = getDatabaseCategoryBySlug(items, addressBar);
  const item = group?.items.find((entry) => entry.addressBar === itemAddressBar);
  if (!item) {
    return {};
  }

  return buildMetadata(buildDatabaseSeo(item), getDatabaseItemPath(item), {
    type: "article",
    publishedTime: item.publishDate,
    modifiedTime: item.lastModified || item.updatedAt || item.lastChecked || item.publishDate,
  });
}

export default async function Page({ params }) {
  const { addressBar, itemAddressBar } = await params;
  const group = getDatabaseCategoryBySlug(items, addressBar);
  const item = group?.items.find((entry) => entry.addressBar === itemAddressBar);

  if (!item) {
    notFound();
  }

  return <DatabaseDetailPage item={enrichDatabaseItem(item, { items, pals })} categorySlug={addressBar} />;
}
