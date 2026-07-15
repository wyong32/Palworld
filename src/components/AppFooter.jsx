import Link from "next/link";
import Image from "next/image";
import { legalCopyrightNotice, legalRoutes } from "@/app/legal/_content";
import { siteConfig } from "@/seo/site";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/pals", label: "Pals" },
  { href: "/database", label: "Database" },
  { href: "/breeding", label: "Breeding" },
  { href: "/guides", label: "Guides" },
  { href: "/map", label: "Map" },
  { href: "/updates", label: "Updates" },
];

export default function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-content">
          <div className="site-footer-brand">
            <Link href="/" className="site-footer-logo" aria-label={`${siteConfig.name} home`}>
              <Image
                className="site-brand-sigil"
                src={siteConfig.logoImage}
                width={40}
                height={40}
                alt=""
              />
              <strong>{siteConfig.name}</strong>
            </Link>
            <h2>Know the Pal. Plan the route.</h2>
            <p>
              A player-built Palworld Wiki for Pals, work suitability, combat teams,
              breeding, items, maps, updates, and the decisions that shape every Palpagos run.
            </p>
          </div>

          <div className="site-footer-columns">
            <nav className="site-footer-link-group" aria-label="Footer main navigation">
              <h3>Navigate</h3>
              {mainLinks.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <nav className="site-footer-link-group" aria-label="Legal navigation">
              <h3>Legal</h3>
              {legalRoutes.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="site-footer-bottom">
            <p className="site-footer-small">{legalCopyrightNotice}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
