import { buildMetadata } from "@/seo/site";
import LegalArticle from "../_components/LegalArticle";
import { legalPages } from "../_content";

const page = legalPages.contactUs;

export const metadata = buildMetadata(
  page.seo,
  page.href,
);

export default function ContactUsPage() {
  return <LegalArticle page={page} />;
}
