import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/seo/site";

export default function GuidesPage({ guides }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Palworld Guides - Complete Player Strategy Hub",
    url: `${siteConfig.url}/guides`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: guides.length,
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        url: `${siteConfig.url}/guides/${guide.addressBar}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="listing-hero-section">
        <div className="container">
          <div className="listing-hero-content">
            <h1>Palworld Guides - Complete Player Strategy Hub</h1>
            <p>
              Palworld Guides help players plan progression, bases, teams, breeding,
              maps, updates, resources, bosses, and long routes with practical checklists.
            </p>
          </div>
        </div>
      </section>

      <section className="listing-grid-section">
        <div className="container">
          <div className="listing-grid-content">
            <div className="listing-toolbar">
              <strong>Updated guide hub</strong>
              <span>{guides.length} guides</span>
            </div>
            <div className="listing-card-grid">
              {guides.map((guide) => (
                <article className="listing-card" key={guide.id}>
                  <Image className="listing-card-image" src={guide.imageUrl} alt={guide.imageAlt} width={900} height={506} />
                  <div className="listing-card-body">
                    <h2>{guide.title}</h2>
                    <p>{guide.summary}</p>
                    <div className="listing-card-tags">
                      {guide.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <Link className="listing-card-link" href={`/guides/${guide.addressBar}`}>Read guide</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
