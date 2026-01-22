"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const WORDS = [
  { original: "CONJUNCTION", scrambled: "JUNCTIONCON", hint: "A word used to connect clauses." },
  { original: "ADJECTIVE", scrambled: "IVEADJECT", hint: "Describes a noun." },
  { original: "PARTICIPLE", scrambled: "CIPLETIPAR", hint: "A word formed from a verb." },
  { original: "PREPOSITION", scrambled: "POSITIONPRE", hint: "Shows relationship in space or time." }
];

export default function WordScramble() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);

  const current = WORDS[index];

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toUpperCase() === current.original) {
      setScore(score + 100);
      setGuess("");
      if (index < WORDS.length - 1) setIndex(index + 1);
      else alert("Game Complete! Final Score: " + (score + 100));
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
      <div className={`max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border-b-8 border-rose-200 ${shake ? 'animate-bounce' : ''}`}>
        <div className="flex justify-between mb-8">
          <Link href="/games" className="text-rose-400 hover:text-rose-600 font-bold text-sm">← Back</Link>
          <span className="font-black text-rose-600 tracking-widest">SCORE: {score}</span>
        </div>

        <h2 className="text-xs uppercase tracking-[0.3em] font-black text-slate-400 mb-2">Unscramble This</h2>
        <div className="text-4xl font-black text-slate-800 mb-8 tracking-tighter">
          {current.scrambled}
        </div>

        <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl text-sm mb-8 italic">
          <strong>Hint:</strong> {current.hint}
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