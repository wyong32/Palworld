import Image from "next/image";
import Link from "next/link";
import BreedingPlanner from "@/components/BreedingPlanner";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { breedingSteps, cakeProductionPlan, mutationCards } from "@/data/breedingTools";
import { getDatabaseItemPath } from "@/data/database";
import { items } from "@/data/items";
import { breedingHubTrail } from "@/seo/breadcrumbs";
import { buildMetadata, pageSeo, siteConfig } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.breeding, "/breeding", {
  type: "article",
  publishedTime: "2026-07-13",
  modifiedTime: "2026-07-15",
});

const factCards = [
  {
    value: "Lv. 19",
    label: "Breeding Farm unlock",
    detail: "Spend 2 Technology Points, then build with 100 Wood, 20 Stone, and 50 Fiber.",
    href: "/database/structures/breeding-farm",
  },
  {
    value: "1 + 1",
    label: "Parent assignment",
    detail: "Assign one male and one female Pal to the farm before adding Cake.",
    href: "/breeding/calculator",
  },
  {
    value: "1 Cake",
    label: "Consumed per egg",
    detail: "Cake goes in the farm chest; Cake stored there does not spoil.",
    href: "/database/ingredients/cake",
  },
  {
    value: "Tier 7",
    label: "Egg Incubator",
    detail: "Ancient Technology unlock for hatching bred and world-spawned eggs.",
    href: "/database/structures/egg-incubator",
  },
];

const playerFlows = [
  {
    eyebrow: "First stable line",
    title: "Set up a clean Breeding Farm before chasing rare results",
    intent: "For players unlocking breeding for the first time.",
    steps: [
      "Place the farm near beds, food, and a short chest route so assigned parents do not path away.",
      "Stock at least five Cakes before assigning parents; one Cake equals one egg.",
      "Hatch every egg in an Egg Incubator and record the child's passives before using it as a next parent.",
    ],
    fieldNote: "Keep farm space, parent storage, Cake storage, and incubators close together.",
  },
  {
    eyebrow: "Cake economy",
    title: "Build the Cake chain as a base production route",
    intent: "For players whose eggs stop because Cake production stalls.",
    steps: [
      "Grow Wheat, mill it into Flour, then keep Berries separate from your base's regular food line.",
      "Run Ranch space for Mozzarina, Chikipi, and Beegarde so Milk, Eggs, and Honey do not require manual farming.",
      "Assign Transporting, Watering, Gathering, Cooling, and Kindling workers before scaling to multiple farms.",
    ],
    fieldNote: "Build the food chain before scaling to multiple parent pairs.",
  },
  {
    eyebrow: "Target Pal route",
    title: "Use special combinations for known target results",
    intent: "For players breeding Anubis, Jormuntide Ignis, Suzaku Aqua, and other 1.0 results.",
    steps: [
      "Start with fixed special pairs when the target is a variant or route-locked species.",
      "For normal results, remember the hidden breeding-power average decides the child, so parent choice matters.",
      "Open each parent and target Pal from the planner to check elements, drops, work suitability, and role fit.",
    ],
    fieldNote: "Re-check any pre-1.0 combination before turning the result into your next parent.",
  },
  {
    eyebrow: "Passive chain",
    title: "Preserve passives by narrowing the parent pool",
    intent: "For players building combat, mount, or base-worker specialists.",
    steps: [
      "Use parents that carry only the passives you actually want whenever possible.",
      "Expect RNG: passive inheritance is not guaranteed, even when both parents look perfect.",
      "Retire mixed children unless they improve the chain; random passives can occupy empty slots.",
    ],
    fieldNote: "Keep parent passives clean and retire children that dilute the target line.",
  },
  {
    eyebrow: "1.0 mutation batch",
    title: "Separate mutation tests from your clean passive pair",
    intent: "For endgame players trying the 1.0 Mutation and new Cake effects.",
    steps: [
      "Keep one farm for normal Cake baseline eggs and another for special Cake experiments.",
      "Label storage boxes by Cake type so Mushroom, Vegetable, Deluxe Vegetable, and Special Cake results do not mix.",
      "Do not assume exact odds; keep mutation batches separate until the result is worth keeping.",
    ],
    fieldNote: "Label each batch by Cake type so results stay easy to compare.",
  },
];

