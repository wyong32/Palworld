import DatabaseCategoryExplorer from "@/components/DatabaseCategoryExplorer";
import { buildDatabaseCategoryData } from "@/data/databaseGuide";
import Link from "next/link";
import { siteConfig } from "@/seo/site";

export default function DatabaseCategoryPage({ group, items, pals }) {
  const data = buildDatabaseCategoryData(group, items, pals);
  const categoryIntent = data.guide.intent.charAt(0).toLowerCase() + data.guide.intent.slice(1);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Palworld Database - ${group.category}`,
        url: `${siteConfig.url}/database/${group.slug}`,
        description: data.guide.intent,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: data.items.length,
          itemListElement: data.items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            url: `${siteConfig.url}${item.href}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Palworld Database", item: `${siteConfig.url}/database` },
          { "@type": "ListItem", position: 3, name: group.category, item: `${siteConfig.url}/database/${group.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="listing-hero-section database-hero-section">
        <div className="container">
          <div className="listing-hero-content database-hero-content">
            <span className="wiki-kicker">Palworld Database Category</span>
            <h1>Palworld Database - {group.category}</h1>
            <p>Palworld Database - {group.category} entries help players {categoryIntent}</p>
            <div className="database-hero-actions">
              <a href="#category-list">Browse {group.category}</a>
              <a href="#category-method">How to use this list</a>
              <Link href="/database">All categories</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="database-category-method-section" id="category-method">
        <div className="container">
          <div className="database-method-panel">
            <article>
              <span className="wiki-kicker">Use Case</span>
              <h2>{data.guide.role}</h2>
              <p>{data.guide.howToUse}</p>
            </article>
            <article>
              <span className="wiki-kicker">Acquisition</span>
              <h2>How players usually route it</h2>
              <p>{data.guide.acquisition}</p>
            </article>
            <article>
              <span className="wiki-kicker">Priority</span>
              <h2>When it matters</h2>
              <p>{data.guide.priority}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="listing-grid-section" id="category-list">
        <div className="container">
          <DatabaseCategoryExplorer data={data} />
        </div>
      </section>
    </>
  );
}
