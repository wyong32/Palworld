import Script from "next/script";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import { GPT_UNITS } from "@/config/gpt";
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
        {/* GPT 全局脚本：加载 Google Publisher Tag */}
        <Script
          id="google-publisher-tag"
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
        {/* GPT 全局广告：底部 Anchor、左侧栏和右侧栏共用 anchor_1 单元 */}
        <Script
          id="gpt-anchor-setup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googletag = window.googletag || { cmd: [] };
              googletag.cmd.push(function () {
                var anchorSlot = googletag.defineOutOfPageSlot(
                  '${GPT_UNITS.anchor}',
                  googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
                );
                if (anchorSlot) anchorSlot.addService(googletag.pubads());
                window.__gptAnchorSlot = anchorSlot;

                var leftRailSlot = googletag.defineOutOfPageSlot(
                  '${GPT_UNITS.anchor}',
                  googletag.enums.OutOfPageFormat.LEFT_SIDE_RAIL
                );
                if (leftRailSlot) leftRailSlot.addService(googletag.pubads());
                window.__gptLeftRailSlot = leftRailSlot;

                var rightRailSlot = googletag.defineOutOfPageSlot(
                  '${GPT_UNITS.anchor}',
                  googletag.enums.OutOfPageFormat.RIGHT_SIDE_RAIL
                );
                if (rightRailSlot) rightRailSlot.addService(googletag.pubads());
                window.__gptRightRailSlot = rightRailSlot;
              });
            `,
          }}
        />
        {/* GPT 全局广告：插屏 inter_1 */}
        <Script
          id="gpt-interstitial-setup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              googletag.cmd.push(function () {
                var interstitialSlot = googletag.defineOutOfPageSlot(
                  '${GPT_UNITS.interstitial}',
                  googletag.enums.OutOfPageFormat.INTERSTITIAL
                );
                if (interstitialSlot) {
                  interstitialSlot.addService(googletag.pubads());
                }
                window.__gptInterstitialSlot = interstitialSlot;
                googletag.setConfig({
                  centering: true,
                  disableInitialLoad: true,
                  singleRequest: true,
                });
                googletag.enableServices();
              });
            `,
          }}
        />
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
        {/* GPT 全局广告：显示并刷新 Anchor、左右侧栏和 Interstitial */}
        <Script
          id="gpt-out-of-page-display"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              googletag.cmd.push(function () {
                var oopSlots = [];
                if (window.__gptAnchorSlot) {
                  googletag.display(window.__gptAnchorSlot);
                  oopSlots.push(window.__gptAnchorSlot);
                }
                if (window.__gptLeftRailSlot) {
                  googletag.display(window.__gptLeftRailSlot);
                  oopSlots.push(window.__gptLeftRailSlot);
                }
                if (window.__gptRightRailSlot) {
                  googletag.display(window.__gptRightRailSlot);
                  oopSlots.push(window.__gptRightRailSlot);
                }
                if (window.__gptInterstitialSlot) {
                  googletag.display(window.__gptInterstitialSlot);
                  oopSlots.push(window.__gptInterstitialSlot);
                }
                if (oopSlots.length) googletag.pubads().refresh(oopSlots);
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
