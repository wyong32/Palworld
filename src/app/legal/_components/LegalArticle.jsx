import Link from "next/link";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { legalDetailTrail } from "@/seo/breadcrumbs";
import { legalRoutes, legalUpdatedDate } from "../_content";

export default function LegalArticle({ page }) {
  const breadcrumbs = legalDetailTrail(page);

  return (
    <article className="legal-page">
      <PageBreadcrumbs items={breadcrumbs} />
      <section className="legal-hero-section">
        <span className="wiki-kicker">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <dl className="legal-meta-list" aria-label="Legal page details">
          <div>
            <dt>Last updated</dt>
            <dd>{legalUpdatedDate}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>Palworld Wiki</dd>
          </div>
        </dl>
      </section>

      <section className="legal-body-section">
        <div className="legal-article-flow">
          {page.sections.map((section) => (
            <section key={section.title} className="legal-text-section">
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <aside className="legal-side-panel" aria-label="Legal pages">
          <span className="legal-side-title">Legal</span>
          <nav>
            {legalRoutes.map((item) => (
              <Link href={item.href} key={item.href} aria-current={item.href === page.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      </section>
    </article>
  );
}
