import { buildMetadata } from "@/seo/site";
import LegalArticle from "../_components/LegalArticle";
import { legalPages } from "../_content";

const page = legalPages.privacyPolicy;

export const metadata = buildMetadata(
  page.seo,
  page.href,
);

export default function PrivacyPolicyPage() {
  return <LegalArticle page={page} />;
}
