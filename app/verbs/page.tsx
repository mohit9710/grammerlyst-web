import type { Metadata } from "next";
import VerbsCarousel from "./VerbsClient";

export const metadata: Metadata = {
  title: "English Verbs Lab | Grammrlyst",
  description:
    "Build your vocabulary with regular and irregular English verbs, definitions, and usage examples.",
};

export default function Page() {
  return <VerbsCarousel />;
}
