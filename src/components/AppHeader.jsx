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
              sizes="40px"
              alt=""
            />
            <span>
              <span className="site-brand-mark">Palworld Wiki</span>
              <span className="site-brand-note">Palpagos field guide</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            {topNavItems.map((item) => (
              <div className="site-nav-item" key={item.href}>
                <Link className="site-nav-link" href={item.href} aria-haspopup={item.children?.length ? "true" : undefined}>
                  {item.label}
                </Link>
                {item.children?.length > 0 && (
                  <div className="site-nav-dropdown" aria-label={`${item.label} quick links`}>
                    {item.children.map((child) => (
                      <Link className="site-nav-link" href={child.href} key={child.href}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <details className="site-nav" aria-label="Mobile primary navigation">
            <summary className="site-nav-link" aria-label="Open primary navigation">
              <span aria-hidden="true">Menu</span>
            </summary>
            <div role="navigation" aria-label="Primary navigation">
              {topNavItems.map((item) => (
                <div className="site-nav-mobile-group" key={`mobile-${item.href}`}>
                  <Link className="site-nav-link" href={item.href}>
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link className="site-nav-link" href={child.href} key={`mobile-${child.href}`}>
                      {child.label}
                    </Link>
                  ))}
                </div>
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
