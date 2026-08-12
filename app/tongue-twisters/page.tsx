"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../../styles/pronunciation.css";

import {
  fetchTongueTwisters,
  TongueTwister,
  TwisterDifficulty,
} from "@/services/tongueTwistersService";

const DIFFICULTY_STYLES: Record<TwisterDifficulty, string> = {
  Beginner: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  Intermediate: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
  Advanced: "bg-pink-500/10 border-pink-500/20 text-pink-300",
};

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreAttempt(original: string, spoken: string): number {
  const originalWords = normalizeWords(original);

  const spokenWords = new Set(normalizeWords(spoken));

  if (originalWords.length === 0) return 0;

  const matched = originalWords.filter((word) =>
    spokenWords.has(word)
  ).length;

  return Math.round((matched / originalWords.length) * 100);
}

export default function TongueTwistersPage() {
  const [twisters, setTwisters] = useState<TongueTwister[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "All" | TwisterDifficulty
  >("All");

  const [activeId, setActiveId] = useState<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const [transcript, setTranscript] = useState("");

  const [score, setScore] = useState<number | null>(null);

  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  // =====================================================
  // SEO
  // =====================================================

  useEffect(() => {
    document.title =
      "Tongue Twisters | Pronunciation & Speaking Practice | Grammrlyst";

    let metaDesc = document.querySelector('meta[name="description"]');

    if (!metaDesc) {
      metaDesc = document.createElement("meta");

      metaDesc.setAttribute("name", "description");

      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute(
      "content",
      "Practice English tongue twisters from beginner to advanced. Listen to native pronunciation and test your own speaking accuracy — free, no sign-up required."
    );
  }, []);

  // =====================================================
  // FETCH DATA — public, no auth required
  // =====================================================

  useEffect(() => {
    fetchTongueTwisters()
      .then(setTwisters)
      .catch(() => setTwisters([]))
      .finally(() => setLoading(false));
  }, []);

  // =====================================================
  // SPEECH RECOGNITION SETUP
  // =====================================================

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const rec = new SpeechRecognition();

    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";

    rec.onresult = (event: any) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }

      setTranscript(text.trim());
    };

    rec.onerror = () => setIsRecording(false);

    rec.onend = () => setIsRecording(false);

    recognitionRef.current = rec;

    return () => {
      rec.stop();
    };
  }, []);

  // =====================================================
  // ACTIONS
  // =====================================================

  const handleListen = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.85;

    window.speechSynthesis.speak(utterance);
  };

  const openPractice = (twister: TongueTwister) => {
    setActiveId(twister.id);
    setTranscript("");
    setScore(null);
  };

  const closePractice = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    setActiveId(null);
    setTranscript("");
    setScore(null);
  };

  const toggleRecording = (originalText: string) => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setScore(scoreAttempt(originalText, transcript));
    } else {
      setTranscript("");
      setScore(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const difficulties: ("All" | TwisterDifficulty)[] = [
    "All",
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  const filteredTwisters = useMemo(() => {
    return twisters.filter((t) => {
      const matchesSearch =
        t.text.toLowerCase().includes(search.toLowerCase()) ||
        t.targetSound.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === "All"
          ? true
          : t.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [twisters, search, selectedDifficulty]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white text-xl font-bold">
        Loading Tongue Twisters...
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-x-hidden relative">
        {/* BACKGROUND GLOWS */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>

        <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-violet-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-10 lg:py-14">
          {/* HERO */}
          <div className="mb-14 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>

              <span className="text-sm text-slate-300">
                Free & Open to Everyone
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
              Tongue Twister
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Speaking Drills
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
              Sharpen your articulation from beginner to advanced. Listen to
              native pronunciation, then record yourself and see how close
              you get — no account required.
            </p>

            {!speechSupported && (
              <p className="mt-4 text-sm text-amber-300">
                Your browser doesn't support speech recognition for the
                practice mode — try Chrome on desktop or Android for the
                full experience. Listening still works everywhere.
              </p>
            )}
          </div>

          {/* FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <input
              type="text"
              placeholder="Search tongue twisters or sounds (e.g. 'S', 'TH')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:max-w-md px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
            />

            <div className="flex flex-wrap gap-2">
              {difficulties.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${
                    selectedDifficulty === level
                      ? "bg-gradient-to-r from-cyan-500 to-violet-600 border-transparent text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* TWISTERS GRID */}
          {filteredTwisters.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-6 xl:gap-8">
              {filteredTwisters.map((twister) => {
                const isActive = activeId === twister.id;

                return (
                  <div
                    key={twister.id}
                    className={`group relative overflow-hidden rounded-[2rem] border p-6 lg:p-8 transition-all duration-300 ${
                      isActive
                        ? "border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 to-violet-600/10"
                        : "border-white/10 bg-white/5 hover:border-cyan-400/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${DIFFICULTY_STYLES[twister.difficulty]}`}
                      >
                        <span className="text-xs font-semibold">
                          {twister.difficulty}
                        </span>
                      </div>

                      <span className="text-xs text-slate-500 font-mono">
                        Focus: {twister.targetSound}
                      </span>
                    </div>

                    <p className="text-xl md:text-2xl font-bold leading-relaxed mb-6">
                      "{twister.text}"
                    </p>

                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      💡 {twister.tip}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleListen(twister.text)}
                        className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all text-sm font-semibold"
                      >
                        🔊 Listen
                      </button>

                      {speechSupported && (
                        <button
                          onClick={() =>
                            isActive
                              ? closePractice()
                              : openPractice(twister)
                          }
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-sm font-semibold hover:scale-[1.02] transition-all"
                        >
                          {isActive ? "Close Practice" : "🎤 Practice"}
                        </button>
                      )}
                    </div>

                    {/* PRACTICE PANEL */}
                    {isActive && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <button
                          onClick={() => toggleRecording(twister.text)}
                          className={`w-full py-4 rounded-2xl font-black transition-all duration-300 mb-4 ${
                            isRecording
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-[1.02]"
                          }`}
                        >
                          {isRecording
                            ? "⏹ Stop & Check"
                            : "● Start Speaking"}
                        </button>

                        <div className="custom-scrollbar min-h-[70px] max-h-[140px] overflow-y-auto rounded-2xl bg-[#0d1324] border border-white/5 p-4 text-slate-300 italic text-sm leading-relaxed mb-4">
                          {transcript ||
                            (isRecording
                              ? "Listening..."
                              : "Your spoken attempt will appear here.")}
                        </div>

                        {score !== null && (
                          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-400">
                                Word Match Accuracy
                              </span>

                              <span
                                className={`text-2xl font-black ${
                                  score >= 80
                                    ? "text-emerald-400"
                                    : score >= 50
                                    ? "text-cyan-400"
                                    : "text-red-400"
                                }`}
                              >
                                {score}%
                              </span>
                            </div>

                            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  score >= 80
                                    ? "bg-emerald-500"
                                    : score >= 50
                                    ? "bg-cyan-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center">
              <div className="text-6xl mb-5">👅</div>

              <h3 className="text-2xl font-bold mb-3">
                No Tongue Twisters Found
              </h3>

              <p className="text-slate-400">
                Try a different search term or difficulty level.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
