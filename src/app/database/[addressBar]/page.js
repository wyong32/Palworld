import { getDatabaseCategoryBySlug, getDatabaseCategoryGroups } from "@/data/database";
import { databaseRecords } from "@/data/databaseRecords";
import { pals } from "@/data/pals";
import DatabaseCategoryPage from "@/page/DatabaseCategoryPage";
import { buildMetadata } from "@/seo/site";
import { fitDescription } from "@/seo/tdk";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getDatabaseCategoryGroups(databaseRecords).map((group) => ({ addressBar: group.slug }));
}

export async function generateMetadata({ params }) {
  const { addressBar } = await params;
  const group = getDatabaseCategoryBySlug(databaseRecords, addressBar);
  if (!group) {
    return {};
  }

  const creatureCategory = ["Bosses", "Predators", "Enemies"].includes(group.category);

  return buildMetadata(
    {
      title: creatureCategory
        ? `Palworld Database - ${group.category} Stats and Records`
        : `Palworld Database - ${group.category} Item List Guide`,
      description: fitDescription(
        creatureCategory
          ? `Palworld Database ${group.category} list covers ${group.items.length} Palworld 1.0 records with combat stats, variants, drops, related Pals, and exact map links when the boss-spawner table provides them.`
          : `Palworld Database ${group.category} list covers ${group.items.length} entries with item images, category context, route hints, related Pals, and player-use links for crafting and planning.`,
        creatureCategory ? "Open an entry for combat stats, drops, and route checks." : "Use it before opening individual item detail pages.",
      ),
      keywords: `Palworld Database ${group.category}, Palworld ${group.category}, Palworld 1.0 data, Palworld Database`,
    },
    `/database/${group.slug}`,
  );
}

export default async function Page({ params }) {
  const { addressBar } = await params;
  const group = getDatabaseCategoryBySlug(databaseRecords, addressBar);

  if (!group) {
    notFound();
  }

  return <DatabaseCategoryPage group={group} items={databaseRecords} pals={pals} />;
}
