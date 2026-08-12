"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { fetchMemoryDeck, MemoryCard } from "@/services/wordMemoryService";
import { updateXP } from "@/services/userService";

const PAIR_COUNT = 8;

export default function WordMemoryMatch() {
  const [cards, setCards] = useState<MemoryCard[]>([]);

  const [flipped, setFlipped] = useState<string[]>([]);

  const [matchedPairIds, setMatchedPairIds] = useState<Set<number>>(
    new Set()
  );

  const [moves, setMoves] = useState(0);

  const [seconds, setSeconds] = useState(0);

  const [loading, setLoading] = useState(true);

  const [isFinished, setIsFinished] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [finalScore, setFinalScore] = useState(0);

  const [locked, setLocked] = useState(false);

  // =====================================================
  // SEO
  // =====================================================

  useEffect(() => {
    document.title = "Word Memory Match | Grammrlyst";

    let metaDesc = document.querySelector('meta[name="description"]');

    if (!metaDesc) {
      metaDesc = document.createElement("meta");

      metaDesc.setAttribute("name", "description");

      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute(
      "content",
      "Flip cards to match English words with their meanings and build vocabulary while you play."
    );
  }, []);

  // =====================================================
  // LOAD DECK
  // =====================================================

  const startGame = useCallback(async () => {
    setLoading(true);

    setFlipped([]);

    setMatchedPairIds(new Set());

    setMoves(0);

    setSeconds(0);

    setIsFinished(false);

    setFinalScore(0);

    try {
      const deck = await fetchMemoryDeck(PAIR_COUNT);

      setCards(deck);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (loading || isFinished) return;

    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, isFinished]);

  // =====================================================
  // XP SAVE
  // =====================================================

  const handleGameWin = async (score: number) => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    setIsSaving(true);

    try {
      await updateXP(token, score, false, "Word Memory Match");

      await updateXP(token, 150, true, "Word Memory Bonus");
    } catch (err) {
      console.error("Points sync failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // CARD LOGIC
  // =====================================================

  const handleCardClick = (card: MemoryCard) => {
    if (locked) return;

    if (flipped.includes(card.cardId)) return;

    if (matchedPairIds.has(card.pairId)) return;

    if (flipped.length === 2) return;

    const nextFlipped = [...flipped, card.cardId];

    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);

      const [firstId, secondId] = nextFlipped;

      const first = cards.find((c) => c.cardId === firstId)!;
      const second = cards.find((c) => c.cardId === secondId)!;

      const isMatch =
        first.pairId === second.pairId && first.type !== second.type;

      if (isMatch) {
        const updatedMatched = new Set(matchedPairIds);
        updatedMatched.add(first.pairId);

        setTimeout(() => {
          setMatchedPairIds(updatedMatched);
          setFlipped([]);

          if (updatedMatched.size === PAIR_COUNT) {
            const score = Math.max(
              100,
              500 - (moves + 1 - PAIR_COUNT) * 20 - seconds * 2
            );

            setFinalScore(score);
            setIsFinished(true);
            handleGameWin(score);
          }
        }, 400);
      } else {
        setLocked(true);

        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 px-10 py-8 shadow-sm">
          <p className="text-slate-500 font-semibold animate-pulse">
            Shuffling the deck...
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
                Word Memory Match
              </h1>

              <p className="text-slate-500 mt-1">
                Flip cards to pair each word with its correct meaning
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
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Moves
                </p>

                <h2 className="text-3xl font-black text-blue-600">
                  {moves}
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Time
                </p>

                <h2 className="text-3xl font-black text-slate-900">
                  {seconds}s
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">
                  Pairs Found
                </p>

                <h2 className="text-3xl font-black text-emerald-600">
                  {matchedPairIds.size}/{PAIR_COUNT}
                </h2>
              </div>
            </div>
          )}

          {/* GAME CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            {!isFinished ? (
              <div className="p-4 md:p-8">
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {cards.map((card) => {
                    const isFlipped =
                      flipped.includes(card.cardId) ||
                      matchedPairIds.has(card.pairId);

                    return (
                      <button
                        key={card.cardId}
                        onClick={() => handleCardClick(card)}
                        disabled={matchedPairIds.has(card.pairId)}
                        className={`relative aspect-square rounded-2xl border p-2 md:p-3 flex items-center justify-center text-center transition-all duration-300 ${
                          matchedPairIds.has(card.pairId)
                            ? "bg-emerald-50 border-emerald-300"
                            : isFlipped
                            ? card.type === "word"
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-indigo-50 border-indigo-300"
                            : "bg-slate-900 border-slate-900 hover:bg-slate-800"
                        }`}
                      >
                        {isFlipped ? (
                          <span
                            className={`font-bold leading-snug ${
                              card.type === "word"
                                ? "text-sm md:text-lg"
                                : "text-[10px] md:text-xs text-slate-700"
                            }`}
                          >
                            {card.label}
                          </span>
                        ) : (
                          <span className="text-white text-2xl">?</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="text-slate-400 font-medium text-sm mt-6 text-center">
                  💡 Match each word (blue) with its meaning (light purple)
                </p>
              </div>
            ) : (
              <div className="p-8 md:p-14 text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-5xl mb-8">
                  🧠
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
                  All Matched!
                </h2>

                <p className="text-slate-500 text-lg mb-2">Final Score</p>

                <p className="text-6xl font-black text-blue-600 mb-4">
                  {finalScore}
                </p>

                <p className="text-slate-500 mb-1">
                  {moves} moves • {seconds}s
                </p>

                <p className="text-emerald-600 font-black text-xl mb-10">
                  +150 Bonus XP Applied
                </p>

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
