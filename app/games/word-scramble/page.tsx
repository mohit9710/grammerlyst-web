import type { Metadata } from "next";
import WordScramble from "./WordScrambleClient";

export const metadata: Metadata = {
  title: "Word Scramble | Grammrlyst",
  description:
    "Unscramble words and improve your English vocabulary with fun interactive challenges.",
};

export default function Page() {
  return <WordScramble />;
}
