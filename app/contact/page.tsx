import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Mail, MessageSquare, Globe, ArrowRight, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Grammrlyst Support & Inquiries",
  description:
    "Have questions about our AI English tools? Reach out to the Grammrlyst team for support, feedback, or business partnerships.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            How can we <span className="text-blue-600">help you?</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We’re here to support your English learning journey. Reach out to our 
            dedicated teams for assistance or collaboration.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Contact Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">General Support</h3>
            <p className="text-slate-500 text-sm mb-4">Questions about your account or lessons?</p>
            <a href="mailto:grammrlyst@gmail.com" className="text-blue-600 font-semibold hover:underline">
              grammrlyst@gmail.com
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Partnerships</h3>
            <p className="text-slate-500 text-sm mb-4">For business and collaboration inquiries.</p>
            <a href="mailto:business@grammrlyst.com" className="text-blue-600 font-semibold hover:underline">
              business@grammrlyst.com
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Global Presence</h3>
            <p className="text-slate-500 text-sm mb-4">We operate as a global online platform.</p>
            <span className="text-slate-900 font-semibold">Worldwide Support</span>
          </div>
        </div>

        {/* FAQ Shortcut Section */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex gap-6 items-start">
            <div className="hidden sm:flex w-14 h-14 bg-white/10 rounded-full items-center justify-center shrink-0">
              <HelpCircle className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Looking for quick answers?</h2>
              <p className="text-slate-400">
                Check our Frequently Asked Questions for instant help with common issues.
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap bg-white text-slate-900 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors">
            Visit Help Center <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Response Time Notice */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm italic">
            * We typically respond to all emails within 24 to 48 business hours. 
            Thank you for your patience!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}