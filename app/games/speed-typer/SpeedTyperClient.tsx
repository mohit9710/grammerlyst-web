"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { updateXP } from "@/services/userService";

export default function SentenceSprinter() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "/api/backend";

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [userInput, setUserInput] =
    useState("");

  const [startTime, setStartTime] =
    useState<number | null>(null);

  const [wpm, setWpm] = useState(0);

  const [accuracy, setAccuracy] =
    useState(100);

  const [isFinished, setIsFinished] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [sentences, setSentences] =
    useState<string[]>([]);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const targetSentence =
    sentences[currentIndex] || "";

  // =====================================================
  // FETCH SENTENCES
  // =====================================================

  useEffect(() => {
    async function loadSentences() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/games/sentences?limit=5`
        );

        const data = await res.json();

        const sentenceList = data.map(
          (s: any) => s.content
        );

        setSentences(sentenceList);
      } catch (err) {
        console.error(
          "Failed to load sentences",
          err
        );
      }
    }

    loadSentences();
  }, [API_BASE_URL]);

  // =====================================================
  // AUTO FOCUS
  // =====================================================

  useEffect(() => {
    if (
      sentences.length > 0 &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [sentences]);

  // =====================================================
  // CALCULATE WPM
  // =====================================================

  const calculateWpm = () => {
    if (!startTime) return 0;

    const timeElapsed =
      (Date.now() - startTime) / 60000;

    const wordsTyped =
      sentences
        .slice(0, currentIndex)
        .join(" ")
        .split(" ").length +
      userInput.split(" ").length;

    const currentWpm =
      timeElapsed > 0
        ? Math.round(
            wordsTyped / timeElapsed
          )
        : 0;

    setWpm(currentWpm);

    return currentWpm;
  };

  // =====================================================
  // CALCULATE ACCURACY
  // =====================================================

  const calculateAccuracy = (
    typed: string,
    target: string
  ) => {
    let correct = 0;

    for (
      let i = 0;
      i < typed.length;
      i++
    ) {
      if (typed[i] === target[i]) {
        correct++;
      }
    }

    const acc = Math.round(
      (correct / target.length) * 100
    );

    setAccuracy(acc > 100 ? 100 : acc);
  };

  // =====================================================
  // COMPLETE GAME
  // =====================================================

  const handleGameComplete = async (
    finalWpm: number
  ) => {
    setIsFinished(true);

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) return;

    setIsSaving(true);

    try {
      const GAME_NAME =
        "Speed Typer";

      const performanceXP =
        Math.min(
          Math.max(finalWpm * 10, 100),
          1000
        );

      await updateXP(
        token,
        performanceXP,
        false,
        GAME_NAME
      );

      const today = new Date()
        .toISOString()
        .split("T")[0];

      const lastSpeedBonus =
        localStorage.getItem(
          "last_speed_bonus"
        );

      if (lastSpeedBonus !== today) {
        await updateXP(
          token,
          300,
          true,
          "Speed Typer Bonus"
        );

        localStorage.setItem(
          "last_speed_bonus",
          today
        );
      }
    } catch (err) {
      console.error(
        "Failed to sync progress",
        err
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;

    if (!startTime)
      setStartTime(Date.now());

    setUserInput(val);

    calculateAccuracy(
      val,
      targetSentence
    );

    calculateWpm();

    if (val === targetSentence) {
      if (
        currentIndex <
        sentences.length - 1
      ) {
        setCurrentIndex(
          (prev) => prev + 1
        );

        setUserInput("");
      } else {
        const finalWpm =
          calculateWpm();

        handleGameComplete(finalWpm);
      }
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (sentences.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-3xl shadow-sm border">
          <p className="text-slate-500 font-semibold animate-pulse">
            Loading Arena...
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
        <div className="max-w-6xl mx-auto">

          {/* TOP BAR */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                Sentence Sprinter
              </h1>

              <p className="text-slate-500 mt-1">
                Improve your typing speed
                and vocabulary
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                Speed
              </p>

              <h2 className="text-3xl font-black text-blue-600">
                {wpm}
              </h2>

              <span className="text-xs text-slate-400">
                WPM
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                Accuracy
              </p>

              <h2 className="text-3xl font-black text-emerald-600">
                {accuracy}%
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                Progress
              </p>

              <h2 className="text-3xl font-black text-slate-900">
                {currentIndex + 1}/
                {sentences.length}
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                XP Potential
              </p>

              <h2 className="text-3xl font-black text-amber-500">
                +{Math.min(
                  Math.max(wpm * 10, 100),
                  1000
                )}
              </h2>
            </div>
          </div>

          {/* PROGRESS BAR */}

          {!isFinished && (
            <div className="bg-white border border-slate-200 rounded-full h-3 overflow-hidden mb-8">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentIndex + 1) /
                      sentences.length) *
                    100
                  }%`,
                }}
              />
            </div>
          )}

          {/* GAME AREA */}

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">

            {!isFinished ? (
              <div className="p-6 md:p-10">

                {/* TARGET TEXT */}

                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mb-8 min-h-[220px] flex items-center">

                  <p className="text-2xl md:text-3xl leading-relaxed font-semibold tracking-wide">

                    {targetSentence
                      .split("")
                      .map((char, i) => {
                        let color =
                          "text-slate-300";

                        if (
                          i <
                          userInput.length
                        ) {
                          color =
                            userInput[i] ===
                            char
                              ? "text-slate-900"
                              : "text-red-500 bg-red-100";
                        }

                        return (
                          <span
                            key={i}
                            className={`${color} transition-all`}
                          >
                            {char}
                          </span>
                        );
                      })}
                  </p>
                </div>

                {/* INPUT */}

                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInput}
                  autoComplete="off"
                  autoCapitalize="none"
                  disabled={isSaving}
                  placeholder="Start typing here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                />

                {/* FOOT NOTE */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-5 text-sm">

                  <p className="text-slate-400 font-medium">
                    ⌨️ Typing accuracy
                    increases XP rewards
                  </p>

                  <p className="text-blue-600 font-bold">
                    Sentence{" "}
                    {currentIndex + 1} of{" "}
                    {sentences.length}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-14 text-center">

                <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto text-5xl mb-8">
                  ⚡
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
                  Speed Master!
                </h2>

                <p className="text-slate-500 text-lg mb-2">
                  You reached{" "}
                  <strong>
                    {wpm} WPM
                  </strong>
                </p>

                <p className="text-emerald-600 font-black text-2xl mb-10">
                  +
                  {Math.min(
                    Math.max(wpm * 10, 100),
                    1000
                  )}{" "}
                  XP Earned
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-4">

                  <button
                    onClick={() =>
                      window.location.reload()
                    }
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
