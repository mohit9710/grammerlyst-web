import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Grammrlyst Support",
  description:
    "Get in touch with Grammrlyst for support, feedback, business inquiries, or partnership opportunities.",
  keywords: ["Contact Grammrlyst", "English learning support", "Customer support"],
};

export default function ContactPage() {
  return (
    <>
    <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-slate-900 mb-6">
          Contact Us
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Have questions, feedback, or partnership inquiries? We'd love to hear from you.
        </p>

        <div className="space-y-6 text-slate-600">
          <div>
            <h2 className="text-xl font-bold mb-2">📧 Email</h2>
            <p>support@grammrlyst.com</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">🤝 Business Inquiries</h2>
            <p>business@grammrlyst.com</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">📍 Location</h2>
            <p>Global Online Platform</p>
          </div>
        </div>
      </main>
    <Footer />
    </>
  );
}