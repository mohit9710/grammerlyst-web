import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import {
  Mail,
  MessageSquare,
  Globe,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Clock3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Grammrlyst Support & Inquiries",
  description:
    "Have questions about our AI English tools? Reach out to the Grammrlyst team for support, feedback, or business partnerships.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative border-b border-slate-200 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Grammrlyst Support Center
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-none mb-8">
            Let’s solve your
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              questions fast.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed">
            Need help with your account, AI tools, subscriptions,
            partnerships, or feedback? Our team is ready to assist you.
          </p>

          {/* Quick Stats */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-5">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 px-6 py-4 rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-slate-900">24h</p>
              <span className="text-sm text-slate-500 font-medium">
                Avg Response
              </span>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 px-6 py-4 rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-blue-600">Global</p>
              <span className="text-sm text-slate-500 font-medium">
                Worldwide Support
              </span>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 px-6 py-4 rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-emerald-600">AI</p>
              <span className="text-sm text-slate-500 font-medium">
                Smart Assistance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <main className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Support */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-8 shadow-inner">
                <Mail className="w-8 h-8" />
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 mb-3">
                  General Support
                </h3>

                <p className="text-slate-500 leading-relaxed">
                  Questions about your account, lessons, AI features,
                  subscriptions, or technical issues.
                </p>
              </div>

              <a
                href="mailto:support@grammlyst.in"
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
              >
                support@grammlyst.in
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Partnerships */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-8 shadow-inner">
                <MessageSquare className="w-8 h-8" />
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 mb-3">
                  Partnerships
                </h3>

                <p className="text-slate-500 leading-relaxed">
                  Want to collaborate with Grammrlyst or explore business
                  opportunities together?
                </p>
              </div>

              <a
                href="mailto:grammrlyst@gmail.com"
                className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
              >
                grammrlyst@gmail.com
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Global */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-8 shadow-inner">
                <Globe className="w-8 h-8" />
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 mb-3">
                  Worldwide Platform
                </h3>

                <p className="text-slate-500 leading-relaxed">
                  Grammrlyst supports English learners globally with AI-powered
                  education tools.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-purple-600 font-bold">
                Worldwide Availability
              </div>
            </div>
          </div>
        </div>

        {/* HELP CENTER SECTION */}
        <section className="mt-20 relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 md:p-14 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-500/10" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="flex gap-6">
              <div className="hidden sm:flex w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl items-center justify-center border border-white/10 shrink-0">
                <HelpCircle className="w-10 h-10 text-blue-400" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-blue-300 mb-5">
                  <Clock3 className="w-4 h-4" />
                  Instant Help
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  Need answers right now?
                </h2>

                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                  Visit our Help Center to explore FAQs, troubleshooting guides,
                  billing support, and AI learning resources.
                </p>
              </div>
            </div>

            <button className="group bg-white text-slate-900 px-8 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-50 transition-all shadow-xl whitespace-nowrap">
              Visit Help Center
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Bottom Notice */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Clock3 className="w-5 h-5 text-blue-600" />

            <p className="text-slate-600 text-sm font-medium">
              We usually respond within{" "}
              <span className="font-black text-slate-900">
                24–48 business hours
              </span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}