import { pals } from "@/data/pals";
import { items } from "@/data/items";
import { buildPalSeo, enrichPal } from "@/data/palGuide";
import PalsDetailPage from "@/page/PalsDetailPage";
import { buildMetadata } from "@/seo/site";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return pals.map((pal) => ({ addressBar: pal.addressBar }));
}

export async function generateMetadata({ params }) {
  const { addressBar } = await params;
  const pal = pals.find((item) => item.addressBar === addressBar);
  if (!pal) {
    return {};
  }

  return buildMetadata(buildPalSeo(pal), `/pals/${pal.addressBar}`, {
    type: "article",
    publishedTime: pal.publishDate,
    modifiedTime: pal.lastModified || pal.updatedAt || pal.lastChecked || pal.publishDate,
  });
}

export default async function PalDetailPage({ params }) {
  const { addressBar } = await params;
  // 中文注释：详情页只读取本栏目本地数据，不抽象成跨栏目通用组件。
  const pal = pals.find((item) => item.addressBar === addressBar);

  if (!pal) {
    notFound();
  }

  return <PalsDetailPage pal={enrichPal(pal, { items, allPals: pals })} />;
}
