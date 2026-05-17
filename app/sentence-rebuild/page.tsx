"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Layers3,
  ArrowRight,
  Brain,
  Zap,
  Timer,
  RotateCcw,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const QUESTIONS = [
  {
    words: ["today", "school", "I", "went", "to"],
    answer: "I went to school today",
  },
  {
    words: ["football", "playing", "is", "He"],
    answer: "He is playing football",
  },
  {
    words: ["very", "This", "easy", "game", "is"],
    answer: "This game is very easy",
  },
];

export default function SentenceRebuildPage() {
  const [questionIndex, setQuestionIndex] = useState(0);

  const currentQuestion = QUESTIONS[questionIndex];

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);

  const [score, setScore] = useState(0);

  const [status, setStatus] = useState<
    "idle" | "correct" | "wrong"
  >("idle");

  // Initialize question
  useEffect(() => {
    const shuffled = [...currentQuestion.words].sort(
      () => Math.random() - 0.5
    );

    setRemainingWords(shuffled);
    setSelectedWords([]);
    setTimeLeft(30);
    setStatus("idle");
  }, [questionIndex]);

  // TIMER
  useEffect(() => {
    if (timeLeft <= 0) {
      handleWrong();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Progress
  const progress = useMemo(() => {
    return (timeLeft / 30) * 100;
  }, [timeLeft]);

  // Add word
  const addWord = (word: string, index: number) => {
    setSelectedWords((prev) => [...prev, word]);

    setRemainingWords((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // Undo single word
  const undoLast = () => {
    if (selectedWords.length === 0) return;

    const updated = [...selectedWords];
    const lastWord = updated.pop();

    setSelectedWords(updated);

    if (lastWord) {
      setRemainingWords((prev) => [...prev, lastWord]);
    }
  };

  // Clear all
  const clearAll = () => {
    setRemainingWords((prev) => [
      ...prev,
      ...selectedWords,
    ]);

    setSelectedWords([]);
  };

  // Correct answer
  const handleCorrect = () => {
    setStatus("correct");

    setScore((prev) => prev + 100);

    setTimeout(() => {
      if (questionIndex < QUESTIONS.length - 1) {
        setQuestionIndex((prev) => prev + 1);
      } else {
        alert("🎉 Game Completed!");
      }
    }, 1200);
  };

  // Wrong answer
  const handleWrong = () => {
    setStatus("wrong");

    setTimeout(() => {
      if (questionIndex < QUESTIONS.length - 1) {
        setQuestionIndex((prev) => prev + 1);
      } else {
        alert("Game Over");
      }
    }, 1200);
  };

  // Submit
  const handleSubmit = () => {
    const userSentence = selectedWords.join(" ").trim();

    if (
      userSentence.toLowerCase() ===
      currentQuestion.answer.toLowerCase()
    ) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#060816] text-white overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#4338ca30,transparent_40%)]" />

        <section className="relative max-w-7xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex flex-wrap gap-4 justify-between items-center mb-10">

            <div>
              <p className="text-indigo-400 uppercase tracking-[0.3em] text-sm mb-2">
                Grammar Builder
              </p>

              <h1 className="text-5xl font-black">
                Sentence Rebuild
              </h1>
            </div>

            <div className="flex gap-4 flex-wrap">

              {/* Score */}
              <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                {score} XP
              </div>

              {/* Timer */}
              <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-2">
                <Timer className="w-4 h-4 text-cyan-400" />
                {timeLeft}s
              </div>

            </div>
          </div>

          {/* Timer Progress */}
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-10">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft < 10
                  ? "bg-rose-500"
                  : "bg-indigo-500"
              }`}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* LEFT SIDE */}
            <div>

              <div className="bg-white/5 border border-white/10 rounded-[36px] p-8">

                {/* Status */}
                {status === "correct" && (
                  <div className="mb-6 bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 px-5 py-4 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    Correct Sentence!
                  </div>
                )}

                {status === "wrong" && (
                  <div className="mb-6 bg-rose-500/10 border border-rose-400/20 text-rose-300 px-5 py-4 rounded-2xl flex items-center gap-3">
                    <XCircle className="w-5 h-5" />
                    Wrong Sentence
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <Layers3 className="w-6 h-6 text-indigo-400" />

                  <h2 className="text-2xl font-black">
                    Arrange The Sentence
                  </h2>
                </div>

                <p className="text-slate-400 mb-8">
                  Build the correct English sentence
                  using the shuffled words.
                </p>

                {/* Selected Words */}
                <div className="min-h-[180px] bg-[#0f172a] border border-white/10 rounded-3xl p-6 flex flex-wrap gap-3 mb-8">

                  {selectedWords.length === 0 ? (
                    <p className="text-slate-600">
                      Select words below...
                    </p>
                  ) : (
                    selectedWords.map((word, i) => (
                      <div
                        key={i}
                        className="bg-indigo-500 text-white px-4 py-3 rounded-2xl font-bold"
                      >
                        {word}
                      </div>
                    ))
                  )}
                </div>

                {/* Controls */}
                <div className="flex gap-3 mb-6">

                  <button
                    onClick={undoLast}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Undo
                  </button>

                  <button
                    onClick={clearAll}
                    className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/20 text-rose-300 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>

                </div>

                {/* Word Pool */}
                <div className="flex flex-wrap gap-4">

                  {remainingWords.map((word, index) => (
                    <button
                      key={`${word}-${index}`}
                      onClick={() => addWord(word, index)}
                      className="bg-white/5 border border-white/10 hover:border-indigo-400 hover:bg-indigo-500/10 px-5 py-3 rounded-2xl transition-all font-bold"
                    >
                      {word}
                    </button>
                  ))}

                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={selectedWords.length === 0}
                  className="mt-8 w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed py-5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all"
                >
                  Submit Sentence
                  <ArrowRight className="w-5 h-5" />
                </button>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-white/10 rounded-[36px] p-10">

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
                <Brain className="w-10 h-10 text-indigo-400 mb-4" />

                <h3 className="text-3xl font-black mb-4">
                  Train Grammar Instincts
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  Learn natural English sentence flow,
                  grammar structure, and speaking logic
                  through interactive rebuilding rounds.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Real conversation structure",
                  "Grammar sequencing",
                  "Fast thinking challenges",
                  "Vocabulary building",
                  "XP reward system",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Correct Answer Preview */}
              <div className="mt-8 bg-black/30 border border-white/10 rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-3">
                  Current Challenge
                </p>

                <h4 className="text-xl font-black text-indigo-300">
                  Rebuild the sentence correctly before time runs out.
                </h4>
              </div>

            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}