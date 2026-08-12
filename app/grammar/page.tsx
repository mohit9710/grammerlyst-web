import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GrammarWorkshop from "@/components/GrammarWorkshop";
import { fetchGrammarTopics } from "@/services/grammar";

export const metadata: Metadata = {
  title: "English Grammar Guide | Learn Rules | Grammrlyst",
  description: "Master English grammar with easy lessons and examples.",
};

export default async function GrammarPage() {
  const topics = await fetchGrammarTopics().catch(() => []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-x-hidden relative">
        {/* BACKGROUND GLOWS */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>
        <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-violet-500/20 blur-3xl rounded-full"></div>

        <GrammarWorkshop initialTopics={topics} />
      </main>

      <Footer />
    </>
  );
}
