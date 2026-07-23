import Image from "next/image";
import Link from "next/link";
import GptAdSlot from "@/components/GptAdSlot";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { buildBreadcrumbJsonLd, guidesDetailTrail } from "@/seo/breadcrumbs";
import { siteConfig } from "@/seo/site";

export default function GuidesDetailPage({ guide }) {
  const heading = guide.seo?.title || (guide.title.startsWith("Palworld") ? guide.title : `Palworld Guides - ${guide.title}`);
  const url = `${siteConfig.url}/guides/${guide.addressBar}`;
  const breadcrumbs = guidesDetailTrail(guide);
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
      buildBreadcrumbJsonLd(breadcrumbs),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageBreadcrumbs items={breadcrumbs} />
      {/* GPT 广告：banner_1 */}
      <GptAdSlot elementId="div-gpt-ad-guide-detail-1" unit={1} />
      <section className="detail-hero-section">
        <div className="container">
          <div className="detail-hero-content">
            <div className="detail-hero-copy">
              <span className="wiki-kicker">Palworld Guide</span>
              <h1>{heading}</h1>
              <p>{heading} helps players use {guide.summary.charAt(0).toLowerCase() + guide.summary.slice(1)}</p>
            </div>
            <div className="detail-hero-image">
              <Image
                src={guide.imageUrl}
                alt={guide.imageAlt}
                width={760}
                height={570}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 42vw, 360px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GPT 广告：banner_2 */}
      <GptAdSlot elementId="div-gpt-ad-guide-detail-2" unit={2} />

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
      {/* GPT 广告：banner_3 */}
      <GptAdSlot elementId="div-gpt-ad-guide-detail-3" unit={3} />
    </>
  );
}
