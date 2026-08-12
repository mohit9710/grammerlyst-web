import type { Metadata } from "next";
import AccentTrainingPage from "./AccentTrainingClient";

export const metadata: Metadata = {
  title: "English Accent Training | Grammrlyst",
  description:
    "Train your speaking accent and pronunciation with AI-guided practice.",
};

export default function Page() {
  return <AccentTrainingPage />;
}
