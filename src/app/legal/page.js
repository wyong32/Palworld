import Link from "next/link";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { buildMetadata } from "@/seo/site";
import { legalHubTrail } from "@/seo/breadcrumbs";
import { legalPages, legalRoutes } from "./_content";

export const metadata = buildMetadata(
  {
    title: "Palworld Wiki Legal - Policies and Contact Pages",
    description:
      "Palworld Wiki Legal collects Privacy Policy, Terms of Service, Copyright, About Us, and Contact Us pages for players, readers, rights holders, and questions.",
    keywords: "Palworld Wiki Legal, Palworld Wiki Privacy Policy, Palworld Wiki Terms, Palworld Wiki Copyright",
  },
  "/legal",
);

export default function LegalIndexPage() {
  const pages = Object.values(legalPages);

  return (
    <article className="legal-page legal-index-page">
      <PageBreadcrumbs items={legalHubTrail()} />
      <section className="legal-hero-section">
        <span className="wiki-kicker">Legal</span>
        <h1>Palworld Wiki Legal</h1>
        <p>
          Palworld Wiki Legal collects the site policies, copyright notice, about information, and contact details
          in one place for players, readers, and rights holders.
        </p>
      </section>

      <section className="legal-index-grid" aria-label="Legal page directory">
        {legalRoutes.map((route) => {
          const page = pages.find((item) => item.href === route.href);
          return (
            <Link href={route.href} key={route.href}>
              <span>{route.label}</span>
              <strong>{page?.title || route.label}</strong>
              <p>{page?.description}</p>
            </Link>
          );
        })}
      </section>
    </article>
  );
}
