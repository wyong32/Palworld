import Image from "next/image";
import Link from "next/link";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { buildBreadcrumbJsonLd, palsDetailTrail } from "@/seo/breadcrumbs";
import { siteConfig } from "@/seo/site";

function FactRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}

function formatCoordinate(value) {
  return Number.isFinite(value) ? Math.round(value).toLocaleString("en-US") : "Unknown";
}

function StatCard({ label, value, note }) {
  return (
    <div className="entity-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function PalLink({ href, children }) {
  return href ? <Link href={href}>{children}</Link> : <strong>{children}</strong>;
}

function dropQuantity(drop) {
  return drop.min === drop.max ? `${drop.min}` : `${drop.min}–${drop.max}`;
}

export default function PalsDetailPage({ pal }) {
  const game = pal.gameData;
  const stats = game?.stats;
  const updatedDate = pal.lastChecked || pal.publishDate;
  const url = `${siteConfig.url}/pals/${pal.addressBar}`;
  const breadcrumbs = palsDetailTrail(pal);
  const lead = game?.description || pal.summary;
  const topWork = pal.work[0] || null;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${pal.title} stats, locations and breeding guide`,
        description: lead,
        datePublished: pal.publishDate,
        dateModified: updatedDate,
        image: `${siteConfig.url}${pal.imageUrl}`,
        url,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        about: [pal.title, ...pal.elements, "base stats", "work suitability", "breeding"],
      },
      buildBreadcrumbJsonLd(breadcrumbs),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageBreadcrumbs items={breadcrumbs} />

      <section className="detail-hero-section pal-detail-hero-section">
        <div className="container">
          {pal.publicationStatus.key !== "current" && (
            <aside className={`pal-publication-alert is-${pal.publicationStatus.key}`} role="note">
              <strong>{pal.publicationStatus.label}</strong>
              <span>{pal.publicationStatus.note}</span>
            </aside>
          )}
          <div className="detail-hero-content pal-detail-hero-content">
            <div className="detail-hero-copy">
              <span className="wiki-kicker">Paldeck #{pal.number}</span>
              <h1>{pal.title}</h1>
              <p>{lead}</p>
              <div className="pal-detail-chip-row">
                {pal.elements.map((element) => (
                  <span className={`pal-element-chip pal-element-${element.toLowerCase().replace(/\s+/g, "-")}`} key={element}>{element}</span>
                ))}
                {pal.work.slice(0, 4).map((work) => <span className="pal-role-badge" key={work.type}>{work.type} Lv.{work.level}</span>)}
              </div>
            </div>
            <div className="detail-hero-image pal-detail-hero-image">
              <Image src={pal.imageUrl} alt={pal.imageAlt} width={760} height={570} preload sizes="(max-width: 768px) 100vw, (max-width: 1024px) 42vw, 360px" />
            </div>
          </div>
        </div>
      </section>

      <section className="detail-body-section">
        <div className="container">
          <div className="detail-body-content">
            <article className="detail-article pal-detail-article">
              <nav className="pal-detail-toc" aria-label={`${pal.title} page sections`}>
                {stats && <a href="#stats">Stats</a>}
                <a href="#work">Work and combat</a>
                {pal.skillData && <a href="#skills">Skills</a>}
                <a href="#locations">Locations</a>
                <a href="#breeding">Breeding</a>
                <a href="#drops">Drops</a>
                <a href="#similar-pals">Similar Pals</a>
              </nav>

              {stats && (
                <section id="stats" className="pal-detail-section">
                  <span className="wiki-kicker">Species parameters</span>
                  <h2>{pal.title} base stats</h2>
                  <p>
                    These are version 1.0 species base parameters, not a leveled character sheet.
                    Level, Potential, passives, condensation and other modifiers change the values shown in play.
                  </p>
                  <div className="entity-stat-grid">
                    <StatCard label="HP" value={stats.hp} />
                    <StatCard label="Melee attack" value={stats.meleeAttack} />
                    <StatCard label="Ranged attack" value={stats.rangedAttack} />
                    <StatCard label="Defense" value={stats.defense} />
                    <StatCard label="Support" value={stats.support} />
                    <StatCard label="Stamina" value={stats.stamina} />
                    <StatCard label="Run speed" value={stats.runSpeed} />
                    <StatCard label="Transport speed" value={stats.transportSpeed} />
                  </div>
                </section>
              )}

              <section id="work" className="pal-detail-section">
                <span className="wiki-kicker">Practical role</span>
                <h2>What {pal.title} is good at</h2>
                {pal.work.length > 0 ? (
                  <>
                    <div className="pal-work-grid">
                      {pal.work.map((work) => (
                        <div className="pal-work-tile" key={work.type}>
                          <strong>{work.type}</strong>
                          <span>Lv.{work.level}</span>
                          <small>{work.level === work.topLevel ? "Current table maximum" : `Table maximum Lv.${work.topLevel}`}</small>
                        </div>
                      ))}
                    </div>
                    <p className="editorial-note">
                      <strong>Practical reading:</strong> {topWork
                        ? `${topWork.type} Lv.${topWork.level} is the strongest recorded base assignment for ${pal.title}${pal.work.length > 1 ? `; its other jobs are ${pal.work.slice(1).map((work) => `${work.type} Lv.${work.level}`).join(", ")}.` : "."}`
                        : `${pal.title} has no recorded base assignment.`}
                      {pal.travelType && ` Its ${pal.travelType.toLowerCase()} role is separate from base Work Suitability.`}
                    </p>
                  </>
                ) : (
                  <p>{pal.title} has no non-zero Work Suitability entry in the matched 1.0 species record. Use it for combat, travel or collection only when its Partner Skill and your team plan justify the slot.</p>
                )}
                <div className="pal-matchup-grid">
                  <div><strong>Strong against</strong><span>{pal.strongAgainst.length ? pal.strongAgainst.join(", ") : "No direct elemental advantage"}</span></div>
                  <div><strong>Weak against</strong><span>{pal.weakAgainst.length ? pal.weakAgainst.join(", ") : "No direct elemental weakness"}</span></div>
                  <div><strong>Partner Skill</strong><span>{pal.partnerSkill || "Not recorded"}</span></div>
                </div>
              </section>

              {pal.skillData && (
                <section id="skills" className="pal-detail-section">
                  <span className="wiki-kicker">1.0 skill verification</span>
                  <h2>{pal.title} Partner Skill and learnset</h2>
                  <article className="pal-partner-skill-card">
                    <div>
                      <span>Partner Skill</span>
                      <h3>{pal.skillData.partnerSkill.name || "No current Partner Skill record"}</h3>
                    </div>
                    <p>{pal.skillData.partnerSkill.description || "No effect description is available for this Partner Skill."}</p>
                    {pal.skillData.partnerSkill.valuesByRank?.length > 0 && (
                      <dl>
                        {pal.skillData.partnerSkill.valuesByRank.map((value, index) => (
                          <div key={`${pal.title}-partner-rank-${index + 1}`}><dt>Rank {index + 1}</dt><dd>{value}</dd></div>
                        ))}
                      </dl>
                    )}
                  </article>

                  {pal.skillData.innateTraits.length > 0 && (
                    <div className="pal-innate-trait-list">
                      <h3>Innate traits</h3>
                      {pal.skillData.innateTraits.map((trait) => (
                        <article key={trait.internalId}>
                          <strong>{trait.name}</strong>
                          <span>{trait.description || "No effect description is available for this trait."}</span>
                        </article>
                      ))}
                    </div>
                  )}

                  {pal.skillData.activeSkills.length > 0 ? (
                    <div className="pal-active-skill-table">
                      <div className="pal-active-skill-head" aria-hidden="true">
                        <span>Level</span><span>Skill</span><span>Element</span><span>Power</span><span>Cooldown</span>
                      </div>
                      {pal.skillData.activeSkills.map((skill) => (
                        <article key={`${skill.internalId}-${skill.learnLevel}`}>
                          <span>Lv.{skill.learnLevel}</span>
                          <div><strong>{skill.name}</strong><small>{skill.type} · {skill.description}</small></div>
                          <span>{skill.element}</span>
                          <span>{skill.power || "—"}</span>
                          <span>{skill.cooldown ? `${skill.cooldown}s` : "—"}</span>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p>No natural Active Skill learnset was present for this record.</p>
                  )}
                </section>
              )}

              <section id="locations" className="pal-detail-section">
                <span className="wiki-kicker">Encounter data</span>
                <h2>Where to find {pal.title}</h2>
                {pal.mapEncounters.length > 0 ? (
                  <>
                    <p>{pal.mapPointCount} fixed Alpha encounter{pal.mapPointCount === 1 ? " is" : "s are"} available below. These are exact encounter coordinates, not approximate habitat markers.</p>
                    <div className="pal-map-location-grid">
                      {pal.mapEncounters.map((encounter) => (
                        <article key={encounter.id}>
                          <span>Fixed Alpha · Lv.{encounter.level ?? "Unknown"}</span>
                          <h3>{pal.title} in {encounter.regionLabel}</h3>
                          <dl>
                            <div><dt>World X</dt><dd>{formatCoordinate(encounter.world?.x)}</dd></div>
                            <div><dt>World Y</dt><dd>{formatCoordinate(encounter.world?.y)}</dd></div>
                          </dl>
                          <Link href={encounter.mapHref}>Open exact map marker</Link>
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>
                    No fixed Alpha coordinate for {pal.title} is present in the current boss-spawner dataset.
                    {pal.habitat ? ` The existing habitat record is “${pal.habitat}”, but it is not precise enough to present as a coordinate.` : " No precise location is available on this page."}
                    {" "}<Link href="/map#interactive-map-title">Open the map</Link> for encounters with validated points.
                  </p>
                )}
              </section>

              <section id="breeding" className="pal-detail-section">
                <span className="wiki-kicker">Current breeding table</span>
                <h2>How to breed {pal.title}</h2>
                {pal.publicationStatus.key === "boss-only" ? (
                  <p>{pal.title} is a boss-only Paldeck entry and cannot currently be captured, owned, deployed, or bred. Its internal self-pair row is excluded from player-facing breeding routes.</p>
                ) : pal.breedingRoutes.length > 0 ? (
                  <>
                    <p>Each parent pair below resolves to {pal.title} in the current site breeding matrix. Parent passives and Potential do not change the species result.</p>
                    <div className="breeding-route-grid">
                      {pal.breedingRoutes.map((route) => (
                        <div className="breeding-route-card" key={`${route.parentA}-${route.parentB}`}>
                          <PalLink href={route.parentAHref}>{route.parentA}</PalLink>
                          <span>+</span>
                          <PalLink href={route.parentBHref}>{route.parentB}</PalLink>
                          <span>=</span>
                          <strong>{pal.title}</strong>
                        </div>
                      ))}
                    </div>
                    <p><Link href="/breeding/calculator">Open the breeding calculator</Link> to search every current parent pair.</p>
                  </>
                ) : (
                  <p>No current parent pair is indexed for {pal.title}. Do not use older pre-1.0 combinations without checking them in the <Link href="/breeding/calculator">breeding calculator</Link>.</p>
                )}
              </section>

              <section id="drops" className="pal-detail-section">
                <span className="wiki-kicker">Standard drop table</span>
                <h2>{pal.title} drops</h2>
                {game?.drops?.length > 0 ? (
                  <div className="drop-table-wrap">
                    <table className="entity-data-table">
                      <thead><tr><th>Item</th><th>Drop rate</th><th>Quantity</th></tr></thead>
                      <tbody>
                        {game.drops.map((drop) => (
                          <tr key={drop.id}>
                            <td>{drop.href ? <Link href={drop.href}>{drop.title}</Link> : drop.title}</td>
                            <td>{drop.rate}%</td>
                            <td>{dropQuantity(drop)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No standard drop-rate data is available for {pal.title}. The page does not infer missing rates.</p>
                )}
                {pal.linkedTech && <p className="pal-tech-callout"><strong>Related Pal Gear:</strong> {pal.linkedTech.href ? <Link href={pal.linkedTech.href}>{pal.linkedTech.title}</Link> : pal.linkedTech.title}</p>}
              </section>

              <section id="similar-pals" className="pal-detail-section">
                <span className="wiki-kicker">Direct comparisons</span>
                <h2>Pals similar to {pal.title}</h2>
                <p>These entries share an element, Work Suitability type or practical role. Compare their exact work levels and base parameters before replacing a trained Pal.</p>
                <div className="pal-related-grid">
                  {pal.relatedPals.map((related) => (
                    <Link href={related.href} className="pal-related-card" key={related.href}>
                      <Image src={related.imageUrl} alt={`${related.title} icon`} width={92} height={92} sizes="72px" />
                      <span><strong>{related.title}</strong><small>{related.element} · {related.workSuitability || "No base work"}</small></span>
                    </Link>
                  ))}
                </div>
              </section>

            </article>

            <aside className="detail-side-panel pal-detail-side-panel">
              <h2>{pal.title} record</h2>
              <dl className="detail-fact-list">
                <FactRow label="Paldeck No." value={pal.number} />
                <FactRow label="Internal ID" value={game?.internalId} />
                <FactRow label="Element" value={pal.elements.join(", ")} />
                <FactRow label="Size" value={stats?.size} />
                <FactRow label="Rarity value" value={stats?.rarity} />
                <FactRow label="Breeding power" value={stats?.breedingPower} />
                <FactRow label="Partner Skill" value={pal.partnerSkill} />
                <FactRow label="Updated" value={updatedDate} />
              </dl>
              <div className="detail-related-links">
                <Link href="/pals">All Pals</Link>
                <Link href={pal.mapHref || "/map#interactive-map-title"}>Open map</Link>
                <Link href="/breeding/calculator">Breeding calculator</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
