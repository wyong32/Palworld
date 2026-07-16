import { absoluteUrl } from "@/seo/site";

export function buildBreadcrumbTrail(...segments) {
  return [{ label: "Home", href: "/" }, ...segments];
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function palsHubTrail() {
  return buildBreadcrumbTrail({ label: "Palworld Pals", href: "/pals" });
}

export function palsDetailTrail(pal) {
  return buildBreadcrumbTrail(
    { label: "Palworld Pals", href: "/pals" },
    { label: pal.title, href: `/pals/${pal.addressBar}` },
  );
}

export function databaseHubTrail() {
  return buildBreadcrumbTrail({ label: "Palworld Database", href: "/database" });
}

export function databaseCategoryTrail(group) {
  return buildBreadcrumbTrail(
    { label: "Palworld Database", href: "/database" },
    { label: group.category, href: `/database/${group.slug}` },
  );
}

export function databaseItemTrail(item, categorySlug) {
  return buildBreadcrumbTrail(
    { label: "Palworld Database", href: "/database" },
    { label: item.category, href: `/database/${categorySlug}` },
    { label: item.title, href: `/database/${categorySlug}/${item.addressBar}` },
  );
}

export function guidesHubTrail() {
  return buildBreadcrumbTrail({ label: "Palworld Guides", href: "/guides" });
}

export function guidesDetailTrail(guide) {
  return buildBreadcrumbTrail(
    { label: "Palworld Guides", href: "/guides" },
    { label: guide.title, href: `/guides/${guide.addressBar}` },
  );
}

export function breedingHubTrail() {
  return buildBreadcrumbTrail({ label: "Breeding", href: "/breeding" });
}

export function mapHubTrail() {
  return buildBreadcrumbTrail({ label: "Map", href: "/map" });
}

export function updatesHubTrail() {
  return buildBreadcrumbTrail({ label: "Updates", href: "/updates" });
}

export function searchHubTrail() {
  return buildBreadcrumbTrail({ label: "Search", href: "/search" });
}

export function legalHubTrail() {
  return buildBreadcrumbTrail({ label: "Legal", href: "/legal" });
}

export function legalDetailTrail(page) {
  return buildBreadcrumbTrail(
    { label: "Legal", href: "/legal" },
    { label: page.title, href: page.href },
  );
}
