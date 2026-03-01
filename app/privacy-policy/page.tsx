import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Grammrlyst",
  description:
    "Read the Privacy Policy of Grammrlyst to understand how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
    <Navbar />
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-slate-900 mb-6">
        Privacy Policy
      </h1>

      <p className="text-slate-600 mb-6">
        Last updated: January 2026
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">
        Information We Collect
      </h2>
      <p className="text-slate-600 mb-6">
        We may collect personal information such as your name, email address,
        and usage data to improve your learning experience.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">
        How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 text-slate-600 space-y-2">
        <li>To provide and improve our services</li>
        <li>To personalize your learning experience</li>
        <li>To track progress and performance</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">
        Advertising & Cookies
      </h2>
      <p className="text-slate-600 mb-6">
        We may use third-party advertising services such as Google AdSense.
        These services may use cookies to display relevant ads based on your
        interests and browsing behavior.
      </p>

      <p className="text-slate-600 mb-6">
        Google, as a third-party vendor, uses cookies to serve ads on our
        website. Users may opt out of personalized advertising by visiting
        Google's Ads Settings page.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">
        Data Security
      </h2>
      <p className="text-slate-600 mb-6">
        We implement security measures to protect your personal information.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">
        Contact Us
      </h2>
      <p className="text-slate-600">
        If you have any questions about this Privacy Policy, please contact us
        at support@grammrlyst.com.
      </p>
    </main>
    <Footer />
    </>
  );
}