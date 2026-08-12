"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Volume2, Mic, Repeat, Gauge, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveAttempt } from "@/services/reportAnalysis";

export default function AccentSwitchPage() {
  const router = useRouter();
  const [text, setText] = useState("Hello, how are you today?");
  const [accent, setAccent] = useState("en-US");
  const [isLoop, setIsLoop] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [spokenText, setSpokenText] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<any>(null);

  const [strictMode, setStrictMode] = useState(false);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      // router.replace("/auth/login");
    } else {
      setLoading(false);
    }
    
    if (typeof window === "undefined") return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 🔊 SPEAK
  const speak = () => {
    if (typeof window === "undefined") return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent;
    utterance.rate = speed;

    const selectedVoice = voices.find((v) => v.lang === accent);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => {
      if (isLoop) speak();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // 🧹 CLEAN TEXT
  const clean = (str: string) =>
    str.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();

  // 🧠 SIMILARITY (LEVENSHTEIN)
  const similarity = (a: string, b: string) => {
    if (!a || !b) return 0;

    const dp = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : Math.min(
                dp[i - 1][j - 1] + 1,
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1
              );
      }
    }

    const distance = dp[a.length][b.length];
    return 1 - distance / Math.max(a.length, b.length);
  };

  // 📊 IMPROVED SCORE
  const calculateScore = (original: string, spoken: string) => {
    const cleanOriginal = clean(original);
    const cleanSpoken = clean(spoken);

    // Full sentence similarity
    const sentenceScore = similarity(cleanOriginal, cleanSpoken);

    // Word-level
    const o = cleanOriginal.split(" ");
    const s = cleanSpoken.split(" ");

    let wordScore = 0;
    o.forEach((word, i) => {
      wordScore += similarity(word, s[i] || "");
    });

    wordScore = wordScore / o.length;

    // 🔥 Combine
    return (sentenceScore * 0.5 + wordScore * 0.5) * 100;
  };

  // 🎤 RECORD
  const startRecording = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = accent;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: any) => {
      const result = event.results[0][0];

      const spoken = result.transcript;
      const conf = result.confidence || 0.5;

      setSpokenText(spoken);
      setConfidence(conf);

      const textScore = calculateScore(text, spoken);

      // 🔥 FINAL SCORE
      const finalScore = Math.round((textScore * 0.7) + (conf * 30));
      setScore(finalScore);


      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("access_token");

        if (!token) {
          console.log("No token found");
          return;
        }

        await saveAttempt(token, {
          exercise_type: "speaking",

          question: text,

          user_answer: spoken,

          corrected_answer: text,

          ai_feedback:
            finalScore >= 90
              ? "Excellent pronunciation."
              : finalScore >= 75
              ? "Good pronunciation. Keep practicing."
              : "Focus on clarity and word stress.",

          accuracy_score: finalScore,

          grammar_score: finalScore,

          vocabulary_score: finalScore,

          confidence_score: Math.round(
            conf * 100
          ),

          xp_earned:
            finalScore >= 90
              ? 20
              : finalScore >= 75
              ? 15
              : 10,

          duration_seconds: 60,
        });

        console.log(
          "Speaking attempt saved successfully"
        );
      } catch (err) {
        console.error(
          "Save attempt failed",
          err
        );
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // 🛑 STOP RECORDING
  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  // 🎯 HIGHLIGHT
  const highlightText = () => {
    const o = clean(text).split(" ");
    const s = clean(spokenText).split(" ");

    const threshold = strictMode ? 0.9 : 0.7;

    return o.map((word, i) => {
      const sim = similarity(word, s[i] || "");
      const isCorrect = sim > threshold;

      return (
        <span
          key={i}
          className={
            isCorrect
              ? "text-green-600 font-semibold"
              : "text-red-500"
          }
        >
          {word + " "}
        </span>
      );
    });
  };

  // 🤖 FEEDBACK
  const getFeedback = () => {
    if (!score) return "";

    if (score > 90) return "🔥 Excellent pronunciation!";
    if (score > 75) return "👍 Good, keep practicing!";
    if (score > 50) return "⚡ Improve clarity";
    return "❌ Try again slowly";
  };

  return (
  <>
    <Navbar />

    <main className="min-h-screen bg-[#060816] text-white overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        
        {/* HERO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 font-semibold mb-5">
            🎧 AI Pronunciation Lab
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
            Accent Trainer
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Speak Like Native
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-slate-400 text-lg leading-relaxed">
            Practice pronunciation, compare accents, and get instant AI-powered
            speaking feedback in real time.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl">
              
              {/* TEXTAREA */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm uppercase tracking-widest text-slate-400 font-bold">
                    Practice Sentence
                  </label>

                  <span className="text-xs text-slate-500">
                    {text.length} characters
                  </span>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  placeholder="Type something to practice..."
                  className="w-full bg-[#0F172A] border border-white/10 focus:border-blue-500 outline-none rounded-3xl p-6 text-lg resize-none placeholder:text-slate-600 transition-all"
                />
              </div>

              {/* ACCENT SELECT */}
              <div className="mb-8">
                <p className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-4">
                  Accent Mode
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      code: "en-US",
                      label: "American",
                      emoji: "🇺🇸",
                    },
                    {
                      code: "en-GB",
                      label: "British",
                      emoji: "🇬🇧",
                    },
                    {
                      code: "en-IN",
                      label: "Indian",
                      emoji: "🇮🇳",
                    },
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => setAccent(item.code)}
                      className={`rounded-2xl p-5 border transition-all text-left ${
                        accent === item.code
                          ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="text-3xl mb-3">
                        {item.emoji}
                      </div>

                      <h3 className="font-bold text-lg">
                        {item.label}
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        Natural pronunciation
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* CONTROLS */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={speak}
                  className="h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20"
                >
                  <Volume2 size={22} />
                  Play Audio
                </button>

                <button
                  onClick={startRecording}
                  className="h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-500/20"
                >
                  <Mic size={22} />
                  Start Speaking
                </button>
              </div>

              {/* SETTINGS */}
              <div className="grid md:grid-cols-3 gap-4">
                
                <button
                  onClick={() => setIsLoop(!isLoop)}
                  className={`rounded-2xl p-5 border transition-all ${
                    isLoop
                      ? "bg-blue-500/10 border-blue-500"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Repeat size={20} />
                    <div>
                      <p className="font-bold">Loop Audio</p>
                      <p className="text-xs text-slate-400">
                        Repeat playback
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setStrictMode(!strictMode)}
                  className={`rounded-2xl p-5 border transition-all ${
                    strictMode
                      ? "bg-rose-500/10 border-rose-500"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    🔥
                    <div>
                      <p className="font-bold">Strict Mode</p>
                      <p className="text-xs text-slate-400">
                        Hard accuracy check
                      </p>
                    </div>
                  </div>
                </button>

                <div className="rounded-2xl p-5 border border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Gauge size={18} />
                    <span className="font-bold">Speed</span>
                  </div>

                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={speed}
                    onChange={(e) =>
                      setSpeed(Number(e.target.value))
                    }
                    className="w-full"
                  />

                  <div className="mt-2 text-sm text-slate-400">
                    {speed}x playback
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              
              {/* SCORE CARD */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black">
                    AI Feedback
                  </h2>

                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl">
                    🎯
                  </div>
                </div>

                {spokenText ? (
                  <>
                    {/* SCORE */}
                    <div className="text-center mb-8">
                      <div className="text-7xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {score}%
                      </div>

                      <p className="text-slate-400 mt-2">
                        Pronunciation Accuracy
                      </p>
                    </div>

                    {/* FEEDBACK */}
                    <div className="bg-[#0F172A] rounded-3xl p-5 mb-5 border border-white/5">
                      <p className="text-sm text-slate-400 mb-2">
                        Your Speech
                      </p>

                      <p className="text-lg leading-relaxed">
                        {spokenText}
                      </p>
                    </div>

                    {/* CONFIDENCE */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-slate-400">
                          Confidence
                        </span>

                        <span className="font-bold">
                          {(confidence! * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{
                            width: `${(confidence || 0) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 p-5">
                      <p className="font-semibold text-lg">
                        {getFeedback()}
                      </p>
                    </div>

                    {/* WORD HIGHLIGHT */}
                    <div className="mt-6">
                      <p className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3">
                        Pronunciation Analysis
                      </p>

                      <div className="bg-[#0F172A] border border-white/5 rounded-3xl p-5 leading-loose text-lg">
                        {highlightText()}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white/5 flex items-center justify-center text-5xl mb-6">
                      🎙️
                    </div>

                    <h3 className="text-2xl font-bold mb-3">
                      Ready to Practice?
                    </h3>

                    <p className="text-slate-400 leading-relaxed">
                      Press the microphone button and start speaking.
                      AI analysis will appear here instantly.
                    </p>
                  </div>
                )}
              </div>

              {/* QUICK TIPS */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] p-6 shadow-2xl">
                <h3 className="text-xl font-black mb-4">
                  💡 Speaking Tips
                </h3>

                <div className="space-y-3 text-blue-100">
                  <div className="flex gap-3">
                    <span>•</span>
                    <p>Speak slowly and clearly</p>
                  </div>

                  <div className="flex gap-3">
                    <span>•</span>
                    <p>Practice daily for fluency</p>
                  </div>

                  <div className="flex gap-3">
                    <span>•</span>
                    <p>Listen before repeating</p>
                  </div>

                  <div className="flex gap-3">
                    <span>•</span>
                    <p>Use strict mode for precision</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </>
);
}