import Link from "next/link";
import MapFocusWorkbench from "@/components/MapFocusWorkbench";
import { bossRouteHighlights } from "@/data/newContent";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { mapHubTrail } from "@/seo/breadcrumbs";
import { pageSeo, siteConfig } from "@/seo/site";

const faqItems = [
  {
    question: "How do I find a specific Alpha Pal on the map?",
    answer:
      "Choose Alpha Pals, search the English or Chinese name or internal ID, then select the result to center its fixed game-data point and open the matching Pal guide.",
  },
  {
    question: "Why are tower bosses and random dungeon bosses not shown?",
    answer:
      "This atlas uses the fixed boss-spawner table. That table does not contain tower masters, sealed-realm entrances, dungeon entrances, or random dungeon interiors, so the map does not invent coordinates for them.",
  },
  {
    question: "Why does World Tree use a separate map?",
    answer:
      "Palworld stores the World Tree with its own map image and world bounds. The atlas preserves that projection and switches to the seven fixed World Tree encounters instead of placing them on Palpagos.",
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

export default function MapPage({ hub, markers, categories, sourceStats, guidance, palProfiles }) {
  const breadcrumbs = mapHubTrail();
  const categoryCounts = countByCategory(markers);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Palworld Map Guide: Alpha Pals, Bosses, and World Tree",
    description: pageSeo.map.description,
    dateModified: "2026-07-20",
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

      <article className="map-workbench">
        <section className="map-workbench-hero" aria-labelledby="map-page-title">
          <span className="wiki-kicker">{hub.eyebrow}</span>
          <div className="map-workbench-hero-grid">
            <div>
              <h1 id="map-page-title">Palworld Map - Alpha Pals, Bosses, and World Tree</h1>
              <p>
                Palworld Map now combines fixed 1.0 boss points, exact quest objectives, and clustered wild-spawn
                anchors, then connects those records to Pal guides, route preparation, and the wider player toolkit.
              </p>
            </div>
            <div className="map-workbench-meta" aria-label="Map route notes">
              <strong>{hub.version}</strong>
              <span>928 searchable map records</span>
              <span>Palpagos and World Tree projections</span>
            </div>
          </div>
        </section>

        <MapFocusWorkbench palProfiles={palProfiles} />

        <section className="map-workbench-strip" aria-label="Map marker coverage">
          {sourceStats.slice(0, 4).map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="map-workbench-section map-prose-section" aria-labelledby="map-guide-title">
          <div className="map-workbench-section-head">
            <span className="wiki-kicker">Map guide</span>
            <h2 id="map-guide-title">Palworld Map route planning starts with player intent</h2>
            <p>
              A marker only tells you where something is. The route decision comes from the surrounding system:
              whether the target is a fixed Alpha encounter, a human boss, a special region, or a separate World Tree route.
            </p>
          </div>

          <div className="map-prose-grid">
            <article>
              <h3>Alpha Pal encounters</h3>
              <p>
                Every Alpha marker in the atlas is a fixed point from the 1.0 boss-spawner table. Use the{" "}
                <a href="#interactive-map-title" data-map-focus="alpha">Alpha preset</a>, search the Pal name,
                then open its linked <Link href="/pals">Pal guide</Link> to compare elements, work suitability,
                drops, and whether <Link href="/breeding">Breeding</Link> is a better route.
              </p>
            </article>

            <article>
              <h3>Human boss encounters</h3>
              <p>
                Human spawner records stay in their own filter so they are never presented as catchable Pals.
                Open the <a href="#interactive-map-title" data-map-focus="human">Human bosses preset</a> to inspect
                33 fixed encounters, then use the <Link href="/guides/palworld-1-0-progression-guide">progression guide</Link>
                to prepare armor, ammunition, food, and climate protection.
              </p>
            </article>

            <article>
              <h3>Special regions and oil rigs</h3>
              <p>
                The three oil-rig region records stay separate from creature encounters. Use the{" "}
                <a href="#interactive-map-title" data-map-focus="special">Special regions preset</a> for their exact
                positions, then connect the run to <Link href="/database/materials">Materials</Link> and relevant
                equipment pages instead of treating an oil rig as a boss species.
              </p>
            </article>

            <article>
              <h3>World Tree uses its own projection</h3>
              <p>
                The seven World Tree Alpha encounters use a different image and set of world bounds. The{" "}
                <a href="#interactive-map-title" data-map-focus="world-tree">World Tree preset</a> switches both the
                projection and marker set, keeping those endgame points out of the Palpagos coordinate space.
              </p>
            </article>
          </div>
        </section>

        <section className="map-workbench-section map-prose-section" aria-labelledby="map-1-0-title">
          <div className="map-workbench-section-head">
            <span className="wiki-kicker">1.0 coverage</span>
            <h2 id="map-1-0-title">Sunreach and World Tree need careful route planning.</h2>
            <p>
              Palworld 1.0 changed how players read the world map. New regions, Watchtowers, settlements,
              habitat rebalance, Soralite, Paloxite, and story routing all affect map advice.
            </p>
          </div>

          <div className="map-prose-grid map-prose-grid-three">
            <article>
              <h3>Palpagos main map</h3>
              <p>
                Use the Palpagos map controls to search species, filter layers, and inspect fixed boss coordinates.
                Then compare the destination with your in-game fast-travel network before committing Spheres,
                ammunition, food, or climate gear to the trip.
              </p>
            </article>
            <article>
              <h3>Sunreach</h3>
              <p>
                Sunreach is a floating-island route with new Pals, tower bosses, and specialized ores. Keep Sunreach
                route advice dated, and use <Link href="/updates">Updates</Link> when a new marker changes how you
                plan the next run.
              </p>
            </article>
            <article>
              <h3>World Tree</h3>
              <p>
                The World Tree is central to 1.0 story progression and Awakening resources. Before using a World Tree
                marker as a destination, read the{" "}
                <Link href="/guides/world-tree-preparation-checklist">World Tree Preparation Checklist</Link> so team,
                gear, and resource planning are not separated from the map result.
              </p>
            </article>
          </div>
        </section>

        <section className="map-workbench-section" aria-labelledby="map-boss-routes-title">
          <div className="map-workbench-section-head">
            <span className="wiki-kicker">Boss routes</span>
            <h2 id="map-boss-routes-title">Editorial route notes for Palworld 1.0.</h2>
            <p>
              These planning notes are separate from the exact points in the interactive map. They connect selected
              1.0 encounters to the team, item, and route preparation players should check before spending supplies.
            </p>
          </div>
          <div className="map-guidance-grid">
            {bossRouteHighlights.map((route) => (
              <article key={route.title}>
                <h3>{route.title}</h3>
                <p>
                  <b>{route.region}</b> · {route.level}. {route.body}
                </p>
                <Link href={route.href}>Open related page</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="map-workbench-section" aria-labelledby="map-local-index-title">
          <div className="map-workbench-section-head">
            <span className="wiki-kicker">Editorial route index</span>
            <h2 id="map-local-index-title">Read every marker at the right level of precision.</h2>
            <p>
              Exact coordinates identify a point, route clusters group a practical run, regional markers narrow a
              search area, and planning markers describe where a route should begin rather than a guaranteed spawn.
            </p>
          </div>
          <div className="map-local-grid">
            {categories.map((category) => (
              <div key={category.key} style={{ "--layer-color": category.color }}>
                <strong>{categoryCounts[category.key] || 0}</strong>
                <span>{category.label}</span>
              </div>
            ))}
          </div>
          <div className="map-guidance-grid">
            {guidance.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.route}</p>
                <ul>
                  {item.checklist.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="map-workbench-section map-workbench-faq" aria-labelledby="map-faq-title">
          <span className="wiki-kicker">FAQ</span>
          <h2 id="map-faq-title">Palworld map FAQ</h2>
          <div>
            {faqItems.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
