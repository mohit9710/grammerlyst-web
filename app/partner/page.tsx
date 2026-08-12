import type { Metadata } from "next";
import BecomePartnerPage from "./PartnerClient";

export const metadata: Metadata = {
  title: "Become a Partner | Grammrlyst",
  description:
    "Partner with Grammrlyst to bring AI-powered English learning to your students, community, or organization.",
};

export default function Page() {
  return <BecomePartnerPage />;
}
