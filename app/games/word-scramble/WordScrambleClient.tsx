"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  gameService,
  ScrambleWord,
} from "@/services/gameService";

import { updateXP } from "@/services/userService";

export default function WordScramble() {
  const router = useRouter();

  const [words, setWords] = useState<
    ScrambleWord[]
  >([]);

  const [index, setIndex] = useState(0);

  const [guess, setGuess] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [shake, setShake] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [isFinished, setIsFinished] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);


  // =====================================================
  // FETCH WORDS
  // =====================================================

  useEffect(() => {
    async function initGame() {
      try {
        const data =
          await gameService.getScrambleChallenges(
            10
          );

        if (data.length > 0) {
          setWords(data);
        }
      } catch (err) {
        console.error(
          "Failed to load challenges"
        );
      } finally {
        setLoading(false);
      }
    }

    initGame();
  }, [router]);

  // =====================================================
  // XP SAVE
  // =====================================================

  const handleGameWin = async (
    finalScore: number
  ) => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) return;

    setIsSaving(true);

    try {
      await updateXP(
        token,
        finalScore,
        false,
        "Word Unscrambler"
      );

      await updateXP(
        token,
        200,
        true,
        "Word Scramble Bonus"
      );
    } catch (err) {
      console.error(
        "Points sync failed",
        err
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // CHECK ANSWER
  // =====================================================

  const checkAnswer = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!current || isSaving) return;

    if (
      guess.trim().toUpperCase() ===
      current.original_word.toUpperCase()
    ) {
      const newScore =
        score + 100;

      setScore(newScore);

      setGuess("");

      if (
        index <
        words.length - 1
      ) {
        setIndex(index + 1);
      } else {
        setIsFinished(true);

        handleGameWin(newScore);
      }
    } else {
      setShake(true);

      setTimeout(
        () => setShake(false),
        500
      );
    }
  };

  const current = words[index];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 px-10 py-8 shadow-sm">
          <p className="text-slate-500 font-semibold animate-pulse">
            Preparing Word Challenge...
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
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                Word Scramble
              </h1>

              <p className="text-slate-500 mt-1">
                Unscramble the letters and
                test your vocabulary
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
                  Progress
                </p>

                <h2 className="text-3xl font-black text-slate-900">
                  {index + 1}/
                  {words.length}
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Reward
                </p>

                <h2 className="text-3xl font-black text-amber-500">
                  +100
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Bonus XP
                </p>

                <h2 className="text-3xl font-black text-emerald-600">
                  +200
                </h2>
              </div>
            </div>
          )}

          {/* PROGRESS BAR */}

          {!isFinished && (
            <div className="bg-white border border-slate-200 rounded-full h-3 overflow-hidden mb-8">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500"
                style={{
                  width: `${
                    ((index + 1) /
                      words.length) *
                    100
                  }%`,
                }}
              />
            </div>
          )}

          {/* GAME CARD */}

          <div
            className={`bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden ${
              shake
                ? "animate-pulse"
                : ""
            }`}
          >
            {!isFinished ? (
              <div className="p-6 md:p-10">

                {/* WORD AREA */}

                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-12 text-center mb-8">

                  <p className="text-xs uppercase tracking-[0.3em] font-black text-slate-400 mb-5">
                    Scrambled Word
                  </p>

                  <h2 className="text-4xl md:text-6xl font-black tracking-[0.15em] uppercase text-slate-900 break-all">
                    {
                      current?.scrambled_word
                    }
                  </h2>
                </div>

                {/* HINT */}

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">

                  <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-2">
                    Hint
                  </p>

                  <p className="text-amber-900 text-lg">
                    {current?.hint}
                  </p>
                </div>

                {/* FORM */}

                <form
                  onSubmit={checkAnswer}
                  className="space-y-5"
                >

                  <input
                    autoFocus
                    type="text"
                    value={guess}
                    onChange={(e) =>
                      setGuess(
                        e.target.value
                      )
                    }
                    disabled={isSaving}
                    placeholder="Type the correct word..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-center text-2xl uppercase font-bold tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                  />

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black transition"
                  >
                    {isSaving
                      ? "Saving..."
                      : "Submit Answer"}
                  </button>
                </form>

                {/* FOOT NOTE */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-5 text-sm">

                  <p className="text-slate-400 font-medium">
                    💡 Correct answers
                    increase your XP
                  </p>

                  <p className="text-blue-600 font-bold">
                    Word{" "}
                    {index + 1} of{" "}
                    {words.length}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-14 text-center">

                <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-5xl mb-8">
                  🎉
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
                  Challenge Complete!
                </h2>

                <p className="text-slate-500 text-lg mb-2">
                  Final Score
                </p>

                <p className="text-6xl font-black text-blue-600 mb-4">
                  {score}
                </p>

                <p className="text-emerald-600 font-black text-xl mb-10">
                  +200 Bonus XP Applied
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-4">

                  <button
                    onClick={() =>
                      window.location.reload()
                    }
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