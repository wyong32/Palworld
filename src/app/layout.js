import Script from "next/script";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import { buildBaseJsonLd, buildMetadata, pageSeo, siteConfig } from "@/seo/site";
import "@/style/global.css";
import "@/style/site.css";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata(pageSeo.home),
};

const baseJsonLd = buildBaseJsonLd();
const googleAnalyticsId = "G-V3KEFG6ER0";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `,
          }}
        />
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
