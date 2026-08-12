import type { Metadata } from "next";
import TongueTwistersPage from "./TongueTwistersClient";

export const metadata: Metadata = {
  title: "Tongue Twisters | Pronunciation & Speaking Practice | Grammrlyst",
  description:
    "Practice English tongue twisters from beginner to advanced. Listen to native pronunciation and test your own speaking accuracy — free, no sign-up required.",
};

export default function Page() {
  return <TongueTwistersPage />;
}
