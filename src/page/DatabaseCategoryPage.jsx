import Link from "next/link";
import DatabaseCategoryExplorer from "@/components/DatabaseCategoryExplorer";
import GptAdSlot from "@/components/GptAdSlot";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { getDatabaseCategoryGroups } from "@/data/database";
import { buildDatabaseCategoryData } from "@/data/databaseGuide";
import { buildBreadcrumbJsonLd, databaseCategoryTrail } from "@/seo/breadcrumbs";
import { siteConfig } from "@/seo/site";

export default function DatabaseCategoryPage({ group, items, pals }) {
  const data = buildDatabaseCategoryData(group, items, pals);
  const categoryLinks = getDatabaseCategoryGroups(items);
  const breadcrumbs = databaseCategoryTrail(group);
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
      buildBreadcrumbJsonLd(breadcrumbs),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageBreadcrumbs items={breadcrumbs} />

      <section className="database-category-ledger-hero">
        <div className="container">
          <div className="database-category-ledger-grid">
            <div>
              <span className="wiki-kicker">Database category</span>
              <h1>{group.category}</h1>
              <p>{data.guide.intent} {data.isCreatureCategory ? "Every entry below represents a current Palworld 1.0 combat record." : "The list below separates current records from legacy, disabled, or broader category entries."}</p>
              <div className="database-hero-actions">
                <a href="#category-ledger">Open {group.category} list</a>
                <Link href="/database">Database index</Link>
              </div>
            </div>
            <dl className="database-ledger-proof">
              <div><dt>Entries</dt><dd>{data.stats.total}</dd></div>
              <div><dt>Matched records</dt><dd>{data.stats.matched}</dd></div>
              <div><dt>{data.isCreatureCategory ? "With drops" : "With recipes"}</dt><dd>{data.isCreatureCategory ? data.stats.withDrops : data.stats.craftable}</dd></div>
              <div><dt>{data.isCreatureCategory ? "Exact map points" : "Used by others"}</dt><dd>{data.isCreatureCategory ? data.stats.mapped : data.stats.usedIn}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* GPT 广告：banner_1 */}
      <GptAdSlot elementId="div-gpt-ad-database-category-1" unit={1} />

      <nav className="database-category-rail" aria-label="Database categories">
        <div className="container">
          {categoryLinks.map((category) => (
            <Link className={category.slug === group.slug ? "is-active" : ""} href={`/database/${category.slug}`} key={category.slug} aria-current={category.slug === group.slug ? "page" : undefined}>
              {category.category}<span>{category.items.length}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* GPT 广告：banner_2 */}
      <GptAdSlot elementId="div-gpt-ad-database-category-2" unit={2} />

      <section className="database-category-ledger-section" id="category-ledger">
        <div className="container">
          <DatabaseCategoryExplorer data={data} />
        </div>
      </section>
      {/* GPT 广告：banner_3 */}
      <GptAdSlot elementId="div-gpt-ad-database-category-3" unit={3} />
    </>
  );
}
