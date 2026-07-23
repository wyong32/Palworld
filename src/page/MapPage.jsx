import Link from "next/link";
import GptAdSlot from "@/components/GptAdSlot";
import MapFocusWorkbench from "@/components/MapFocusWorkbench";
import { bossRouteHighlights } from "@/data/newContent";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { mapHubTrail } from "@/seo/breadcrumbs";
import { pageSeo, siteConfig } from "@/seo/site";
import styles from "./MapPage.module.css";

const faqItems = [
  {
    question: "How do I find a specific Alpha Pal on the map?",
    answer:
      "Choose the Alpha preset, search the English or Chinese name or internal ID, then select the result to center its fixed map point and open the matching Pal guide.",
  },
  {
    question: "Why are tower bosses and random dungeon bosses not shown?",
    answer:
      "The atlas shows fixed dungeon entrances, but tower masters and random dungeon interiors are not fixed overworld points, so they are kept separate from the location layers.",
  },
  {
    question: "Why does World Tree use a separate map?",
    answer:
      "The World Tree uses its own map image and world bounds. The atlas preserves that projection for its bosses, travel points, collectibles, and other locations instead of placing them on Palpagos.",
  },
  {
    question: "How should I prepare for a boss or tower route?",
    answer:
      "Check the boss element, repair gear, restock ammo and food, bring climate protection for the region, and unlock the closest fast-travel point before starting the run.",
  },
];

function countByCategory(markers) {
  return markers.reduce((groups, marker) => {
    groups[marker.category] = (groups[marker.category] || 0) + 1;
    return groups;
  }, {});
}

