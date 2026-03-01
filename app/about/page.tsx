import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Grammrlyst - Learn English Smarter",
  description:
    "Learn more about Grammrlyst, our mission to help learners master English grammar, vocabulary, and communication skills through interactive tools and AI-powered learning.",
  keywords: [
    "Learn English online",
    "English grammar platform",
    "AI English learning",
    "Grammrlyst",
  ],
};

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-slate-900 mb-6">
        About Grammrlyst
      </h1>

      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        Grammrlyst is an AI-powered English learning platform designed to make
        grammar, vocabulary, and communication skills simple, interactive, and
        engaging.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Our Mission</h2>
      <p className="text-slate-600 leading-relaxed mb-6">
        Our mission is to help learners worldwide master English through
        practical exercises, smart feedback, and gamified learning tools.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">What We Offer</h2>
      <ul className="list-disc pl-6 text-slate-600 space-y-2">
        <li>Interactive grammar lessons</li>
        <li>AI-powered sentence correction</li>
        <li>Daily language challenges</li>
        <li>Roleplay conversation practice</li>
        <li>Progress tracking with XP & streak system</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4">Why Choose Us?</h2>
      <p className="text-slate-600 leading-relaxed">
        We combine structured grammar education with modern AI technology to
        provide instant feedback and personalized learning experiences.
      </p>
    </main>
    <Footer />
    </>
  );
}