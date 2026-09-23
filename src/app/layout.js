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
        <Script id="clear-lsv" strategy="afterInteractive">
          {`window.localStorage.removeItem('**lsv**');`}
        </Script>
        <Script src="/collect-data.js" strategy="afterInteractive" />
        {/* 中文注释：弹窗广告只在根布局延迟加载一次，避免页面内多个广告位重复触发。 */}
        <Script
          id="alliance-popunder"
          src="https://pl31457322.profitableratecpmnetwork.com/40/f1/13/40f1137ec2b7e262144cd8f7d46ac1b8.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
