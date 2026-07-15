import { guides } from "@/data/guides";
import GuidesDetailPage from "@/page/GuidesDetailPage";
import { buildMetadata } from "@/seo/site";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return guides.map((guide) => ({ addressBar: guide.addressBar }));
}

export async function generateMetadata({ params }) {
  const { addressBar } = await params;
  const guide = guides.find((item) => item.addressBar === addressBar);
  if (!guide) {
    return {};
  }

  return buildMetadata(guide.seo, `/guides/${guide.addressBar}`, {
    type: "article",
    publishedTime: guide.publishDate,
    modifiedTime: guide.lastModified || guide.updatedAt || guide.publishDate,
  });
}

export default async function Page({ params }) {
  const { addressBar } = await params;
  const guide = guides.find((item) => item.addressBar === addressBar);

  if (!guide) {
    notFound();
  }

  return <GuidesDetailPage guide={guide} />;
}