const cakeVariants = [
  {
    name: "Cake",
    use: "Baseline breeding input",
    effect: "Required to produce eggs in a Breeding Farm; use it as the baseline before testing special Cake effects.",
    proof: "Baseline batch for comparing normal results.",
    href: "/database/ingredients/cake",
  },
  {
    name: "Mushroom Cake",
    use: "Stat-growth attempt",
    effect: "Slightly increases the likelihood that newly born Pals have higher stats.",
    proof: "Use for stat-growth batches.",
  },
  {
    name: "Vegetable Cake",
    use: "Egg volume",
    effect: "Produces two Pal Eggs at once.",
    proof: "Use when egg volume matters.",
  },
  {
    name: "Deluxe Vegetable Cake",
    use: "Mutation batch",
    effect: "Increases mutation likelihood, improves stat-growth chances, and is the best fit for dedicated Mutation batches.",
    proof: "Keep these eggs separate from passive-chain work and compare them against a normal Cake baseline.",
  },
  {
    name: "Special Cake",
    use: "Passive inheritance batch",
    effect: "Increases the chance of inheriting multiple passive skills from the parents.",
    proof: "Use when passive-skill transfer matters more than egg volume.",
  },
];

const faqItems = [
  {
    question: "What do I need before breeding Pals?",
    answer:
      "You need a Breeding Farm, one male Pal, one female Pal, Cake in the farm chest, and an Egg Incubator to hatch the produced egg.",
  },
  {
    question: "Why does every serious breeding route start with Cake production?",
    answer:
      "The farm consumes Cake for eggs, so a weak Cake chain stops every parent route. Automating Wheat, Berries, Milk, Eggs, Honey, transport, watering, gathering, cooling, and kindling is the fastest way to scale.",
  },
  {
    question: "Are passive skills guaranteed to pass to the child?",
    answer:
      "No. Passive inheritance is probability based. Cleaner parent skill pools improve planning, but children can still receive an unexpected passive instead of the exact set you want.",
  },
  {
    question: "Can I use old breeding calculators after Palworld 1.0?",
    answer:
      "Use them cautiously. The core hidden breeding-power method still matters for normal results, but 1.0 added Mutation and special Cake effects that many older calculators do not model.",
  },
  {
    question: "Does this page list exact mutation odds?",
    answer:
      "No. It explains the effect categories and keeps exact odds out until they are clear enough for reliable player planning.",
  },
];

function findItem(title) {
  return items.find((item) => item.title.toLowerCase() === title.toLowerCase());
}

