import PalsExplorer from "@/components/PalsExplorer";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { items } from "@/data/items";
import { buildPalExplorerData } from "@/data/palGuide";
import { palsHubTrail } from "@/seo/breadcrumbs";
import { siteConfig } from "@/seo/site";

export default function PalsPage({ pals }) {
  const breadcrumbs = palsHubTrail();
  const explorerData = buildPalExplorerData(pals, items);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Palworld Pals - Paldeck, Best Workers, Combat, and Mounts",
    url: `${siteConfig.url}/pals`,
    description: "Search and compare Palworld Pals by work suitability, element, combat role, mount type, drops, and breeding value.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pals.length,
      itemListElement: pals.map((pal, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: pal.title,
        url: `${siteConfig.url}/pals/${pal.addressBar}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageBreadcrumbs items={breadcrumbs} />
      <section className="listing-hero-section pals-hero-section">
        <div className="container">
          <div className="listing-hero-content pals-hero-content">
            <span className="wiki-kicker">Palworld Pal Guide</span>
            <h1>Palworld Pals - Paldeck, Best Workers, Combat, and Mounts</h1>
            <p>
              Compare Palworld Pals by element, Work Suitability, base role, combat fit,
              flying or ground mount use, Partner Skill, drops, and breeding value. Start with
              a player goal, then open the Pal guide for the exact decision.
            </p>
            <div className="pals-hero-actions" aria-label="Quick Pal categories">
              <a href="#pal-results">Browse all Pals</a>
              <a href="#work-filters">Work suitability</a>
            </div>
          </div>
        </div>
      </section>

      <section className="pals-table-section" id="pal-results">
        <div className="container">
          <PalsExplorer data={explorerData} />
        </div>
      </section>

    </>
  );
}
