import { pals } from "@/data/pals";
import PalsPage from "@/page/PalsPage";
import { buildMetadata, pageSeo } from "@/seo/site";

export const metadata = buildMetadata(pageSeo.pals, "/pals");

export default function Page() {
  return <PalsPage pals={pals} />;
}