export default function MapPage({ hub, markers, categories, sourceStats, guidance, palProfiles, mapRecordCount }) {
  const breadcrumbs = mapHubTrail();
  const categoryCounts = countByCategory(markers);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Palworld Map Guide: Alpha Pals, Bosses, and World Tree",
    description: pageSeo.map.description,
    dateModified: "2026-07-21",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/map`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageBreadcrumbs items={breadcrumbs} />

      <article className={styles.page}>
        <header className={styles.hero} aria-labelledby="map-page-title">
          <div className={styles.heroCopy}>
            <div className={styles.heroLabel}>
              <span>FIELD ATLAS</span>
              <i aria-hidden="true" />
              <span>PALWORLD {hub.version}</span>
            </div>
            <h1 id="map-page-title">Palworld Map - Alpha Pals, Bosses, and World Tree</h1>
            <p>
              Search Palpagos and World Tree across fixed encounters, travel, dungeon entrances, resources,
              collectibles, quest objectives, and clustered wild habitats—without confusing a visual cluster
              with an exact coordinate.
            </p>
            <nav className={styles.heroActions} aria-label="Map page shortcuts">
              <a href="#interactive-map-title">Open the atlas</a>
              <a href="#precision-guide">Read the precision key</a>
              <Link href="/updates">Check 1.0 updates</Link>
            </nav>
          </div>

          <aside className={styles.fieldLedger} aria-label="Current map dataset">
            <div className={styles.ledgerTopline}>
              <span>LIVE DATASET</span>
              <span>21 JUL 2026</span>
            </div>
            <strong>{mapRecordCount.toLocaleString("en-US")}</strong>
            <p>searchable map records</p>
            <dl>
              <div><dt>Build</dt><dd>24088745</dd></div>
              <div><dt>Maps</dt><dd>02</dd></div>
              <div><dt>Coordinate rule</dt><dd>Exact actors stay exact</dd></div>
            </dl>
            <div className={styles.ledgerMark} aria-hidden="true"><span>N</span><i /></div>
          </aside>
        </header>

        {/* GPT 广告：banner_1 */}
        <GptAdSlot elementId="div-gpt-ad-map-1" unit={1} />

        <section className={styles.coverageRail} aria-label="Exploration map coverage">
          <div className={styles.coverageLead}>
            <span>MAP COVERAGE</span>
            <strong>Start with a task, not a wall of pins.</strong>
          </div>
          {sourceStats.slice(0, 4).map((stat, index) => (
            <div className={styles.coverageItem} key={stat.label}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <MapFocusWorkbench palProfiles={palProfiles} />

        {/* GPT 广告：banner_2 */}
        <GptAdSlot elementId="div-gpt-ad-map-2" unit={2} />

        <section className={styles.precisionSection} id="precision-guide" aria-labelledby="map-guide-title">
          <header>
            <span className={styles.sectionLabel}>MAP GUIDE</span>
            <h2 id="map-guide-title">Palworld Map route planning starts with player intent</h2>
            <p>
              A marker only tells you where something is. The route decision comes from the surrounding system:
              whether the target is a fixed Alpha encounter, a human boss, a special region, or a separate World Tree route.
            </p>
          </header>
          <div className={styles.precisionList}>
            <article>
              <span>01</span>
              <div>
                <h3>Alpha Pal encounters</h3>
                <p>
                  Every Alpha marker is a fixed point from the 1.0 boss-spawner table. Use the{" "}
                  <a href="#interactive-map-title" data-map-focus="alpha">Alpha preset</a>, then open its linked{" "}
                  <Link href="/pals">Pal guide</Link> to compare elements, work suitability, drops, and breeding routes.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Human boss encounters</h3>
                <p>
                  Human spawner records stay in their own filter so they are never presented as catchable Pals.
                  Open the <a href="#interactive-map-title" data-map-focus="human">Human bosses preset</a> and use the{" "}
                  <Link href="/guides/palworld-1-0-progression-guide">progression guide</Link> to prepare the run.
                </p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Special regions and oil rigs</h3>
                <p>
                  Oil-rig region records stay separate from creature encounters. Use the{" "}
                  <a href="#interactive-map-title" data-map-focus="special">Special regions preset</a> for their exact
                  positions, then connect the run to <Link href="/database/materials">Materials</Link> and equipment pages.
                </p>
              </div>
            </article>
            <article>
              <span>04</span>
              <div>
                <h3>World Tree uses its own projection</h3>
                <p>
                  The <a href="#interactive-map-title" data-map-focus="world-tree">World Tree preset</a> switches the
                  image, bounds, and location layers, keeping those endgame points out of the Palpagos coordinate space.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* GPT 广告：banner_3 */}
        <GptAdSlot elementId="div-gpt-ad-map-3" unit={3} />

        <section className={styles.precisionSection} aria-labelledby="map-1-0-title">
          <header>
            <span className={styles.sectionLabel}>1.0 COVERAGE</span>
            <h2 id="map-1-0-title">Sunreach and World Tree need careful route planning.</h2>
            <p>
              Palworld 1.0 changed how players read the world map. New regions, Watchtowers, settlements,
              habitat rebalance, Soralite, Paloxite, and story routing all affect map advice.
            </p>
          </header>
          <div className={styles.precisionList}>
            <article>
              <span>01</span>
              <div>
                <h3>Palpagos main map</h3>
                <p>
                  Search species, filter exact actor layers, and inspect fixed boss coordinates. Compare the destination
                  with your in-game fast-travel network before committing Spheres, ammunition, food, or climate gear.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Sunreach</h3>
                <p>
                  Sunreach is a floating-island route with new Pals, tower bosses, and specialized ores. Keep its route
                  advice dated, and use <Link href="/updates">Updates</Link> when new markers change the run.
                </p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>World Tree</h3>
                <p>
                  The World Tree is central to 1.0 story progression and Awakening resources. Read the{" "}
                  <Link href="/guides/world-tree-preparation-checklist">World Tree Preparation Checklist</Link> before
                  treating a marker as the whole route plan.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.routeDesk} aria-labelledby="map-boss-routes-title">
          <header className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionLabel}>BOSS ROUTES</span>
              <h2 id="map-boss-routes-title">Editorial route notes for Palworld 1.0.</h2>
            </div>
            <p>
              These planning notes are separate from the exact points in the interactive map. They connect selected
              1.0 encounters to the team, item, and route preparation players should check before spending supplies.
            </p>
          </header>

          <div className={styles.routeDeskGrid}>
            <div className={styles.routeLog}>
              {bossRouteHighlights.map((route, index) => (
                <article key={route.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>{route.region} · {route.level}</small>
                    <h3>{route.title}</h3>
                    <p>{route.body}</p>
                    <Link href={route.href}>Open route record <b aria-hidden="true">↗</b></Link>
                  </div>
                </article>
              ))}
            </div>

            <aside className={styles.worldBrief}>
              <span className={styles.sectionLabel}>WORLD BRIEFING</span>
              <strong className={styles.worldBriefTitle}>Palpagos and World Tree are different planning spaces.</strong>
              <div>
                <a href="#interactive-map-title" data-map-focus="alpha">
                  <span>Fixed encounters</span><strong>Alpha routes</strong><small>Search an exact boss point, then compare its Pal guide and drops.</small>
                </a>
                <a href="#interactive-map-title" data-map-focus="collection">
                  <span>Dense exploration</span><strong>Collectible sweep</strong><small>Reveal eggs, chests, Effigies, Skill Fruit trees, and notes.</small>
                </a>
                <a href="#interactive-map-title" data-map-focus="world-tree">
                  <span>Separate projection</span><strong>World Tree</strong><small>Keep endgame travel and collectible points inside their own bounds.</small>
                </a>
              </div>
              <Link href="/guides/world-tree-preparation-checklist">Open the World Tree checklist</Link>
            </aside>
          </div>
        </section>

        {/* GPT 广告：banner_1 */}
        <GptAdSlot elementId="div-gpt-ad-map-4" unit={1} />

        <section className={styles.planningIndex} aria-labelledby="map-local-index-title">
          <header className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionLabel}>EDITORIAL ROUTE INDEX</span>
              <h2 id="map-local-index-title">Read every marker at the right level of precision.</h2>
            </div>
            <p>
              Exact coordinates identify a point, UI clusters keep dense exact data readable, regional markers narrow a
              search area, and planning markers describe where a route should begin rather than a guaranteed spawn.
            </p>
          </header>

          <div className={styles.layerMatrix}>
            {categories.map((category, index) => (
              <div key={category.key} style={{ "--layer-color": category.color }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i aria-hidden="true" />
                <strong>{category.label}</strong>
                <small>{categoryCounts[category.key] || 0} planning records</small>
              </div>
            ))}
          </div>

          <div className={styles.fieldNotes}>
            {guidance.map((item, index) => (
              <article key={item.title}>
                <span>FIELD NOTE {String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.route}</p>
                <ul>{item.checklist.map((check) => <li key={check}>{check}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="map-faq-title">
          <header>
            <span className={styles.sectionLabel}>FAQ</span>
            <h2 id="map-faq-title">Palworld map FAQ</h2>
          </header>
          <div>
            {faqItems.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span><h3>{faq.question}</h3></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        {/* GPT 广告：banner_2 */}
        <GptAdSlot elementId="div-gpt-ad-map-5" unit={2} />
      </article>
    </>
  );
}
