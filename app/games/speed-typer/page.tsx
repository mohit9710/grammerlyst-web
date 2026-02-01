"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { updateXP } from "@/services/userService"; 

export default function SentenceSprinter() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const inputRef = useRef<HTMLInputElement>(null);
  const [sentences, setSentences] = useState<string[]>([]);

  const targetSentence = sentences[currentIndex] || "";

  useEffect(() => {
    document.title = "Speed Typer | English Vocabulary & Typing Test | Grammrlyst";
  }, []);
  
  useEffect(() => {
    async function loadSentences() {
      try {
        const res = await fetch(`${API_BASE_URL}/games/sentences?limit=5`); // Limit 5 tak badha diya
        const data = await res.json();
        const sentenceList = data.map((s: any) => s.content);
        setSentences(sentenceList);
      } catch (err) {
        console.error("Failed to load sentences", err);
      }
    }
    loadSentences();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (sentences.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sentences]);

  // --- XP & BONUS LOGIC FIXED ---
  const handleGameComplete = async (finalWpm: number) => {
    setIsFinished(true);
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsSaving(true);
    try {
      // Game Name specify karna zaroori hai backend logs ke liye
      const GAME_NAME = "Speed Typer"; 

      // 1. Calculate XP (Performance based)
      const performanceXP = Math.min(Math.max(finalWpm * 10, 100), 1000);
      
      // updateXP service call with game_name query param logic
      await updateXP(token, performanceXP, false, GAME_NAME);

      // 2. Daily Speed Bonus Logic
      const today = new Date().toISOString().split('T')[0];
      const lastSpeedBonus = localStorage.getItem("last_speed_bonus");

      if (lastSpeedBonus !== today) {
        try {
          // Bonus claim (isBonus = true)
          await updateXP(token, 300, true, "Speed Typer Bonus");
          localStorage.setItem("last_speed_bonus", today);
        } catch (bErr) {
          console.log("Bonus already claimed");
        }
      }
    } catch (err) {
      console.error("Failed to sync progress", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());

    if (val === targetSentence) {
      if (currentIndex < sentences.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserInput("");
        calculateWpm(); // Update WPM after each sentence
      } else {
        const finalWpm = calculateWpm();
        handleGameComplete(finalWpm);
      }
    } else {
      setUserInput(val);
      calculateWpm(); // Live WPM update
    }
  };

  const calculateWpm = () => {
    if (!startTime) return 0;
    const timeElapsed = (Date.now() - startTime) / 60000; 
    // Total words calculation
    const wordsTyped = sentences.slice(0, currentIndex).join(" ").split(" ").length + userInput.split(" ").length;
    const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(currentWpm);
    return currentWpm;
  };

  if (sentences.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 font-bold animate-pulse text-xl">Loading Arena...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-[3rem] shadow-xl p-12 border border-slate-100 relative overflow-hidden">
        
        {!isFinished && (
          <div className="absolute top-0 left-0 h-1.5 bg-blue-500 transition-all duration-500" 
               style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}></div>
        )}

        <div className="flex justify-between items-center mb-10">
          <Link href="/games" className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2 transition-colors">
            <i className="fas fa-arrow-left"></i> Exit
          </Link>
          <div className="flex gap-8">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-black text-slate-400 tracking-widest">Speed</span>
              <span className="text-3xl font-black text-blue-600">{wpm} <small className="text-xs">WPM</small></span>
            </div>
            <div className="text-center border-l pl-8">
              <span className="block text-[10px] uppercase font-black text-slate-400 tracking-widest">Progress</span>
              <span className="text-3xl font-black text-slate-800">{currentIndex + 1}/{sentences.length}</span>
            </div>
          </div>
        </div>

        {isFinished ? (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
              <i className="fas fa-bolt"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2 italic">SPEED DEMON!</h2>
            <p className="text-slate-500 text-lg mb-1">You reached <strong>{wpm} WPM</strong></p>
            <p className="text-emerald-500 font-black text-xl mb-10">+{Math.min(Math.max(wpm * 10, 100), 1000)} XP Earned</p>
            
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <button 
                onClick={() => window.location.reload()}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Race Again
              </button>
              <Link href="/dashboard" className="text-blue-600 font-bold hover:underline py-2">
                Check Dashboard
              </Link>
            </div>
            {isSaving && <p className="mt-6 text-[10px] text-blue-400 animate-pulse font-black uppercase tracking-[0.2em]">Syncing Performance Data...</p>}
          </div>
        ) : (
          <>
            <div className="mb-10 p-10 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 relative">
              <p className="text-3xl text-slate-300 font-bold leading-relaxed select-none font-mono tracking-tight">
                {targetSentence.split("").map((char, i) => {
                  let color = "text-slate-300";
                  if (i < userInput.length) {
                    color = userInput[i] === char ? "text-slate-900" : "text-rose-500 bg-rose-50";
                  }
                  return <span key={i} className={`${color} transition-all duration-75`}>{char}</span>;
                })}
              </p>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInput}
              autoComplete="off"
              autoCapitalize="none"
              disabled={isSaving}
              placeholder="Type the sentence above..."
              className="w-full p-8 text-2xl rounded-[2rem] border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all shadow-sm font-mono"
            />
            <div className="flex justify-between mt-6 px-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                <i className="fas fa-keyboard mr-2"></i> Case Sensitive
              </p>
              <p className="text-blue-500 text-xs font-black uppercase tracking-widest">
                Accuracy Boosts XP 🎯
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}