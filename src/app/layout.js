import { Lexend, Source_Sans_3 } from "next/font/google";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import { buildBaseJsonLd, buildMetadata, pageSeo, siteConfig } from "@/seo/site";
import "@/style/global.css";
import "@/style/site.css";

const lexend = Lexend({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata(pageSeo.home),
};

const baseJsonLd = buildBaseJsonLd();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lexend.variable} ${sourceSans.variable}`}>
      <body>
        {baseJsonLd.map((schema, index) => (
          <script
            key={`base-json-ld-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <div className="app-shell">
          <AppHeader />
          <div className="site-content-shell">
            <div className="container">
              <div className="site-content-grid">
                <AppSidebar />
                <main id="main-content" className="site-main">{children}</main>
              </div>
            </div>
          </div>
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
