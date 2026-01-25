"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
export default function SentenceSprinter() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Using the lowercase state variable consistently
  const [sentences, setSentences] = useState<string[]>([]);

  // Safety check: ensure we have a sentence to display
  const targetSentence = sentences[currentIndex] || "";

  useEffect(() => {
    async function loadSentences() {
      try {
        const res = await fetch(`${API_BASE_URL}/games/sentences?limit=15`);
        const data = await res.json();
        const sentenceList = data.map((s: any) => s.content);
        setSentences(sentenceList);
      } catch (err) {
        console.error("Failed to load sentences", err);
      }
    }
    loadSentences();
  }, []);

  // Auto-focus after sentences load
  useEffect(() => {
    if (sentences.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sentences]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (!startTime) setStartTime(Date.now());

    if (val === targetSentence) {
      calculateWpm();
      if (currentIndex < sentences.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserInput("");
      } else {
        setIsFinished(true);
      }
    } else {
      setUserInput(val);
    }
  };

  const calculateWpm = () => {
    if (!startTime) return;
    const timeElapsed = (Date.now() - startTime) / 60000; 
    const wordsTyped = sentences.slice(0, currentIndex + 1).join(" ").split(" ").length;
    setWpm(Math.round(wordsTyped / timeElapsed));
  };

  // Prevent rendering if sentences haven't loaded yet to avoid errors
  if (sentences.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 font-bold animate-pulse">Loading Sentences...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-[3rem] shadow-xl p-12 border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <Link href="/games" className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2">
            <i className="fas fa-arrow-left"></i> Exit Game
          </Link>
          <div className="flex gap-6">
            <div className="text-center">
              <span className="block text-xs uppercase font-black text-slate-400">WPM</span>
              <span className="text-2xl font-black text-blue-600">{wpm}</span>
            </div>
            <div className="text-center">
              <span className="block text-xs uppercase font-black text-slate-400">Progress</span>
              <span className="text-2xl font-black text-slate-800">{currentIndex + 1}/{sentences.length}</span>
            </div>
          </div>
        </div>

        {isFinished ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              <i className="fas fa-trophy"></i>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Grandmaster!</h2>
            <p className="text-slate-500 mb-8">You finished with an average of {wpm} words per minute.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10 p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 relative">
              <p className="text-2xl text-slate-300 font-medium leading-relaxed">
                {targetSentence.split("").map((char, i) => {
                  let color = "text-slate-300";
                  if (i < userInput.length) {
                    color = userInput[i] === char ? "text-blue-600" : "text-rose-500 bg-rose-50";
                  }
                  return <span key={i} className={`${color} transition-colors`}>{char}</span>;
                })}
              </p>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInput}
              placeholder="Start typing the sentence above..."
              className="w-full p-6 text-xl rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all shadow-inner"
            />
            <p className="mt-4 text-center text-slate-400 text-sm italic">
              Case sensitive! Watch out for periods and commas.
            </p>
          </>
        )}
      </div>
    </div>
  );
}