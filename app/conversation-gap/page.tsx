"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mic,
  Brain,
  Sparkles,
  Volume2,
  Clock3,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  MessageCircle,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    category: "Friends",
    situation: "Your friend says:",
    message: "I'm feeling really tired today.",
    suggestions: [
      "You should get some rest.",
      "Long day at work?",
      "What happened?",
    ],
    best: [
      "You should get some rest.",
      "Long day at work?",
    ],
    explanation:
      "Good conversations continue with empathy or follow-up questions.",
  },

  {
    id: 2,
    category: "Office",
    situation: "Your manager says:",
    message: "We need this project before Friday.",
    suggestions: [
      "Okay.",
      "Sure, I'll prioritize it.",
      "Can we discuss the deadline?",
    ],
    best: [
      "Sure, I'll prioritize it.",
      "Can we discuss the deadline?",
    ],
    explanation:
      "Professional conversations need clarity and confidence.",
  },

  {
    id: 3,
    category: "Social",
    situation: "Someone says:",
    message: "I love watching horror movies.",
    suggestions: [
      "What's your favorite one?",
      "I get scared easily 😅",
      "Okay.",
    ],
    best: [
      "What's your favorite one?",
      "I get scared easily 😅",
    ],
    explanation:
      "Natural conversations continue with reactions and curiosity.",
  },
];

export default function ConversationFlowPracticePage() {
  const [current, setCurrent] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const [score, setScore] = useState(0);

  const [timer, setTimer] = useState(15);

  const [started, setStarted] = useState(false);

  const [voiceMode, setVoiceMode] = useState(false);

  const item = useMemo(
    () => conversations[current],
    [current]
  );

  // TIMER
  useEffect(() => {
    if (!started || submitted) return;

    if (timer <= 0) {
      setSubmitted(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, started, submitted]);

  // RESET
  const resetQuestion = () => {
    setSelected(null);
    setSubmitted(false);
    setTimer(15);
  };

  // SUBMIT
  const handleSubmit = () => {
    if (!selected) return;

    setSubmitted(true);

    if (item.best.includes(selected)) {
      setScore((prev) => prev + 100);
    }
  };

  // NEXT
  const nextQuestion = () => {
    if (current < conversations.length - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setSubmitted(false);
      setTimer(15);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111f] text-white overflow-hidden">
        {/* HERO */}
        <section className="border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.12),transparent_35%)]" />

          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-300 text-sm mb-8">
                <Sparkles className="w-4 h-4" />
                Real Conversation Continuation Training
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-8">
                Learn What
                <br />
                To Say
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                  Next
                </span>
              </h1>

              <p className="text-xl text-slate-400 leading-relaxed">
                Train real-life English conversation flow.
                Practice follow-up questions, reactions,
                empathy, and natural speaking responses.
              </p>
            </div>
          </div>
        </section>

        {/* PRACTICE AREA */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
              {/* TOP */}
              <div className="p-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-cyan-400 text-sm uppercase tracking-[0.3em] font-bold mb-2">
                    {item.category}
                  </div>

                  <h2 className="text-3xl font-black">
                    Conversation Practice
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-2">
                    <Clock3 className="w-5 h-5 text-cyan-400" />
                    <span className="font-black text-xl">
                      {timer}s
                    </span>
                  </div>

                  <div className="bg-cyan-500 text-slate-950 px-5 py-3 rounded-2xl font-black">
                    XP {score}
                  </div>
                </div>
              </div>

              {/* CHAT */}
              <div className="p-8">
                <div className="bg-black/20 border border-white/10 rounded-3xl p-8 mb-8">
                  <p className="text-slate-400 text-sm mb-4">
                    {item.situation}
                  </p>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-7 h-7 text-cyan-400" />
                    </div>

                    <div className="text-2xl md:text-3xl font-bold leading-relaxed">
                      "{item.message}"
                    </div>
                  </div>
                </div>

                {/* OPTIONS */}
                <div className="space-y-4">
                  {item.suggestions.map((option, i) => {
                    const active = selected === option;

                    const correct =
                      submitted &&
                      item.best.includes(option);

                    const wrong =
                      submitted &&
                      active &&
                      !item.best.includes(option);

                    return (
                      <button
                        key={i}
                        disabled={submitted}
                        onClick={() => setSelected(option)}
                        className={`w-full text-left rounded-2xl border p-6 transition-all ${
                          correct
                            ? "bg-emerald-500/20 border-emerald-400"
                            : wrong
                            ? "bg-rose-500/20 border-rose-400"
                            : active
                            ? "bg-cyan-500/10 border-cyan-400"
                            : "bg-white/5 border-white/10 hover:border-cyan-400/30 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">
                            {option}
                          </span>

                          {correct && (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          )}

                          {wrong && (
                            <XCircle className="w-6 h-6 text-rose-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* FEEDBACK */}
                {submitted && (
                  <div className="mt-8 bg-cyan-500/10 border border-cyan-400/20 rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-7 h-7 text-cyan-400" />
                      </div>

                      <div>
                        <h3 className="text-xl font-black mb-3">
                          AI Feedback
                        </h3>

                        <p className="text-slate-300 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-4 mt-8">
                  {!started ? (
                    <button
                      onClick={() => setStarted(true)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all"
                    >
                      Start Practice
                    </button>
                  ) : !submitted ? (
                    <>
                      <button
                        onClick={handleSubmit}
                        disabled={!selected}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-black disabled:opacity-40"
                      >
                        Submit Answer
                      </button>

                      <button
                        onClick={resetQuestion}
                        className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      disabled={
                        current === conversations.length - 1
                      }
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-black disabled:opacity-40 flex items-center gap-2"
                    >
                      Next Conversation
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6">
            {/* VOICE MODE */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-400 text-sm">
                    Optional
                  </p>

                  <h3 className="text-2xl font-black">
                    Voice Mode
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Mic className="w-7 h-7 text-cyan-400" />
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed mb-6">
                Speak your answer instead of selecting it.
                AI analyzes fluency, hesitation, and
                confidence.
              </p>

              <button
                onClick={() => setVoiceMode(!voiceMode)}
                className={`w-full py-4 rounded-2xl font-black transition-all ${
                  voiceMode
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {voiceMode
                  ? "Voice Mode Enabled"
                  : "Enable Voice Mode"}
              </button>
            </div>

            {/* LEARNING */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-400 text-sm">
                    What You Learn
                  </p>

                  <h3 className="text-2xl font-black">
                    Conversation Skills
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "How to continue conversations",
                  "Follow-up question training",
                  "Avoid awkward silence",
                  "Natural human responses",
                  "Real-world social confidence",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-black/20 border border-white/10 rounded-2xl p-4 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />

                    <span className="text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDIO */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2rem] p-8 text-slate-950">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Volume2 className="w-7 h-7" />
              </div>

              <h3 className="text-3xl font-black mb-4">
                Real Audio
                Conversations
              </h3>

              <p className="font-medium leading-relaxed mb-6">
                Listen to native speakers and reply in
                real-time like an actual conversation.
              </p>

              <button className="bg-slate-950 text-white px-6 py-4 rounded-2xl font-black hover:scale-105 transition-all">
                Try Audio Mode
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}