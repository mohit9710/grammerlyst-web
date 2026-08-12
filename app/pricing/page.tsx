import type { Metadata } from "next";
import PricingPage from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing Plans | Grammrlyst",
  description:
    "Choose the right Grammrlyst plan — from free daily practice to unlimited AI roleplay, grammar, and writing tools.",
};

export default function Page() {
  return <PricingPage />;
}
