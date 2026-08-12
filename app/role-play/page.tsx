import type { Metadata } from "next";
import RolePlayPage from "./RolePlayClient";

export const metadata: Metadata = {
  title: "AI Roleplay Chat | Grammrlyst",
  description:
    "Practice real-world English conversations with AI roleplay scenarios — doctor visits, interviews, and more.",
};

export default function Page() {
  return <RolePlayPage />;
}
