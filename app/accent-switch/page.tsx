"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Volume2, Mic, Repeat, Gauge, Square } from "lucide-react";
import { useRouter } from "next/navigation";

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

  // ✅ LOAD VOICES (FIX SSR ISSUE)
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    // if (!token) {
    //   router.replace("/auth/login");
    // }
    
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

    recognition.onresult = (event: any) => {
      const result = event.results[0][0];

      const spoken = result.transcript;
      const conf = result.confidence || 0.5;

      setSpokenText(spoken);
      setConfidence(conf);

      const textScore = calculateScore(text, spoken);

      // 🔥 FINAL SCORE
      const finalScore = Math.round((textScore * 0.7) + (conf * 30));
      setScore(finalScore);
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

      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-2xl border">
          <h1 className="text-3xl font-bold text-center mb-4">
            🎧 Accent Trainer Pro
          </h1>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border rounded-xl mb-4"
            rows={4}
          />

          {/* Accent */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { code: "en-US", label: "🇺🇸" },
              { code: "en-GB", label: "🇬🇧" },
              { code: "en-IN", label: "🇮🇳" },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => setAccent(item.code)}
                className={`p-3 rounded-xl ${
                  accent === item.code
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={speak}
              className="flex-1 bg-green-500 text-white p-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Volume2 size={18} /> Play
            </button>

            <button
              onClick={startRecording}
              className="flex-1 bg-purple-500 text-white p-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Mic size={18} /> Record
            </button>

            {/* <button
              onClick={stopRecording}
              className="bg-red-500 text-white p-3 rounded-xl"
            >
              <Square size={18} />
            </button> */}
          </div>

          {/* Loop + Speed + Strict */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setIsLoop(!isLoop)}
              className={`px-4 py-2 rounded-lg ${
                isLoop ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <Repeat size={16} /> Loop
            </button>

            <button
              onClick={() => setStrictMode(!strictMode)}
              className={`px-4 py-2 rounded-lg ${
                strictMode ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              🔥 Strict
            </button>

            <div className="flex items-center gap-2">
              <Gauge size={16} />
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
              <span>{speed}x</span>
            </div>
          </div>

          {/* Feedback */}
          {spokenText && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">Your Speech:</p>
              <p className="mb-2">{spokenText}</p>

              <p className="text-sm text-gray-600">Accuracy:</p>
              <p className="text-lg font-bold">
                {score}% {score && score > 80 ? "🔥 Great!" : "⚡ Improve"}
              </p>

              {confidence !== null && (
                <p className="text-sm text-gray-500">
                  Confidence: {(confidence * 100).toFixed(0)}%
                </p>
              )}

              <p className="mt-2">{getFeedback()}</p>

              <div className="mt-2">{highlightText()}</div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}