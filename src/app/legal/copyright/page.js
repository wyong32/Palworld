import { buildMetadata } from "@/seo/site";
import LegalArticle from "../_components/LegalArticle";
import { legalPages } from "../_content";

const page = legalPages.copyright;

export const metadata = buildMetadata(
  page.seo,
  page.href,
);

export default function CopyrightPage() {
  return <LegalArticle page={page} />;
}
