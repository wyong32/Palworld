import { databaseCategorySlug, getDatabaseCategoryGroups } from "@/data/database";
import { guides } from "@/data/guides";
import { items } from "@/data/items";
import { bossRouteHighlights, newItemHighlights, newPalHighlights, onePointZeroCoverage } from "@/data/newContent";
import { getPalWorkSuitability } from "@/data/palGuide";
import { pals } from "@/data/pals";
import Image from "next/image";
import Link from "next/link";

function findPal(title) {
  return pals.find((pal) => pal.title === title);
}

const heroPals = ["Jetragon", "Anubis", "Braloha", "Selyne"].map(findPal).filter(Boolean);
const featuredPals = ["Anubis", "Braloha", "Jetragon", "Shadowbeak", "Faleris", "Selyne", "Lamball", "Grizzbolt"]
  .map(findPal)
  .filter(Boolean);

const reasonCards = [
  {
    title: "Built around real Palworld decisions",
    body:
      "Choose a base worker, fill an element gap, compare mounts, plan a parent pair, trace an item, or prepare a route without digging through unrelated pages.",
  },
  {
    title: "Pals, items, breeding, and maps connect",
    body:
      "Pal drops lead to Database items, Pal Gear leads back to its species, breeding combinations link their parents, and capture advice connects to the map when location matters.",
  },
  {
    title: "Current for the Palworld 1.0 era",
    body:
      "Version 1.0 raised the level cap to 85, added 72 Pals and variants, opened Sunreach and the World Tree, and changed breeding, combat, bases, and progression.",
  },
];

const objectiveCards = [
  {
    label: "Paldeck",
    title: "Choose the right Pal for the job",
    body:
      "Filter by Work Suitability, element, combat role, flying or ground mount use, ranch value, and useful drops.",
    href: "/pals",
    link: "Compare Pals",
  },
  {
    label: "Base work",
    title: "Fix a slow production line",
    body:
      "Find stronger workers for mining, handiwork, kindling, watering, planting, transport, medicine, cooling, and farming.",
    href: "/pals#work-filters",
    link: "Find base workers",
  },
  {
    label: "Breeding",
    title: "Build a clean parent and Cake route",
    body:
      "Set up the Breeding Farm, automate Cake, compare recorded combinations, protect passive lines, and separate Mutation batches.",
    href: "/breeding",
    link: "Open breeding planner",
  },
  {
    label: "Exploration",
    title: "Find a Pal, boss, dungeon, or resource",
    body:
      "Start with the interactive map, then use the matching Pal, item, or guide page to prepare the actual route.",
    href: "/map",
    link: "Open interactive map",
  },
];

const updateHighlights = [
  {
    title: "Level cap raised to 85",
    body:
      "Recheck technology, equipment, team investment, and old endgame assumptions before continuing an Early Access save.",
    href: "/updates",
  },
  {
    title: "72 new Pals and variants",
    body:
      "New species can change capture goals, work specialists, breeding chains, element coverage, and mount progression.",
    href: "/pals",
  },
  {
    title: "Sunreach, World Tree, Awakening, and Mutation",
    body:
      "New regions and Pal-strengthening systems make map preparation and careful breeding batches more important.",
    href: "/guides/world-tree-preparation-checklist",
  },
];

const faqItems = [
  {
    question: "What can I find on Palworld Wiki?",
    answer:
      "You can browse Pal guides, item categories and item pages, breeding workflows, an interactive map, Palworld 1.0 updates, progression guidance, and World Tree preparation.",
  },
  {
    question: "How do I find the best Pal for base work?",
    answer:
      "Open the Pals page, choose a Work Suitability such as Mining or Handiwork, sort by highest work level, then compare the leading Pal detail pages before investing upgrades.",
  },
  {
    question: "Where do I check a Pal location?",
    answer:
      "Open the interactive map from the Pal detail page, enable the Pal or Alpha layer, search the species name, and confirm the active time and nearest fast-travel point.",
  },
  {
    question: "How are Pal and item pages connected?",
    answer:
      "Pal pages link matching drops and Pal Gear to the Database. Item pages can lead back to related Pals, connected item categories, crafting routes, and map checks when location matters.",
  },
  {
    question: "Is the site updated for Palworld 1.0?",
    answer:
      "The main guides cover the July 10, 2026 release, including the level 85 cap, 72 additions to the roster, Sunreach, the World Tree, Awakening, Mutation, and major route changes.",
  },
];

