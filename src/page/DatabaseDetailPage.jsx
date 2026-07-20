import Image from "next/image";
import Link from "next/link";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { buildBreadcrumbJsonLd, databaseItemTrail } from "@/seo/breadcrumbs";
import { siteConfig } from "@/seo/site";

function FactRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}

function StatCard({ label, value, note }) {
  if (value === null || value === undefined) return null;
  return <div className="entity-stat-card"><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

function CreatureDropCard({ entry }) {
  const content = (
    <>
      <span className="pal-drop-card-image">
        {entry.imageUrl
          ? <Image src={entry.imageUrl} alt="" width={88} height={66} sizes="64px" />
          : <span aria-hidden="true">{entry.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join("")}</span>}
      </span>
      <span>
        <strong>{entry.title}</strong>
        <small>{entry.min === entry.max ? `${entry.min} per drop` : `${entry.min}–${entry.max} per drop`} · {entry.rate}% listed rate</small>
      </span>
    </>
  );

  return entry.href
    ? <Link className="pal-drop-card" href={entry.href}>{content}</Link>
    : <div className="pal-drop-card">{content}</div>;
}

function RecipeItem({ entry, output = false }) {
  const content = (
    <>
      <span className="database-recipe-item-image">
        {entry.imageUrl
          ? <Image src={entry.imageUrl} alt="" width={72} height={72} sizes="48px" />
          : <span aria-hidden="true">{entry.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join("")}</span>}
      </span>
      <span className="database-recipe-item-copy">
        <strong>{entry.title}</strong>
        <small>{output ? "Output" : "Ingredient"}</small>
      </span>
      <b>×{entry.count}</b>
    </>
  );

  return entry.href && !output
    ? <Link className="database-recipe-item" href={entry.href}>{content}</Link>
    : <div className={`database-recipe-item${output ? " is-output" : ""}`}>{content}</div>;
}

function formatRelationList(entries) {
  const labels = entries.map((entry) => `${entry.count} × ${entry.title}`);
  if (labels.length < 2) return labels[0] || "no listed materials";
  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
}

function getRecipeSummary(item, recipe, structure = false) {
  const result = structure
    ? `Building one ${item.title}`
    : `One production cycle creates ${recipe.productCount} × ${item.title}`;
  const work = recipe.workAmount > 0
    ? ` The data lists ${recipe.workAmount.toLocaleString("en-US")} ${structure ? "build " : ""}work.`
    : "";
  const energy = recipe.energyType
    ? ` It also requires ${recipe.energyAmount.toLocaleString("en-US")} ${recipe.energyType} energy.`
    : "";
  return `${result} and consumes ${formatRelationList(recipe.materials)}.${work}${energy}`;
}

function getVisibleStats(game) {
  if (!game) return [];
  const stats = game.stats || {};
  const definitions = game.kind === "creature"
    ? [
        ["HP", stats.hp],
        ["Melee attack", stats.meleeAttack],
        ["Ranged attack", stats.rangedAttack],
        ["Defense", stats.defense],
        ["Support", stats.support],
        ["Stamina", stats.stamina],
        ["Run speed", stats.runSpeed > 0 ? stats.runSpeed : null],
        ["Max HP rate", stats.maxHpRate > 0 ? `${stats.maxHpRate}×` : null],
        ["Damage dealt", stats.damageDealtRate > 0 ? `${stats.damageDealtRate}×` : null],
        ["Damage taken", stats.damageTakenRate > 0 ? `${stats.damageTakenRate}×` : null],
        ["Capture rate", stats.captureRate > 0 ? `${stats.captureRate}×` : null],
        ["Size", stats.size],
        ["Element", [stats.element1, stats.element2].filter((element) => element && element !== "None").join(" / ") || null],
      ]
    : game.kind === "structure"
    ? [
        ["Rank", stats.rank],
        ["Build work", stats.buildWork],
        ["Capacity", stats.buildCapacity > 0 ? stats.buildCapacity : null],
        ["Energy / sec", stats.energyPerSecond > 0 ? stats.energyPerSecond : null],
        ["Per-base limit", stats.maxPerBase > 0 ? stats.maxPerBase : null],
        ["Base-only", stats.baseOnly ? "Yes" : null],
        ["Palbox area", stats.hubAreaOnly ? "Required" : null],
      ]
    : [
        ["Rank", stats.rank],
        ["Rarity value", stats.rarity],
        ["Attack", stats.attack > 0 ? stats.attack : null],
        ["Magic attack", stats.magicAttack > 0 ? stats.magicAttack : null],
        ["Defense", stats.defense > 0 ? stats.defense : null],
        ["Magic defense", stats.magicDefense > 0 ? stats.magicDefense : null],
        ["HP", stats.hp > 0 ? stats.hp : null],
        ["Shield", stats.shield > 0 ? stats.shield : null],
        ["Durability", stats.durability > 0 ? stats.durability : null],
        ["Magazine", stats.magazineSize > 0 ? stats.magazineSize : null],
        ["Satiety", stats.restoreSatiety > 0 ? `+${stats.restoreSatiety}` : null],
        ["SAN", stats.restoreSanity > 0 ? `+${stats.restoreSanity}` : null],
        ["Health", stats.restoreHealth > 0 ? `+${stats.restoreHealth}` : null],
        ["Weight", stats.weight],
        ["Sell price", stats.price > 0 ? stats.price.toLocaleString("en-US") : null],
        ["Max stack", stats.maxStack > 1 ? stats.maxStack.toLocaleString("en-US") : null],
        ["Element", stats.element],
        ["Sleep weapon", stats.sleepWeapon ? "Yes" : null],
        ["Sneak multiplier", stats.sneakAttackRate > 0 && stats.sneakAttackRate !== 1 ? `${stats.sneakAttackRate}×` : null],
      ];
  return definitions.filter(([, value]) => value !== null && value !== undefined);
}

function getEditorialReading(item, game) {
  if (!game) return null;
  const stats = game.stats || {};
  if (game.kind === "creature") {
    if (game.encounters?.length > 0) return `${item.title} has ${game.encounters.length} exact fixed-spawn record${game.encounters.length === 1 ? "" : "s"}. Those coordinates identify the source-table point; they do not imply a safe route, respawn condition or recommended player level.`;
    if (game.subtype === "Human Enemy") return `This page groups rows only when localized name, weapon and organization match. Scenario variants remain visible because an oil-rig, invasion, arena or quest row can carry different combat modifiers.`;
    return `No fixed coordinate is assigned because the extracted boss-spawner table does not provide one for this ${game.subtype}. The absence of a map link is deliberate.`;
  }
  if (game.kind === "structure") return `${item.title} is a placeable structure. Its material list and build-work requirement below are the useful planning values; placement and worker pathing still have to be tested in the player’s base layout.`;
  if (stats.attack > 0) return `${item.title} is an offensive item with ${stats.attack} listed attack${stats.magazineSize > 0 ? ` and a ${stats.magazineSize}-round magazine` : ""}. Compare durability and ammunition availability before treating the higher attack value as a complete loadout decision.`;
  if (stats.defense > 0 || stats.hp > 0 || stats.shield > 0) return `${item.title} contributes ${[stats.defense > 0 && `${stats.defense} defense`, stats.hp > 0 && `${stats.hp} HP`, stats.shield > 0 && `${stats.shield} shield`].filter(Boolean).join(", ")}. Those are equipment values; temperature resistance, passives and the rest of the loadout can still change the better choice.`;
  if (stats.restoreSatiety > 0 || stats.restoreSanity > 0 || stats.restoreHealth > 0) return `${item.title} restores ${[stats.restoreSatiety > 0 && `${stats.restoreSatiety} satiety`, stats.restoreSanity > 0 && `${stats.restoreSanity} SAN`, stats.restoreHealth > 0 && `${stats.restoreHealth} health`].filter(Boolean).join(" and ")}. Use those numbers to compare it with food or medicine competing for the same ingredients.`;
  return game.description ? `The in-game description is the strongest verified statement about ${item.title}; this page does not add an unsupported acquisition route or effect.` : null;
}

export default function DatabaseDetailPage({ item, categorySlug }) {
  const game = item.gameData;
  const isCreature = game?.kind === "creature";
  const visibleStats = getVisibleStats(game);
  const recipes = game?.recipes || [];
  const buildMaterials = game?.materials || [];
  const unlocks = game?.unlocks || [];
  const hasMaterials = recipes.length > 0 || buildMaterials.length > 0;
  const usedInGroups = Object.values(
    item.usedIn.reduce((groups, relation) => {
      groups[relation.category] ||= { category: relation.category, entries: [] };
      groups[relation.category].entries.push(relation);
      return groups;
    }, {}),
  );
  const heroSummary = game
    ? isCreature
      ? game.description
      : `${item.title} is recorded as ${game.subtype || game.type || item.category} in the Palworld 1.0 data.${hasMaterials ? " Its exact material requirements are listed below." : unlocks.length > 0 ? ` It unlocks ${unlocks.length} indexed building or item definitions.` : " Only supported fields are shown below."}`
    : item.guideSummary;
  const heroBadgeMeta = Number.isFinite(game?.stats?.rank)
    ? `Rank ${game.stats.rank}`
    : isCreature && game.encounters?.[0]?.level
      ? `Lv.${game.encounters[0].level}`
    : game?.technology
      ? `Lv.${game.technology.level}`
      : null;
  const heroTags = [...new Set([
    item.category,
    game?.subtype,
    recipes.length > 0 ? `${recipes.length} recipe${recipes.length === 1 ? "" : "s"}` : null,
    item.usedIn.length > 0 ? `Used in ${item.usedIn.length}` : null,
    unlocks.length > 0 ? `${unlocks.length} unlocks` : null,
    game?.encounters?.length > 0 ? `${game.encounters.length} exact map point${game.encounters.length === 1 ? "" : "s"}` : null,
    game?.drops?.length > 0 ? `${game.drops.length} drops` : null,
    game?.variants?.length > 1 ? `${game.variants.length} variants` : null,
    isCreature && game?.weapon && game.weapon !== "None" ? game.weapon : null,
    game?.technology ? `Tech Lv.${game.technology.level}` : null,
    game?.gameplayEnabled === false ? "Item flag off" : null,
  ].filter(Boolean))];
  const purposeSummary = game
    ? isCreature
      ? `${item.title} is backed by a matched ${game.subtype} character row.${game.encounters.length > 0 ? ` The boss-spawner table contributes ${game.encounters.length} exact encounter point${game.encounters.length === 1 ? "" : "s"}.` : " No fixed coordinate is added without a matching boss-spawner row."}${game.drops.length > 0 ? ` The drop table contributes ${game.drops.length} supported reward entr${game.drops.length === 1 ? "y" : "ies"}.` : ""}`
      : `${item.title} is backed by a matched ${game.kind || "item"} record.${recipes.length > 0 ? ` The data includes ${recipes.length} crafting recipe${recipes.length === 1 ? "" : "s"}.` : ""}${buildMaterials.length > 0 ? " Its building-material requirements are listed from the structure table." : ""}${item.usedIn.length > 0 ? ` It also appears in ${item.usedIn.length} indexed downstream recipe or building record${item.usedIn.length === 1 ? "" : "s"}.` : ""}`
    : item.guideSummary;
  const url = `${siteConfig.url}/database/${categorySlug}/${item.addressBar}`;
  const breadcrumbs = databaseItemTrail(item, categorySlug);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: isCreature ? `${item.title} stats, drops and encounter data` : `${item.title} stats, recipe and item details`,
        description: item.guideSummary,
        datePublished: item.publishDate,
        dateModified: item.lastChecked || item.publishDate,
        about: [item.title, item.category, game?.type, game?.subtype].filter(Boolean),
        url,
        mainEntityOfPage: url,
        image: `${siteConfig.url}${item.imageUrl}`,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      buildBreadcrumbJsonLd(breadcrumbs),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageBreadcrumbs items={breadcrumbs} />
      <section className="database-dossier-hero">
        <div className="container">
          <div className="database-dossier-grid">
            <figure className="database-dossier-visual">
              <div className="database-dossier-image-frame">
                <Image src={item.imageUrl} alt={item.imageAlt} width={760} height={570} preload sizes="(max-width: 900px) calc(100vw - 64px), (max-width: 1280px) 32vw, 360px" />
              </div>
              <figcaption>
                <strong>{game?.subtype || game?.type || item.category}</strong>
                {heroBadgeMeta && <span>{heroBadgeMeta}</span>}
              </figcaption>
            </figure>

            <div className="database-dossier-copy">
              <span className="database-dossier-kicker">
                Game data <i aria-hidden="true" /> {game ? item.gameDataProvenance.gameVersion : "Site record"}
              </span>
              <h1>{item.title}</h1>
              <p className="database-dossier-lead">{heroSummary}</p>
              {game?.description && !isCreature && <blockquote>{game.description}</blockquote>}
              <div className="database-dossier-tags" aria-label={`${item.title} record labels`}>
                {heroTags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-body-section">
        <div className="container">
          <div className="detail-body-content">
            <article className="detail-article database-detail-article">
              <nav className="pal-detail-toc" aria-label={`${item.title} page sections`}>
                <a href="#purpose">{isCreature ? "Overview" : "Purpose"}</a>
                {visibleStats.length > 0 && <a href="#stats">Stats</a>}
                {game?.encounters?.length > 0 && <a href="#encounters">Locations</a>}
                {game?.drops?.length > 0 && <a href="#drops">Drops</a>}
                {game?.variants?.length > 1 && <a href="#variants">Variants</a>}
                {hasMaterials && <a href="#recipe">Recipe</a>}
                {item.usedIn.length > 0 && <a href="#used-in">Used in</a>}
                {unlocks.length > 0 && <a href="#contents">Contents</a>}
                {game?.technology && <a href="#unlock">Unlock</a>}
                {item.relatedPals.length > 0 && <a href="#pal-links">Related Pals</a>}
                <a href="#related-items">Related items</a>
              </nav>

              <section className="pal-detail-section" id="purpose">
                <span className="wiki-kicker">{isCreature ? "Verified record" : "Verified function"}</span>
                <h2>{isCreature ? `${item.title} overview` : `What ${item.title} does`}</h2>
                <p>{purposeSummary}</p>
                {getEditorialReading(item, game) && <p className="editorial-note"><strong>Practical reading:</strong> {getEditorialReading(item, game)}</p>}
                {game?.gameplayEnabled === false && (
                  <p className="database-record-warning"><strong>Definition status:</strong> the matched item row has <code>bLegalInGame=false</code>. The values and recipe are present in the 1.0 table, but this page does not present the item as a normally enabled inventory record.</p>
                )}
              </section>

              {visibleStats.length > 0 && (
                <section className="pal-detail-section" id="stats">
                  <span className="wiki-kicker">{isCreature ? "Character parameters" : "Item parameters"}</span>
                  <h2>{item.title} stats</h2>
                  <p>{isCreature ? "These are base character parameters and enemy modifiers from the representative 1.0 row; they are not a simulated final damage result." : "Only non-zero, player-relevant values from the matched 1.0 item or building record are shown."}</p>
                  <div className="entity-stat-grid">
                    {visibleStats.map(([label, value]) => <StatCard key={label} label={label} value={value} />)}
                  </div>
                </section>
              )}

              {game?.encounters?.length > 0 && (
                <section className="pal-detail-section" id="encounters">
                  <span className="wiki-kicker">Boss spawner table</span>
                  <h2>{item.displayName || item.title} locations</h2>
                  <p>Each point below is an exact world coordinate from <code>DT_BossSpawnerLoactionData</code>. It is not a regional planning marker or a clustered approximation.</p>
                  <div className="creature-encounter-list">
                    {game.encounters.map((encounter) => (
                      <article key={`${encounter.spawnerId}-${encounter.world.x}-${encounter.world.y}`}>
                        <div><span>Encounter level</span><strong>{encounter.level}</strong></div>
                        <dl>
                          <FactRow label="X" value={encounter.world.x.toLocaleString("en-US")} />
                          <FactRow label="Y" value={encounter.world.y.toLocaleString("en-US")} />
                          <FactRow label="Z" value={encounter.world.z.toLocaleString("en-US")} />
                          <FactRow label="Spawner ID" value={encounter.spawnerId} />
                        </dl>
                        {encounter.mapHref
                          ? <Link href={encounter.mapHref}>Open exact marker on the map →</Link>
                          : <span className="database-record-warning">No published marker matches this extracted point.</span>}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {game?.drops?.length > 0 && (
                <section className="pal-detail-section" id="drops">
                  <span className="wiki-kicker">Drop table</span>
                  <h2>{item.displayName || item.title} drops</h2>
                  <p>The rate and quantity range are copied from the level-0 character drop row. Linked rewards open their Database item page.</p>
                  <div className="pal-drop-grid creature-drop-grid">
                    {game.drops.map((drop) => <CreatureDropCard entry={drop} key={drop.id} />)}
                  </div>
                </section>
              )}

              {game?.variants?.length > 1 && (
                <section className="pal-detail-section" id="variants">
                  <span className="wiki-kicker">Internal definitions</span>
                  <h2>{item.displayName || item.title} variants</h2>
                  <p>These rows share the grouping key used by this page. Keeping their internal IDs and modifiers visible prevents a scenario-specific row from being mistaken for a universal value.</p>
                  <div className="creature-variant-table" role="table" aria-label={`${item.title} internal variants`}>
                    <div role="row"><strong role="columnheader">Internal ID</strong><strong role="columnheader">HP</strong><strong role="columnheader">Ranged</strong><strong role="columnheader">Defense</strong><strong role="columnheader">Max HP rate</strong></div>
                    {game.variants.map((variant) => (
                      <div role="row" key={variant.internalId}>
                        <code role="cell">{variant.internalId}</code><span role="cell">{variant.hp}</span><span role="cell">{variant.rangedAttack}</span><span role="cell">{variant.defense}</span><span role="cell">{variant.maxHpRate}×</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {hasMaterials && (
                <section className="pal-detail-section" id="recipe">
                  <span className="wiki-kicker">Crafting data</span>
                  <h2>{game.kind === "structure" ? `${item.title} building materials` : `${item.title} recipe`}</h2>
                  <p>{recipes.length > 1 ? `${recipes.length} production records are available. Each flow below keeps its input counts and output quantity separate.` : game.kind === "structure" ? "The structure record separates required materials from its build-work value." : "The production flow below uses the exact input and output counts from the matched recipe row."}</p>
                  {recipes.map((recipe, recipeIndex) => (
                    <article className="database-recipe-card" key={recipe.id}>
                      <div className="database-recipe-card-heading">
                        <div>
                          <span>{recipes.length > 1 ? `Production record ${recipeIndex + 1}` : "Production flow"}</span>
                          {recipes.length > 1 && <h3>{recipe.productCount > 1 ? `${recipe.productCount} × ${item.title}` : item.title}</h3>}
                        </div>
                        <div className="database-recipe-output-count"><small>Output</small><strong>×{recipe.productCount}</strong></div>
                      </div>
                      <div className="database-recipe-flow" aria-label={`${item.title} recipe flow`}>
                        {recipe.materials.map((material, index) => (
                          <div className="database-recipe-flow-step" key={material.id}>
                            {index > 0 && <span className="database-recipe-operator" aria-hidden="true">+</span>}
                            <RecipeItem entry={material} />
                          </div>
                        ))}
                        <span className="database-recipe-operator is-arrow" aria-hidden="true">→</span>
                        <RecipeItem entry={{ title: item.title, imageUrl: item.imageUrl, count: recipe.productCount }} output />
                      </div>
                      <p>{getRecipeSummary(item, recipe)}</p>
                    </article>
                  ))}
                  {buildMaterials.length > 0 && (
                    <article className="database-recipe-card">
                      <div className="database-recipe-card-heading">
                        <div><span>Building flow</span></div>
                        <div className="database-recipe-output-count"><small>Output</small><strong>×1</strong></div>
                      </div>
                      <div className="database-recipe-flow" aria-label={`${item.title} building flow`}>
                        {buildMaterials.map((material, index) => (
                          <div className="database-recipe-flow-step" key={material.id}>
                            {index > 0 && <span className="database-recipe-operator" aria-hidden="true">+</span>}
                            <RecipeItem entry={material} />
                          </div>
                        ))}
                        <span className="database-recipe-operator is-arrow" aria-hidden="true">→</span>
                        <RecipeItem entry={{ title: item.title, imageUrl: item.imageUrl, count: 1 }} output />
                      </div>
                      <p>{getRecipeSummary(item, { productCount: 1, workAmount: game.stats.buildWork, energyType: null, energyAmount: 0, materials: buildMaterials }, true)}</p>
                    </article>
                  )}
                </section>
              )}

              {item.usedIn.length > 0 && (
                <section className="pal-detail-section" id="used-in">
                  <span className="wiki-kicker">Reverse recipe index</span>
                  <h2>What can be made with {item.title}</h2>
                  <p>{item.title} appears as an exact material ID in {item.usedIn.length} indexed recipe or building record{item.usedIn.length === 1 ? "" : "s"}. Every entry with an existing page is linked below.</p>
                  <div className="database-use-catalog">
                    {usedInGroups.map((group, groupIndex) => (
                      <section className="database-use-group" key={group.category}>
                        <header className="database-use-group-heading">
                          <span className="database-use-group-index" aria-hidden="true">{String(groupIndex + 1).padStart(2, "0")}</span>
                          <div>
                            <h3><Link href={`/database/${group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{group.category}</Link></h3>
                            <p>{group.entries.length} linked output{group.entries.length === 1 ? "" : "s"}</p>
                          </div>
                        </header>
                        <div className="database-use-entries">
                          {group.entries.map((relation) => (
                            <Link className="database-use-entry" href={relation.href} key={relation.href}>
                              <span className="database-use-entry-image">
                                {relation.imageUrl
                                  ? <Image src={relation.imageUrl} alt="" width={72} height={72} sizes="48px" />
                                  : <span aria-hidden="true">{relation.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join("")}</span>}
                              </span>
                              <span className="database-use-entry-copy">
                                <strong>{relation.title}</strong>
                                <small>{relation.relation === "Builds" ? "Building input" : "Crafting input"}</small>
                              </span>
                              <span className="database-use-entry-quantity"><small>Needs</small><strong>{relation.count}</strong></span>
                              <span className="database-use-entry-arrow" aria-hidden="true">↗</span>
                            </Link>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </section>
              )}

              {unlocks.length > 0 && (
                <section className="pal-detail-section" id="contents">
                  <span className="wiki-kicker">Technology group contents</span>
                  <h2>What {item.title} unlocks</h2>
                  <p>The 1.0 technology row lists {unlocks.length} building or item definition{unlocks.length === 1 ? "" : "s"}. Entries that already have a Database page are linked directly.</p>
                  <div className="database-unlock-list">
                    {unlocks.map((unlock) => (
                      unlock.href
                        ? <Link href={unlock.href} key={unlock.id}>{unlock.title}<span>Open record →</span></Link>
                        : <div key={unlock.id}><strong>{unlock.title}</strong><span>Game definition: {unlock.id}</span></div>
                    ))}
                  </div>
                </section>
              )}

              {game?.technology && (
                <section className="pal-detail-section" id="unlock">
                  <span className="wiki-kicker">Technology table</span>
                  <h2>How to unlock {item.title}</h2>
                  <div className="unlock-fact-grid">
                    <div><span>Required level</span><strong>{game.technology.level}</strong></div>
                    <div><span>Technology Points</span><strong>{game.technology.cost}</strong></div>
                    <div><span>Technology type</span><strong>{game.technology.ancientTechnology ? "Ancient Technology" : "Technology"}</strong></div>
                    {game.technology.requiredBoss && <div><span>Boss gate</span><strong>{game.technology.requiredBoss}</strong></div>}
                    {game.technology.requiredTechnology && <div><span>Prior technology</span><strong>{game.technology.requiredTechnology}</strong></div>}
                    {game.technology.researchId && <div><span>Research ID</span><strong>{game.technology.researchId}</strong></div>}
                  </div>
                </section>
              )}

              {item.relatedPals.length > 0 && (
                <section className="pal-detail-section" id="pal-links">
                  <span className="wiki-kicker">Recorded connections</span>
                  <h2>Pals connected to {item.title}</h2>
                  <p>{isCreature ? "This is the matching standard Pal entry. Boss and Predator values on this page remain separate from the standard species record." : "These links come from a listed standard drop, Pal Gear requirement or an exact Pal Gear name match."}</p>
                  <div className="pal-related-grid">
                    {item.relatedPals.map((pal) => (
                      <Link href={pal.href} className="pal-related-card" key={pal.href}>
                        <Image src={pal.imageUrl} alt={`${pal.title} icon`} width={92} height={92} sizes="72px" />
                        <span><strong>{pal.title}</strong><small>{pal.element} · {pal.reasons.join(", ")}</small></span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section className="pal-detail-section" id="related-items">
                <span className="wiki-kicker">Next database entries</span>
                <h2>{isCreature ? `${item.title} drops and nearby records` : hasMaterials ? `${item.title} materials and related items` : `Items related to ${item.title}`}</h2>
                <p>{isCreature ? "Verified drop items are listed before nearby records from the same combat category." : hasMaterials ? "Recipe materials are listed first, followed by close entries from the same item group." : `No verified recipe was matched. These entries are limited to close ${item.category} comparisons.`}</p>
                {item.relatedItems.length > 0 ? (
                  <div className="pal-drop-grid">
                    {item.relatedItems.map((related) => (
                      <Link href={related.href} className="pal-drop-card" key={related.href}>
                        <Image src={related.imageUrl} alt={`${related.title} database entry`} width={96} height={72} sizes="64px" />
                        <span><strong>{related.title}</strong><small>{related.category}</small></span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>There is no supported item connection to show. Return to <Link href={`/database/${categorySlug}`}>{item.category}</Link> for the full category.</p>
                )}
              </section>

              <div className="game-data-proof">
                <strong>Data method</strong>
                <p>{isCreature ? "Character values, hostile classification, boss flags, fixed-spawn points and drops are normalized from the Palworld 1.0 unpacked DataTables. Exact coordinates are labeled as such; variants and editorial interpretation remain separate." : "Descriptions, item values, recipes, building materials and technology requirements are normalized from the Palworld 1.0 unpacked DataTables. Zero-value fields are omitted. Any practical reading is labeled as editorial and does not replace the displayed values."}</p>
              </div>
            </article>

            <aside className="detail-side-panel database-detail-side-panel">
              <h2>{item.title} record</h2>
              <dl className="detail-fact-list">
                <FactRow label="Game data" value={game ? item.gameDataProvenance.gameVersion : "No matched 1.0 record"} />
                <FactRow label="Steam build" value={game ? item.gameDataProvenance.steamBuildId : null} />
                <FactRow label="Data table" value={game?.sourceAsset?.split("/").at(-1)} />
                <FactRow label="Source tables" value={game?.sourceAssets?.map((source) => source.split("/").at(-1)).join(", ")} />
                <FactRow label="Internal ID" value={game?.internalId} />
                <FactRow label="Record type" value={game?.kind} />
                <FactRow label={isCreature ? "Entity type" : "Item type"} value={game?.type} />
                <FactRow label="Subtype" value={game?.subtype} />
                <FactRow label="Organization" value={isCreature && game?.organization !== "None" ? game?.organization : null} />
                <FactRow label="Weapon class" value={isCreature && game?.weapon !== "None" ? game?.weapon : null} />
                <FactRow label="AI response" value={isCreature ? game?.aiResponse : null} />
                <FactRow label="Boss flag" value={isCreature ? (game?.flags?.isBoss ? "True" : "False") : null} />
                <FactRow label="Tower Boss" value={game?.flags?.isTowerBoss ? "True" : null} />
                <FactRow label="Raid Boss" value={game?.flags?.isRaidBoss ? "True" : null} />
                <FactRow label="Exact map points" value={isCreature ? game?.encounters?.length : null} />
                <FactRow label="Drop entries" value={isCreature ? game?.drops?.length : null} />
                <FactRow label="Definition variants" value={isCreature ? game?.variants?.length : null} />
                <FactRow label="Rarity value" value={game?.stats?.rarity} />
                <FactRow label="Item flag" value={!isCreature ? (game?.gameplayEnabled === false ? "Off in item table" : game ? "On in item table" : null) : null} />
                <FactRow label="Passive IDs" value={game?.stats?.passives?.join(", ")} />
                <FactRow label="Primary category" value={item.category} />
                <FactRow label="Updated" value={item.lastChecked} />
              </dl>
              <div className="detail-related-links">
                {item.adjacentItems.previous && <Link href={item.adjacentItems.previous.href}>← {item.adjacentItems.previous.title}</Link>}
                <Link href={`/database/${categorySlug}`}>All {item.category}</Link>
                {item.adjacentItems.next && <Link href={item.adjacentItems.next.href}>{item.adjacentItems.next.title} →</Link>}
                <Link href="/database">Database index</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
