import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import ArcadeBonusBanner from "@/components/ArcadeBonusBanner";

export const metadata: Metadata = {
  title: "Grammrlyst Arcade | Learn English Through Games",
};

const GAMES = [
  {
    id: "speed-typer",
    title: "Sentence Sprinter",
    description:
      "Type sentences at lightning speed and improve your typing accuracy.",
    icon: "fa-keyboard",
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
    path: "/games/speed-typer",
    locked: false,
  },
  {
    id: "scramble-solve",
    title: "Word Unscrambler",
    description:
      "Unscramble mixed letters into meaningful English words.",
    icon: "fa-shuffle",
    gradient: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/20",
    path: "/games/word-scramble",
    locked: false,
  },
  {
    id: "grammar-defense",
    title: "Syntax Defender",
    description:
      "Destroy grammar mistakes before they reach the danger zone.",
    icon: "fa-shield-halved",
    gradient: "from-amber-400 to-orange-500",
    glow: "shadow-amber-500/20",
    path: "/games/syntax-defender",
    locked: false,
  },
  {
    id: "word-memory",
    title: "Word Memory Match",
    description:
      "Flip cards to pair vocabulary words with their meanings.",
    icon: "fa-brain",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    path: "/games/word-memory",
    locked: false,
  },
  {
    id: "odd-one-out",
    title: "Odd One Out",
    description:
      "Spot the word that doesn't belong before the timer runs out.",
    icon: "fa-magnifying-glass",
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    path: "/games/odd-one-out",
    locked: false,
  },
];

export default function GamesHub() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
        {/* HERO */}
        <section className="relative px-6 pt-20 pb-14 md:pt-28 md:pb-20">
          {/* Glow Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-500/10 blur-3xl rounded-full"></div>
          <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-3xl rounded-full"></div>

          <div className="relative max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] font-black text-indigo-300 mb-8 backdrop-blur-xl">
              🎮 Grammrlyst Arcade
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-6">
              Learn English
              <br />
              Through Games
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Improve grammar, vocabulary, spelling, and typing speed with
              immersive arcade-style challenges.
            </p>

            <ArcadeBonusBanner />
          </div>
        </section>

        {/* GAMES */}
        <main className="relative max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-3 gap-8">
            {GAMES.map((game) =>
              game.locked ? (
                <div
                  key={game.id}
                  className="relative rounded-[2.5rem] bg-white/[0.04] border border-white/10 backdrop-blur-2xl overflow-hidden p-8 opacity-60"
                >
                  <div className="absolute top-6 right-6 bg-white/10 border border-white/10 text-white text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider">
                    Locked
                  </div>

                  <div
                    className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${game.gradient} flex items-center justify-center text-white text-4xl mb-10 shadow-2xl ${game.glow}`}
                  >
                    <i className={`fas ${game.icon}`}></i>
                  </div>

                  <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                    {game.title}
                  </h2>

                  <p className="text-slate-400 leading-relaxed mb-10">
                    {game.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
                      Coming Soon
                    </span>

                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                      🔒
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={game.id}
                  href={game.path}
                  className="group relative rounded-[2.5rem] bg-white/[0.05] border border-white/10 backdrop-blur-2xl overflow-hidden p-8 hover:-translate-y-2 hover:border-white/20 transition-all duration-500"
                >
                  {/* Glow */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${game.gradient} blur-3xl`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${game.gradient} flex items-center justify-center text-white text-4xl mb-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      <i className={`fas ${game.icon}`}></i>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                        {game.title}
                      </h2>

                      <p className="text-slate-400 leading-relaxed text-base">
                        {game.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
                          ▶
                        </div>

                        <div>
                          <p className="text-white font-bold">
                            Start Playing
                          </p>

                          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">
                            Press Enter
                          </p>
                        </div>
                      </div>

                      <div className="text-white text-xl group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>

          {/* BOTTOM INFO */}
          <div className="mt-20 rounded-[2.5rem] bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/10 backdrop-blur-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 rounded-[2rem] bg-white/10 border border-white/10 flex items-center justify-center text-4xl">
                💡
              </div>

              <div>
                <h3 className="text-2xl font-black text-white mb-3">
                  Pro Gamer Tip
                </h3>

                <p className="text-slate-300 max-w-2xl leading-relaxed">
                  Keyboard-based learning strengthens memory recall, grammar
                  recognition, and typing fluency much faster than passive
                  reading.
                </p>
              </div>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-slate-500 text-xs uppercase tracking-[0.25em] font-black mb-2">
                Recommended
              </p>

              <p className="text-white font-bold text-lg">
                Play 15 mins daily
              </p>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-10 text-center text-slate-500 text-sm">
          © 2026 Grammrlyst Arcade • Level Up Your English
        </footer>
      </div>
    </>
  );
}
