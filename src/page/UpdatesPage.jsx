import Image from "next/image";
import Link from "next/link";
import UpdateImpactBoard from "@/components/UpdateImpactBoard";
import { pageSeo, siteConfig } from "@/seo/site";

const quickStats = [
  { value: "1.0", label: "Current major version", note: "Release branch" },
  { value: "2026-07-10", label: "Launch date", note: "Version 1.0 release" },
  { value: "72", label: "New Pals", note: "47 new plus 25 variants" },
  { value: "287", label: "Roster after 1.0", note: "Current 1.0 roster count" },
  { value: "Lv.85", label: "Player level cap", note: "Current 1.0 progression cap" },
  { value: "850K+", label: "Steam concurrency", note: "Post-launch player peak" },
];

const priorityActions = [
  {
    label: "Returning players",
    title: "Check saves, mods, and old routes before grinding",
    body:
      "Version 1.0 touches progression, habitats, towers, partner skills, breeding, bases, and the world map. Remove or update mods first, then retest old resource loops before treating them as current.",
    proof: "Best used before long farming sessions.",
  },
  {
    label: "Pal hunters",
    title: "Rebuild Paldeck goals around new habitats and variants",
    body:
      "The 1.0 roster adds 47 new Pals and 25 variants. Use the Pal explorer to compare elements, work suitability, drops, and team roles before committing rare Spheres.",
    href: "/pals",
    linkText: "Open the Pal explorer",
    proof: "Version 1.0 roster planning.",
  },
  {
    label: "Explorers",
    title: "Treat Sunreach and World Tree as version-marked routes",
    body:
      "Sunreach, the World Tree, Watchtowers, settlements, Ancient Ruins, seven new small islands, and rebalanced habitats make old map advice fragile. Start from the interactive map, then confirm the route you actually plan to run.",
    href: "/map",
    linkText: "Use the interactive map",
    proof: "Route planning for the expanded world.",
  },
  {
    label: "Breeders",
    title: "Separate normal breeding from Mutation experiments",
    body:
      "Mutation and special cakes now change breeding planning. Keep clean passive lines apart from Mushroom, Vegetable, Deluxe Vegetable, and Special Cake tests.",
    href: "/breeding",
    linkText: "Plan breeding batches",
    proof: "Mutation and cake batch planning.",
  },
  {
    label: "Crafters",
    title: "Recheck materials, weapons, structures, and recipes",
    body:
      "Soralite, Paloxite, accessory schematics, new equipment, base pieces, ores, and technology mean old storage layouts and material priorities may be wrong. Use Database categories for item planning instead of broad update posts.",
    href: "/database",
    linkText: "Browse Database categories",
    proof: "Item and base-building refresh.",
  },
];

const impactRows = [
  {
    system: "Pals and Paldeck",
    officialFact:
      "Palworld 1.0 adds 72 Pals, including 47 new Pals and 25 variants, bringing the roster total to 287.",
    playerUse:
      "Check the Pal explorer for element, work suitability, drops, Partner Skill, and role fit before building capture or boss teams.",
    href: "/pals",
    linkLabel: "Pal explorer",
  },
  {
    system: "World map",
    officialFact:
      "Sunreach, the World Tree, Watchtowers, Ancient Ruins, settlements, seven new small islands, and habitat review all affect route planning.",
    playerUse:
      "Use the map page for live map interaction, then connect Pal location results to guide pages rather than reading a marker as a complete route.",
    href: "/map",
    linkLabel: "Map workbench",
  },
  {
    system: "Breeding",
    officialFact:
      "Mutation can produce stronger Pals from eggs, and special cake types now modify breeding outcomes or throughput.",
    playerUse:
      "Keep normal Cake routes separate from Mutation batches so passive inheritance work does not mix with experiment logs.",
    href: "/breeding",
    linkLabel: "Breeding guide",
  },
  {
    system: "World Tree progression",
    officialFact:
      "The World Tree is now accessible and ties into Awakening through Radiant Gems found inside that area.",
    playerUse:
      "Prepare climate gear, combat team setup, repair materials, food, and database item checks before treating World Tree as a simple travel destination.",
    href: "/guides/world-tree-preparation-checklist",
    linkLabel: "World Tree checklist",
  },
  {
    system: "Database and crafting",
    officialFact:
      "The changelog adds Soralite, Paloxite, new equipment, materials, structures, base parts, technologies, recipes, accessory schematic routes, and progression rewards.",
    playerUse:
      "Open Database categories when an update note mentions a material or structure, because the detail page is where category, image, and route hints belong.",
    href: "/database/materials",
    linkLabel: "Materials category",
  },
  {
    system: "Combat, towers, and bosses",
    officialFact:
      "Tower bosses, combat balance, skills, partner skills, raids, and endgame progression were reworked in 1.0.",
    playerUse:
      "Review boss team setup after the update instead of relying on Early Access tower timings or old damage assumptions.",
    href: "/pals",
    linkLabel: "Pal explorer",
  },
  {
    system: "Expeditions and fishing",
    officialFact:
      "Version 1.0 rebalances expedition destinations and rewards, adds Sunreach and World Tree expeditions, and changes high-tier fishing spots, bait access, and Alpha fishing chances.",
    playerUse:
      "Recheck food, bait, mount, inventory, and Database item goals before repeating old expedition or fishing loops.",
    href: "/database/consumables",
    linkLabel: "Consumables category",
  },
];

