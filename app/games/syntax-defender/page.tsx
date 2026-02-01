"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gameService, SpellingWord } from "@/services/gameService";
import { updateXP } from "@/services/userService";

export default function SyntaxDefender() {
  const router = useRouter();

  const [words, setWords] = useState<SpellingWord[]>([]);
  const [activeWord, setActiveWord] = useState<SpellingWord | null>(null);
  const [index, setIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [position, setPosition] = useState(0); 
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const requestRef = useRef<number>(0);
  const posRef = useRef<number>(0); 
  const scoreRef = useRef<number>(0); // Score tracking for handleEndGame

  // Update scoreRef whenever score changes
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const handleEndGame = useCallback(async (finalScore: number) => {
    if (gameOver) return;
    setGameOver(true);
    setGameStarted(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsSaving(true);
    try {
      const GAME_NAME = "Syntax Defender";
      
      // 1. Send Score with specific game name
      await updateXP(token, finalScore, false, GAME_NAME);

      // 2. Bonus Logic
      const today = new Date().toISOString().split('T')[0];
      const lastBonus = localStorage.getItem("last_syntax_bonus");

      if (lastBonus !== today && finalScore > 0) {
        // Corrected type name for Bonus
        await updateXP(token, 150, true, "Syntax Defender Bonus");
        localStorage.setItem("last_syntax_bonus", today);
      }
    } catch (err) {
      console.error("XP Sync Error", err);
    } finally {
      setIsSaving(false);
    }
  }, [gameOver]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/auth/login"); return; }

    async function init() {
      try {
        const data = await gameService.getSpellingChallenges(10);
        if (data && data.length > 0) {
          setWords(data);
          setActiveWord(data[0]);
        }
      } catch (e) {
        console.error("Load error", e);
      } finally { setLoading(false); }
    }
    init();
  }, [router]);

  // Optimized Animation Loop
  useEffect(() => {
    if (gameStarted && !gameOver && activeWord) {
      const animate = () => {
        posRef.current += 0.35; // Increased speed slightly for more challenge
        setPosition(posRef.current);

        if (posRef.current >= 95) { // Adjusted limit
          handleEndGame(scoreRef.current);
        } else {
          requestRef.current = requestAnimationFrame(animate);
        }
      };

      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [gameStarted, gameOver, activeWord, handleEndGame]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeWord || gameOver || !gameStarted) return;
    const val = e.target.value;
    setUserInput(val);

    // Case-insensitive matching for better UX
    if (val.trim().toLowerCase() === activeWord.right_version.toLowerCase()) {
      const nextScore = score + 100;
      setScore(nextScore);
      setUserInput("");
      
      // Instant Reset for next word
      posRef.current = 0;
      setPosition(0);
      
      if (index < words.length - 1) {
        const nextIndex = index + 1;
        setIndex(nextIndex);
        setActiveWord(words[nextIndex]);
      } else {
        handleEndGame(nextScore);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-500 font-mono">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      INITIALIZING DEFENSE SYSTEMS...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden font-mono">
      <div className="max-w-2xl w-full h-[650px] bg-slate-900 rounded-[3rem] border-4 border-slate-800 relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* HUD */}
        <div className="p-6 flex justify-between items-center z-20 bg-slate-900/90 border-b border-slate-800">
          <Link href="/games" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <i className="fas fa-chevron-left"></i> Exit
          </Link>
          <div className="flex gap-6 items-center">
            <div className="text-amber-500 font-black text-xl tracking-tighter shadow-amber-500/20 drop-shadow-md">
              XP: {score}
            </div>
            <div className="text-slate-600 font-bold text-xs">
              UNIT: {index + 1}/{words.length}
            </div>
          </div>
        </div>

        {!gameStarted && !gameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 z-20">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
               <i className="fas fa-shield-halved text-amber-500 text-3xl"></i>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Syntax Defender</h1>
            <p className="text-slate-500 mb-10 text-sm">Intercept falling errors by typing the correct version.</p>
            <button 
              onClick={() => setGameStarted(true)} 
              className="bg-amber-500 text-slate-950 px-12 py-4 rounded-2xl font-black hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              START MISSION
            </button>
          </div>
        ) : gameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 z-20 animate-in fade-in zoom-in duration-300">
            <div className={`text-6xl mb-6 ${score === words.length * 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
               <i className={score === words.length * 100 ? "fas fa-circle-check" : "fas fa-circle-xmark"}></i>
            </div>
            <h2 className={`text-4xl font-black mb-2 tracking-tighter ${score === words.length * 100 ? 'text-emerald-400' : 'text-rose-500'}`}>
              {score === words.length * 100 ? "MISSION SUCCESS" : "DEFENSE BREACHED"}
            </h2>
            <div className="text-slate-400 mb-10 text-lg uppercase font-bold tracking-widest">Efficiency: {score} XP</div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button onClick={() => window.location.reload()} className="bg-white text-slate-900 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all uppercase text-sm">Restart</button>
              <Link href="/games" className="text-slate-500 font-bold py-2 hover:text-white transition-colors">Return to Hub</Link>
            </div>
            {isSaving && <p className="mt-8 text-amber-500 text-[10px] animate-pulse font-black uppercase tracking-[0.3em]">Uploading Intel to Server...</p>}
          </div>
        ) : (
          <div className="flex-1 relative">
            {/* Falling Word Container */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 will-change-transform" 
              style={{ transform: `translate(-50%, ${position * 5.2}px)` }}
            >
              <div className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-black shadow-[0_15px_40px_rgba(244,63,94,0.3)] border-b-4 border-rose-700 min-w-[220px] text-center">
                <span className="block text-[9px] font-black text-rose-200 uppercase mb-1 tracking-widest">Error Detected</span>
                <span className="text-2xl tracking-tighter uppercase">{activeWord?.wrong_version}</span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="absolute bottom-0 w-full h-1 bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.8)]"></div>

            {/* Input Field */}
            <div className="absolute bottom-16 w-full px-10">
              <input 
                autoFocus 
                type="text" 
                value={userInput} 
                onChange={handleInput} 
                disabled={isSaving}
                autoComplete="off"
                placeholder="TYPE CORRECTION..." 
                className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl text-amber-500 text-center text-2xl font-black focus:border-amber-500 focus:outline-none shadow-2xl transition-all placeholder:text-slate-800 placeholder:text-sm" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}