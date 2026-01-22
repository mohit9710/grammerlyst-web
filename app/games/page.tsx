"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import "../../styles/index.css";

const GAMES = [
  {
    id: "speed-typer",
    title: "Sentence Sprinter",
    description: "Type the displayed sentences as fast as you can. Focus on punctuation and speed.",
    icon: "fa-keyboard",
    color: "bg-blue-100 text-blue-600",
    hoverColor: "group-hover:text-blue-600",
    path: "/games/speed-typer",
  },
  {
    id: "scramble-solve",
    title: "Word Unscrambler",
    description: "Keyboard-only! Use your keys to rearrange letters into the correct verb or noun.",
    icon: "fa-random",
    color: "bg-rose-100 text-rose-600",
    hoverColor: "group-hover:text-rose-600",
    path: "/games/word-scramble",
  },
  {
    id: "grammar-defense",
    title: "Syntax Defender",
    description: "Enemy words are falling! Type the correct correction to blast them away before they hit the ground.",
    icon: "fa-shield-alt",
    color: "bg-amber-100 text-amber-600",
    hoverColor: "group-hover:text-amber-600",
    path: "/games/syntax-defender",
  },
];

export default function GamesHub() {
  return (
    <>
      <Navbar />
      <header className="bg-slate-50 py-16 px-6 border-b">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            The Arcade
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Sharpen your English reflexes with these keyboard-based challenges. 
            No mouse allowed!
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              href={game.path}
              className="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2"
            >
              <div className={`w-20 h-20 ${game.color} rounded-3xl flex items-center justify-center text-3xl mb-8 group-hover:rotate-12 transition-transform`}>
                <i className={`fas ${game.icon}`}></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {game.title}
              </h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                {game.description}
              </p>
              <div className={`mt-auto font-bold flex items-center gap-2 ${game.hoverColor}`}>
                Start Playing 
                <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-400 group-hover:bg-current group-hover:text-white transition-colors">
                  ENTER
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pro Tip Section */}
        <div className="mt-20 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex items-start gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <i className="fas fa-lightbulb text-emerald-500 text-2xl"></i>
          </div>
          <div>
            <h4 className="text-emerald-900 font-bold text-lg mb-1">Keyboard Pro-Tip</h4>
            <p className="text-emerald-700">
              Using your keyboard instead of clicking helps build <strong>muscle memory</strong> for spelling. 
              Try to keep your eyes on the screen and off your fingers!
            </p>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        &copy; 2026 Grammrlyst Arcade • All Rights Reserved.
      </footer>
    </>
  );
}