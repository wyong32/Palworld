import Link from "next/link";
import Image from "next/image";
import { topNavItems } from "@/data/navigation";
import { siteConfig } from "@/seo/site";

export default function AppHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header-content">
          <Link className="site-brand" href="/" aria-label="Palworld Wiki home">
            <Image
              className="site-brand-sigil"
              src={siteConfig.logoImage}
              width={40}
              height={40}
              alt=""
              priority
            />
            <span>
              <span className="site-brand-mark">Palworld Wiki</span>
              <span className="site-brand-note">Palpagos field guide</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            {topNavItems.map((item) => (
              <Link className="site-nav-link" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <details className="site-nav" aria-label="Mobile primary navigation">
            <summary className="site-nav-link" aria-label="Open primary navigation">
              <span aria-hidden="true">Menu</span>
            </summary>
            <div role="navigation" aria-label="Primary navigation">
              {topNavItems.map((item) => (
                <Link className="site-nav-link" href={item.href} key={`mobile-${item.href}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <form className="site-search" action="/search" role="search">
            <label htmlFor="site-search-input">Search Palworld Wiki</label>
            <input id="site-search-input" type="search" name="q" placeholder="Search Pals, items, guides..." />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    </header>
  );
}