function RouteLink({ href, children, className }) {
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

export default function BreedingPage() {
  const cakePlan = cakeProductionPlan.map((part) => {
    const itemRef = findItem(part.item);
    return {
      ...part,
      itemRef,
      itemHref: itemRef ? getDatabaseItemPath(itemRef) : undefined,
    };
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Palworld Breeding Guide: Farm, Cake, Eggs, Mutation and Combos",
    description: pageSeo.breeding.description,
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
    mainEntityOfPage: `${siteConfig.url}/breeding`,
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
      <PageBreadcrumbs items={breedingHubTrail()} />

      <article className="breeding-page">
        <section className="breeding-page-hero" aria-labelledby="breeding-page-title">
          <div className="breeding-page-hero-grid">
            <div className="breeding-page-copy">
              <span className="eyebrow">Palworld 1.0 Breeding Desk</span>
              <h1 id="breeding-page-title">Palworld Breeding Guide - Parents, Cake, Eggs, and Mutation</h1>
              <p>
                Palworld Breeding Guide helps players build the farm, automate Cake, choose parents,
                protect passive chains, hatch eggs, and keep Mutation tests organized beyond a simple
                combo table.
              </p>
              <div className="breeding-page-actions" aria-label="Breeding shortcuts">
                <Link href="/breeding/calculator">Open calculator</Link>
                <a href="#cake-route">Cake route</a>
                <a href="#breeding-faq">FAQ</a>
              </div>
            </div>
            <div className="breeding-page-art" aria-label="Breeding route visual panel">
              <Image
                src="/images/palworld/screenshot-3.jpg"
                alt="Palworld player facing a Pal in an open-world breeding and progression guide scene"
                width={720}
                height={420}
                preload
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 42vw, 360px"
              />
              <div className="breeding-art-card">
                <Image src="/images/database/breeding-farm.png" alt="Breeding Farm icon" width={72} height={72} sizes="54px" />
                <div>
                  <strong>Farm + Cake + Incubator</strong>
                  <span>The core loop before combo hunting.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="breeding-command-section" aria-labelledby="breeding-command-title">
          <div className="breeding-section-head">
            <span className="eyebrow">Player route</span>
            <h2 id="breeding-command-title">Palworld Breeding Guide route: start with the bottleneck, not the rarest Pal</h2>
            <p>
              Breeding fails most often because the base loop is weak: no Cake, bad parent pathing, missing Incubator
              temperature control, or passive chains mixed with random test eggs.
            </p>
          </div>

          <div className="breeding-command-grid">
            <div className="breeding-runbook-panel">
              <div>
                <span>Recommended order</span>
                <h3>Five steps before mass breeding</h3>
              </div>
              <ol>
                <li>Unlock and place the Breeding Farm at Technology tier 19.</li>
                <li>Automate the Cake recipe before assigning valuable parents.</li>
                <li>Keep one male and one female assigned and watch for pathing resets.</li>
                <li>Move each egg into an Egg Incubator and adjust hot/cold messages.</li>
                <li>Only promote children that improve the target Pal or passive chain.</li>
              </ol>
            </div>

            <div className="breeding-fact-grid">
              {factCards.map((card) => (
                <RouteLink key={card.label} className="breeding-fact-card" href={card.href}>
                  <strong>{card.value}</strong>
                  <span>{card.label}</span>
                  <p>{card.detail}</p>
                </RouteLink>
              ))}
            </div>
          </div>
        </section>

        <section id="planner" className="breeding-tool-section" aria-label="Breeding planner tool">
          <BreedingPlanner steps={breedingSteps} cakePlan={cakePlan} mutationCards={mutationCards} />
        </section>

        <section className="breeding-flow-section" aria-labelledby="breeding-flow-title">
          <div className="breeding-section-head">
            <span className="eyebrow">How players use it</span>
            <h2 id="breeding-flow-title">Choose the workflow that matches your current goal</h2>
            <p>
              These workflows match common player goals: first farm setup, Cake scaling, target Pal routes,
              passive chains, and 1.0 mutation batches.
            </p>
          </div>
          <div className="breeding-flow-grid">
            {playerFlows.map((flow) => (
              <article key={flow.title} className="breeding-flow-card">
                <span>{flow.eyebrow}</span>
                <h3>{flow.title}</h3>
                <p>{flow.intent}</p>
                <ul>
                  {flow.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                  <small>{flow.fieldNote}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="cake-route" className="breeding-cake-section" aria-labelledby="breeding-cake-title">
          <div className="breeding-section-head">
            <span className="eyebrow">Cake and 1.0 effects</span>
            <h2 id="breeding-cake-title">Use the right Cake for the batch you are testing</h2>
            <p>
              Normal Cake is the baseline input for egg production. Palworld 1.0 added special Cake effects, so
              batch planning now matters more than simply filling the farm box.
            </p>
          </div>
          <div className="breeding-cake-variant-grid">
            {cakeVariants.map((cake) => (
              <article key={cake.name} className="breeding-cake-variant-card">
                <div>
                  <Image
                    src={cake.name === "Cake" ? "/images/database/cake.png" : "/images/database/_category-ingredients.png"}
                    alt={`${cake.name} Palworld breeding use`}
                    width={56}
                    height={56}
                    sizes="48px"
                  />
                  <span>{cake.use}</span>
                </div>
                <h3>{cake.name}</h3>
                <p>{cake.effect}</p>
                <small>{cake.proof}</small>
                {cake.href && <Link href={cake.href}>Open Database entry</Link>}
              </article>
            ))}
          </div>
        </section>

        <section id="breeding-faq" className="breeding-faq-section" aria-labelledby="breeding-faq-title">
          <div className="breeding-section-head">
            <span className="eyebrow">FAQ</span>
            <h2 id="breeding-faq-title">Breeding questions players ask first</h2>
            <p>
              Use these quick answers before scaling a breeding base or spending rare parents on a long passive chain.
            </p>
          </div>

          <div className="breeding-faq-grid" aria-label="Breeding FAQ">
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

