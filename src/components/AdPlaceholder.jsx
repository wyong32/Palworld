"use client";

import { useEffect, useMemo, useState } from "react";

const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

const DESKTOP_BANNER_DOCUMENT = `<!doctype html>
<html><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden;background:transparent}</style></head>
<body>
<script>
  atOptions = {
    'key': 'dd628463f8f373bdaa63e71204c87d50',
    'format': 'iframe',
    'height': 90,
    'width': 728,
    'params': {}
  };
<\/script>
<script src="https://www.highrevenueformat.com/dd628463f8f373bdaa63e71204c87d50/invoke.js"><\/script>
</body></html>`;

const MOBILE_BANNER_DOCUMENT = `<!doctype html>
<html><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden;background:transparent}</style></head>
<body>
<script>
  atOptions = {
    'key': 'bc95a8ff5c95f248fc5c19e346e6263a',
    'format': 'iframe',
    'height': 50,
    'width': 320,
    'params': {}
  };
<\/script>
<script src="https://www.highrevenueformat.com/bc95a8ff5c95f248fc5c19e346e6263a/invoke.js"><\/script>
</body></html>`;

const NATIVE_BANNER_DOCUMENT = `<!doctype html>
<html><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden;background:transparent}</style></head>
<body>
<script async="async" data-cfasync="false" src="https://pl31457323.profitableratecpmnetwork.com/16ae4a00b40ff5f13a5f7a04a7b96a76/invoke.js"><\/script>
<div id="container-16ae4a00b40ff5f13a5f7a04a7b96a76"></div>
</body></html>`;

function useMobileAd() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  return isMobile;
}

export default function AdPlaceholder({ format = "banner" }) {
  const isMobile = useMobileAd();
  const isNative = format === "native";
  const sourceDocument = useMemo(() => {
    if (isNative) {
      return NATIVE_BANNER_DOCUMENT;
    }

    if (isMobile === null) {
      return null;
    }

    return isMobile ? MOBILE_BANNER_DOCUMENT : DESKTOP_BANNER_DOCUMENT;
  }, [isMobile, isNative]);

  const width = isNative ? 728 : isMobile ? 320 : 728;
  const height = isNative ? 300 : isMobile ? 50 : 90;

  return (
    <aside
      className={`ad-slot ad-slot--${isNative ? "native" : "banner"}`}
      aria-label="Advertisement"
    >
      {sourceDocument ? (
        <iframe
          className="ad-slot-frame"
          title={isNative ? "Native advertisement" : "Banner advertisement"}
          srcDoc={sourceDocument}
          width={width}
          height={height}
          loading="lazy"
          scrolling="no"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      ) : (
        // 中文注释：等待客户端确认断点后再加载，避免桌面和移动广告同时产生一次展示。
        <span className="ad-slot-loading" aria-hidden="true" />
      )}
    </aside>
  );
}
