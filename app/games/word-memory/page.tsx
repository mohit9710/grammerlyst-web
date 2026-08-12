import type { Metadata } from "next";
import WordMemory from "./WordMemoryClient";

export const metadata: Metadata = {
  title: "Word Memory Match | Grammrlyst",
  description:
    "Flip cards to match English words with their meanings and build vocabulary while you play.",
};

export default function Page() {
  return <WordMemory />;
}