export default function HomePage() {
  const categoryGroups = getDatabaseCategoryGroups(items);
  const topCategories = categoryGroups
    .map((group) => ({
      title: group.category,
      href: `/database/${databaseCategorySlug(group.category)}`,
      count: group.items.length,
      sample: group.items.slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const stats = [
    { value: pals.length, label: "Pal entries", detail: "Images, roles, and links", href: "/pals" },
    { value: items.length, label: "Item entries", detail: "Across the Database", href: "/database" },
    { value: categoryGroups.length, label: "Item categories", detail: "For faster lookup", href: "/database" },
    { value: guides.length, label: "Long-form guides", detail: "Progression and World Tree", href: "/guides" },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="home-field-hero">
        <div className="container">
          <div className="home-field-hero-grid">
            <div className="home-field-copy">
              <span className="wiki-kicker">Palworld Wiki</span>
              <h1>Palworld Wiki - Pals, Breeding, Maps, Items, and 1.0 Guides</h1>
              <p>
                Find the <Link href="/pals">Pal</Link>, <Link href="/database">item</Link>, route, or answer you need. Compare workers and combat teams,
                plan <Link href="/breeding">breeding</Link>, search the <Link href="/map">map</Link>, and prepare for Palworld 1.0 without losing the thread of your run.
              </p>
              <div className="home-field-actions" aria-label="Primary Palworld Wiki shortcuts">
                <Link href="/pals">Browse Pals</Link>
                <Link href="/database">Find Items</Link>
                <Link href="/breeding">Plan Breeding</Link>
                <Link href="/map">Open Map</Link>
              </div>
            </div>

            <div className="home-field-visual" aria-label="Palworld Wiki field dashboard">
              <Image
                src="/images/palworld/palworld-header.jpg"
                alt="Palworld key art with Pals and open-world scenery"
                width={920}
                height={520}
                preload
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 330px, 48vw"
              />
              <div className="home-pal-stack" aria-label="Featured Pal shortcuts">
                {heroPals.map((pal) => (
                  <Link href={`/pals/${pal.addressBar}`} key={pal.addressBar}>
                    <Image src={pal.imageUrl} alt={pal.imageAlt} width={96} height={96} sizes="38px" />
                    <span>{pal.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-overview-section">
        <div className="container">
          <div className="home-overview-grid">
            <div className="home-overview-copy">
              <span className="wiki-kicker">About Palworld Wiki</span>
              <h2>A practical field guide for every Palpagos run</h2>
              <p>
                Palworld combines creature collection with survival crafting, base automation,
                exploration, <Link href="/breeding">breeding</Link>, and combat. One decision often touches several systems:
                a Pal can be a worker, a mount, a fighter, a parent, and a way to obtain an item you need.
              </p>
              <p>
                Palworld Wiki connects those systems so you can begin with the problem in front of you
                and move naturally to the next answer, whether that is a Work Suitability comparison,
                a <Link href="/breeding/calculator">breeding pair</Link>, an <Link href="/database">item category</Link>, or a <Link href="/map">map route</Link>.
              </p>
            </div>
            <div className="home-stat-strip home-overview-stats" aria-label="Current wiki coverage">
              {stats.map((stat) => (
                <Link href={stat.href} key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <small>{stat.detail}</small>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-objective-section" aria-labelledby="home-objective-title">
        <div className="container">
          <div className="home-section-head">
            <div>
              <span className="wiki-kicker">Start with your goal</span>
              <h2 id="home-objective-title">What do you need to solve next?</h2>
              <p>Choose the task that is blocking your run, then narrow the answer with filters and detail pages.</p>
            </div>
          </div>
          <div className="home-objective-grid">
            {objectiveCards.map((card) => (
              <article key={card.title}>
                <span>{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <Link href={card.href}>{card.link}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-planning-section" aria-labelledby="home-planning-title">
        <div className="container">
          <div className="home-planning-grid">
            <div className="home-pal-board">
              <div className="home-section-head">
                <div>
                  <span className="wiki-kicker">Pal planning</span>
                  <h2 id="home-planning-title">Compare the role before the rarity</h2>
                  <p>
                    A rare Pal is not automatically the right worker, mount, or boss pick.
                    Compare the exact role and investment path first.
                  </p>
                </div>
                <Link href="/pals">All Pals</Link>
              </div>
              <div className="home-pal-preview" aria-label="Pal role previews">
                {featuredPals.map((pal) => (
                  <Link href={`/pals/${pal.addressBar}`} key={`${pal.addressBar}-preview`}>
                    <Image src={pal.imageUrl} alt={pal.imageAlt} width={78} height={78} sizes="52px" />
                    <span><strong>{pal.title}</strong><small>{getPalWorkSuitability(pal) || pal.element}</small></span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="home-category-board">
              <div>
                <div>
                  <span className="wiki-kicker">Item lookup</span>
                  <h2>Database categories for common bottlenecks</h2>
                </div>
                <Link href="/database">All categories</Link>
              </div>
              <div className="home-category-grid">
                {topCategories.map((category) => (
                  <Link href={category.href} className="home-category-card" key={category.title}>
                    <strong>{category.title}</strong>
                    <span>{category.count} entries</span>
                    <small>{category.sample.map((item) => item.title).join(" / ")}</small>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-version-section" aria-labelledby="home-version-title">
        <div className="container">
          <div className="home-version-grid">
            <div className="home-version-copy">
              <span className="wiki-kicker">Palworld 1.0</span>
              <h2 id="home-version-title">Recheck the systems behind your old route</h2>
              <p>
                The July 10, 2026 release changed progression, the world, the roster, Pal investment,
                <Link href="/breeding">breeding</Link>, bases, and combat. Returning players should refresh the route before repeating the grind.
              </p>
              <Link href="/updates">Read the 1.0 update guide</Link>
            </div>
            <div className="home-version-list">
              {updateHighlights.map((item) => (
                <Link href={item.href} key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-objective-section" aria-labelledby="home-new-content-title">
        <div className="container">
          <div className="home-section-head">
            <div>
              <span className="wiki-kicker">New in Palworld 1.0</span>
              <h2 id="home-new-content-title">New Pals, bosses, regions, and route pressure</h2>
              <p>
                Version 1.0 is not just a patch note. It adds new Pal goals, boss routes, endgame
                regions, and items that change what players should check before a long run.
              </p>
            </div>
            <Link href="/updates">Full update desk</Link>
          </div>

          <div className="home-objective-grid">
            {onePointZeroCoverage.map((card) => (
              <article key={card.title}>
                <span>{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <Link href={card.href}>Open related guide</Link>
              </article>
            ))}
          </div>

          <div className="home-planning-grid">
            <div className="home-pal-board">
              <div className="home-section-head">
                <div>
                  <span className="wiki-kicker">New Pal checks</span>
                  <h2>1.0 Pals and special creatures to compare first</h2>
                  <p>Open the Pal page before committing Spheres, parent routes, boss prep, or upgrade materials.</p>
                </div>
                <Link href="/pals">All Pal entries</Link>
              </div>
              <div className="home-pal-preview" aria-label="New Palworld 1.0 Pal shortcuts">
                {newPalHighlights.slice(0, 8).map((pal) => (
                  <Link href={pal.href} key={pal.title}>
                    <Image src={pal.imageUrl} alt={pal.imageAlt} width={78} height={78} sizes="52px" />
                    <span><strong>{pal.title}</strong><small>{pal.note}</small></span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="home-category-board">
              <div>
                <div>
                  <span className="wiki-kicker">Boss and item routes</span>
                  <h2>What changed your next long route?</h2>
                </div>
                <Link href="/map">Open map</Link>
              </div>
              <div className="home-category-grid">
                {bossRouteHighlights.slice(0, 2).map((route) => (
                  <Link href={route.href} className="home-category-card" key={route.title}>
                    <strong>{route.title}</strong>
                    <span>{route.region}</span>
                    <small>{route.body}</small>
                  </Link>
                ))}
                {newItemHighlights.slice(0, 4).map((item) => (
                  <Link href={item.href} className="home-category-card" key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.category}</span>
                    <small>{item.note}</small>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-reasons-section" aria-labelledby="home-reasons-title">
        <div className="container">
          <div className="home-section-head">
            <div>
              <span className="wiki-kicker">Why Palworld Wiki</span>
              <h2 id="home-reasons-title">Built for the way Palworld systems overlap</h2>
              <p>Use a quick lookup when the answer is simple and a connected guide when the decision affects the whole run.</p>
            </div>
          </div>
          <div className="home-reason-grid">
            {reasonCards.map((card) => (
              <article key={card.title}><h3>{card.title}</h3><p>{card.body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-faq-redesign-section" aria-labelledby="home-faq-title">
        <div className="container">
          <div className="home-faq-redesign-head">
            <span className="wiki-kicker">FAQ</span>
            <h2 id="home-faq-title">Palworld Wiki FAQ</h2>
            <p>Fast answers for finding Pals, workers, locations, items, and current 1.0 guidance.</p>
          </div>
          <div className="home-faq-redesign-grid">
            {faqItems.map((faq) => (
              <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
