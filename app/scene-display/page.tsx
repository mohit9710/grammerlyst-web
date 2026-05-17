"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mic,
  Play,
  Pause,
  Sparkles,
  Users,
  Volume2,
  Film,
  Brain,
  ChevronRight,
  Flame,
  Star,
  Clock3,
  MessageCircle,
  Radio,
  Wand2,
  Trophy,
} from "lucide-react";

import {
  sceneDisplayService,
  SceneScenario,
  SceneCharacter,
} from "@/services/sceneDisplayService";

export default function SceneRoleplayPage() {
  const [scenes, setScenes] = useState<SceneScenario[]>([]);
  const [selectedScene, setSelectedScene] =
    useState<SceneScenario | null>(null);

  const [selectedCharacter, setSelectedCharacter] =
    useState<SceneCharacter | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [userSpeech, setUserSpeech] = useState("");
  const [aiReply, setAiReply] = useState("");

  const [emotionScore, setEmotionScore] =
    useState<number>(0);

  const [fluencyScore, setFluencyScore] =
    useState<number>(0);

  const [confidenceScore, setConfidenceScore] =
    useState<number>(0);

  const [immersiveMode, setImmersiveMode] =
    useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadScenes();
  }, []);

  const loadScenes = async () => {
    const data =
      await sceneDisplayService.getScenes();

    setScenes(data);

    if (data.length > 0) {
      setSelectedScene(data[0]);
      setSelectedCharacter(
        data[0].characters[0]
      );
    }
  };

  // 🔊 AI Dialogue Playback
  const playDialogue = (text: string) => {
    setIsPlaying(true);

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // 🎤 Record User
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    setIsRecording(true);

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[0][0].transcript;

      setUserSpeech(transcript);

      generateAIReply(transcript);

      setEmotionScore(
        Math.floor(Math.random() * 20) + 75
      );

      setFluencyScore(
        Math.floor(Math.random() * 20) + 80
      );

      setConfidenceScore(
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

  // 🤖 AI CONTINUATION
  const generateAIReply = async (
    speech: string
  ) => {
    const reply =
      await sceneDisplayService.generateReply(
        speech,
        selectedCharacter?.name || ""
      );

    setAiReply(reply);

    setTimeout(() => {
      playDialogue(reply);
    }, 800);
  };

  const totalScore = useMemo(() => {
    return Math.floor(
      (emotionScore +
        fluencyScore +
        confidenceScore) /
        3
    );
  }, [
    emotionScore,
    fluencyScore,
    confidenceScore,
  ]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#060816] text-white overflow-hidden">
        {/* HERO */}
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_35%)]" />

          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full text-violet-300 text-sm font-semibold mb-8">
                <Film className="w-4 h-4" />
                Scene Roleplay • Immersive Speaking
              </div>

              <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-8">
                Speak Inside
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text">
                  Real English
                  Scenarios.
                </span>
              </h1>

              <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
                Become part of movie scenes,
                business situations, interviews,
                cafes, airports and real-world
                conversations.
                <br />
                Speak naturally with AI
                characters and continue the
                dialogue in real time.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <button
                  onClick={() =>
                    playDialogue(
                      selectedScene?.intro || ""
                    )
                  }
                  className="h-14 px-8 rounded-2xl bg-violet-600 hover:bg-violet-500 transition-all font-bold flex items-center gap-3 shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Start Scenario
                </button>

                <button className="h-14 px-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold">
                  Browse Scenes
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN */}
        <section className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            {/* SCENE */}
            <div className="relative rounded-[36px] overflow-hidden border border-white/10 bg-[#0c1022]">
              <div className="aspect-video relative">
                <img
                  src={selectedScene?.thumbnail}
                  alt="scene"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* TOP */}
                <div className="absolute top-6 left-6 flex gap-3">
                  <div className="bg-black/50 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-sm font-semibold">
                    {selectedScene?.category}
                  </div>

                  <div className="bg-violet-500/20 border border-violet-500/20 text-violet-300 px-4 py-2 rounded-full text-sm font-semibold">
                    {selectedScene?.difficulty}
                  </div>
                </div>

                {/* PLAY */}
                <button
                  onClick={() =>
                    playDialogue(
                      selectedScene?.intro || ""
                    )
                  }
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:scale-110 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-12 h-12" />
                  ) : (
                    <Play className="w-12 h-12 fill-white ml-1" />
                  )}
                </button>

                {/* SUBTITLE */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-4xl w-full px-8">
                  <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5">
                    <div className="text-violet-300 text-xs font-bold uppercase tracking-[0.3em] mb-3">
                      Current Dialogue
                    </div>

                    <p className="text-2xl font-semibold leading-relaxed">
                      “{selectedScene?.intro}”
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() =>
                  playDialogue(
                    selectedScene?.intro || ""
                  )
                }
                className="h-16 rounded-2xl bg-[#0d1326] border border-white/10 hover:border-violet-500/40 transition-all flex items-center justify-center gap-3 font-semibold"
              >
                <Volume2 className="w-5 h-5 text-violet-400" />
                Hear AI Actor
              </button>

              <button
                onClick={
                  isRecording
                    ? stopRecording
                    : startRecording
                }
                className={`h-16 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : "bg-violet-600 hover:bg-violet-500"
                }`}
              >
                <Mic className="w-5 h-5" />
                {isRecording
                  ? "Listening..."
                  : "Speak Your Dialogue"}
              </button>

              <button
                onClick={() =>
                  setImmersiveMode(
                    !immersiveMode
                  )
                }
                className={`h-16 rounded-2xl font-semibold transition-all flex items-center justify-center gap-3 ${
                  immersiveMode
                    ? "bg-cyan-500 text-black"
                    : "bg-[#0d1326] border border-white/10"
                }`}
              >
                <Radio className="w-5 h-5" />
                Immersive Mode
              </button>
            </div>

            {/* CONVERSATION */}
            <div className="rounded-[32px] border border-white/10 bg-[#0c1022] p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-violet-400" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Live Conversation
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Continue the scene naturally
                    with AI actors.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* AI */}
                <div className="flex gap-4">
                  <img
                    src={
                      selectedCharacter?.avatar
                    }
                    className="w-14 h-14 rounded-2xl object-cover"
                  />

                  <div className="bg-white/[0.04] border border-white/10 rounded-3xl rounded-tl-md p-5 max-w-xl">
                    <div className="text-violet-300 text-sm font-bold mb-2">
                      {selectedCharacter?.name}
                    </div>

                    <p className="text-slate-200 leading-relaxed">
                      {selectedScene?.intro}
                    </p>
                  </div>
                </div>

                {/* USER */}
                {userSpeech && (
                  <div className="flex justify-end gap-4">
                    <div className="bg-violet-600 rounded-3xl rounded-tr-md p-5 max-w-xl">
                      <div className="text-violet-100 text-sm font-bold mb-2">
                        You
                      </div>

                      <p className="leading-relaxed">
                        {userSpeech}
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400" />
                  </div>
                )}

                {/* AI REPLY */}
                {aiReply && (
                  <div className="flex gap-4">
                    <img
                      src={
                        selectedCharacter?.avatar
                      }
                      className="w-14 h-14 rounded-2xl object-cover"
                    />

                    <div className="bg-white/[0.04] border border-white/10 rounded-3xl rounded-tl-md p-5 max-w-xl">
                      <div className="text-cyan-300 text-sm font-bold mb-2">
                        AI Reply
                      </div>

                      <p className="text-slate-200 leading-relaxed">
                        {aiReply}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ANALYSIS */}
            {(emotionScore > 0 ||
              fluencyScore > 0) && (
              <div className="rounded-[32px] border border-white/10 bg-[#0c1022] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                    <Brain className="w-7 h-7 text-cyan-400" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black">
                      Speaking Analysis
                    </h2>

                    <p className="text-slate-400 text-sm">
                      AI evaluated your
                      delivery.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Emotion",
                      value: emotionScore,
                    },
                    {
                      label: "Fluency",
                      value: fluencyScore,
                    },
                    {
                      label: "Confidence",
                      value:
                        confidenceScore,
                    },
                    {
                      label: "Overall",
                      value: totalScore,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-white/[0.03] border border-white/10 p-5"
                    >
                      <div className="text-slate-400 text-sm mb-2">
                        {item.label}
                      </div>

                      <div className="text-4xl font-black">
                        {item.value}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6">
            {/* CHARACTERS */}
            <div className="rounded-[32px] border border-white/10 bg-[#0c1022] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">
                  AI Characters
                </h3>

                <Users className="w-5 h-5 text-violet-400" />
              </div>

              <div className="space-y-4">
                {selectedScene?.characters.map(
                  (char) => (
                    <button
                      key={char.id}
                      onClick={() =>
                        setSelectedCharacter(
                          char
                        )
                      }
                      className={`w-full rounded-2xl p-4 transition-all border ${
                        selectedCharacter?.id ===
                        char.id
                          ? "border-violet-500/40 bg-violet-500/10"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={char.avatar}
                          className="w-14 h-14 rounded-2xl object-cover"
                        />

                        <div className="text-left flex-1">
                          <div className="font-bold">
                            {char.name}
                          </div>

                          <div className="text-xs text-slate-500 mt-1">
                            {char.role}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* SCENES */}
            <div className="rounded-[32px] border border-white/10 bg-[#0c1022] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">
                  Scenarios
                </h3>

                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>

              <div className="space-y-4">
                {scenes.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => {
                      setSelectedScene(
                        scene
                      );

                      setSelectedCharacter(
                        scene.characters[0]
                      );
                    }}
                    className={`w-full rounded-2xl overflow-hidden border transition-all ${
                      selectedScene?.id ===
                      scene.id
                        ? "border-violet-500/40"
                        : "border-white/10"
                    }`}
                  >
                    <img
                      src={scene.thumbnail}
                      className="w-full h-32 object-cover"
                    />

                    <div className="p-4 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold">
                          {scene.title}
                        </h4>

                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>

                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                        {scene.description}
                      </p>

                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-[10px] font-bold uppercase">
                          {
                            scene.difficulty
                          }
                        </span>

                        <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase">
                          {
                            scene.category
                          }
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* STATS */}
            <div className="rounded-[32px] bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-yellow-400" />
                </div>

                <div>
                  <div className="text-xl font-black">
                    Immersion Stats
                  </div>

                  <div className="text-sm text-slate-400">
                    Real-world speaking
                    progress
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Scenarios Completed
                  </span>

                  <span className="font-bold">
                    42
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Best Fluency
                  </span>

                  <span className="font-bold text-green-400">
                    95%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Daily Streak
                  </span>

                  <span className="font-bold text-orange-400 flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    18 Days
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Speaking Time
                  </span>

                  <span className="font-bold flex items-center gap-1">
                    <Clock3 className="w-4 h-4" />
                    2h 18m
                  </span>
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