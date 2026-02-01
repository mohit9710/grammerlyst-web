"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gameService, ScrambleWord } from "@/services/gameService";
import { updateXP } from "@/services/userService"; // New functionality

export default function WordScramble() {
  const router = useRouter();

  const [words, setWords] = useState<ScrambleWord[]>([]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state for backend sync

  // SEO & Meta Effects
  useEffect(() => {
    document.title = "Word Scramble | English Vocabulary & Spelling Game | Grammrlyst";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Challenge your English spelling skills with Word Scramble. Unscramble mixed-up letters to find hidden vocabulary words.');
  }, []);

  // Auth & Init Game
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    async function initGame() {
      try {
        const data = await gameService.getScrambleChallenges(10);
        if (data.length > 0) {
          setWords(data);
        }
      } catch (err) {
        console.error("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    }
    initGame();
  }, [router]);

  const handleGameWin = async (finalScore: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsSaving(true);
    try {
      // 1. Update Base XP for the game
      await updateXP(token, finalScore, false, "Word Unscrambler");
      
      // 2. Bonus functionality: Add Daily Bonus XP
      await updateXP(token, 200, true, "Word Scramble Bonus");
      
    } catch (err) {
      console.error("Points sync failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || isSaving) return;

    if (guess.trim().toUpperCase() === current.original_word.toUpperCase()) {
      const newScore = score + 100;
      setScore(newScore);
      setGuess("");

      if (index < words.length - 1) {
        setIndex(index + 1);
      } else {
        setIsFinished(true);
        handleGameWin(newScore); // Trigger XP updates on finish
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const current = words[index];

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center font-black text-rose-400 animate-pulse">
        PREPARING SCRAMBLE...
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4">Game Complete!</h2>
          <p className="text-rose-600 text-5xl font-black mb-2">{score}</p>
          <p className="text-slate-400 text-sm font-bold mb-8 uppercase tracking-widest">+200 BONUS XP APPLIED</p>
          
          <button
            disabled={isSaving}
            onClick={() => window.location.reload()}
            className={`w-full ${isSaving ? 'bg-slate-300' : 'bg-rose-600'} text-white p-4 rounded-xl font-black transition-all`}
          >
            {isSaving ? "SYNCING SCORE..." : "PLAY AGAIN"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
      <div className={`max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border-b-8 border-rose-200 ${shake ? 'animate-shake' : ''}`}>
        <div className="flex justify-between mb-8">
          <Link href="/games" className="text-rose-400 hover:text-rose-600 font-bold text-sm">← Back</Link>
          <div className="flex flex-col items-end">
             <span className="font-black text-rose-600 tracking-widest text-sm">SCORE: {score}</span>
          </div>
        </div>

        <h2 className="text-xs uppercase tracking-[0.3em] font-black text-slate-400 mb-2">
          Word {index + 1} of {words.length}
        </h2>
        <div className="text-4xl font-black text-slate-800 mb-8 tracking-tighter uppercase">
          {current?.scrambled_word}
        </div>

        <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl text-sm mb-8 italic">
          <strong>Hint:</strong> {current?.hint}
        </div>

        <form onSubmit={checkAnswer}>
          <input
            autoFocus
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={isSaving}
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-rose-500 text-center text-xl font-bold uppercase tracking-widest outline-none mb-4"
            placeholder="TYPE HERE..."
          />
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-rose-600 text-white p-4 rounded-xl font-black shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSaving ? "SAVING..." : "SUBMIT [ENTER]"}
          </button>
        </form>
      </div>
    </div>
  );
}