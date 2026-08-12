import type { Metadata } from "next";
import BlogPage from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog | English Learning Tips & Insights | Grammrlyst",
  description:
    "Free English learning articles covering grammar, IELTS writing, vocabulary, pronunciation, and fluency tips. No sign-up required.",
};

export default function Page() {
  return <BlogPage />;
}
