import type { Metadata } from "next";
import SentencePolisherPage from "./SentencePolisherClient";

export const metadata: Metadata = {
  title: "Sentence Polisher | AI Grammar Correction Tool",
  description: "Fix grammar mistakes instantly with AI.",
};

export default function Page() {
  return <SentencePolisherPage />;
}
