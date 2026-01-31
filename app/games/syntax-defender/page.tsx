"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gameService, SpellingWord } from "@/services/gameService";

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
  const requestRef = useRef<number>(0);


  // --- SEO & META SIDE EFFECTS ---
  useEffect(() => {
    // 1. Dynamic Title focusing on Syntax and Sentence Structure
    document.title = "Syntax Defender | Master English Sentence Structure | Grammrlyst";

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Defend your grammar! Practice English syntax by arranging words in the correct order. Learn Subject-Verb-Object patterns and advanced sentence structures through interactive gameplay.');

    // 3. Update Theme Color for Mobile Browsers
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#1e293b'); // Slate-800
  }, []);
  // Load data from API on start
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    async function init() {
      const data = await gameService.getSpellingChallenges(10);
      if (data.length > 0) {
        setWords(data);
        setActiveWord(data[0]);
      }
      setLoading(false);
    }
    init();
  }, []);

  // Game Loop for falling animation
  useEffect(() => {
    if (gameStarted && !gameOver && activeWord) {
      const fall = () => {
        setPosition((prev) => {
          if (prev >= 90) {
            setGameOver(true);
            return prev;
          }
          return prev + 0.15; 
        });
        requestRef.current = requestAnimationFrame(fall);
      };
      requestRef.current = requestAnimationFrame(fall);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [gameStarted, gameOver, activeWord]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeWord) return;
    const val = e.target.value.toLowerCase();
    setUserInput(val);

    if (val === activeWord.right_version.toLowerCase()) {
      setScore((prev) => prev + 100);
      setUserInput("");
      setPosition(0);
      if (index < words.length - 1) {
        setIndex((prev) => prev + 1);
        setActiveWord(words[index + 1]);
      } else {
        setGameOver(true); 
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-amber-500 font-mono animate-pulse">LOADING SYSTEM...</div>;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden font-mono">
      <div className="max-w-2xl w-full h-[600px] bg-slate-800 rounded-[2rem] border-4 border-slate-700 relative flex flex-col shadow-2xl">
        
        {/* HUD */}
        <div className="p-6 flex justify-between items-center z-20">
          <Link href="/games" className="text-slate-500 hover:text-white transition-colors">
            <i className="fas fa-times-circle text-2xl"></i>
          </Link>
          <div className="text-amber-400 font-bold text-xl tracking-widest">
            SCORE: {score}
          </div>
        </div>

        {!gameStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 z-20">
            <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-4xl mb-6">🛡️</div>
            <h1 className="text-3xl font-black text-white mb-4">Syntax Defender</h1>
            <p className="text-slate-400 mb-8">Type the <strong>correct spelling</strong> to destroy them!</p>
            <button onClick={() => setGameStarted(true)} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-4 rounded-xl font-black">INITIALIZE</button>
          </div>
        ) : gameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 z-20">
            <h2 className="text-5xl font-black text-white mb-4">{score === words.length * 100 ? "VICTORY" : "SYSTEM FAILURE"}</h2>
            <button onClick={() => window.location.reload()} className="bg-slate-700 text-white px-8 py-4 rounded-xl">REBOOT</button>
          </div>
        ) : (
          <div className="flex-1 relative">
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${position}%` }}>
              <div className="bg-rose-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex flex-col items-center">
                <span className="text-xs opacity-70">Fix this:</span>
                <span className="text-2xl uppercase">{activeWord?.wrong_version}</span>
              </div>
            </div>

            <div className="absolute bottom-16 w-full px-10">
              <input autoFocus type="text" value={userInput} onChange={handleInput} placeholder="TYPE HERE..." className="w-full bg-slate-950 border-2 border-amber-500/50 p-4 rounded-xl text-amber-400 text-center text-2xl font-black focus:outline-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}