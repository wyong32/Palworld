import Image from "next/image";
import Link from "next/link";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { buildBreadcrumbJsonLd, databaseItemTrail } from "@/seo/breadcrumbs";
import { siteConfig } from "@/seo/site";

function FactRow({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function DatabaseDetailPage({ item, categorySlug }) {
  const url = `${siteConfig.url}/database/${categorySlug}/${item.addressBar}`;
  const breadcrumbs = databaseItemTrail(item, categorySlug);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `Palworld Database - ${item.title} Guide`,
        description: item.guideSummary,
        datePublished: item.publishDate,
        dateModified: item.lastChecked || item.publishDate,
        about: ["Palworld", item.title, item.category, "Palworld Database"],
        url,
        mainEntityOfPage: url,
        image: `${siteConfig.url}${item.imageUrl}`,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      buildBreadcrumbJsonLd(breadcrumbs),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageBreadcrumbs items={breadcrumbs} />
      <section className="detail-hero-section database-detail-hero-section">
        <div className="container">
          <div className="detail-hero-content database-detail-hero-content">
            <div className="detail-hero-copy">
              <span className="wiki-kicker">Palworld Database Item</span>
              <h1>Palworld Database - {item.title} Guide</h1>
              <p>{item.guideSummary}</p>
              <div className="database-chip-row">
                <span>{item.category}</span>
                <span>{item.role}</span>
                {item.relatedPals.length > 0 && <span>{item.relatedPals.length} linked Pals</span>}
                {item.relatedItems.length > 0 && <span>{item.relatedItems.length} related items</span>}
              </div>
            </div>
            <div className="detail-hero-image database-detail-hero-image">
              <Image
                src={item.imageUrl}
                alt={item.imageAlt}
                width={760}
                height={570}
                preload
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 42vw, 360px"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="detail-body-section">
        <div className="container">
          <div className="detail-body-content">
            <article className="detail-article database-detail-article">
              <nav className="pal-detail-toc" aria-label={`${item.title} database guide sections`}>
                <a href="#how-to-use">How to use</a>
                <a href="#how-to-get">How to get</a>
                <a href="#pal-links">Pal links</a>
                <a href="#related-items">Related items</a>
              </nav>

              <section className="pal-detail-section" id="how-to-use">
                <span className="wiki-kicker">Player Use</span>
                <h2>Palworld Database - how to use {item.title}</h2>
                <p>{item.guide.howToUse}</p>
                <div className="database-step-list">
                  {item.usageSteps.map((step, index) => (
                    <div key={step}>
                      <strong>{String(index + 1).padStart(2, "0")}</strong>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="pal-detail-section" id="how-to-get">
                <span className="wiki-kicker">Acquisition Route</span>
                <h2>How to get {item.title}</h2>
                <p>{item.guide.acquisition}</p>
                <div className="database-hint-grid">
                  {item.acquisitionHints.map((hint) => (
                    <article key={hint}>
                      <strong>Route hint</strong>
                      <span>{hint}</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="pal-detail-section" id="pal-links">
                <span className="wiki-kicker">Pal Connections</span>
                <h2>Related Pals</h2>
                <p>
                  These Pals can connect through listed drops, Pal Gear requirements, or matching Pal Gear
                  names. Use them to move from item planning into capture, breeding, or base work.
                </p>
                {item.relatedPals.length > 0 ? (
                  <div className="pal-related-grid">
                    {item.relatedPals.map((pal) => (
                      <Link href={pal.href} className="pal-related-card" key={pal.href}>
                        <Image src={pal.imageUrl} alt={`${pal.title} Palworld icon`} width={92} height={92} sizes="72px" />
                        <span>
                          <strong>{pal.title}</strong>
                          <small>{pal.element} · {pal.reasons.join(", ")}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No Pal drop or Pal Gear connection is currently listed for this item.</p>
                )}
              </section>

              <section className="pal-detail-section" id="related-items">
                <span className="wiki-kicker">Database Routing</span>
                <h2>Related Database items</h2>
                <p>
                  Compare entries from the same category or neighboring equipment and material groups when
                  the next craft, upgrade, or farming route is not obvious.
                </p>
                {item.relatedItems.length > 0 ? (
                  <div className="pal-drop-grid">
                    {item.relatedItems.map((related) => (
                      <Link href={related.href} className="pal-drop-card" key={related.href}>
                        <Image src={related.imageUrl} alt={`${related.title} database item`} width={96} height={72} sizes="64px" />
                        <span>
                          <strong>{related.title}</strong>
                          <small>{related.category}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No closely connected item is listed yet. Return to {item.category} to compare entries with the same player role.</p>
                )}
              </section>

            </article>

            <aside className="detail-side-panel database-detail-side-panel">
              <h2>Item Facts</h2>
              <dl className="detail-fact-list">
                <FactRow label="Primary Category" value={item.category} />
                <FactRow label="Player Role" value={item.role} />
                <FactRow label="Listed Categories" value={item.categories.join(", ")} />
                <FactRow label="Updated" value={item.lastChecked} />
              </dl>
              <div className="detail-related-links">
                <Link href={`/database/${categorySlug}`}>Back to {item.category}</Link>
                <Link href="/database">All Database Categories</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
