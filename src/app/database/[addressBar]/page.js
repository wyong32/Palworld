import { getDatabaseCategoryBySlug, getDatabaseCategoryGroups } from "@/data/database";
import { items } from "@/data/items";
import { pals } from "@/data/pals";
import DatabaseCategoryPage from "@/page/DatabaseCategoryPage";
import { buildMetadata } from "@/seo/site";
import { fitDescription } from "@/seo/tdk";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getDatabaseCategoryGroups(items).map((group) => ({ addressBar: group.slug }));
}

export async function generateMetadata({ params }) {
  const { addressBar } = await params;
  const group = getDatabaseCategoryBySlug(items, addressBar);
  if (!group) {
    return {};
  }

  return buildMetadata(
    {
      title: `Palworld Database - ${group.category} Item List Guide`,
      description: fitDescription(
        `Palworld Database ${group.category} list covers ${group.items.length} entries with item images, category context, route hints, related Pals, and player-use links for crafting and planning.`,
        "Use it before opening individual item detail pages.",
      ),
      keywords: `Palworld Database ${group.category}, Palworld ${group.category}, Palworld items, Palworld Database`,
    },
    `/database/${group.slug}`,
  );
}

export default async function Page({ params }) {
  const { addressBar } = await params;
  const group = getDatabaseCategoryBySlug(items, addressBar);

  if (!group) {
    notFound();
  }

  return <DatabaseCategoryPage group={group} items={items} pals={pals} />;
}
