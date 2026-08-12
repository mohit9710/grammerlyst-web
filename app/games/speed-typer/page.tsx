import type { Metadata } from "next";
import SentenceSprinter from "./SpeedTyperClient";

export const metadata: Metadata = {
  title: "Sentence Sprinter Typing Game | Grammrlyst",
  description:
    "Improve typing speed and accuracy while practicing English sentences.",
};

export default function Page() {
  return <SentenceSprinter />;
}
