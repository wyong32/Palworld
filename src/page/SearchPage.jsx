import Image from "next/image";
import Link from "next/link";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { searchSite } from "@/data/searchIndex";
import { searchHubTrail } from "@/seo/breadcrumbs";

function SearchResultImage({ item }) {
  if (!item.imageUrl) {
    return (
      <div className="search-result-fallback" aria-hidden="true">
        {item.type.slice(0, 2)}
      </div>
    );
  }

  return <Image src={item.imageUrl} alt={item.imageAlt || `${item.title} result`} width={82} height={82} />;
}

export default function SearchPage({ query }) {
  const breadcrumbs = searchHubTrail();
  const results = searchSite(query);
  const hasQuery = query.trim().length > 0;

  return (
    <>
      <PageBreadcrumbs items={breadcrumbs} />
      <section className="listing-hero-section search-hero-section">
        <div className="container">
          <div className="listing-hero-content search-hero-content">
            <span className="wiki-kicker">Site Search</span>
            <h1>Palworld Wiki Search - Pals, Items, Guides, and Map Routes</h1>
            <p>
              Palworld Wiki Search finds Pals, items, categories, breeding planning, map topics,
              guides, and current update notes from one search box.
            </p>
            <form className="search-page-form" action="/search" role="search">
              <label htmlFor="search-page-input">Search keyword</label>
              <input
                id="search-page-input"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Try Anubis, Cake, coal, World Tree..."
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
      </section>

      <section className="search-results-section">
        <div className="container">
          <div className="search-results-head">
            <div>
              <span className="wiki-kicker">{hasQuery ? "Results" : "Popular entries"}</span>
              <h2>{hasQuery ? `${results.length} results for "${query}"` : "Start from a common route"}</h2>
            </div>
            <Link href="/pals">Browse all Pals</Link>
          </div>

          {results.length > 0 ? (
            <div className="search-result-grid">
              {results.map((item) => (
                <Link className="search-result-card" href={item.href} key={`${item.type}-${item.href}`}>
                  <SearchResultImage item={item} />
                  <span>
                    <small>{item.type}</small>
                    <strong>{item.title}</strong>
                    <em>{item.summary}</em>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="search-empty-panel">
              <h2>No matching entries found</h2>
              <p>Try a Pal name, item name, material, guide topic, map area, or a shorter keyword.</p>
              <div>
                <Link href="/pals">Pals</Link>
                <Link href="/database">Database</Link>
                <Link href="/breeding">Breeding</Link>
                <Link href="/map">Map</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
