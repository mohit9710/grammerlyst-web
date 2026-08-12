import type { Metadata } from "next";
import PronunciationPage from "./PronunciationClient";

export const metadata: Metadata = {
  title: "AI Pronunciation Training | Grammrlyst",
  description:
    "Practice and perfect English pronunciation with instant AI feedback.",
};

export default function Page() {
  return <PronunciationPage />;
}
