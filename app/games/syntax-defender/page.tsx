"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gameService, SpellingWord } from "@/services/gameService";
import { updateXP } from "@/services/userService";

export default function SyntaxDefender() {
  const router = useRouter();

  const [words, setWords] = useState<SpellingWord[]>([]);
  const [activeWord, setActiveWord] =
    useState<SpellingWord | null>(null);

  const [index, setIndex] = useState(0);
  const [userInput, setUserInput] =
    useState("");
  const [position, setPosition] =
    useState(0);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] =
    useState(false);

  const [gameStarted, setGameStarted] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const requestRef = useRef<number>(0);
  const posRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const handleEndGame = useCallback(
    async (finalScore: number) => {
      if (gameOver) return;

      setGameOver(true);
      setGameStarted(false);

      if (requestRef.current)
        cancelAnimationFrame(
          requestRef.current
        );

      const token =
        localStorage.getItem(
          "access_token"
        ) || "test";

      setIsSaving(true);

      try {
        await updateXP(
          token,
          finalScore,
          false,
          "Syntax Defender"
        );

        const today = new Date()
          .toISOString()
          .split("T")[0];

        const lastBonus =
          localStorage.getItem(
            "last_syntax_bonus"
          );

        if (
          lastBonus !== today &&
          finalScore > 0
        ) {
          await updateXP(
            token,
            150,
            true,
            "Syntax Defender Bonus"
          );

          localStorage.setItem(
            "last_syntax_bonus",
            today
          );
        }
      } catch (err) {
        console.error(
          "XP Sync Error",
          err
        );
      } finally {
        setIsSaving(false);
      }
    },
    [gameOver]
  );

  useEffect(() => {
    async function init() {
      try {
        const data =
          await gameService.getSpellingChallenges(
            10
          );

        if (
          data &&
          data.length > 0
        ) {
          setWords(data);
          setActiveWord(data[0]);
        }
      } catch (e) {
        console.error("Load error", e);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  // SLOWER + SMOOTHER GAME SPEED
  useEffect(() => {
    if (
      gameStarted &&
      !gameOver &&
      activeWord
    ) {
      const animate = () => {
        // MUCH SLOWER
        posRef.current += 0.16;

        setPosition(posRef.current);

        // More distance before lose
        if (posRef.current >= 100) {
          handleEndGame(
            scoreRef.current
          );
        } else {
          requestRef.current =
            requestAnimationFrame(
              animate
            );
        }
      };

      requestRef.current =
        requestAnimationFrame(animate);

      return () =>
        cancelAnimationFrame(
          requestRef.current
        );
    }
  }, [
    gameStarted,
    gameOver,
    activeWord,
    handleEndGame,
  ]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      !activeWord ||
      gameOver ||
      !gameStarted
    )
      return;

    const val = e.target.value;

    setUserInput(val);

    if (
      val
        .trim()
        .toLowerCase() ===
      activeWord.right_version.toLowerCase()
    ) {
      const nextScore =
        score + 100;

      setScore(nextScore);

      setUserInput("");

      posRef.current = 0;
      setPosition(0);

      if (
        index <
        words.length - 1
      ) {
        const nextIndex =
          index + 1;

        setIndex(nextIndex);

        setActiveWord(
          words[nextIndex]
        );
      } else {
        handleEndGame(nextScore);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-6"></div>

        <p className="text-indigo-400 font-black tracking-[0.3em] text-sm uppercase">
          Initializing Defense System
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-6 md:p-8 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-5xl h-[92vh] bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] flex flex-col relative">

        {/* TOP BAR */}
        <div className="h-24 border-b border-white/10 px-6 md:px-10 flex items-center justify-between bg-black/20 backdrop-blur-xl">

          <div className="flex items-center gap-5">
            <Link
              href="/games"
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all"
            >
              ←
            </Link>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Syntax Defender
              </h1>

              <p className="text-slate-400 text-sm">
                Destroy grammar errors before
                impact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">

            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
                Score
              </p>

              <h2 className="text-2xl font-black text-indigo-400">
                {score}
              </h2>
            </div>

            <div className="hidden md:block bg-white/5 border border-white/10 px-5 py-3 rounded-2xl text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
                Progress
              </p>

              <h2 className="text-2xl font-black text-white">
                {index + 1}/
                {words.length}
              </h2>
            </div>
          </div>
        </div>

        {/* START SCREEN */}
        {!gameStarted &&
        !gameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">

            <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full"></div>

            <div className="relative z-10">

              <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-5xl shadow-[0_10px_40px_rgba(99,102,241,0.4)] mb-8 mx-auto">
                🛡️
              </div>

              <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
                Ready to Defend?
              </h2>

              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed text-lg mb-12">
                Incorrect words will fall from
                above. Type the correct spelling
                before they hit the danger zone.
              </p>

              <button
                onClick={() =>
                  setGameStarted(true)
                }
                className="px-12 py-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black text-lg shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                Start Mission
              </button>
            </div>
          </div>
        ) : gameOver ? (
          // GAME OVER
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">

            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-6xl mb-8 shadow-[0_20px_50px_rgba(99,102,241,0.4)]">
              ⚡
            </div>

            <h2 className="text-5xl font-black text-white mb-3">
              Mission Complete
            </h2>

            <p className="text-slate-400 text-lg mb-8">
              Final Defense Score
            </p>

            <div className="text-7xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-12">
              {score}
            </div>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button
                onClick={() =>
                  window.location.reload()
                }
                className="w-full py-5 rounded-2xl bg-white text-slate-900 font-black hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Play Again
              </button>

              <Link
                href="/games"
                className="w-full py-5 rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
              >
                Back to Games
              </Link>
            </div>

            {isSaving && (
              <p className="mt-8 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                Syncing Progress...
              </p>
            )}
          </div>
        ) : (
          // GAMEPLAY
          <div className="flex-1 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/10 blur-3xl rounded-full"></div>

            {/* Falling Word */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-20 transition-transform duration-75"
              style={{
                transform: `translate(-50%, ${position * 6}px)`,
              }}
            >
              <div className="min-w-[280px] px-8 py-6 rounded-[2rem] bg-gradient-to-br from-rose-500 to-pink-600 shadow-[0_20px_50px_rgba(244,63,94,0.4)] border border-white/10 text-center">

                <p className="text-[10px] uppercase tracking-[0.3em] text-rose-100 font-black mb-3">
                  Incoming Error
                </p>

                <h2 className="text-4xl font-black text-white tracking-tight uppercase">
                  {
                    activeWord?.wrong_version
                  }
                </h2>
              </div>
            </div>

            {/* Danger Line */}
            <div className="absolute bottom-40 left-0 w-full px-10">
              <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse"></div>
            </div>

            {/* INPUT AREA */}
            <div className="absolute bottom-10 left-0 w-full px-6 md:px-10 z-30">

              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-2xl">

                <p className="text-center text-slate-500 text-xs uppercase tracking-[0.3em] font-black mb-4">
                  Type Correct Word
                </p>

                <input
                  autoFocus
                  type="text"
                  value={userInput}
                  onChange={handleInput}
                  disabled={isSaving}
                  autoComplete="off"
                  placeholder="TYPE HERE..."
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-6 text-center text-3xl font-black text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}