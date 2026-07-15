import HomePage from "@/page/HomePage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.home);

export default function Page() {
  return <HomePage />;
}