const timeline = [
  {
    date: "2026-07-13",
    title: "Post-launch peak signal",
    body:
      "More than 850,000 concurrent Steam players returned after 1.0, making the launch period especially active for new routes, discoveries, and balance changes.",
  },
  {
    date: "2026-07-10",
    title: "Palworld 1.0 release",
    body:
      "Palworld exited Early Access and moved into the 1.0 release branch, so old save routes, item plans, and boss prep should be checked again.",
  },
  {
    date: "2026-07-10",
    title: "1.0 change impact",
    body:
      "The changelog introduced Sunreach, World Tree progression, 72 new Pals, Awakening, Mutation, special cakes, base changes, combat adjustments, and many item updates.",
  },
  {
    date: "2026-07-09",
    title: "Launch trailer",
    body:
      "Pocketpair released the 1.0 launch trailer notice and confirmed the July 10 release timing.",
  },
  {
    date: "2026-07-08",
    title: "40 million player milestone",
    body:
      "Pocketpair announced Palworld had passed 40 million total players before launch, giving the 1.0 update strong audience context.",
  },
];

const returningPlayerPlan = [
  "Remove incompatible mods before opening an important save, then make a backup before the first 1.0 session.",
  "Recheck the Technology tree, level requirements, equipment, and base assignments before starting a long craft queue.",
  "Open the Paldeck and inspect old team staples because stats, Partner Skills, habitats, and role competition changed.",
  "Test one familiar farming or boss route before rebuilding every base or spending rare upgrade materials.",
];

const faqItems = [
  {
    question: "What is the latest major Palworld update covered here?",
    answer:
      "This page is currently built around Palworld 1.0, released on July 10, 2026.",
  },
  {
    question: "Should I trust old Early Access Palworld guides after 1.0?",
    answer:
      "Use them cautiously. Version 1.0 changes world routing, habitats, combat, partner skills, breeding, bases, items, and progression, so old advice should be rechecked against current pages.",
  },
  {
    question: "Where should I start as a returning player?",
    answer:
      "Start with the 1.0 change list on this page, then move into the Pal explorer, interactive map, breeding guide, and Database categories based on what your save needs first.",
  },
  {
    question: "Does this page list exact Mutation odds or drop rates?",
    answer:
      "No. It explains the Mutation and special cake categories, but exact odds or rates should only be added when they are clear enough for player use.",
  },
  {
    question: "How should returning players use this Updates page?",
    answer:
      "Start with the player priority cards, then open the affected Pal, Database, Breeding, Map, or Guide page for the route you plan to play next.",
  },
];

