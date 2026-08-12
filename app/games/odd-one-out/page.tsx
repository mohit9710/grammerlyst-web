"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  fetchOddOneOutRounds,
  OddOneOutRound,
} from "@/services/oddOneOutService";
import { updateXP } from "@/services/userService";

const ROUND_COUNT = 10;
const ROUND_SECONDS = 10;
const STARTING_LIVES = 3;

export default function OddOneOut() {
  const [rounds, setRounds] = useState<OddOneOutRound[]>([]);

  const [index, setIndex] = useState(0);

  const [score, setScore] = useState(0);

  const [streak, setStreak] = useState(0);

  const [lives, setLives] = useState(STARTING_LIVES);

  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);

  const [selected, setSelected] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [isFinished, setIsFinished] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [gameOverEarly, setGameOverEarly] = useState(false);

  const answeredRef = useRef(false);

  const current = rounds[index];

  // =====================================================
  // SEO
  // =====================================================

  useEffect(() => {
    document.title = "Odd One Out | Grammrlyst";

    let metaDesc = document.querySelector('meta[name="description"]');

    if (!metaDesc) {
      metaDesc = document.createElement("meta");

      metaDesc.setAttribute("name", "description");

      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute(
      "content",
      "Spot the odd word out in each group before time runs out and sharpen your English vocabulary."
    );
  }, []);

  // =====================================================
  // LOAD ROUNDS
  // =====================================================

  const startGame = useCallback(async () => {
    setLoading(true);

    setIndex(0);
    setScore(0);
    setStreak(0);
    setLives(STARTING_LIVES);
    setTimeLeft(ROUND_SECONDS);
    setSelected(null);
    setIsFinished(false);
    setGameOverEarly(false);
    answeredRef.current = false;

    try {
      const data = await fetchOddOneOutRounds(ROUND_COUNT);
      setRounds(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  // =====================================================
  // XP SAVE
  // =====================================================

  const handleGameWin = async (finalScore: number, completed: boolean) => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    setIsSaving(true);

    try {
      await updateXP(token, finalScore, false, "Odd One Out");

      if (completed) {
        await updateXP(token, 150, true, "Odd One Out Bonus");
      }
    } catch (err) {
      console.error("Points sync failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // ROUND FLOW
  // =====================================================

  const goToNextRound = useCallback(
    (nextScore: number, livesLeft: number) => {
      if (livesLeft <= 0) {
        setGameOverEarly(true);
        setIsFinished(true);
        handleGameWin(nextScore, false);
        return;
      }

      if (index + 1 >= rounds.length) {
        setIsFinished(true);
        handleGameWin(nextScore, true);
        return;
      }

      setIndex((i) => i + 1);
      setSelected(null);
      setTimeLeft(ROUND_SECONDS);
      answeredRef.current = false;
    },
    [index, rounds.length]
  );

  const handleAnswer = useCallback(
    (choiceIndex: number | null) => {
      if (answeredRef.current || !current) return;

      answeredRef.current = true;
      setSelected(choiceIndex);

      const isCorrect = choiceIndex === current.oddIndex;

      const nextScore = isCorrect
        ? score + 100 + timeLeft * 5
        : score;

      const nextLives = isCorrect ? lives : lives - 1;

      setScore(nextScore);
      setStreak(isCorrect ? streak + 1 : 0);
      setLives(nextLives);

      setTimeout(() => {
        goToNextRound(nextScore, nextLives);
      }, 1100);
    },
    [current, score, timeLeft, lives, streak, goToNextRound]
  );

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (loading || isFinished || !current) return;

    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, loading, isFinished, current, handleAnswer]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 px-10 py-8 shadow-sm">
          <p className="text-slate-500 font-semibold animate-pulse">
            Loading rounds...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                Odd One Out
              </h1>

              <p className="text-slate-500 mt-1">
                Spot the word that doesn't belong before time runs out
              </p>
            </div>

            <Link
              href="/games"
              className="bg-white border border-slate-200 px-5 py-3 rounded-2xl font-semibold text-slate-600 hover:bg-slate-100 transition w-fit"
            >
              ← Exit Game
            </Link>
          </div>

          {/* STATS */}
          {!isFinished && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Score
                </p>

                <h2 className="text-3xl font-black text-blue-600">
                  {score}
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Round
                </p>

                <h2 className="text-3xl font-black text-slate-900">
                  {index + 1}/{rounds.length}
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Streak
                </p>

                <h2 className="text-3xl font-black text-amber-500">
                  🔥 {streak}
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Lives
                </p>

                <h2 className="text-3xl font-black text-rose-500">
                  {"❤️".repeat(lives) || "—"}
                </h2>
              </div>
            </div>
          )}

          {/* TIMER BAR */}
          {!isFinished && (
            <div className="bg-white border border-slate-200 rounded-full h-3 overflow-hidden mb-8">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 3
                    ? "bg-rose-500"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600"
                }`}
                style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
              />
            </div>
          )}

          {/* GAME CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            {!isFinished && current ? (
              <div className="p-6 md:p-10">
                <p className="text-center text-xs uppercase tracking-[0.3em] font-black text-slate-400 mb-3">
                  Category: {current.category}
                </p>

                <h2 className="text-center text-lg md:text-xl font-bold text-slate-900 mb-8">
                  Which word doesn't belong?
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {current.words.map((word, i) => {
                    const isSelected = selected === i;
                    const isCorrectAnswer = current.oddIndex === i;
                    const showResult = selected !== null;

                    let stateClasses =
                      "bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50";

                    if (showResult) {
                      if (isCorrectAnswer) {
                        stateClasses =
                          "bg-emerald-50 border-emerald-400 text-emerald-700";
                      } else if (isSelected) {
                        stateClasses =
                          "bg-rose-50 border-rose-400 text-rose-700";
                      } else {
                        stateClasses =
                          "bg-slate-50 border-slate-200 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={showResult}
                        className={`rounded-2xl border-2 px-6 py-8 text-xl md:text-2xl font-black transition-all ${stateClasses}`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>

                {selected !== null && (
                  <p className="text-center text-slate-500 mt-6 text-sm">
                    💡 {current.explanation}
                  </p>
                )}

                <p className="text-center text-slate-400 font-medium text-sm mt-6">
                  ⏱ {timeLeft}s remaining
                </p>
              </div>
            ) : (
              <div className="p-8 md:p-14 text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-5xl mb-8">
                  {gameOverEarly ? "💔" : "🎯"}
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
                  {gameOverEarly ? "Out of Lives!" : "Round Complete!"}
                </h2>

                <p className="text-slate-500 text-lg mb-2">Final Score</p>

                <p className="text-6xl font-black text-blue-600 mb-4">
                  {score}
                </p>

                {!gameOverEarly && (
                  <p className="text-emerald-600 font-black text-xl mb-10">
                    +150 Bonus XP Applied
                  </p>
                )}

                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <button
                    onClick={startGame}
                    disabled={isSaving}
                    className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition"
                  >
                    Play Again
                  </button>

                  <Link
                    href="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition"
                  >
                    Dashboard
                  </Link>
                </div>

                {isSaving && (
                  <p className="mt-6 text-sm text-blue-500 animate-pulse">
                    Syncing your XP...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
