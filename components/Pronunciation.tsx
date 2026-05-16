"use client";

import { useState, useEffect } from "react";
import { fetchPronunciation } from "@/services/pronunciationService";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/userProfile";

interface TextData {
  id: number;
  content: string;
  difficulty_level: string;
  category: string;
  created_at: string;
}

interface Props {
  plan: any;

  onComplete?: (result: any) => void;

  onTextChange?: (
    text: TextData | null
  ) => void;
}

const calculateAccuracy = (
  original: string,
  spoken: string
): number => {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .trim();

  const s1Words = clean(original).split(/\s+/);
  const s2Words = clean(spoken).split(/\s+/);

  let commonCount = 0;

  const map = new Map<string, number>();

  s1Words.forEach((w) =>
    map.set(w, (map.get(w) || 0) + 1)
  );

  s2Words.forEach((w) => {
    if (
      map.has(w) &&
      (map.get(w) as number) > 0
    ) {
      commonCount++;

      map.set(
        w,
        (map.get(w) as number) - 1
      );
    }
  });

  return s1Words.length
    ? Math.round(
        (commonCount / s1Words.length) * 100
      )
    : 0;
};

export default function Pronunciation({
  plan,
  onComplete,
}: Props) {
  const [textData, setTextData] =
    useState<TextData | null>(null);

  const [userSpokenText, setUserSpokenText] =
    useState("");

  const [accuracy, setAccuracy] =
    useState<number | null>(null);

  const [isRecording, setIsRecording] =
    useState(false);

  const [recognition, setRecognition] =
    useState<any>(null);

  const { isAuth, loading } = useUser();

  const router = useRouter();

  const isLocked = !plan?.active;

  const fetchNewText = async () => {
    setAccuracy(null);

    setUserSpokenText("");

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(
            "access_token"
          ) || ""
        : "";

    if (!token)
      return router.replace("/auth/login");

    try {
      const data: unknown =
        await fetchPronunciation(token);

      if (
        Array.isArray(data) &&
        data.length > 0
      ) {
        setTextData(data[0] as TextData);
      } else if (
        data &&
        typeof data === "object" &&
        "content" in data
      ) {
        setTextData(data as TextData);
      } else {
        setTextData(null);
      }
    } catch (error) {
      console.error(
        "Error fetching text:",
        error
      );

      setTextData(null);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!isAuth) {
      router.replace("/auth/login");
      return;
    }

    fetchNewText();

    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any)
          .SpeechRecognition ||
        (window as any)
          .webkitSpeechRecognition;

      if (!SpeechRecognition) return;

      const rec = new SpeechRecognition();

      rec.continuous = true;

      rec.interimResults = true;

      rec.lang = "en-IN";

      rec.onresult = (event: any) => {
        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          transcript +=
            event.results[i][0].transcript;
        }

        setUserSpokenText(transcript);
      };

      rec.onerror = () =>
        setIsRecording(false);

      rec.onend = () =>
        setIsRecording(false);

      setRecognition(rec);
    }
  }, [loading, isAuth]);

  const toggleRecording = async () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();

      setIsRecording(false);

      if (textData?.content) {
        const finalAccuracy =
          calculateAccuracy(
            textData.content,
            userSpokenText
          );

        setAccuracy(finalAccuracy);

        if (onComplete) {
          await onComplete({
            exercise_typee: "pronunciation",

            original_text:
              textData.content,

            transcript:
              userSpokenText,

            corrected_text:
              textData.content,

            feedback:
              finalAccuracy >= 90
                ? "Excellent pronunciation"
                : finalAccuracy >= 70
                ? "Good pronunciation"
                : "Needs improvement",

            accuracy_score:
              finalAccuracy,

            grammar_score:
              finalAccuracy,

            pronunciation_score:
              finalAccuracy,

            fluency_score:
              Math.max(
                finalAccuracy - 5,
                0
              ),

            vocabulary_score: 80,

            listening_score: 75,

            verb_score: 70,

            confidence_score:
              finalAccuracy >= 80
                ? 85
                : 60,

            speaking_speed: 120,

            pause_count: 2,

            filler_word_count: 1,

            xp_earned:
              Math.floor(
                finalAccuracy / 5
              ),

            duration_seconds: 60,
          });
        }
      }
    } else {
      setUserSpokenText("");

      setAccuracy(null);

      try {
        recognition.start();

        setIsRecording(true);
      } catch {}
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-cyan-500/20 blur-3xl rounded-full" />

      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-violet-500/20 blur-3xl rounded-full" />

      {/* SEO */}
      <div className="sr-only">
        <h1>
          English Pronunciation Practice
        </h1>

        <p>
          Practice sentence:
          {textData?.content}
        </p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* HEADER */}
        <div className="mb-8 lg:mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="uppercase tracking-[0.25em] text-cyan-400 text-xs font-bold mb-3">
              AI SPEAKING TRAINER
            </p>

            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Pronunciation Lab
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl text-sm md:text-base">
              Improve your English
              pronunciation with live AI
              speech recognition and
              instant accuracy analysis.
            </p>
          </div>

          <button
            onClick={fetchNewText}
            disabled={loading}
            className="h-fit px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-cyan-400/40 transition-all font-semibold disabled:opacity-50"
          >
            New Practice Text
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="xl:col-span-2 space-y-6">
            {/* READING CARD */}
            <div className="rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 md:p-10 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold mb-2">
                    Practice Sentence
                  </p>

                  <h2 className="text-xl md:text-2xl font-black">
                    Read Clearly & Naturally
                  </h2>
                </div>

                <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-bold uppercase">
                  {textData?.difficulty_level ||
                    "Loading"}
                </div>
              </div>

              <div className="min-h-[260px] md:min-h-[320px] flex items-center justify-center rounded-[2rem] bg-[#0d1324] border border-white/5 p-6 md:p-10">
                {loading ? (
                  <div className="text-slate-400 animate-pulse">
                    Loading practice text...
                  </div>
                ) : (
                  <p className="text-2xl md:text-4xl leading-relaxed font-bold text-center max-w-4xl">
                    {textData?.content ||
                      "No text available"}
                  </p>
                )}
              </div>
            </div>

            {/* TRANSCRIPTION */}
            <div className="rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-400 font-bold mb-2">
                    Live AI Detection
                  </p>

                  <h3 className="text-2xl font-black">
                    Your Speech
                  </h3>
                </div>

                {isRecording && (
                  <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    Recording
                  </div>
                )}
              </div>

              <div className="min-h-[180px] rounded-[1.5rem] bg-[#0d1324] border border-white/5 p-6 text-slate-300 italic leading-relaxed">
                {userSpokenText ||
                  (isRecording
                    ? "Listening to your voice..."
                    : "Your spoken text will appear here...")}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* ACTION CARD */}
            <div className="rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 md:p-8 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-2xl mb-6">
                🎤
              </div>

              <h3 className="text-2xl font-black mb-3">
                Voice Practice
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Start reading the sentence
                aloud and get real-time AI
                pronunciation analysis.
              </p>

              <button
                disabled={
                  loading || !recognition
                }
                onClick={() => {
                  if (isLocked) {
                    router.push(
                      "/pricing"
                    );

                    return;
                  }

                  toggleRecording();
                }}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 ${
                  isLocked
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-[1.02]"
                }`}
              >
                {isLocked
                  ? "Upgrade to Pro 🔒"
                  : isRecording
                  ? "Stop & Analyze"
                  : "Start Reading"}
              </button>
            </div>

            {/* ACCURACY CARD */}
            <div className="rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 md:p-8 shadow-2xl">
              <p className="uppercase tracking-[0.2em] text-cyan-400 text-xs font-bold mb-4">
                Accuracy Score
              </p>

              {accuracy !== null ? (
                <>
                  <div className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {accuracy}%
                  </div>

                  <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full ${
                        accuracy >= 85
                          ? "bg-green-500"
                          : accuracy >= 70
                          ? "bg-cyan-500"
                          : accuracy >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${accuracy}%`,
                      }}
                    />
                  </div>

                  <p className="text-slate-300 text-sm">
                    {accuracy >= 90
                      ? "Excellent pronunciation!"
                      : accuracy >= 70
                      ? "Good job, keep practicing."
                      : "Practice more for better fluency."}
                  </p>
                </>
              ) : (
                <div className="text-slate-500 text-sm leading-relaxed">
                  Complete one speaking
                  session to view your AI
                  pronunciation score.
                </div>
              )}
            </div>

            {/* QUICK TIPS */}
            <div className="rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-400/10 p-6 md:p-8 backdrop-blur-xl">
              <h3 className="text-xl font-black mb-5">
                Speaking Tips
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex gap-3">
                  <span>🎧</span>
                  <p>
                    Speak slowly and clearly
                    for better detection.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span>🗣️</span>
                  <p>
                    Focus on word stress and
                    pronunciation.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span>🚀</span>
                  <p>
                    Practice daily to improve
                    fluency and confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}