export default function UpdatesPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Palworld Updates: 1.0 Patch Notes, New Pals, Map Changes and Wiki Tracker",
    description: pageSeo.updates.description,
    dateModified: "2026-07-15",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/updates`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="updates-page">
        <section className="updates-page-hero" aria-labelledby="updates-page-title">
          <div className="updates-page-hero-grid">
            <div className="updates-page-copy">
              <span className="eyebrow">Palworld 1.0 Update Desk</span>
              <h1 id="updates-page-title">Palworld Updates - 1.0 Patch Notes, New Pals, and Route Changes</h1>
              <p>
                Palworld Updates tracks 1.0 patch notes, new Pals, Sunreach, World Tree routes,
                Awakening, Mutation, Database changes, and the player routes that need a fresh check.
              </p>
              <div className="updates-page-proof">
                <span>Last checked: 2026-07-15</span>
                <span>Major systems checked for route impact</span>
              </div>
            </div>

            <div className="updates-page-media">
              <Image
                src="/images/palworld/screenshot-5.jpg"
                alt="Palworld 1.0 update scene used for patch notes and version tracking"
                width={720}
                height={430}
                preload
              />
              <div className="updates-page-release-card">
                <span>Current major version</span>
                <strong>Palworld 1.0</strong>
                <small>Release date: July 10, 2026</small>
              </div>
            </div>
          </div>
        </section>

        <section className="updates-page-stats" aria-label="Palworld 1.0 update facts">
          {quickStats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>{stat.note}</small>
            </div>
          ))}
        </section>

        <section className="updates-page-section" aria-labelledby="updates-actions-title">
          <div className="updates-section-head">
            <span className="eyebrow">Player priority</span>
            <h2 id="updates-actions-title">Palworld Updates checklist: what to do first after 1.0</h2>
            <p>
              These player routes turn the biggest 1.0 changes into concrete next steps. Open a Pal, item, breeding,
              or map page only when it helps the next action.
            </p>
          </div>
          <div className="updates-action-grid">
            {priorityActions.map((action) => (
              <article key={action.title} className="updates-action-card">
                <span>{action.label}</span>
                <h3>{action.title}</h3>
                <p>{action.body}</p>
                {action.href && <Link href={action.href}>{action.linkText}</Link>}
                <small>{action.proof}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="updates-page-section" aria-labelledby="updates-impact-title">
          <div className="updates-section-head">
            <span className="eyebrow">Patch impact matrix</span>
            <h2 id="updates-impact-title">Connect each 1.0 change to a player task</h2>
            <p>
              Use the affected system to decide what needs attention first: your Pal team, map route,
              breeding line, World Tree preparation, item storage, or boss setup.
            </p>
          </div>
          <div className="updates-impact-table" role="table" aria-label="Palworld 1.0 impact matrix">
            {impactRows.map((row) => (
              <article key={row.system} role="row">
                <div>
                  <span>System</span>
                  <strong>{row.system}</strong>
                </div>
                <p>
            <b>Patch detail:</b> {row.officialFact}
                </p>
                <p>
                  <b>Player use:</b> {row.playerUse}{" "}
                  <Link href={row.href}>{row.linkLabel}</Link>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="updates-page-section updates-tool-section" aria-label="Interactive patch impact board">
          <UpdateImpactBoard />
        </section>

        <section className="updates-page-section updates-timeline-section" aria-labelledby="updates-timeline-title">
          <div className="updates-section-head">
            <span className="eyebrow">Version history</span>
            <h2 id="updates-timeline-title">Recent Palworld update timeline</h2>
            <p>
              Dates use concrete update milestones. Timeline entries are kept short so players can see which changes are
              current without reading a copied patch wall.
            </p>
          </div>
          <ol className="updates-timeline">
            {timeline.map((event) => (
              <li key={`${event.date}-${event.title}`}>
                <time>{event.date}</time>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="updates-page-section updates-rules-section" aria-labelledby="updates-rules-title">
          <div className="updates-section-head">
            <span className="eyebrow">Returning player reset</span>
            <h2 id="updates-rules-title">Check these four things before resuming an old save</h2>
            <p>
              Start with save safety and the systems that can waste the most time or materials when an old assumption is wrong.
            </p>
          </div>
          <div className="updates-rules-panel">
            <ul>
              {returningPlayerPlan.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <p>
              When a route breaks, isolate the system first. Use the <Link href="/pals">Paldeck</Link> for team and work roles,
              the <Link href="/database">Database</Link> for item bottlenecks, the <Link href="/breeding">Breeding guide</Link> for
              parent and Mutation planning, and the <Link href="/map">interactive map</Link> for changed destinations.
            </p>
          </div>
        </section>

        <section className="updates-page-section updates-faq-section" aria-labelledby="updates-faq-title">
          <span className="eyebrow">FAQ</span>
          <h2 id="updates-faq-title">Palworld updates FAQ</h2>
          <div className="updates-faq-grid">
            {faqItems.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
