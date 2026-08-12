import type { Metadata } from "next";
import OddOneOut from "./OddOneOutClient";

export const metadata: Metadata = {
  title: "Odd One Out | Grammrlyst",
  description:
    "Spot the odd word out in each group before time runs out and sharpen your English vocabulary.",
};

export default function Page() {
  return <OddOneOut />;
}
