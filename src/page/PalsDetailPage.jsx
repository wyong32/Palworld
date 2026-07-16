import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/seo/site";

function FactRow({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function GuideCard({ title, verdict, children }) {
  return (
    <article className="pal-guide-card">
      <span>{verdict}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function JoinList({ values, fallback = "No direct advantage listed" }) {
  return values.length > 0 ? values.join(", ") : fallback;
}

function PalComboLink({ href, children }) {
  if (!href || href.endsWith("/pals/")) {
    return <strong>{children}</strong>;
  }

  return <Link href={href}>{children}</Link>;
}

export default function PalsDetailPage({ pal }) {
  const updatedDate = pal.lastChecked || pal.publishDate;
  const primaryWork = pal.primaryWork;
  const combatCandidate = pal.roles.includes("Combat Candidate");
  const intro = pal.decisionSummary
    ? `${pal.title} is most useful for ${pal.decisionSummary}.`
    : `${pal.title} is currently best treated as a Paldeck and species-comparison entry.`;
  const url = `${siteConfig.url}/pals/${pal.addressBar}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `Palworld Pals - ${pal.title} Guide`,
        description: `${intro} Compare work suitability, combat matchups, partner skill, drops, breeding routes, and related Pals.`,
        datePublished: pal.publishDate,
        dateModified: updatedDate,
        image: `${siteConfig.url}${pal.imageUrl}`,
        url,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        about: ["Palworld", pal.title, "Palworld Pals", "Palworld work suitability"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Palworld Pals", item: `${siteConfig.url}/pals` },
          { "@type": "ListItem", position: 3, name: pal.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="detail-hero-section pal-detail-hero-section">
        <div className="container">
          <div className="detail-hero-content pal-detail-hero-content">
            <div className="detail-hero-copy">
              <span className="wiki-kicker">Palworld Pal Guide</span>
              <h1>Palworld Pals - {pal.title} Guide</h1>
              <p>
                {intro} Compare its base role, element matchups, Partner Skill, drops,
                breeding options, and the Pals that compete for the same job.
              </p>
              <div className="pal-detail-chip-row">
                {pal.elements.map((element) => (
                  <span className={`pal-element-chip pal-element-${element.toLowerCase().replace(/\s+/g, "-")}`} key={element}>
                    {element}
                  </span>
                ))}
                {pal.roles.slice(0, 5).map((role) => (
                  <span className="pal-role-badge" key={role}>{role}</span>
                ))}
              </div>
            </div>
            <div className="detail-hero-image pal-detail-hero-image">
              <Image src={pal.imageUrl} alt={pal.imageAlt} width={760} height={570} preload />
            </div>
          </div>
        </div>
      </section>

      <section className="detail-body-section">
        <div className="container">
          <div className="detail-body-content">
            <article className="detail-article pal-detail-article">
              <nav className="pal-detail-toc" aria-label={`${pal.title} guide sections`}>
                <a href="#how-to-use">Best uses</a>
                <a href="#work-planner">Base work</a>
                <a href="#combat-matchups">Combat</a>
                <a href="#where-to-find">Where to find</a>
                <a href="#breeding-planner">Breeding</a>
                <a href="#database-links">Drops</a>
                <a href="#task-chain">Task chain</a>
                <a href="#related-pals">Compare</a>
                <a href="#data-status">Data status</a>
              </nav>

              <section id="how-to-use" className="pal-detail-section">
                <span className="wiki-kicker">At a glance</span>
                <h2>Best uses for {pal.title}</h2>
                <p>
                  Choose {pal.title} for the role it performs well, not simply because it is available.
                  These recommendations combine the work levels, element, mount role, Partner Skill,
                  drops, and known breeding routes recorded on this page.
                </p>
                <div className="pal-guide-card-grid">
                  <GuideCard title="Base work" verdict={pal.recommendations.base}>
                    {primaryWork
                      ? `Prioritize ${primaryWork.type} Lv.${primaryWork.level}. ${pal.work.length > 1 ? "Limit lower-priority jobs at the Monitoring Stand so it stays on the production line you built it for." : "Its narrow work profile makes assignment easier to control."}`
                      : "No Work Suitability level is currently recorded, so do not plan a production line around it yet."}
                  </GuideCard>
                  <GuideCard title="Combat team" verdict={pal.recommendations.combat}>
                    {combatCandidate
                      ? `Use ${pal.title} when ${pal.element} coverage fits the encounter. Check active skills and the Partner Skill before investing rare upgrade materials.`
                      : `Its element can still fill a matchup gap, but the current entry does not place it on the main combat shortlist.`}
                  </GuideCard>
                  <GuideCard title="Exploration" verdict={pal.recommendations.travel}>
                    {pal.travelType
                      ? `Use it for ${pal.travelType.toLowerCase()} routes after unlocking the required Pal Gear.`
                      : "No ride, flight, swimming, or glider role is recorded; bring a separate travel Pal for long routes."}
                  </GuideCard>
                  <GuideCard title="Breeding" verdict={pal.recommendations.breeding}>
                    {pal.breedingCombos.length > 0
                      ? "Review the recorded combinations below, then keep clean parent passives separate from Mutation experiments."
                      : "Use it as a parent only when its species result, passives, or work role moves the target line forward."}
                  </GuideCard>
                </div>
              </section>

              <section id="work-planner" className="pal-detail-section">
                <span className="wiki-kicker">Base planner</span>
                <h2>{pal.title} Work Suitability</h2>
                {pal.work.length > 0 ? (
                  <>
                    <p>
                      Higher Work Suitability levels complete their matching jobs faster. For a multi-job Pal,
                      prioritize the highest level first and disable tasks that repeatedly pull it away from the key station.
                    </p>
                    <div className="pal-work-grid">
                      {pal.work.map((work) => (
                        <div className="pal-work-tile" key={`${work.type}-${work.level}`}>
                          <strong>{work.type}</strong>
                          <span>Lv.{work.level}</span>
                          <small>{work.level === work.topLevel ? "Highest recorded level" : `Recorded ceiling Lv.${work.topLevel}`}</small>
                        </div>
                      ))}
                    </div>
                    <p>
                      Compare these levels with other <Link href="/pals#work-filters">Palworld base workers</Link> before
                      spending Pal Souls, Work Suitability books, or condensation copies.
                    </p>
                  </>
                ) : (
                  <p>
                    Work Suitability has not been recorded for {pal.title}. Treat it as a field, combat,
                    travel, or collection Pal until a current work profile is available.
                  </p>
                )}
              </section>

              <section id="combat-matchups" className="pal-detail-section">
                <span className="wiki-kicker">Battle guide</span>
                <h2>{pal.title} combat matchups</h2>
                <p>
                  {pal.title} uses {pal.element} typing. Element advantage is the first check; active-skill power,
                  Partner Skill behavior, passives, Potential, equipment, and the specific boss phase still decide
                  whether it deserves a permanent team slot.
                </p>
                <div className="pal-matchup-grid">
                  <div>
                    <strong>Strong into</strong>
                    <span>{JoinList({ values: pal.strongAgainst })}</span>
                  </div>
                  <div>
                    <strong>Countered by</strong>
                    <span>{JoinList({ values: pal.weakAgainst, fallback: "No direct counter listed" })}</span>
                  </div>
                  <div>
                    <strong>Partner Skill</strong>
                    <span>{pal.partnerSkill || "No Partner Skill is recorded"}</span>
                  </div>
                </div>
              </section>

              <section id="where-to-find" className="pal-detail-section">
                <span className="wiki-kicker">Capture route</span>
                <h2>Where to find and catch {pal.title}</h2>
                <p>
                  Open the <Link href="/map">Palworld interactive map</Link>, enable the Pal or Alpha layer,
                  and search for {pal.title}. The current habitat field records {pal.habitat || "no time-of-day detail"},
                  so verify the marker and active time before committing rare Spheres to a long trip.
                </p>
                <div className="database-step-list">
                  <div><strong>01</strong><span>Search {pal.title} on the map and choose the nearest unlocked fast-travel point.</span></div>
                  <div><strong>02</strong><span>Bring {JoinList({ values: pal.weakAgainst, fallback: "appropriate counter-element" })} coverage, capture Spheres, food, and repair materials.</span></div>
                  <div><strong>03</strong><span>Lower health carefully, avoid finishing the target with damage-over-time effects, then improve the capture angle before throwing.</span></div>
                </div>
              </section>

              <section id="breeding-planner" className="pal-detail-section">
                <span className="wiki-kicker">Breeding route</span>
                <h2>{pal.title} breeding combinations</h2>
                {pal.breedingCombos.length > 0 ? (
                  <div className="pal-guide-card-grid">
                    {pal.breedingCombos.map((combo) => (
                      <article className="pal-guide-card" key={`${combo.parentA}-${combo.parentB}-${combo.target}`}>
                        <span>{combo.role}</span>
                        <h3>
                          <PalComboLink href={combo.parentAHref}>{combo.parentA}</PalComboLink>
                          {" + "}
                          <PalComboLink href={combo.parentBHref}>{combo.parentB}</PalComboLink>
                          {" = "}
                          <PalComboLink href={combo.targetHref}>{combo.target}</PalComboLink>
                        </h3>
                        <p>{combo.why} {combo.action}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p>
                    No curated combination involving {pal.title} is recorded in the current planner. Use the general
                    <Link href="/breeding#planner"> Palworld breeding planner</Link> to compare available parent routes,
                    then verify the result before scaling a passive or Mutation line.
                  </p>
                )}
              </section>

              <section id="database-links" className="pal-detail-section">
                <span className="wiki-kicker">Items and Pal Gear</span>
                <h2>{pal.title} drops and Database links</h2>
                <p>
                  The listed drops are {pal.drops || "not yet recorded"}. Open a linked item when you need its
                  category, use case, related materials, or the next Pal connection.
                </p>
                {pal.linkedDrops.length > 0 ? (
                  <div className="pal-drop-grid">
                    {pal.linkedDrops.map((drop) => (
                      <Link href={drop.href} className="pal-drop-card" key={drop.href}>
                        <Image src={drop.imageUrl} alt={`${drop.title} database item`} width={96} height={72} />
                        <span><strong>{drop.title}</strong><small>{drop.category}</small></span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No matching Database item page is linked for this Pal&apos;s current drop text.</p>
                )}
                {pal.linkedTech && (
                  <div className="pal-tech-callout">
                    <strong>Pal Gear</strong>
                    {pal.linkedTech.href ? <Link href={pal.linkedTech.href}>{pal.linkedTech.title}</Link> : <span>{pal.linkedTech.title}</span>}
                  </div>
                )}
              </section>

              <section id="task-chain" className="pal-detail-section">
                <span className="wiki-kicker">Next Step</span>
                <h2>{pal.title} task chain</h2>
                <p>
                  Use {pal.title} as part of a route, not as an isolated Paldeck entry. The next useful page depends
                  on whether you are catching it, breeding it, comparing workers, farming drops, or replacing a team slot.
                </p>
                <div className="database-task-chain">
                  {pal.taskLinks.map((link) => (
                    <Link href={link.href} key={`${link.href}-${link.label}`}>
                      <strong>{link.label}</strong>
                      <span>{link.note}</span>
                    </Link>
                  ))}
                </div>
              </section>

              <section id="related-pals" className="pal-detail-section">
                <span className="wiki-kicker">Role comparison</span>
                <h2>Pals to compare with {pal.title}</h2>
                <p>
                  These Pals share elements, work roles, travel roles, or other practical traits. Compare the exact
                  Work Suitability level and Partner Skill before replacing a trained Pal.
                </p>
                <div className="pal-related-grid">
                  {pal.relatedPals.map((related) => (
                    <Link href={related.href} className="pal-related-card" key={related.href}>
                      <Image src={related.imageUrl} alt={`${related.title} Palworld icon`} width={92} height={92} />
                      <span><strong>{related.title}</strong><small>{related.element}</small></span>
                    </Link>
                  ))}
                </div>
              </section>

              <section id="data-status" className="pal-detail-section">
                <span className="wiki-kicker">Version Check</span>
                <h2>{pal.title} data status</h2>
                <div className="database-status-grid">
                  <div><strong>Updated date</strong><span>{pal.dataStatus.updated}</span></div>
                  <div><strong>Game version</strong><span>{pal.dataStatus.gameVersion}</span></div>
                  <div><strong>Data type</strong><span>{pal.dataStatus.sourceType}</span></div>
                  <div><strong>Precision</strong><span>{pal.dataStatus.precision}</span></div>
                </div>
              </section>
            </article>

            <aside className="detail-side-panel pal-detail-side-panel">
              <h2>{pal.title} facts</h2>
              <dl className="detail-fact-list">
                <FactRow label="Paldeck No." value={pal.number} />
                <FactRow label="Element" value={pal.element} />
                <FactRow label="Recommended Role" value={pal.recommendations.base} />
                <FactRow label="Travel Role" value={pal.travelType} />
                <FactRow label="Partner Skill" value={pal.partnerSkill} />
                <FactRow label="Drops" value={pal.drops} />
                <FactRow label="Habitat" value={pal.habitat} />
                <FactRow label="Group" value={pal.section} />
                <FactRow label="Updated" value={pal.dataStatus.updated || updatedDate} />
                <FactRow label="Game Version" value={pal.dataStatus.gameVersion} />
                <FactRow label="Data Type" value={pal.dataStatus.sourceType} />
              </dl>
              <div className="detail-related-links">
                <Link href="/pals">Back to Paldeck</Link>
                <Link href="/map">Find on the map</Link>
                <Link href="/breeding#planner">Open breeding planner</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
