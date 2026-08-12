"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  chatbotService,
  CorrectionResponse,
} from "@/services/chatbotService";
import Footer from "@/components/Footer";
import { saveAttempt } from "@/services/reportAnalysis";

export default function AIChatTutor() {
  const router = useRouter();

  const [input, setInput] =
    useState("");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [corrections, setCorrections] =
    useState<CorrectionResponse[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // AUTH
  // =====================================================

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(
            "access_token"
          )
        : null;

    if (!token) {
      // router.replace("/auth/login");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [router]);

  // =====================================================
  // HANDLE FIX
  // =====================================================

  const handleFix = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !input.trim() ||
      isProcessing
    )
      return;

    setIsProcessing(true);

    setError(null);

    try {
      const token =
        localStorage.getItem(
          "access_token"
        );

      const result =
        await chatbotService.correctSentence(
          input
        );

      setCorrections((prev) => [
        result,
        ...prev,
      ]);

      // SAVE ATTEMPT
      if (token) {
        try {
          await saveAttempt(token, {
            exercise_type:
              "sentence_polisher",

            question: input,

            user_answer: input,

            corrected_answer:
              result.fixed,

            ai_feedback:
              result.rule ||
              "Sentence corrected by AI",

            accuracy_score: 85,

            grammar_score: 90,

            pronunciation_score: 0,

            fluency_score: 80,

            vocabulary_score: 75,

            listening_score: 0,

            verb_score: 70,

            confidence_score: 78,

            speaking_speed: 0,

            pause_count: 0,

            filler_word_count: 0,

            xp_earned: 15,

            duration_seconds: 30,
          });
        } catch (saveErr) {
          console.error(
            "Save attempt failed",
            saveErr
          );
        }
      }

      setInput("");
    } catch (err: any) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );

      setTimeout(
        () => setError(null),
        4000
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white font-bold">
        Loading Sentence Polisher...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
      <Navbar />

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-cyan-500/20 blur-3xl rounded-full" />

      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-violet-500/20 blur-3xl rounded-full" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* HERO */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="uppercase tracking-[0.3em] text-cyan-400 text-xs font-bold mb-4">
            AI WRITING ASSISTANT
          </p>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
            Sentence{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Polisher
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Instantly improve grammar,
            fluency, sentence structure,
            and writing clarity using AI.
          </p>
        </div>

        {/* INPUT SECTION */}
        <div className="max-w-5xl mx-auto mb-14">
          <form
            onSubmit={handleFix}
            className="rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl p-4 md:p-5"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <textarea
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                placeholder="Type or paste your sentence here..."
                rows={4}
                className="flex-1 bg-[#0d1324] border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-slate-500 outline-none resize-none focus:border-cyan-400 transition-all"
              />

              <button
                disabled={
                  !input.trim() ||
                  isProcessing
                }
                className="lg:w-[220px] rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 text-white font-black text-lg shadow-2xl px-6 py-5"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    <span>
                      Polishing...
                    </span>
                  </div>
                ) : (
                  "Correct Sentence"
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-4 text-red-300 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* EMPTY STATE */}
        {corrections.length === 0 && (
          <div className="max-w-4xl mx-auto rounded-[2rem] bg-white/5 border border-dashed border-white/10 p-12 text-center backdrop-blur-xl">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-4xl shadow-2xl mb-6">
              ✨
            </div>

            <h3 className="text-2xl font-black mb-3">
              Your AI Corrections
            </h3>

            <p className="text-slate-400 max-w-lg mx-auto">
              Submit a sentence and your
              grammar corrections will
              appear here with improved
              versions and writing tips.
            </p>
          </div>
        )}

        {/* RESULTS */}
        <div className="max-w-6xl mx-auto space-y-6">
          {corrections.map((c, i) => (
            <div
              key={i}
              className={`rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
                i === 0
                  ? "ring-2 ring-cyan-400/30"
                  : ""
              }`}
            >
              {/* TOP */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-white/5 px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="uppercase tracking-[0.2em] text-cyan-400 text-xs font-bold mb-2">
                    AI Grammar Analysis
                  </p>

                  <h2 className="text-2xl font-black">
                    Sentence Improved
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                    {c.rule}
                  </span>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        c.fixed
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="grid lg:grid-cols-2 gap-6 p-6 md:p-8">
                {/* ORIGINAL */}
                <div className="rounded-[1.5rem] bg-[#0d1324] border border-white/5 p-6">
                  <p className="uppercase tracking-[0.2em] text-red-400 text-xs font-bold mb-4">
                    Original Sentence
                  </p>

                  <p className="text-slate-400 text-lg leading-relaxed line-through decoration-red-400/50">
                    {c.original}
                  </p>
                </div>

                {/* FIXED */}
                <div className="rounded-[1.5rem] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/10 p-6">
                  <p className="uppercase tracking-[0.2em] text-cyan-400 text-xs font-bold mb-4">
                    AI Corrected
                  </p>

                  <p className="text-white text-xl font-semibold leading-relaxed">
                    {c.fixed}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TIPS */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="rounded-[2rem] bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-400/10 p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-black mb-6">
              Writing Tips
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                <div className="text-3xl mb-4">
                  ✍️
                </div>

                <h4 className="font-bold text-lg mb-2">
                  Keep Sentences Clear
                </h4>

                <p className="text-slate-400 text-sm leading-relaxed">
                  Short and clear
                  sentences improve
                  readability and fluency.
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                <div className="text-3xl mb-4">
                  📚
                </div>

                <h4 className="font-bold text-lg mb-2">
                  Improve Vocabulary
                </h4>

                <p className="text-slate-400 text-sm leading-relaxed">
                  Replace repetitive words
                  with more natural
                  alternatives.
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                <div className="text-3xl mb-4">
                  🚀
                </div>

                <h4 className="font-bold text-lg mb-2">
                  Practice Daily
                </h4>

                <p className="text-slate-400 text-sm leading-relaxed">
                  Consistent writing
                  practice improves grammar
                  and confidence faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}