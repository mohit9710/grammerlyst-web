"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mic,
  Pause,
  Sparkles,
  Brain,
  Volume2,
  AlertTriangle,
  ChevronRight,
  Wand2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Suggestion {
  word: string;
  type: "word" | "phrase" | "smart";
}

export default function WordRescuePage() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState("");
  const [timer, setTimer] = useState(0);

  const [showRescue, setShowRescue] = useState(false);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { word: "hospital", type: "word" },
    { word: "doctor clinic", type: "phrase" },
    { word: "medical center", type: "smart" },
  ]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fake live speaking text
  const speechLines = useMemo(
    () => [
      "Yesterday I went to...",
      "Yesterday I went to uh...",
      "Yesterday I went to the place where doctors...",
      "Yesterday I went to the place where doctors work...",
    ],
    []
  );

  useEffect(() => {

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (!isListening) return;

    let index = 0;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);

      if (index < speechLines.length) {
        setCurrentSpeech(speechLines[index]);
        index++;
      }

      // Trigger rescue popup
      if (index === 3) {
        setShowRescue(true);
      }
    }, 2200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isListening, speechLines]);

  const handleStart = () => {
    setCurrentSpeech("");
    setTimer(0);
    setShowRescue(false);
    setIsListening(true);
  };

  const handleStop = () => {
    setIsListening(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const useSuggestion = (word: string) => {
    setCurrentSpeech((prev) => prev + " " + word);
    setShowRescue(false);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_35%)]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:60px_60px]" />

        <section className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-semibold mb-5">
                <Sparkles className="w-4 h-4" />
                AI Speaking Copilot
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                Word
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {" "}
                  Rescue
                </span>
              </h1>

              <p className="mt-6 text-slate-400 max-w-2xl text-lg leading-relaxed">
                Real-time AI speaking assistance that helps learners recover
                forgotten words, fix hesitation, and continue speaking naturally
                without panic.
              </p>
            </div>

            {/* Live Score Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-w-[320px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-500 text-sm">Fluency Assist</p>
                  <h3 className="text-3xl font-black text-cyan-400">ACTIVE</h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Speaking Time</span>
                  <span className="font-bold">{timer}s</span>
                </div>

                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(timer * 4, 100)}%`,
                    }}
                  />
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-300 mb-1">
                    AI Status
                  </p>

                  <p className="text-sm text-emerald-100">
                    Detecting hesitation, fillers & missing vocabulary in
                    real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
            {/* LEFT SIDE */}
            <div className="space-y-8">
              {/* Speaking Panel */}
              <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-slate-500 text-sm mb-2">
                        Live Speaking Session
                      </p>

                      <h2 className="text-3xl font-black">
                        Speak Freely
                      </h2>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-bold border ${
                        isListening
                          ? "bg-red-500/10 border-red-500/20 text-red-300"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {isListening ? "🎤 LISTENING..." : "IDLE"}
                    </div>
                  </div>

                  {/* Live Speech */}
                  <div className="bg-black/30 border border-white/10 rounded-3xl p-8 min-h-[220px] flex flex-col justify-between">
                    <div>
                      <p className="text-slate-500 uppercase tracking-[0.3em] text-xs mb-5">
                        Your Speech
                      </p>

                      <div className="text-3xl font-bold leading-relaxed">
                        {currentSpeech ? (
                          <>
                            {currentSpeech}
                            {isListening && (
                              <span className="animate-pulse text-cyan-400">
                                |
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-600">
                            Start speaking and AI will assist you live...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap gap-4 mt-10">
                      {!isListening ? (
                        <button
                          onClick={handleStart}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-[0_20px_50px_rgba(6,182,212,0.25)]"
                        >
                          <Mic className="w-5 h-5" />
                          Start Speaking
                        </button>
                      ) : (
                        <button
                          onClick={handleStop}
                          className="bg-rose-500 hover:bg-rose-400 transition-all px-8 py-4 rounded-2xl font-bold flex items-center gap-3"
                        >
                          <Pause className="w-5 h-5" />
                          Stop Session
                        </button>
                      )}

                      <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all">
                        <Volume2 className="w-5 h-5" />
                        AI Voice Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    title: "Live Rescue",
                    desc: "AI detects hesitation instantly.",
                    icon: "⚡",
                  },
                  {
                    title: "Smart Suggestions",
                    desc: "Predicts missing words & phrases.",
                    icon: "🧠",
                  },
                  {
                    title: "Confidence Boost",
                    desc: "Continue speaking without panic.",
                    icon: "🚀",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
                  >
                    <div className="text-3xl mb-4">{item.icon}</div>

                    <h3 className="font-black text-lg mb-2">
                      {item.title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              {/* Rescue Popup */}
              <div
                className={`transition-all duration-500 ${
                  showRescue
                    ? "opacity-100 translate-y-0"
                    : "opacity-40 translate-y-2"
                }`}
              >
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[32px] p-7 backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/5" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Wand2 className="w-6 h-6 text-cyan-400" />
                      </div>

                      <div>
                        <p className="text-cyan-300 font-black uppercase text-xs tracking-[0.3em]">
                          Word Rescue
                        </p>

                        <h3 className="text-2xl font-black">
                          AI Suggestions
                        </h3>
                      </div>
                    </div>

                    <div className="bg-black/20 border border-white/10 rounded-2xl p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />

                        <div>
                          <p className="text-slate-300 text-sm mb-1">
                            Hesitation detected:
                          </p>

                          <p className="text-white font-semibold">
                            “the place where doctors...”
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-3">
                      {suggestions.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => useSuggestion(item.word)}
                          className="w-full bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all rounded-2xl p-5 text-left flex items-center justify-between group"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold">
                                {item.word}
                              </span>

                              <span
                                className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${
                                  item.type === "smart"
                                    ? "bg-purple-500/20 text-purple-300"
                                    : item.type === "phrase"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "bg-cyan-500/20 text-cyan-300"
                                }`}
                              >
                                {item.type}
                              </span>
                            </div>

                            <p className="text-slate-400 text-sm">
                              Tap to continue speaking naturally.
                            </p>
                          </div>

                          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-7 backdrop-blur-xl">
                <p className="text-slate-500 uppercase tracking-[0.3em] text-xs mb-5">
                  AI Insights
                </p>

                <div className="space-y-5">
                  {[
                    "Detected filler words: “uh...”",
                    "Sentence interruption probability: High",
                    "Suggested easier vocabulary ready",
                    "Fluency rescue activated in 1.2s",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Feel */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-[32px] p-7">
                <p className="text-purple-300 uppercase tracking-[0.3em] text-xs mb-5">
                  Experience Feel
                </p>

                <h3 className="text-2xl font-black mb-4">
                  Like AI Autocomplete —
                  <br />
                  but for Speaking.
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  Word Rescue acts as a live fluency companion that helps users
                  recover vocabulary instantly during real conversation practice.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}