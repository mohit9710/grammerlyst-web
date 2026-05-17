"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Brain,
  TimerReset,
  Zap,
  ArrowRight,
  Flame,
  Trophy,
  RotateCcw,
  Mic,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  {
    question: "What would you do if you lost your phone in a foreign country?",
    difficulty: "Medium",
    category: "Real Life",
  },
  {
    question: "Convince me why books are better than movies.",
    difficulty: "Hard",
    category: "Debate",
  },
  {
    question: "Describe your dream city in under 20 seconds.",
    difficulty: "Easy",
    category: "Creative",
  },
  {
    question: "What are the advantages of remote work?",
    difficulty: "Medium",
    category: "Professional",
  },
  {
    question: "Explain social media to someone from the 1800s.",
    difficulty: "Hard",
    category: "Funny",
  },
];

export default function ThinkFastPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [index, setIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(20);

  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState<number | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = useMemo(
    () => QUESTIONS[index],
    [index]
  );

  // TIMER
  useEffect(() => {

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }
    
    if (!started || gameOver) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          finishRound();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current)
        clearInterval(intervalRef.current);
    };
  }, [started, index]);

  // SCORE
  const calculateScore = () => {
    const wordCount = answer.trim().split(" ").length;

    let points = 0;

    if (wordCount >= 5) points += 20;
    if (wordCount >= 12) points += 25;
    if (wordCount >= 20) points += 30;

    points += timeLeft;

    return Math.min(points, 100);
  };

  const finishRound = () => {
    const final = calculateScore();

    setScore(final);
    setGameOver(true);
  };

  const nextQuestion = () => {
    if (index < QUESTIONS.length - 1) {
      setIndex((prev) => prev + 1);
      setTimeLeft(20);
      setAnswer("");
      setGameOver(false);
    } else {
      window.location.reload();
    }
  };

  const resetAnswer = () => {
    setAnswer("");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-semibold mb-5">
                <Zap className="w-4 h-4" />
                Fast Speaking Challenge
              </div>

              <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Think Fast
              </h1>

              <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">
                Improve fluency by responding instantly to random
                real-life speaking prompts before time runs out.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 min-w-[120px]">
                <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">
                  Round
                </div>

                <div className="text-3xl font-black">
                  {index + 1}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 min-w-[120px]">
                <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">
                  Timer
                </div>

                <div
                  className={`text-3xl font-black ${
                    timeLeft <= 5
                      ? "text-rose-400 animate-pulse"
                      : "text-cyan-300"
                  }`}
                >
                  {timeLeft}s
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 min-w-[120px]">
                <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">
                  Difficulty
                </div>

                <div className="text-xl font-black text-fuchsia-300">
                  {currentQuestion.difficulty}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            {/* LEFT */}
            <div className="bg-white/[0.04] border border-white/10 rounded-[36px] p-8 backdrop-blur-xl">
              {!started ? (
                <div className="min-h-[550px] flex flex-col items-center justify-center text-center">
                  <div className="w-28 h-28 rounded-[32px] bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-8">
                    <Brain className="w-14 h-14 text-cyan-300" />
                  </div>

                  <h2 className="text-4xl font-black mb-4">
                    Speak Before Time Ends
                  </h2>

                  <p className="text-slate-400 max-w-xl leading-relaxed mb-10">
                    You’ll get random speaking situations and
                    only 20 seconds to answer naturally in
                    English.
                  </p>

                  <button
                    onClick={() => setStarted(true)}
                    className="px-10 py-5 rounded-2xl bg-cyan-400 text-slate-950 font-black text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,211,238,0.35)]"
                  >
                    START THINKING
                  </button>
                </div>
              ) : (
                <div className="min-h-[550px] flex flex-col">
                  {/* CATEGORY */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/20 text-fuchsia-300 text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      {currentQuestion.category}
                    </div>

                    <div className="text-sm text-slate-500">
                      Think & Speak Naturally
                    </div>
                  </div>

                  {/* QUESTION */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-slate-500 uppercase tracking-[0.3em] text-xs mb-5">
                        Your Prompt
                      </div>

                      <h2 className="text-4xl lg:text-5xl font-black leading-tight max-w-3xl">
                        {currentQuestion.question}
                      </h2>
                    </div>
                  </div>

                  {/* TEXT AREA */}
                  <div className="mt-10">
                    <div className="relative">
                      <textarea
                        value={answer}
                        onChange={(e) =>
                          setAnswer(e.target.value)
                        }
                        placeholder="Type what you would say..."
                        className="w-full h-40 bg-black/30 border border-white/10 rounded-3xl p-6 text-lg outline-none focus:border-cyan-400 resize-none placeholder:text-slate-600"
                      />

                      <div className="absolute bottom-5 right-5 text-slate-500 text-sm">
                        {
                          answer
                            .trim()
                            .split(" ")
                            .filter(Boolean).length
                        }{" "}
                        words
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-wrap gap-4 mt-6">
                      <button
                        onClick={finishRound}
                        className="flex-1 min-w-[180px] bg-cyan-400 hover:bg-cyan-300 text-slate-950 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
                      >
                        Submit Answer
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button
                        onClick={resetAnswer}
                        className="px-6 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* SCORE PANEL */}
              <div className="bg-white/[0.04] border border-white/10 rounded-[36px] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-300" />
                  </div>

                  <div>
                    <h3 className="font-black text-xl">
                      Performance
                    </h3>

                    <p className="text-slate-500 text-sm">
                      Instant fluency analysis
                    </p>
                  </div>
                </div>

                {!gameOver ? (
                  <div className="space-y-5">
                    <div className="bg-black/30 rounded-3xl p-6 border border-white/5">
                      <div className="text-slate-500 text-sm mb-2">
                        Current Mode
                      </div>

                      <div className="text-3xl font-black text-cyan-300">
                        Think Fast
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-3xl p-5 border border-white/5">
                        <div className="text-slate-500 text-xs uppercase mb-2">
                          Speed
                        </div>

                        <div className="text-2xl font-black">
                          Fast
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-3xl p-5 border border-white/5">
                        <div className="text-slate-500 text-xs uppercase mb-2">
                          Focus
                        </div>

                        <div className="text-2xl font-black">
                          Speaking
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-3xl p-5 text-cyan-200 text-sm leading-relaxed">
                      Speak naturally instead of memorizing.
                      The goal is quick thinking and fluency.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-[28px] p-8 text-slate-950 mb-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="text-sm font-bold uppercase tracking-widest">
                          Final Score
                        </div>

                        <Flame className="w-6 h-6" />
                      </div>

                      <div className="text-7xl font-black leading-none">
                        {score}
                      </div>

                      <div className="mt-4 font-semibold">
                        {score! >= 85
                          ? "Excellent Fluency"
                          : score! >= 65
                          ? "Good Speaking"
                          : "Needs More Practice"}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={nextQuestion}
                        className="w-full py-4 rounded-2xl bg-white text-slate-950 font-black hover:scale-[1.02] transition-all"
                      >
                        {index < QUESTIONS.length - 1
                          ? "NEXT CHALLENGE"
                          : "RESTART GAME"}
                      </button>

                      <button
                        onClick={() => {
                          setStarted(false);
                          setGameOver(false);
                          setAnswer("");
                          setTimeLeft(20);
                        }}
                        className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold"
                      >
                        Exit Round
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* QUICK TIPS */}
              <div className="bg-white/[0.04] border border-white/10 rounded-[36px] p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-emerald-300" />
                  </div>

                  <div>
                    <h3 className="font-black text-xl">
                      Speaking Tips
                    </h3>

                    <p className="text-slate-500 text-sm">
                      Improve your fluency faster
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                    Don’t translate in your head. Respond
                    directly in English.
                  </div>

                  <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                    Focus on flow and confidence instead of
                    perfect grammar.
                  </div>

                  <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                    Use filler phrases naturally:
                    “Actually…”, “I think…”, “In my opinion…”
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}