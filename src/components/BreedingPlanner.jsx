import Image from "next/image";
import Link from "next/link";

function ItemChip({ item, fallback, href }) {
  const content = (
    <>
      {item?.imageUrl && <Image src={item.imageUrl} alt={item.imageAlt || item.title} width={44} height={44} sizes="40px" />}
      <span>{item?.title || fallback}</span>
    </>
  );

  if (!href) {
    return <span className="breeding-item-chip">{content}</span>;
  }

  return (
    <Link className="breeding-item-chip" href={href}>
      {content}
    </Link>
  );
}

export default function BreedingPlanner({ steps, cakePlan, mutationCards }) {
  return (
    <section className="guide-tool-shell breeding-planner" aria-labelledby="breeding-planner-title">
      <div className="tool-section-head">
        <span>Player Tool</span>
        <h2 id="breeding-planner-title">Breeding Planner and Cake Route</h2>
        <p>
          Open the calculator for parent pairs, then use this route board to keep Cake, eggs, and Mutation batches moving.
        </p>
      </div>

      <div className="breeding-cake-board breeding-calculator-board">
        <div className="breeding-results-head">
          <div>
            <h3>Palworld Breeding Calculator</h3>
            <p>
              Open the dedicated calculator to choose graphic Parent A and Parent B cards, find the child,
              reverse-search target Pal pairs, and compare the result against Pal detail pages.
            </p>
          </div>
          <Link className="breeding-calculator-link" href="/breeding/calculator">
            Open Palworld Breeding Calculator
          </Link>
        </div>
        <div className="breeding-calculator-preview">
          <span>Parents to child</span>
          <span>Target to parents</span>
          <span>Featured combo routes</span>
          <span>Pal detail links</span>
        </div>
      </div>

      <div className="breeding-ops-grid">
        {steps.map((step, index) => (
          <article key={step.title} className="breeding-step-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.action}</p>
            <small>{step.detail}</small>
          </article>
        ))}
      </div>

      <div className="breeding-cake-board">
        <div>
          <h3>Cake automation checklist</h3>
          <p>
            Cake is the breeding bottleneck. Build this loop once, then scale parents instead of hand-farming every egg.
          </p>
        </div>
        <div className="breeding-cake-grid">
          {cakePlan.map((part) => (
            <article key={part.item} className="breeding-cake-card">
              <div className="breeding-cake-title">
                <ItemChip item={part.itemRef} fallback={part.item} href={part.itemHref} />
                <strong>x{part.quantity}</strong>
              </div>
              <p>{part.source}</p>
              <small>{part.tip}</small>
            </article>
          ))}
        </div>
      </div>

      <div className="mutation-board">
        {mutationCards.map((card) => (
          <article key={card.title}>
            <span>1.0</span>
            <h3>{card.title}</h3>
            <p>{card.playerAction}</p>
            <small>{card.note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
