import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/seo/site";

export default function GuidesDetailPage({ guide }) {
  const heading = guide.seo?.title || (guide.title.startsWith("Palworld") ? guide.title : `Palworld Guides - ${guide.title}`);
  const url = `${siteConfig.url}/guides/${guide.addressBar}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: heading,
        description: guide.summary,
        datePublished: guide.publishDate,
        dateModified: guide.lastModified || guide.updatedAt || guide.publishDate,
        image: `${siteConfig.url}${guide.imageUrl}`,
        url,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Palworld Guides", item: `${siteConfig.url}/guides` },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="detail-hero-section">
        <div className="container">
          <div className="detail-hero-content">
            <div className="detail-hero-copy">
              <span className="wiki-kicker">Palworld Guide</span>
              <h1>{heading}</h1>
              <p>{heading} helps players use {guide.summary.charAt(0).toLowerCase() + guide.summary.slice(1)}</p>
            </div>
            <div className="detail-hero-image">
              <Image src={guide.imageUrl} alt={guide.imageAlt} width={760} height={570} />
            </div>
          </div>
        </div>
      </section>

      <section className="detail-body-section">
        <div className="container">
          <div className="detail-body-content">
            <article className="detail-article" dangerouslySetInnerHTML={{ __html: guide.detailsHtml }} />
            <aside className="detail-side-panel">
              <h2>Guide Details</h2>
              <dl className="detail-fact-list">
                <div><dt>Topic</dt><dd>{guide.tags.join(", ")}</dd></div>
                <div><dt>Updated</dt><dd>{guide.publishDate}</dd></div>
              </dl>
              <div className="detail-related-links">
                <Link href="/guides">Back to Guides</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
