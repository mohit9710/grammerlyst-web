"use client";

import { fetchMyPlan } from "@/services/purchaseService";
import {
  fetchListeningAudios,
  ListeningAudio,
} from "@/services/listeningService";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

  const [
    selectedAccent,
    setSelectedAccent,
  ] = useState<
    "en-IN" | "en-US" | "en-GB"
  >("en-IN");

  const [micSupported, setMicSupported] =
    useState(true);

  // =========================================
  // REFS
  // =========================================

  const recognitionRef = useRef<any>(null);

  const isListeningRef =
    useRef(false);

  const isSpacePressedRef =
    useRef(false);

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );

  // =========================================
  // CURRENT QUESTION
  // =========================================

  const currentQuestion =
    listeningQuestions[currentIndex];

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
  // PLAY AUDIO
  // =========================================

  const handlePlayAudio = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.load();

      await audioRef.current.play();

      setPlayCount((prev) => prev + 1);
    } catch (err) {
      console.error(
        "Audio playback failed:",
        err
      );
    }
  };

  const getGoogleDriveDirectUrl = (
    url: string
  ) => {
    if (
      url.includes("drive.google.com")
    ) {
      const match = url.match(
        /\/d\/(.*?)\//
      );

      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }

    return url;
  };

  // =========================================
  // CHECK ANSWER
  // =========================================

  const handleCheckAnswer = () => {
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
  };

  // =========================================
  // NEXT AUDIO
  // =========================================

  const handleNext = () => {
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

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* HEADER */}

        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-3">
                Listening Arena
              </h1>

              <p className="text-slate-500 max-w-2xl">
                Improve your
                listening skills by
                hearing real English
                conversations and
                typing or speaking
                exactly what you
                hear.
              </p>
            </div>

            {/* ACCENT */}

            <select
              value={
                selectedAccent
              }
              onChange={(e) =>
                setSelectedAccent(
                  e.target
                    .value as any
                )
              }
              className="border border-slate-200 bg-white rounded-2xl px-4 py-3 font-semibold shadow-sm"
            >
              <option value="en-IN">
                🇮🇳 Indian Accent
              </option>

              <option value="en-US">
                🇺🇸 American Accent
              </option>

              <option value="en-GB">
                🇬🇧 British Accent
              </option>
            </select>
          </div>
        </div>

        {/* TOP CARD */}

        <div className="bg-white border rounded-[2rem] p-8 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex gap-3 mb-4 flex-wrap">
                <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                  {
                    currentQuestion.difficulty
                  }
                </span>

                <span className="px-4 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wide">
                  {
                    currentQuestion.category
                  }
                </span>

                {isLocked && (
                  <span className="px-4 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide">
                    Pro Required
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-black text-slate-900">
                {
                  currentQuestion.title
                }
              </h2>
            </div>

            {!isLocked && (
              <button
                onClick={
                  handlePlayAudio
                }
                className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
              >
                ▶ Play Audio
              </button>
            )}
          </div>

          <audio
            ref={audioRef}
            controls
            preload="metadata"
            className="hidden"
          >
            <source
              src={getGoogleDriveDirectUrl(
                currentQuestion.audio_url
              )}
              type="audio/mpeg"
            />
          </audio>
        </div>

        {/* GRID */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}

          <div className="lg:col-span-2 bg-white border rounded-[2rem] p-8 shadow-sm">
            <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Type or Speak What
                  You Heard
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  {micSupported
                    ? "Hold SPACE (outside the box) to speak • Release SPACE to stop • Click inside the box to type normally"
                    : "Speech recognition not supported in this browser"}
                </p>
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Audio Played:{" "}
                {playCount} times
              </div>
            </div>

            {isListening && (
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-500">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                Listening… release
                SPACE to stop
              </div>
            )}

            <textarea
              value={userAnswer}
              onChange={(e) =>
                setUserAnswer(
                  e.target.value
                )
              }
              placeholder="Click here and type, or hold SPACE outside this box to speak..."
              className="w-full h-52 border border-slate-200 rounded-2xl p-6 outline-none focus:ring-4 focus:ring-blue-100 resize-none text-lg"
            />

            <div className="flex flex-wrap gap-4 mt-6">
              {isLocked ? (
                <button
                  onClick={() =>
                    router.push(
                      "/pricing"
                    )
                  }
                  className="w-full h-14 bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 transition-all text-white rounded-2xl font-black shadow-lg flex items-center justify-center text-lg"
                >
                  🔒 Upgrade to
                  Pro
                </button>
              ) : (
                <>
                  <button
                    onClick={
                      handleCheckAnswer
                    }
                    className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold"
                  >
                    Check Answer
                  </button>

                  <button
                    onClick={
                      handleNext
                    }
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold"
                  >
                    Next Challenge
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* SCORE */}

            <div className="bg-white border rounded-[2rem] p-8 shadow-sm text-center">
              <p className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4">
                Listening Accuracy
              </p>

              <div className="text-7xl font-black text-blue-600">
                {score !== null
                  ? `${score}%`
                  : "--"}
              </div>
            </div>

            {/* ANSWER */}

            {showAnswer && (
              <div className="bg-white border rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-xl font-black mb-4">
                  Correct Transcript
                </h3>

                <p className="text-slate-700 leading-relaxed mb-6">
                  {
                    currentQuestion.transcript
                  }
                </p>

                <div>
                  <p className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">
                    Missed Words
                  </p>

                  <div className="flex flex-wrap gap-2">
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
                            className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {word}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-green-600 font-bold">
                        Perfect
                        Listening 🎉
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI FEEDBACK */}

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl">
              <h3 className="text-2xl font-black mb-5">
                AI Feedback
              </h3>

              <div className="space-y-4 text-blue-100">
                <div className="flex gap-3">
                  <span>🎧</span>

                  <p>
                    Focus on
                    connected speech
                    and native
                    pronunciation.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span>⚡</span>

                  <p>
                    Replay the audio
                    only 2-3 times
                    for better
                    listening growth.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span>🚀</span>

                  <p>
                    Daily listening
                    improves
                    real-time English
                    comprehension.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span>🎤</span>

                  <p>
                    Speaking your
                    answer aloud
                    helps improve
                    both listening
                    and pronunciation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}