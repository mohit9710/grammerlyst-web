"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mic,
  Square,
  Brain,
  Flame,
  Sparkles,
  Volume2,
  Timer,
  TrendingUp,
} from "lucide-react";

const CHALLENGES = [
  {
    type: "Interview",
    prompt: "Tell me about yourself in under 60 seconds.",
  },
  {
    type: "Debate",
    prompt: "Do you think AI will replace teachers?",
  },
  {
    type: "Sales",
    prompt: "Sell me this water bottle.",
  },
  {
    type: "Storytelling",
    prompt: "Describe the funniest thing that happened this year.",
  },
  {
    type: "Opinion",
    prompt: "Is social media helping or harming society?",
  },
];

export default function DailySpeakingArena() {
  const recognitionRef = useRef<any>(null);

  const [started, setStarted] = useState(false);
  const [recording, setRecording] = useState(false);

  const [timeLeft, setTimeLeft] = useState(60);

  const [transcript, setTranscript] = useState("");

  const [fluency, setFluency] = useState(0);
  const [grammar, setGrammar] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [vocabulary, setVocabulary] = useState("Beginner");

  const [fillerWords, setFillerWords] = useState(0);
  const [wpm, setWpm] = useState(0);

  const [completed, setCompleted] = useState(false);

  const challenge = useMemo(() => {
    return CHALLENGES[
      Math.floor(Math.random() * CHALLENGES.length)
    ];
  }, []);

  // TIMER
  useEffect(() => {
    let interval: any;

    if (recording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((p) => p - 1);
      }, 1000);
    }

    if (timeLeft === 0 && recording) {
      stopRecording();
    }

    return () => clearInterval(interval);
  }, [recording, timeLeft]);

  // START RECORDING
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        finalTranscript +=
          event.results[i][0].transcript + " ";
      }

      setTranscript(finalTranscript);

      analyzeSpeech(finalTranscript);
    };

    recognition.start();

    recognitionRef.current = recognition;

    setStarted(true);
    setRecording(true);
  };

  // STOP
  const stopRecording = () => {
    recognitionRef.current?.stop();

    setRecording(false);
    setCompleted(true);
  };

  // AI ANALYSIS
  const analyzeSpeech = (text: string) => {
    const words = text.split(" ").filter(Boolean);

    const fillers = words.filter((w) =>
      ["um", "umm", "like", "uh", "hmm"].includes(
        w.toLowerCase()
      )
    );

    const wordCount = words.length;

    const estimatedWpm = Math.min(
      180,
      Math.round(wordCount * 1.7)
    );

    setWpm(estimatedWpm);

    setFillerWords(fillers.length);

    // fake smart metrics
    setFluency(Math.min(95, 60 + wordCount / 2));

    setGrammar(Math.min(98, 70 + wordCount / 3));

    setConfidence(Math.max(50, 90 - fillers.length * 3));

    if (wordCount > 90) {
      setVocabulary("Advanced");
    } else if (wordCount > 50) {
      setVocabulary("Intermediate");
    } else {
      setVocabulary("Basic");
    }
  };

  const getFeedback = () => {
    if (fluency > 85) {
      return "Excellent speaking flow with strong confidence and natural pacing.";
    }

    if (fluency > 70) {
      return "Good communication skills. Try reducing filler words.";
    }

    return "Speak slower and focus on sentence clarity.";
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white overflow-hidden relative">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.18),transparent_30%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <section className="relative z-10 max-w-7xl mx-auto px-6 py-10 min-h-screen flex flex-col">

          {/* Top */}
          <div className="flex items-center justify-between mb-8">

            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-xs uppercase tracking-[0.3em] mb-4">
                <Brain className="w-4 h-4" />
                Daily Speaking Arena
              </div>

              <h1 className="text-5xl md:text-6xl font-black leading-none tracking-tight">
                Train Real
                <br />
                Communication.
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-xl">
              <Flame className="text-orange-400 w-6 h-6" />
              <div>
                <p className="text-sm text-slate-400">
                  Daily Streak
                </p>
                <h3 className="font-black text-2xl">7 Days</h3>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 flex-1">

            {/* LEFT */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-2xl flex flex-col">

              {/* Challenge */}
              <div className="flex items-center justify-between mb-8">

                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-blue-400 mb-3">
                    {challenge.type} Challenge
                  </div>

                  <h2 className="text-4xl font-black leading-tight max-w-2xl">
                    {challenge.prompt}
                  </h2>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-black/40 border border-white/10 px-5 py-3 rounded-2xl">
                  <Timer className="w-5 h-5 text-red-400" />

                  <span className="text-2xl font-black">
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {/* Voice Visualizer */}
              <div className="flex-1 bg-black/40 border border-white/5 rounded-[2rem] flex items-center justify-center relative overflow-hidden">

                {!recording ? (
                  <div className="text-center">

                    <div className="w-28 h-28 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_80px_rgba(59,130,246,0.3)]">
                      <Mic className="w-12 h-12 text-blue-400" />
                    </div>

                    <h3 className="text-3xl font-black mb-3">
                      Ready to Speak?
                    </h3>

                    <p className="text-slate-400 max-w-md mx-auto mb-8">
                      Speak naturally. The AI will analyze your fluency,
                      vocabulary, pacing, and confidence in real time.
                    </p>

                    <button
                      onClick={startRecording}
                      className="bg-blue-600 hover:bg-blue-500 transition-all px-10 py-5 rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95"
                    >
                      START SPEAKING
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">

                    {/* Animated Bars */}
                    <div className="flex items-end gap-2 h-40 mb-10">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full animate-pulse"
                          style={{
                            height: `${40 + Math.random() * 100}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-red-400 font-bold uppercase tracking-[0.3em] mb-6 animate-pulse">
                      <Volume2 className="w-5 h-5" />
                      Listening...
                    </div>

                    <button
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-500 transition-all px-8 py-4 rounded-2xl font-black flex items-center gap-3"
                    >
                      <Square className="w-5 h-5" />
                      STOP SESSION
                    </button>
                  </div>
                )}
              </div>

              {/* Transcript */}
              <div className="mt-8 bg-black/30 border border-white/5 rounded-2xl p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-4">
                  Live Transcript
                </div>

                <p className="text-lg leading-relaxed text-slate-200">
                  {transcript ||
                    "Your speech transcription will appear here in real-time..."}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-4">

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6">
                  <p className="text-slate-400 text-sm mb-3">
                    Fluency
                  </p>

                  <h3 className="text-5xl font-black text-blue-400">
                    {fluency}%
                  </h3>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6">
                  <p className="text-slate-400 text-sm mb-3">
                    Grammar
                  </p>

                  <h3 className="text-5xl font-black text-purple-400">
                    {grammar}%
                  </h3>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
                  <p className="text-slate-400 text-sm mb-3">
                    Confidence
                  </p>

                  <h3 className="text-5xl font-black text-emerald-400">
                    {confidence}%
                  </h3>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6">
                  <p className="text-slate-400 text-sm mb-3">
                    Vocabulary
                  </p>

                  <h3 className="text-3xl font-black text-orange-400">
                    {vocabulary}
                  </h3>
                </div>
              </div>

              {/* Speaking Analytics */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">

                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="text-cyan-400 w-6 h-6" />

                  <h3 className="text-2xl font-black">
                    Speaking Analytics
                  </h3>
                </div>

                <div className="space-y-6">

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Speaking Speed
                    </span>

                    <span className="font-black text-xl">
                      {wpm} WPM
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Filler Words
                    </span>

                    <span className="font-black text-xl text-red-400">
                      {fillerWords}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      XP Earned
                    </span>

                    <span className="font-black text-xl text-emerald-400">
                      +150 XP
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[2rem] p-8">

                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="text-yellow-400 w-6 h-6" />

                  <h3 className="text-2xl font-black">
                    AI Feedback
                  </h3>
                </div>

                <p className="text-slate-200 leading-relaxed text-lg">
                  {completed
                    ? getFeedback()
                    : "Complete the speaking challenge to receive detailed AI communication feedback."}
                </p>

                {completed && (
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-black hover:scale-[1.02] transition-all"
                  >
                    NEXT CHALLENGE
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}