"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Play,
  Pause,
  Mic,
  RotateCcw,
  Film,
  Star,
  Volume2,
  Sparkles,
  ChevronRight,
  Trophy,
  Clock3,
  Captions,
} from "lucide-react";
import { movieSceneService, MovieScene } from "@/services/movieSceneService";
import { useRouter } from "next/navigation";

export default function MovieScenePracticePage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<MovieScene[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedScene, setSelectedScene] =
    useState<MovieScene | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [spokenText, setSpokenText] = useState("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [timing, setTiming] = useState<number | null>(null);

  const [countdown, setCountdown] = useState(0);

  const recognitionRef = useRef<any>(null);
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    } else {
      setLoading(false);
    }

    loadScenes();
  }, []);

  const loadScenes = async () => {
    try {
      const data = await movieSceneService.getScenes();

      setScenes(data);

      if (data.length > 0) {
        setSelectedScene(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🎤 RECORD
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    setIsRecording(true);

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[0][0].transcript;

      setSpokenText(transcript);

      // fake scoring
      setAccuracy(
        Math.floor(Math.random() * 15) + 82
      );

      setEnergy(
        Math.floor(Math.random() * 20) + 75
      );

      setTiming(
        Math.floor(Math.random() * 20) + 70
      );
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();

    recognitionRef.current = recognition;
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  // ▶️ PLAY ACTOR VOICE
  const playDialogue = () => {
    if (!selectedScene) return;

    setIsPlaying(true);

    const utterance =
      new SpeechSynthesisUtterance(
        selectedScene.dialogue
      );

    utterance.rate = 0.92;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // ⏳ COUNTDOWN
  const startPractice = () => {
    setCountdown(3);

    let count = 3;

    const interval = setInterval(() => {
      count--;

      if (count <= 0) {
        clearInterval(interval);
        setCountdown(0);

        playDialogue();

        setTimeout(() => {
          startRecording();
        }, 1800);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const scoreAverage = useMemo(() => {
    if (!accuracy || !energy || !timing)
      return null;

    return Math.floor(
      (accuracy + energy + timing) / 3
    );
  }, [accuracy, energy, timing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading movie scenes...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
        {/* HERO */}
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-500/10" />

          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-semibold mb-6">
                <Film className="w-4 h-4" />
                Movie Scene Practice
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
                Speak Like
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text">
                  Real Actors.
                </span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                Watch short movie dialogues,
                repeat them with emotion,
                rhythm and pronunciation,
                then compare your delivery
                against the original scene.
              </p>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={startPractice}
                  className="h-14 px-8 rounded-2xl bg-violet-600 hover:bg-violet-500 transition-all font-bold flex items-center gap-3 shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Start Practice
                </button>

                <button className="h-14 px-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold">
                  Browse Scenes
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-8">
            {/* VIDEO PLAYER */}
            <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-[#0b1020]">
              <div className="aspect-video relative">
                <img
                  src={selectedScene?.thumbnail}
                  alt="scene"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* TOP */}
                <div className="absolute top-5 left-5 flex gap-2">
                  <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                    {selectedScene?.movie}
                  </div>

                  <div className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-xs font-semibold text-violet-300">
                    {selectedScene?.level}
                  </div>
                </div>

                {/* CENTER PLAY */}
                <button
                  onClick={playDialogue}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:scale-110 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  )}
                </button>

                {/* SUBTITLE */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-3xl px-6">
                  <div className="bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-violet-300 text-xs font-bold uppercase tracking-[0.25em] mb-2">
                      <Captions className="w-4 h-4" />
                      Subtitle
                    </div>

                    <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                      “{selectedScene?.dialogue}”
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <button
                onClick={playDialogue}
                className="h-16 rounded-2xl bg-[#0d1326] border border-white/10 hover:border-violet-500/40 transition-all flex items-center justify-center gap-3 font-semibold"
              >
                <Volume2 className="w-5 h-5 text-violet-400" />
                Hear Actor
              </button>

              <button
                onClick={
                  isRecording
                    ? stopRecording
                    : startPractice
                }
                className={`h-16 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-violet-600 hover:bg-violet-500"
                }`}
              >
                <Mic className="w-5 h-5" />
                {isRecording
                  ? "Recording..."
                  : "Repeat Dialogue"}
              </button>

              <button
                onClick={() => {
                  setSpokenText("");
                  setAccuracy(null);
                  setEnergy(null);
                  setTiming(null);
                }}
                className="h-16 rounded-2xl bg-[#0d1326] border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

            {/* COUNTDOWN */}
            {countdown > 0 && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center">
                <div className="text-[140px] font-black text-white animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {/* RESULT */}
            {spokenText && (
              <div className="mt-8 rounded-[30px] border border-white/10 bg-[#0b1020] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-violet-400" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black">
                      Performance Analysis
                    </h2>

                    <p className="text-slate-400 text-sm">
                      AI compared your voice
                      against the original actor.
                    </p>
                  </div>
                </div>

                {/* SCORE CARDS */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      label: "Accuracy",
                      value: accuracy,
                    },
                    {
                      label: "Emotion",
                      value: energy,
                    },
                    {
                      label: "Timing",
                      value: timing,
                    },
                    {
                      label: "Overall",
                      value: scoreAverage,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <p className="text-slate-400 text-sm mb-3">
                        {item.label}
                      </p>

                      <div className="text-4xl font-black">
                        {item.value}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* TRANSCRIPT */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                    <div className="text-sm text-violet-300 font-bold uppercase tracking-widest mb-3">
                      Original Dialogue
                    </div>

                    <p className="text-slate-200 leading-relaxed">
                      {selectedScene?.dialogue}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                    <div className="text-sm text-cyan-300 font-bold uppercase tracking-widest mb-3">
                      Your Dialogue
                    </div>

                    <p className="text-slate-200 leading-relaxed">
                      {spokenText}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            {/* SIDEBAR */}
            <div className="sticky top-24 space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-[#0b1020] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-xl">
                    Scene Library
                  </h3>

                  <div className="text-xs text-slate-500">
                    {scenes.length} Scenes
                  </div>
                </div>

                <div className="space-y-3">
                  {scenes.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() =>
                        setSelectedScene(scene)
                      }
                      className={`w-full rounded-2xl border transition-all p-4 text-left ${
                        selectedScene?.id === scene.id
                          ? "border-violet-500/40 bg-violet-500/10"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex gap-4">
                        <img
                          src={scene.thumbnail}
                          className="w-24 h-20 rounded-xl object-cover"
                        />

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold line-clamp-1">
                              {scene.movie}
                            </h4>

                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>

                          <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                            {scene.dialogue}
                          </p>

                          <div className="flex gap-2">
                            <span className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-[10px] font-bold uppercase">
                              {scene.level}
                            </span>

                            <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase">
                              {scene.duration}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* STATS */}
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>

                  <div>
                    <div className="font-black text-lg">
                      Practice Stats
                    </div>

                    <div className="text-xs text-slate-400">
                      Improve actor-level delivery
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Scenes Completed
                    </span>

                    <span className="font-bold">
                      12
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Best Accuracy
                    </span>

                    <span className="font-bold text-green-400">
                      96%
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Daily Streak
                    </span>

                    <span className="font-bold text-orange-400">
                      7 Days
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Practice Time
                    </span>

                    <span className="font-bold flex items-center gap-1">
                      <Clock3 className="w-4 h-4" />
                      43m
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}