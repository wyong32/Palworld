import Image from "next/image";
import Link from "next/link";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { buildDatabaseExplorerData } from "@/data/databaseGuide";
import { databaseHubTrail } from "@/seo/breadcrumbs";
import { siteConfig } from "@/seo/site";

export default function DatabasePage({ items }) {
  const breadcrumbs = databaseHubTrail();
  const data = buildDatabaseExplorerData(items);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Palworld Database - Items, Gear, Materials and Structures",
    url: `${siteConfig.url}/database`,
    description: "Browse Palworld item categories, acquisition routes, practical uses, related Pals, gear, structures, materials, weapons, and consumables.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.categories.length,
      itemListElement: data.categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: category.category,
        url: `${siteConfig.url}/database/${category.slug}`,
      })),
    },
  };
  const categoryMap = new Map(data.categories.map((category) => [category.category, category]));
  const playerLanes = [
    {
      title: "Capture and combat",
      summary: "Spheres, weapons, ammo, armor, and accessories for boss prep and dungeon routes.",
      categories: ["Spheres", "Weapons", "Ammo", "Armor", "Accessories"],
    },
    {
      title: "Base and crafting",
      summary: "Materials, structures, utility tools, Pal Gear, and schematics for production chains.",
      categories: ["Materials", "Structures", "Utility", "Pal Gear", "Schematics"],
    },
    {
      title: "Food and sustain",
      summary: "Ingredients, consumables, furniture, and catch-all items for base upkeep and field routes.",
      categories: ["Ingredients", "Consumables", "Furniture", "Items"],
    },
  ].map((lane) => ({
    ...lane,
    categories: lane.categories.map((name) => categoryMap.get(name)).filter(Boolean),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageBreadcrumbs items={breadcrumbs} />
      <section className="listing-hero-section database-hero-section">
        <div className="container">
          <div className="listing-hero-content database-hero-content">
            <span className="wiki-kicker">Palworld Item Encyclopedia</span>
            <h1>Palworld Database - Items, Gear, Materials, and Structures</h1>
            <p>
              Palworld Database starts with the category that matches your goal, then drills into item
              lists and detail pages with acquisition hints, usage steps, related Pals, crafting context,
              and connected item routes.
            </p>
            <div className="database-hero-actions">
              <a href="#database-categories">Browse categories</a>
              <a href="#database-featured">Route-critical items</a>
            </div>
          </div>
        </div>
      </section>

      <section className="database-index-section" id="database-categories">
        <div className="container">
          <div className="database-index-layout">
            <section className="database-overview-stats" aria-label="Database coverage">
              <article>
                <strong>{data.stats.total}</strong>
                <span>Item entries</span>
              </article>
              <article>
                <strong>{data.stats.categories}</strong>
                <span>Categories</span>
              </article>
              <article>
                <strong>{playerLanes.length}</strong>
                <span>Player routes</span>
              </article>
              <article>
                <strong>{data.featured.length}</strong>
                <span>Priority items</span>
              </article>
            </section>

            <div className="database-route-panel" aria-labelledby="database-route-title">
              <div>
                <span className="wiki-kicker">Choose by player goal</span>
                <h2 id="database-route-title">Open the right branch before drilling into item details.</h2>
                <p>
                  The Database starts as a category index. Pick the lane that matches your current
                  route, open its second-level item list, then use item pages for acquisition notes,
                  related Pals, acquisition routes, and practical uses.
                </p>
              </div>
              <div className="database-route-lanes">
                {playerLanes.map((lane) => (
                  <article key={lane.title}>
                    <div>
                      <strong>{lane.title}</strong>
                      <p>{lane.summary}</p>
                    </div>
                    <div>
                      {lane.categories.map((category) => (
                        <Link href={`/database/${category.slug}`} key={category.category}>
                          <span>{category.category}</span>
                          <small>{category.count}</small>
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="database-index-head">
              <div>
                <span className="wiki-kicker">Category atlas</span>
                <h2>Database Categories</h2>
                <p>{data.stats.categories} categories · {data.stats.total} entries · each card opens a second-level item list.</p>
              </div>
              <a href="#database-featured">Jump to route-critical items</a>
            </div>

            <div className="database-category-grid database-category-grid-pro database-index-grid">
              {data.categories.map((group, index) => (
                <article className="database-category-card database-category-card-pro" key={group.category}>
                  <div className="database-category-head">
                    <div>
                      <span>{group.guide.role}</span>
                      <h3>{group.category}</h3>
                    </div>
                    <strong>{group.count}</strong>
                  </div>
                  <div className="database-category-body">
                    <p>{group.guide.intent}</p>
                    <div className="database-category-samples">
                      {group.sampleItems.slice(0, 4).map((item) => (
                        <Link href={item.href} key={item.href}>
                          <Image src={item.imageUrl} alt="" width={42} height={42} sizes="42px" />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="database-category-footer">
                      <Link className="database-category-link" href={`/database/${group.slug}`}>
                        Open {group.category}
                      </Link>
                      <span className="database-category-mark">#{String(index + 1).padStart(2, "0")}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="database-featured-section" id="database-featured">
        <div className="container">
          <div className="database-featured-panel">
            <div className="database-featured-copy">
              <span className="wiki-kicker">Fast Routes</span>
              <h2>Route-critical items to check first</h2>
              <p>
                These entries connect common player workflows: capture progression, ammo stockpiles,
                armor upgrades, breeding support, Pal Gear, and material chains.
              </p>
            </div>
            <div className="database-featured-grid">
              {data.featured.map((item) => (
                <Link href={item.href} className="database-feature-card" key={item.href}>
                  <Image src={item.imageUrl} alt={`${item.title} database item`} width={96} height={72} sizes="64px" />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.category} · {item.role}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
