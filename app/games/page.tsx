"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import "../../styles/index.css";

const GAMES = [
  {
    id: "speed-typer",
    title: "Sentence Sprinter",
    description:
      "Type the displayed sentences as fast as you can. Focus on punctuation and speed.",
    icon: "fa-keyboard",
    color: "bg-blue-100 text-blue-600",
    path: "/games/speed-typer",
    locked: false,
  },
  {
    id: "scramble-solve",
    title: "Word Unscrambler",
    description:
      "Keyboard-only! Use your keys to rearrange letters into the correct verb or noun.",
    icon: "fa-random",
    color: "bg-rose-100 text-rose-600",
    path: "/games/word-scramble",
    locked: false,
  },
  {
    id: "grammar-defense",
    title: "Syntax Defender",
    description:
      "Enemy words are falling! Type the correct correction to blast them away before they hit the ground.",
    icon: "fa-shield-alt",
    color: "bg-amber-100 text-amber-600",
    path: "/games/syntax-defender",
    locked: false,
  },
];

export default function GamesHub() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <header className="bg-slate-50 py-16 px-6 border-b">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            The Arcade
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Sharpen your English reflexes with keyboard-only challenges.
            No mouse allowed!
          </p>
        </div>
      </header>

      {/* Games */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {GAMES.map((game) =>
            game.locked ? (
              // LOCKED CARD
              <div
                key={game.id}
                className="relative group bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center opacity-60 cursor-not-allowed"
              >
                <div className="absolute top-6 right-6 bg-slate-900 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                  <i className="fas fa-lock"></i>
                  Locked
                </div>

                <div
                  className={`w-20 h-20 ${game.color} rounded-3xl flex items-center justify-center text-3xl mb-8`}
                >
                  <i className={`fas ${game.icon}`}></i>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {game.title}
                </h3>

                <p className="text-slate-500 leading-relaxed mb-8">
                  {game.description}
                </p>

                <div className="mt-auto font-bold flex items-center gap-2 text-slate-400">
                  Coming Soon
                  <i className="fas fa-hourglass-half text-xs"></i>
                </div>
              </div>
            ) : (
              // UNLOCKED CARD
              <Link
                key={game.id}
                href={game.path}
                className="relative group bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all"
              >
                <div
                  className={`w-20 h-20 ${game.color} rounded-3xl flex items-center justify-center text-3xl mb-8 group-hover:rotate-12 transition-transform`}
                >
                  <i className={`fas ${game.icon}`}></i>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {game.title}
                </h3>

                <p className="text-slate-500 leading-relaxed mb-8">
                  {game.description}
                </p>

                <div className="mt-auto font-bold flex items-center gap-2 text-slate-600">
                  Start Playing
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-400 group-hover:bg-current group-hover:text-white transition-colors">
                    ENTER
                  </span>
                </div>
              </Link>
            )
          )}
        </div>

        {/* Pro Tip */}
        <div className="mt-20 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex items-start gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <i className="fas fa-lightbulb text-emerald-500 text-2xl"></i>
          </div>
          <div>
            <h4 className="text-emerald-900 font-bold text-lg mb-1">
              Keyboard Pro-Tip
            </h4>
            <p className="text-emerald-700">
              Keyboard-only games build <strong>muscle memory</strong> faster.
              Keep your eyes on the screen, not your fingers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm">
        &copy; 2026 Grammrlyst Arcade • All Rights Reserved.
      </footer>
    </>
  );
}
