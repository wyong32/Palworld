import Link from "next/link";
import BreedingCalculatorTool from "@/components/BreedingCalculatorTool";
import GptAdSlot from "@/components/GptAdSlot";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { featuredBreedingCombos } from "@/data/breedingTools";
import { breedingMatrixStats } from "@/data/breedingMatrix";
import { pals } from "@/data/pals";
import { breedingCalculatorTrail } from "@/seo/breadcrumbs";
import { absoluteUrl, buildMetadata, pageSeo, siteConfig } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.breedingCalculator, "/breeding/calculator", {
  type: "article",
  publishedTime: "2026-07-17",
  modifiedTime: "2026-07-17",
});

const calculatorFaq = [
  {
    question: "What does the Palworld Breeding Calculator do?",
    answer:
      "It checks two selected parents against the current 1.0 breeding table, shows the child Pal, and links the result to local Pal detail pages for work roles, drops, and route planning.",
  },
  {
    question: "Can I search for all parent pairs for one target Pal?",
    answer:
      "Yes. Choose Target to Parents, select the Pal you want, then filter the parent list by name or element to find a pair you can capture, own, or prepare for a passive chain.",
  },
  {
    question: "Should I still plan Cake and passive skills?",
    answer:
      "Yes. The calculator gives the species result, but a strong breeding route still needs Cake production, clean parent passives, incubator capacity, and a clear plan for which children become the next parents.",
  },
];

const routeCards = [
  {
    title: "Parent pair result",
    text: "Pick two graphic Pal cards and read the child immediately. Use this when you already own both parents.",
  },
  {
    title: "Target Pal lookup",
    text: "Choose a target such as Anubis, Jormuntide Ignis, or Shadowbeak and compare possible parent pairs.",
  },
  {
    title: "Passive route planning",
    text: "After the species result is clear, keep clean parent passives separate from Mutation or special Cake test batches.",
  },
];

function findPalSummary(title) {
  const pal = pals.find((item) => item.title.toLowerCase() === title.toLowerCase());

  if (!pal) {
    return null;
  }

  return {
    title: pal.title,
    addressBar: pal.addressBar,
    imageUrl: pal.imageUrl,
    imageAlt: pal.imageAlt,
    element: pal.element,
    elements: pal.elements,
  };
}

export default function BreedingCalculatorPage() {
  const combos = featuredBreedingCombos.map((combo) => ({
    ...combo,
    parentARef: findPalSummary(combo.parentA),
    parentBRef: findPalSummary(combo.parentB),
    targetRef: findPalSummary(combo.target),
  }));

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Palworld Breeding Calculator",
    url: absoluteUrl("/breeding/calculator"),
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description: pageSeo.breedingCalculator.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calculatorFaq.map((item) => ({
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageBreadcrumbs items={breedingCalculatorTrail()} />

      <article className="breeding-calculator-page">
        <section className="breeding-calculator-hero" aria-labelledby="breeding-calculator-title">
          <div className="breeding-calculator-hero-copy">
            <span className="eyebrow">Palworld 1.0 breeding tool</span>
            <h1 id="breeding-calculator-title">Palworld Breeding Calculator - 1.0 Combos, Parent Pairs, and Paths</h1>
            <p>
              Palworld Breeding Calculator helps you choose Parent A and Parent B, check the child,
              reverse-search target Pal combinations, and move from a result into Pal details, Cake planning,
              and passive-route decisions.
            </p>
            <div className="breeding-calculator-meta" aria-label="Calculator coverage">
              <span>{breedingMatrixStats.version}</span>
              <span>{breedingMatrixStats.selectablePalCount} selectable · {breedingMatrixStats.palCount} Pal entries</span>
              <span>{breedingMatrixStats.possiblePairCount.toLocaleString()} parent pairs</span>
              <span>Updated {breedingMatrixStats.updatedAt}</span>
            </div>
          </div>
          <aside className="breeding-calculator-route-card" aria-label="Recommended workflow">
            <strong>Best first use</strong>
            <p>
              Start with Parents to Child when you own both Pals. Switch to Target to Parents when the goal is a
              specific worker, mount, boss team member, or passive-skill project.
            </p>
            <Link href="/breeding">Open full breeding guide</Link>
          </aside>
        </section>

        {/* GPT 广告：banner_1 */}
        <GptAdSlot elementId="div-gpt-ad-breeding-calculator-1" unit={1} />

        <BreedingCalculatorTool combos={combos} />

        {/* GPT 广告：banner_2 */}
        <GptAdSlot elementId="div-gpt-ad-breeding-calculator-2" unit={2} />

        <section className="breeding-calculator-section" aria-labelledby="breeding-calculator-route-title">
          <div className="breeding-section-head">
            <span className="eyebrow">How to use the result</span>
            <h2 id="breeding-calculator-route-title">Turn a Palworld breeding combo into the next player action</h2>
            <p>
              A species result is only the first answer. The next decision is whether the child is worth hatching
              repeatedly, whether the parents are easy to replace, and which route supports your current save.
            </p>
          </div>
          <div className="breeding-calculator-route-grid">
            {routeCards.map((card) => (
              <article key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* GPT 广告：banner_3 */}
        <GptAdSlot elementId="div-gpt-ad-breeding-calculator-3" unit={3} />

        <section className="breeding-calculator-section" aria-labelledby="breeding-calculator-support-title">
          <div className="breeding-section-head">
            <span className="eyebrow">Connected pages</span>
            <h2 id="breeding-calculator-support-title">Plan the farm around the combo, not the other way around</h2>
            <p>
              Use the calculator for species results, then check <Link href="/database/ingredients/cake">Cake</Link>,{" "}
              <Link href="/database/structures/breeding-farm">Breeding Farm</Link>,{" "}
              <Link href="/database/structures/egg-incubator">Egg Incubator</Link>, and the target Pal page before
              spending rare passives or special Cake batches.
            </p>
          </div>
        </section>

        {/* GPT 广告：banner_1 */}
        <GptAdSlot elementId="div-gpt-ad-breeding-calculator-4" unit={1} />

        <section className="breeding-calculator-section" aria-labelledby="breeding-calculator-faq-title">
          <div className="breeding-section-head">
            <span className="eyebrow">FAQ</span>
            <h2 id="breeding-calculator-faq-title">Palworld Breeding Calculator questions</h2>
          </div>
          <div className="breeding-faq-grid" aria-label="Breeding calculator FAQ">
            {calculatorFaq.map((item) => (
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
