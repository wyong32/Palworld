import Image from "next/image";
import Link from "next/link";
import DatabaseIndexExplorer from "@/components/DatabaseIndexExplorer";
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
    name: "Palworld Database - Items, Bosses, Predators and Enemies",
    url: `${siteConfig.url}/database`,
    description: "Browse Palworld 1.0 items, crafting chains, Bosses, Predators and hostile enemy records with combat parameters, drops and exact map links where supported.",
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="database-index-page">
        <PageBreadcrumbs items={breadcrumbs} />

        <section className="database-catalog-hero">
          <div className="container">
            <div className="database-catalog-hero-grid">
              <div className="database-catalog-hero-copy">
                <span className="database-catalog-kicker">Palworld 1.0 · database records</span>
                <h1>Items, Bosses, Predators, and Enemies</h1>
                <p>
                  Start with weapons, ammo, armor and consumables, then continue into crafting chains, fixed Alpha Bosses,
                  Predator Pals and hostile human archetypes. Combat pages keep base parameters separate from route guidance.
                </p>
                <div className="database-catalog-actions">
                  <a href="#item-ledger">Search all records</a>
                  <a href="#production-categories">Browse {data.categories.length} categories <span aria-hidden="true">↓</span></a>
                </div>
              </div>

              <aside className="database-catalog-preview" aria-label="Database index sample">
                <header><span>Index sample</span><strong>{data.stats.total} records</strong></header>
                <div className="database-catalog-preview-items">
                  {data.featured.slice(0, 4).map((item, index) => (
                    <Link href={item.href} key={item.href}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <Image src={item.imageUrl} alt="" width={64} height={64} sizes="48px" />
                      <span><strong>{item.title}</strong><small>{item.category}</small></span>
                      <b aria-hidden="true">↗</b>
                    </Link>
                  ))}
                </div>
                <footer>
                  <span><strong>{data.stats.current}</strong> current indexed records</span>
                  <span><strong>{data.stats.reverseLinks.toLocaleString("en-US")}</strong> reverse links</span>
                </footer>
              </aside>
            </div>
          </div>
        </section>

        <section className="database-status-strip" aria-label="Database record status">
          <div className="container">
            <span><strong>{data.stats.current}</strong> current 1.0 records</span>
            <span><strong>{data.stats.legacyDisabled}</strong> disabled definitions</span>
            <span><strong>{data.stats.editorialOrUnmatched}</strong> editorial or unmatched records</span>
          </div>
        </section>

        <section className="database-production-section" id="production-categories">
          <div className="container">
            <header className="database-section-heading">
              <div>
                <span className="wiki-kicker">Database collections</span>
                <h2>Browse by record category</h2>
              </div>
              <p>Categories follow player priority: weapons, ammunition, armor and consumables first, then equipment, combat records, materials and base systems.</p>
            </header>

            <div className="database-production-grid">
              {data.categories.map((group, index) => (
                <article className="database-production-category" key={group.category}>
                  <div className="database-production-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="database-production-copy">
                    <h3><Link href={`/database/${group.slug}`}>{group.category}</Link><span>{group.count} entries</span></h3>
                    <p>{group.guide.intent}</p>
                  </div>
                  <dl className="database-production-facts">
                    <div><dt>Entries</dt><dd>{group.count}</dd></div>
                    <div><dt>1.0 matches</dt><dd>{group.matchedCount}</dd></div>
                    <div><dt>{group.isCreatureCategory ? "Map points" : "Recipes"}</dt><dd>{group.isCreatureCategory ? group.encounterCount : group.recipeCount}</dd></div>
                    <div><dt>{group.isCreatureCategory ? "Drops" : "Uses"}</dt><dd>{group.isCreatureCategory ? group.dropCount : group.relationCount}</dd></div>
                  </dl>
                  <div className="database-production-samples" aria-label={`${group.category} sample items`}>
                    {group.sampleItems.map((item) => (
                      <Link href={item.href} key={item.href} aria-label={item.title} title={item.title}>
                        <Image src={item.imageUrl} alt="" width={48} height={48} sizes="40px" />
                      </Link>
                    ))}
                  </div>
                  <Link href={`/database/${group.slug}`} className="database-production-open" aria-label={`Open ${group.category}`}>↗</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="database-ledger-section" id="item-ledger">
          <div className="container">
            <header className="database-section-heading">
              <div>
                <span className="wiki-kicker">Complete site index</span>
                <h2>Find an item or combat record</h2>
              </div>
              <p>Filter item production relationships or open a Boss, Predator or hostile enemy record for base parameters, drops, scenario variants and exact map links. These values are not simulated final combat results.</p>
            </header>
            <DatabaseIndexExplorer items={data.items} categories={data.categories.map((category) => category.category)} />
          </div>
        </section>

        <section className="database-method-strip">
          <div className="container">
            <div>
              <strong>How records connect</strong>
              <span>Item definition</span><b>→</b><span>Recipe chain</span><b>→</b><span>Combat definition</span><b>→</b><Link href="/map">Exact boss point</Link><b>→</b><Link href="/pals">Related Pal</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
