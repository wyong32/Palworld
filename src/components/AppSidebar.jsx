import Link from "next/link";
import { databaseCategorySlug, getDatabaseCategoryGroups } from "@/data/database";
import { guides } from "@/data/guides";
import { items } from "@/data/items";
import { pals } from "@/data/pals";

function numberLabel(value) {
  return value.toLocaleString("en-US");
}

export default function AppSidebar() {
  const databaseCategories = getDatabaseCategoryGroups(items);
  const topDatabaseCategories = [...databaseCategories]
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 3);

  const coverageItems = [
    { value: pals.length, label: "Pal entries", href: "/pals" },
    { value: items.length, label: "Item entries", href: "/database" },
    { value: databaseCategories.length, label: "Categories", href: "/database" },
    { value: guides.length, label: "Guides", href: "/guides" },
  ];

  const topicGroups = [
    {
      title: "Pals",
      links: [
        { href: "/pals", label: "Paldeck", meta: numberLabel(pals.length), desc: "Every Pal entry, image, element, skill, and drop." },
        { href: "/pals#work-filters", label: "Base Workers", meta: "Work", desc: "Compare work suitability and production roles." },
        { href: "/pals#pal-results", label: "Combat & Mounts", meta: "Team", desc: "Find fighters, flying mounts, and travel options." },
      ],
    },
    {
      title: "Database",
      links: [
        { href: "/database", label: "Item Database", meta: numberLabel(items.length), desc: "Browse item categories, images, uses, and related Pals." },
        ...topDatabaseCategories.map((category) => ({
          href: `/database/${databaseCategorySlug(category.category)}`,
          label: category.category,
          meta: numberLabel(category.items.length),
          desc: `${category.items.length} entries for crafting and route planning.`,
        })),
      ],
    },
    {
      title: "Field Tools",
      links: [
        { href: "/breeding", label: "Breeding", meta: "1.0", desc: "Parent pairs, Cake, eggs, passives, and Mutation." },
        { href: "/map", label: "Interactive Map", meta: "Map", desc: "Pals, bosses, dungeons, resources, and base spots." },
        { href: "/guides", label: "Player Guides", meta: numberLabel(guides.length), desc: "Progression and World Tree preparation." },
        { href: "/updates", label: "Updates", meta: "1.0", desc: "Current changes that affect your save and routes." },
      ],
    },
  ];

  return (
    <aside className="site-sidebar" aria-label="Palworld Wiki player index">
      <div className="site-sidebar-card">
        <div className="site-sidebar-heading">
          <span>Field Index</span>
          <strong>Find your next Palworld answer</strong>
          <p>
            Look up a Pal, solve a base job, find an item, or plan the next route.
          </p>
        </div>

        <section className="site-sidebar-coverage" aria-label="Current wiki coverage">
          {coverageItems.map((item) => (
            <Link href={item.href} key={item.label}>
              <strong>{item.value.toLocaleString("en-US")}</strong>
              <span>{item.label}</span>
            </Link>
          ))}
        </section>

        <nav className="site-sidebar-nav" aria-label="Palworld topic navigation">
          {topicGroups.map((group) => (
            <section className="site-sidebar-group" key={group.title}>
              <h2>{group.title}</h2>
              <div>
                {group.links.map((item) => (
                  <Link href={item.href} key={`${group.title}-${item.label}`}>
                    <span>
                      <strong>{item.label}</strong>
                      <em>{item.desc}</em>
                    </span>
                    <small>{item.meta}</small>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </div>
    </aside>
  );
}
