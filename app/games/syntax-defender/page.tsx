"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const LEVEL_DATA = [
  { wrong: "neccessary", right: "necessary" },
  { wrong: "reiceve", right: "receive" },
  { wrong: "occured", right: "occurred" },
  { wrong: "definately", right: "definitely" },
  { wrong: "seperate", right: "separate" },
  { wrong: "goverment", right: "government" },
  { wrong: "calender", right: "calendar" },
];

export default function SyntaxDefender() {
  const [activeWord, setActiveWord] = useState(LEVEL_DATA[0]);
  const [index, setIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [position, setPosition] = useState(0); // Vertical position in %
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const requestRef = useRef<number>(0);

  // Game Loop for falling animation
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const fall = () => {
        setPosition((prev) => {
          if (prev >= 90) {
            setGameOver(true);
            return prev;
          }
          return prev + 0.15; // Speed of the fall
        });
        requestRef.current = requestAnimationFrame(fall);
      };
      requestRef.current = requestAnimationFrame(fall);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [gameStarted, gameOver]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setUserInput(val);

    if (val === activeWord.right) {
      setScore((prev) => prev + 100);
      setUserInput("");
      setPosition(0);
      if (index < LEVEL_DATA.length - 1) {
        setIndex((prev) => prev + 1);
        setActiveWord(LEVEL_DATA[index + 1]);
      } else {
        setGameOver(true); // Game won
      }
    }
  };

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
            <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-4xl mb-6">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Syntax Defender</h1>
            <p className="text-slate-400 mb-8">Type the <strong>correct spelling</strong> of the falling words to destroy them!</p>
            <button 
              onClick={() => setGameStarted(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-4 rounded-xl font-black transition-all transform hover:scale-105"
            >
              INITIALIZE SYSTEM
            </button>
          </div>
        ) : gameOver ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 z-20">
            <h2 className="text-5xl font-black text-white mb-4">{score === 700 ? "VICTORY" : "SYSTEM FAILURE"}</h2>
            <p className="text-slate-400 mb-8">Final Score: {score}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-600"
            >
              REBOOT
            </button>
          </div>
        ) : (
          <div className="flex-1 relative">
            {/* The Falling Word */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-none"
              style={{ top: `${position}%` }}
            >
              <div className="bg-rose-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-rose-500/50 flex flex-col items-center">
                <span className="text-xs uppercase opacity-70 mb-1">Fix this:</span>
                <span className="text-2xl tracking-widest uppercase">{activeWord.wrong}</span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="absolute bottom-0 w-full h-12 bg-rose-900/20 border-t border-rose-500/30 flex items-center justify-center">
              <span className="text-rose-500/50 text-xs font-black tracking-[0.5em] animate-pulse">DANGER ZONE</span>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-16 w-full px-10">
              <input
                autoFocus
                type="text"
                value={userInput}
                onChange={handleInput}
                placeholder="TYPE CORRECT WORD..."
                className="w-full bg-slate-950 border-2 border-amber-500/50 p-4 rounded-xl text-amber-400 text-center text-2xl font-black focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-800"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}