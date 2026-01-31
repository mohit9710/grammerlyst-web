"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gameService, ScrambleWord } from "@/services/gameService";

export default function WordScramble() {
  const router = useRouter();

  const [words, setWords] = useState<ScrambleWord[]>([]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // --- SEO & META SIDE EFFECTS ---
  useEffect(() => {
    // 1. Target Keywords: Vocabulary, Anagrams, Spelling
    document.title = "Word Scramble | English Vocabulary & Spelling Game | Grammrlyst";

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Challenge your English spelling skills with Word Scramble. Unscramble mixed-up letters to find hidden vocabulary words. A fun, interactive way to learn English.');

    // 3. Open Graph for Social Sharing
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Can you unscramble these English words? | Grammrlyst Games');
    document.head.appendChild(ogTitle);
  }, []);
  
  // Fetch data from API using service
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    
    async function initGame() {
      const data = await gameService.getScrambleChallenges(10);
      if (data.length > 0) {
        setWords(data);
      }
      setLoading(false);
    }
    initGame();
  }, []);

  const current = words[index];

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;

    if (guess.toUpperCase() === current.original_word.toUpperCase()) {
      const newScore = score + 100;
      setScore(newScore);
      setGuess("");
      
      if (index < words.length - 1) {
        setIndex(index + 1);
      } else {
        setIsFinished(true);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

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
          <p className="text-rose-600 text-5xl font-black mb-8">{score}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-rose-600 text-white p-4 rounded-xl font-black"
          >
            PLAY AGAIN
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
          <span className="font-black text-rose-600 tracking-widest">SCORE: {score}</span>
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
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-rose-500 text-center text-xl font-bold uppercase tracking-widest outline-none mb-4"
            placeholder="TYPE HERE..."
          />
          <button className="w-full bg-rose-600 text-white p-4 rounded-xl font-black shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95">
            SUBMIT [ENTER]
          </button>
        </form>
      </div>
    </div>
  );
}