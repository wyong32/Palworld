import PalsExplorer from "@/components/PalsExplorer";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import GptAdSlot from "@/components/GptAdSlot";
import { items } from "@/data/items";
import { newPalHighlights, specialMonsterHighlights, unreleasedArchiveHighlights } from "@/data/newContent";
import { buildPalExplorerData } from "@/data/palGuide";
import { palsHubTrail } from "@/seo/breadcrumbs";
import { siteConfig } from "@/seo/site";
import { getPalRosterStats, isCurrentPal } from "@/data/palStatus";
import Image from "next/image";
import Link from "next/link";

export default function PalsPage({ pals }) {
  const breadcrumbs = palsHubTrail();
  const explorerData = buildPalExplorerData(pals, items);
  const rosterStats = getPalRosterStats(pals);
  const currentPals = pals.filter(isCurrentPal);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Palworld Pals - Paldeck, Best Workers, Combat, and Mounts",
    url: `${siteConfig.url}/pals`,
    description: "Search and compare Palworld Pals by work suitability, element, combat role, mount type, drops, and breeding value.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: currentPals.length,
      itemListElement: currentPals.map((pal, index) => ({
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
            <div className="pal-roster-proof" aria-label="Pal roster coverage">
              <span><strong>{rosterStats.current}</strong> current 1.0 Pals</span>
              <span><strong>{rosterStats.bossOnly}</strong> boss-only Paldeck entry</span>
              <span><strong>{rosterStats.crossoverCreatures}</strong> crossover creatures</span>
              <span><strong>{rosterStats.internalUnreleased}</strong> unreleased internal records</span>
              <span><strong>{rosterStats.archiveUnverified}</strong> unverified archive entries</span>
            </div>
            <div className="pals-hero-actions" aria-label="Quick Pal categories">
              <a href="#pal-results">Browse all Pals</a>
              <a href="#work-filters">Work suitability</a>
              <Link href="/map#interactive-map-title">Fixed Alpha locations</Link>
            </div>
          </div>
        </div>
      </section>

      {/* GPT 广告：banner_1 */}
      <GptAdSlot elementId="div-gpt-ad-pals-1" unit={1} />

      <section className="pals-table-section" id="pal-results">
        <div className="container">
          <section className="pal-spotlight-grid" aria-label="Palworld 1.0 additions and special creatures">
            <article className="pal-spotlight-card">
              <div className="pal-spotlight-head">
                <span>1.0 additions</span>
                <h2>New Palworld Pals to check before route planning</h2>
                <p>These entries connect new regions, boss routes, Paldeck goals, and team planning back into individual Pal pages.</p>
              </div>
              <div className="pal-spotlight-row">
                {newPalHighlights.slice(0, 8).map((pal) => (
                  <Link href={pal.href} className="pal-mini-card" key={pal.title}>
                    <Image src={pal.imageUrl} alt={pal.imageAlt} width={78} height={78} sizes="54px" />
                    <span><strong>{pal.title}</strong><small>{pal.note}</small></span>
                  </Link>
                ))}
              </div>
            </article>

            <article className="pal-spotlight-card">
              <div className="pal-spotlight-head">
                <span>Special creatures</span>
                <h2>Terraria Monsters and archive entries</h2>
                <p>Crossover creatures and archive entries stay searchable so players can separate active planning from collection tracking.</p>
              </div>
              <div className="pal-spotlight-row">
                {[...specialMonsterHighlights.slice(0, 4), ...unreleasedArchiveHighlights.slice(0, 4)].map((pal) => (
                  <Link href={pal.href} className="pal-mini-card" key={pal.title}>
                    <Image src={pal.imageUrl} alt={pal.imageAlt} width={78} height={78} sizes="54px" />
                    <span><strong>{pal.title}</strong><small>{pal.note}</small></span>
                  </Link>
                ))}
              </div>
            </article>
          </section>
          {/* GPT 广告：banner_2 */}
          <GptAdSlot elementId="div-gpt-ad-pals-2" unit={2} />
          <PalsExplorer data={explorerData} />
        </div>
      </section>

      {/* GPT 广告：banner_3 */}
      <GptAdSlot elementId="div-gpt-ad-pals-3" unit={3} />

    </>
  );
}
