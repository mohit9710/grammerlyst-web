"use client";

import { fetchMyPlan } from "@/services/purchaseService";
import {
  fetchListeningAudios,
  ListeningAudio,
} from "@/services/listeningService";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAttempt } from "@/services/reportAnalysis";

const cleanText = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .trim();
};

const calculateAccuracy = (
  original: string,
  typed: string
) => {
  const originalWords =
    cleanText(original).split(/\s+/);

  const typedWords =
    cleanText(typed).split(/\s+/);

  let matched = 0;

  const map = new Map<string, number>();

  originalWords.forEach((word) => {
    map.set(
      word,
      (map.get(word) || 0) + 1
    );
  });

  typedWords.forEach((word) => {
    if (
      map.has(word) &&
      (map.get(word) || 0) > 0
    ) {
      matched++;

      map.set(
        word,
        (map.get(word) || 0) - 1
      );
    }
  });

  return Math.round(
    (matched / originalWords.length) * 100
  );
};

export default function ListeningPractice() {
  const router = useRouter();

  // =========================================
  // STATES
  // =========================================

  const [plan, setPlan] =
    useState<any>(null);

  const [planLoading, setPlanLoading] =
    useState(true);

  const [
    listeningQuestions,
    setListeningQuestions,
  ] = useState<ListeningAudio[]>([]);

  const [loadingAudios, setLoadingAudios] =
    useState(true);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [userAnswer, setUserAnswer] =
    useState("");

  const [score, setScore] = useState<
    number | null
  >(null);

  const [showAnswer, setShowAnswer] =
    useState(false);

  const [missedWords, setMissedWords] =
    useState<string[]>([]);

  const [playCount, setPlayCount] =
    useState(0);

  const [isListening, setIsListening] =
    useState(false);

  const [micSupported, setMicSupported] =
    useState(true);

  const [savingAttempt, setSavingAttempt] =
    useState(false);

  // =========================================
  // REFS
  // =========================================

  const recognitionRef = useRef<any>(null);

  const isListeningRef =
    useRef(false);

  const isSpacePressedRef =
    useRef(false);

  const speechRef =
    useRef<SpeechSynthesisUtterance | null>(
      null
    );

  // =========================================
  // CURRENT QUESTION
  // =========================================

  const currentQuestion =
    listeningQuestions[currentIndex];

  const selectedAccent =
    currentQuestion?.accent || "en-US";

  const isLocked = !plan?.active;

  // =========================================
  // SEO
  // =========================================

  useEffect(() => {
    document.title =
      "Listening Practice | Improve English Listening Skills";

    let metaDesc =
      document.querySelector(
        'meta[name="description"]'
      );

    if (!metaDesc) {
      metaDesc =
        document.createElement("meta");

      metaDesc.setAttribute(
        "name",
        "description"
      );

      document.head.appendChild(
        metaDesc
      );
    }

    metaDesc.setAttribute(
      "content",
      "Practice English listening with AI-powered exercises, speech recognition, voice typing, and accent-based learning."
    );
  }, []);

  // =========================================
  // LOAD AUDIOS
  // =========================================

  useEffect(() => {
    const loadAudios = async () => {
      try {
        const data =
          await fetchListeningAudios();

        setListeningQuestions(data);
      } catch (err) {
        console.error(
          "Audio fetch error:",
          err
        );
      } finally {
        setLoadingAudios(false);
      }
    };

    loadAudios();
  }, []);

  // =========================================
  // LOAD PLAN
  // =========================================

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const data =
          await fetchMyPlan();

        setPlan(data);
      } catch (err) {
        console.error(
          "Plan fetch error:",
          err
        );

        setPlan({
          active: false,
        });
      } finally {
        setPlanLoading(false);
      }
    };

    loadPlan();
  }, []);

  // =========================================
  // RESET QUESTION
  // =========================================

  useEffect(() => {
    setUserAnswer("");
    setScore(null);
    setShowAnswer(false);
    setMissedWords([]);
    setPlayCount(0);
  }, [currentIndex]);

  // =========================================
  // SPEECH RECOGNITION
  // =========================================

  useEffect(() => {
    if (typeof window === "undefined")
      return;

    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang =
      selectedAccent;

    recognition.onresult = (
      event: any
    ) => {
      let finalTranscript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        finalTranscript +=
          event.results[i][0]
            .transcript + " ";
      }

      setUserAnswer(finalTranscript);
    };

    recognition.onstart = () => {
      setIsListening(true);

      isListeningRef.current =
        true;
    };

    recognition.onend = () => {
      setIsListening(false);

      isListeningRef.current =
        false;
    };

    recognition.onerror = () => {
      setIsListening(false);

      isListeningRef.current =
        false;
    };

    recognitionRef.current =
      recognition;

    return () => {
      recognition.stop();
    };
  }, [selectedAccent]);

  // =========================================
  // SPACE HOLD
  // =========================================

  useEffect(() => {
    const isTypingElement = () => {
      const active =
        document.activeElement;

      return (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName ===
            "TEXTAREA" ||
          (active as HTMLElement)
            .isContentEditable)
      );
    };

    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.code !== "Space") return;

      if (isTypingElement()) return;

      e.preventDefault();

      if (
        isSpacePressedRef.current
      )
        return;

      isSpacePressedRef.current =
        true;

      startListening();
    };

    const handleKeyUp = (
      e: KeyboardEvent
    ) => {
      if (e.code !== "Space") return;

      if (isTypingElement()) return;

      e.preventDefault();

      isSpacePressedRef.current =
        false;

      stopListening();
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );
    };
  }, []);

  // =========================================
  // START LISTENING
  // =========================================

  const startListening = () => {
    if (!recognitionRef.current)
      return;

    if (isListeningRef.current)
      return;

    try {
      recognitionRef.current.lang =
        selectedAccent;

      recognitionRef.current.start();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================
  // STOP LISTENING
  // =========================================

  const stopListening = () => {
    if (
      recognitionRef.current &&
      isListeningRef.current
    ) {
      recognitionRef.current.stop();
    }
  };

  // =========================================
  // PLAY AUDIO USING TTS
  // =========================================

  const handlePlayAudio = () => {
    if (
      typeof window === "undefined" ||
      !currentQuestion
    )
      return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        currentQuestion.transcript
      );

    utterance.lang =
      currentQuestion.accent ||
      "en-US";

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const matchedVoice =
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .includes(
            currentQuestion.accent.toLowerCase()
          )
      );

    if (matchedVoice) {
      utterance.voice =
        matchedVoice;
    }

    speechRef.current =
      utterance;

    window.speechSynthesis.speak(
      utterance
    );

    setPlayCount((prev) => prev + 1);
  };

  // =========================================
  // CLEANUP
  // =========================================

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // =========================================
  // CHECK ANSWER + SAVE ATTEMPT
  // =========================================

  const handleCheckAnswer = async () => {
    if (!currentQuestion) return;

    const accuracy =
      calculateAccuracy(
        currentQuestion.transcript,
        userAnswer
      );

    setScore(accuracy);

    setShowAnswer(true);

    const originalWords =
      cleanText(
        currentQuestion.transcript
      ).split(/\s+/);

    const typedWords =
      cleanText(userAnswer).split(
        /\s+/
      );

    const missed =
      originalWords.filter(
        (word) =>
          !typedWords.includes(word)
      );

    setMissedWords(missed);

    try {
      const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;


        if (!token) {
          console.log("No token found");
          return;
        }

        const payload = {
          exercise_type: "listening",

          question:
            currentQuestion.title || "",

          user_answer: userAnswer || "",

          corrected_answer:
            currentQuestion.transcript || "",

          ai_feedback:
            accuracy >= 90
              ? "Excellent listening skills."
              : accuracy >= 70
              ? "Good attempt. Focus more on connected speech."
              : "Practice more carefully and replay less frequently.",

          accuracy_score: accuracy,

          grammar_score: accuracy,

          vocabulary_score: accuracy,

          confidence_score:
            accuracy >= 80 ? 90 : 70,

          xp_earned:
            accuracy >= 90
              ? 20
              : accuracy >= 70
              ? 15
              : 10,

          duration_seconds:
            currentQuestion.duration || 10,
        };

        console.log(
          "SAVE ATTEMPT PAYLOAD =>",
          payload
        );

        const response =
          await saveAttempt(
            token,
            payload
          );

        console.log(
          "SAVE ATTEMPT SUCCESS =>",
          response
        );
    } catch (err) {
      console.error(
        "Save attempt error:",
        err
      );
    } finally {
      setSavingAttempt(false);
    }
  };

  // =========================================
  // NEXT AUDIO
  // =========================================

  const handleNext = () => {
    window.speechSynthesis.cancel();

    if (
      currentIndex <
      listeningQuestions.length - 1
    ) {
      setCurrentIndex(
        (prev) => prev + 1
      );
    } else {
      setCurrentIndex(0);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (
    planLoading ||
    loadingAudios
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-3xl shadow border">
          <p className="text-slate-600 font-semibold">
            Loading listening
            practice...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // NO AUDIOS
  // =========================================

  if (
    listeningQuestions.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-3xl shadow border">
          <p className="text-slate-600 font-semibold">
            No listening audios found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/20 blur-[140px] rounded-full" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* HERO */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-widest">
                AI Listening Lab
              </span>

              <span className="px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/20 text-orange-300 text-xs font-bold uppercase tracking-widest">
                🔥 Daily Practice
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-5">
              Listening
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Arena
              </span>
            </h1>

            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
              Train your ears with real-world English conversations.
            </p>
          </div>

          {/* ACCENT */}

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5 min-w-[280px]">
            <p className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3">
              Audio Accent
            </p>

            <div className="h-[58px] px-5 rounded-2xl bg-white/10 border border-white/10 flex items-center text-lg font-bold">
              {currentQuestion.accent ===
                "en-IN" &&
                "🇮🇳 Indian Accent"}

              {currentQuestion.accent ===
                "en-US" &&
                "🇺🇸 American Accent"}

              {currentQuestion.accent ===
                "en-GB" &&
                "🇬🇧 British Accent"}
            </div>
          </div>
        </div>

        {/* AUDIO HERO */}

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl p-8 lg:p-10 mb-8">

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

            <div>
              <div className="flex gap-3 mb-5 flex-wrap">
                <span className="px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
                  {currentQuestion.difficulty}
                </span>

                <span className="px-4 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-500/20">
                  {currentQuestion.category}
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black mb-5 leading-tight">
                {currentQuestion.title}
              </h2>

              <div className="flex items-center gap-6 mt-8 flex-wrap">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">
                    Audio Plays
                  </p>

                  <p className="text-3xl font-black">
                    {playCount}
                  </p>
                </div>

                <div className="h-12 w-px bg-white/10" />

                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">
                    Accuracy
                  </p>

                  <p className="text-3xl font-black text-cyan-400">
                    {score !== null
                      ? `${score}%`
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            {!isLocked && (
              <div className="flex flex-col items-center">
                <button
                  onClick={handlePlayAudio}
                  className="group relative w-36 h-36 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.4)] hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" />

                  <span className="text-5xl ml-2 group-hover:scale-110 transition-transform">
                    ▶
                  </span>
                </button>

                <p className="mt-5 text-slate-400 font-semibold">
                  Tap to Play Audio
                </p>
              </div>
            )}
          </div>
        </div>

        {/* MAIN */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">

                <div>
                  <h3 className="text-3xl font-black mb-2">
                    Type or Speak
                  </h3>

                  <p className="text-slate-400">
                    {micSupported
                      ? "Hold SPACE outside the box to speak."
                      : "Speech recognition not supported"}
                  </p>
                </div>

                {isListening && (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />

                    <span className="font-bold text-red-300">
                      Listening...
                    </span>
                  </div>
                )}
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) =>
                  setUserAnswer(
                    e.target.value
                  )
                }
                placeholder="Type what you heard..."
                className="w-full h-64 rounded-[2rem] bg-white/5 border border-white/10 outline-none resize-none p-6 text-lg text-white placeholder:text-slate-500"
              />

              <div className="flex flex-wrap gap-4 mt-6">

                <button
                  onClick={
                    handleCheckAnswer
                  }
                  disabled={
                    savingAttempt
                  }
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all px-8 py-4 rounded-2xl font-black"
                >
                  {savingAttempt
                    ? "Saving..."
                    : "Check Answer"}
                </button>

                <button
                  onClick={handleNext}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all"
                >
                  Next Challenge
                </button>
              </div>
            </div>

            {/* TRANSCRIPT */}

            {showAnswer && (
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8">

                <h3 className="text-2xl font-black mb-5">
                  Correct Transcript
                </h3>

                <div className="bg-black/20 border border-white/5 rounded-3xl p-6 text-slate-200 leading-relaxed text-lg mb-8">
                  {currentQuestion.transcript}
                </div>

                <div>
                  <p className="text-sm uppercase tracking-widest font-bold text-red-300 mb-4">
                    Missed Words
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {missedWords.length >
                    0 ? (
                      missedWords.map(
                        (
                          word,
                          index
                        ) => (
                          <span
                            key={
                              index
                            }
                            className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 font-semibold"
                          >
                            {word}
                          </span>
                        )
                      )
                    ) : (
                      <span className="px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-300 font-bold">
                        🎉 Perfect Listening
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}

          <div className="space-y-8">

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 text-center">

              <p className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-6">
                Listening Accuracy
              </p>

              <div className="text-6xl font-black text-cyan-400">
                {score !== null
                  ? `${score}%`
                  : "--"}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}