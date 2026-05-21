import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import {
  BookOpen,
  Cpu,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Languages,
  Rocket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Grammrlyst - Redefining English Mastery",
  description:
    "Discover how Grammrlyst leverages cutting-edge AI to bridge the gap between traditional grammar and real-world English communication.",
  keywords: [
    "About Grammrlyst",
    "English Learning AI",
    "Grammar Tools",
    "ESL Platform",
  ],
};

export default function AboutPage() {
  const features = [
    {
      title: "AI Precision",
      desc: "Context-aware corrections powered by intelligent language models.",
      icon: <Cpu className="w-7 h-7" />,
      glow: "from-blue-500/20 to-cyan-500/10",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Global Learning",
      desc: "Designed for learners from every culture and background.",
      icon: <Globe className="w-7 h-7" />,
      glow: "from-emerald-500/20 to-teal-500/10",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Scientific Method",
      desc: "Learning systems based on NLP and linguistic research.",
      icon: <BrainCircuit className="w-7 h-7" />,
      glow: "from-purple-500/20 to-pink-500/10",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Real Results",
      desc: "XP systems, analytics, and measurable improvement.",
      icon: <Award className="w-7 h-7" />,
      glow: "from-amber-500/20 to-orange-500/10",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative border-b border-slate-200 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />

        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[850px] h-[850px] bg-blue-500/10 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 mb-8">
                <Sparkles className="w-4 h-4 text-blue-600" />
                About Grammrlyst
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-slate-900 mb-8">
                English learning,
                <br />
                rebuilt for the
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI generation.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mb-10">
                Grammrlyst combines modern AI with practical communication
                training to help learners speak, write, and think confidently
                in English.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl flex items-center gap-2">
                  Explore Platform
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                  Learn Our Story
                </button>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative">
              <div className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50" />

                <div className="relative">
                  {/* Top */}
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                        AI Learning Engine
                      </p>
                      <h3 className="text-3xl font-black text-slate-900 mt-2">
                        Personalized Mastery
                      </h3>
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                      <Rocket className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="space-y-5">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Languages className="w-6 h-6" />
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 mb-1">
                          Real Conversation Practice
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          Interactive AI roleplays that simulate real-world
                          communication.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 mb-1">
                          Smart Grammar Analysis
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          Learn mistakes with explanations instead of memorizing
                          rules.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-blue-300 font-bold uppercase tracking-wider">
                          Active Learners
                        </span>

                        <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                          Growing Daily
                        </span>
                      </div>

                      <h2 className="text-5xl font-black tracking-tight">
                        24/7
                      </h2>

                      <p className="text-slate-400 mt-2">
                        AI-powered learning available anytime, anywhere.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Glow */}
              <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-blue-500/20 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-10 shadow-sm">
            <div className="absolute top-0 right-0 w-52 h-52 bg-blue-500/10 blur-3xl rounded-full" />

            <div className="relative">
              <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">
                Our Mission
              </span>

              <h2 className="text-4xl font-black text-slate-900 mt-5 mb-6 leading-tight">
                Make world-class English education accessible to everyone.
              </h2>

              <p className="text-slate-600 leading-relaxed text-lg">
                We believe language should open doors, not create barriers.
                Grammrlyst helps learners improve through adaptive AI tools,
                interactive speaking systems, and personalized feedback.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-500/10" />

            <div className="relative">
              <span className="text-blue-300 font-black uppercase tracking-[0.2em] text-xs">
                Our Vision
              </span>

              <h2 className="text-4xl font-black text-white mt-5 mb-6 leading-tight">
                Build the most trusted AI companion for English mastery.
              </h2>

              <p className="text-slate-400 leading-relaxed text-lg">
                We envision a future where learners gain confidence naturally
                through immersive AI experiences that feel personal, engaging,
                and practical.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">
            Why Grammrlyst
          </span>

          <h2 className="text-5xl font-black text-slate-900 mt-5 mb-4 tracking-tight">
            The difference you’ll feel.
          </h2>

          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Modern AI systems combined with practical learning experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${item.glow}`}
              />

              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8 shadow-inner`}
                >
                  {item.icon}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  {item.title}
                </h3>

                <p className="text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LONG CONTENT SECTION */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="mb-14">
            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">
              Our Philosophy
            </span>

            <h2 className="text-5xl font-black text-slate-900 mt-5 tracking-tight leading-tight">
              Redefining modern English education.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 text-slate-600 leading-relaxed text-lg">
            <div className="space-y-8">
              <p>
                In today’s connected world, English is more than a subject —
                it’s an opportunity. Traditional learning systems often focus on
                memorization instead of practical communication.
              </p>

              <p>
                Grammrlyst changes that by combining AI, NLP, and interactive
                learning systems that adapt to every learner’s strengths,
                weaknesses, and pace.
              </p>
            </div>

            <div className="space-y-8">
              <p>
                Whether you are preparing for IELTS, improving workplace
                communication, or becoming more fluent in daily conversations,
                our tools are designed to create real-world confidence.
              </p>

              <p>
                From pronunciation analysis to AI roleplay conversations,
                everything inside Grammrlyst is built to make learning feel
                immersive, modern, and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}