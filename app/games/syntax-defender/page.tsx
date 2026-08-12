import type { Metadata } from "next";
import SyntaxDefender from "./SyntaxDefenderClient";

export const metadata: Metadata = {
  title: "Syntax Defender Grammar Game | Grammrlyst",
  description:
    "Destroy grammar mistakes before they reach the danger zone in this fast-paced grammar game.",
};

export default function Page() {
  return <SyntaxDefender />;
}
