import Link from "next/link";
import MapFocusWorkbench from "@/components/MapFocusWorkbench";
import { pageSeo, siteConfig } from "@/seo/site";

const faqItems = [
  {
    question: "How do I find a specific Pal on the map?",
    answer:
      "Inspect the Pals and Alpha Pals markers on the interactive map, then compare the location with nearby fast-travel points and the matching Pal guide.",
  },
  {
    question: "Why are Sunreach and World Tree handled carefully?",
    answer:
      "They are 1.0 regions with newer route coverage. Treat them as planning areas first, then confirm the exact destination in-game before long farming or boss runs.",
  },
  {
    question: "Which layer should I use first?",
    answer:
      "Start from intent: Pal and Alpha layers for capture routes, Tower or Field Boss layers for combat, Dungeon layers for loot runs, Resource layers for farming, and Base location layers for build planning.",
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

export default function MapPage({ hub, markers, categories, sourceStats, guidance }) {
  const categoryCounts = countByCategory(markers);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Palworld Map Guide: Interactive Map, Sunreach, World Tree, Pals, Dungeons and Resources",
    description: pageSeo.map.description,
    dateModified: "2026-07-16",
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

      <article className="map-workbench">
        <section className="map-workbench-hero" aria-labelledby="map-page-title">
          <span className="wiki-kicker">{hub.eyebrow}</span>
          <div className="map-workbench-hero-grid">
            <div>
              <h1 id="map-page-title">Palworld Map - Interactive Palpagos Routes, Pals, Bosses, and Resources</h1>
              <p>
                Palworld Map starts with the live map, then helps players decide which layer to open,
                what to search, and how to prepare after a marker is found.
              </p>
            </div>
            <div className="map-workbench-meta" aria-label="Map route notes">
              <strong>{hub.version}</strong>
              <span>Last checked 2026-07-16</span>
              <span>Map layers plus player route guidance</span>
            </div>
          </div>
        </section>

        <MapFocusWorkbench categories={categories} markers={markers} />

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
              whether the target is a Pal capture, a dungeon run, a tower fight, a resource loop, or a base plan.
            </p>
          </div>

          <div className="map-prose-grid">
            <article>
              <h3>Pal and Alpha routes</h3>
              <p>
                When you search for a Pal marker, compare the result against the{" "}
                <Link href="/pals">Pal explorer</Link> before you spend high-tier Spheres. The Pal page helps you
                verify element, work suitability, drops, and whether the same target may be easier through{" "}
                <Link href="/breeding">Breeding</Link>. For Alpha runs,{" "}
                <a href="#interactive-map-title">return to the interactive map</a> and treat
                exact coordinates differently from route clusters.
              </p>
            </article>

            <article>
              <h3>Towers, dungeons, and boss preparation</h3>
              <p>
                A tower or dungeon marker should lead to preparation, not just travel. If the embedded map points you
                toward a boss route, check your <Link href="/guides/palworld-1-0-progression-guide">progression plan</Link>,
                repair materials, ammo, food, and climate gear before entering. Use{" "}
                <a href="#interactive-map-title">return to the map before the combat route</a> when the route
                includes towers, field bosses, dungeon entrances, or chest farming.
              </p>
            </article>

            <article>
              <h3>Resources and item intent</h3>
              <p>
                Resource layers are only useful if they stay connected to what you are crafting. A sulfur marker
                belongs to ammo planning, while ore and coal usually feed production bases. After finding a marker,
                use <Link href="/database/materials">Materials</Link> and item detail pages to keep the run
                focused on the thing you actually need. For farming, <a href="#interactive-map-title">return to the map before starting the run</a>.
              </p>
            </article>

            <article>
              <h3>Base spots depend on the job</h3>
              <p>
                Base-location layers should not be read as a single universal tier list. A mining base, a food base,
                and a breeding base ask for different terrain, nearby resources, Pal pathing, and fast travel access.
                When your map search is about building, compare the result with <Link href="/breeding">Breeding</Link>
                and <Link href="/database/structures">Structures</Link> before committing. You can{" "}
                <a href="#interactive-map-title">return to the map before comparing base locations</a> first.
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
                Use the Palpagos map controls to search species, filter layers, inspect markers, and find the nearest
                fast-travel point before committing Spheres, ammunition, food, or climate gear to the trip.
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

        <section className="map-workbench-section" aria-labelledby="map-local-index-title">
          <div className="map-workbench-section-head">
            <span className="wiki-kicker">Route index</span>
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
