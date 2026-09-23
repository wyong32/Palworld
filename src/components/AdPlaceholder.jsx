"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

const NATIVE_CONTAINER_ID = "container-16ae4a00b40ff5f13a5f7a04a7b96a76";
const NATIVE_SCRIPT_URL =
  "https://pl31457323.profitableratecpmnetwork.com/16ae4a00b40ff5f13a5f7a04a7b96a76/invoke.js";

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
  const nativeHostRef = useRef(null);

  useEffect(() => {
    if (!isNative || !nativeHostRef.current) {
      return undefined;
    }

    const nativeHost = nativeHostRef.current;
    const nativeContainer = document.createElement("div");
    const nativeScript = document.createElement("script");

    nativeContainer.id = NATIVE_CONTAINER_ID;
    nativeScript.async = true;
    nativeScript.setAttribute("data-cfasync", "false");
    nativeScript.src = NATIVE_SCRIPT_URL;

    // 中文注释：严格按照联盟原始顺序插入脚本和容器，保留当前页面的域名与来源信息。
    nativeHost.replaceChildren(nativeScript, nativeContainer);

    return () => {
      nativeHost.replaceChildren();
    };
  }, [isNative]);

  const sourceDocument = useMemo(() => {
    if (isMobile === null) {
      return null;
    }

    return isMobile ? MOBILE_BANNER_DOCUMENT : DESKTOP_BANNER_DOCUMENT;
  }, [isMobile]);

  const width = isNative ? 728 : isMobile ? 320 : 728;
  const height = isNative ? 300 : isMobile ? 50 : 90;

  return (
    <aside
      className={`ad-slot ad-slot--${isNative ? "native" : "banner"}`}
      aria-label="Advertisement"
    >
      {isNative ? (
        <div ref={nativeHostRef} className="ad-slot-native-container" />
      ) : sourceDocument ? (
        <iframe
          className="ad-slot-frame"
          title="Banner advertisement"
          srcDoc={sourceDocument}
          width={width}
          height={height}
          scrolling="no"
        />
      ) : (
        // 中文注释：等待客户端确认断点后再加载，避免桌面和移动广告同时产生一次展示。
        <span className="ad-slot-loading" aria-hidden="true" />
      )}
    </aside>
  );
}
