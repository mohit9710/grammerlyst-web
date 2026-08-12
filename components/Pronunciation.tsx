"use client";

import { useState, useEffect, useRef } from "react";
import "../styles/pronunciation.css";
import {
  fetchPronunciation,
  uploadPronunciationAudio,
} from "@/services/pronunciationService";
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

interface Analysis {
  pronunciation_score: number;
  fluency_score: number;
  grammar_score: number;
  confidence_score: number;
  speaking_speed: number;
  feedback: string;
  mistakes: string[];
  improvements: string[];
}

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

  const [mediaRecorder, setMediaRecorder] =
    useState<MediaRecorder | null>(null);

  const [finalTranscript, setFinalTranscript] =
    useState("");

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const { isAuth, loading } = useUser();

  const router = useRouter();

  const isLocked = !plan?.active;

  const textScrollRef = useRef<HTMLDivElement>(null);

  const isLongText = (textData?.content?.length || 0) > 220;

  // Reset the teleprompter position whenever a new sentence loads
  useEffect(() => {
    if (textScrollRef.current) {
      textScrollRef.current.scrollTop = 0;
    }
  }, [textData]);

  // Slowly auto-scroll the practice text while recording, so the user
  // can keep speaking without needing to hunt for their place in long text
  useEffect(() => {
    const el = textScrollRef.current;

    if (!el || !isRecording) return;

    el.scrollTop = 0;

    const scrollSpeed = 0.3; // px per frame ≈ a slow, readable pace

    let raf: number;

    const step = () => {
      if (!el) return;

      if (el.scrollTop + el.clientHeight < el.scrollHeight - 1) {
        el.scrollTop += scrollSpeed;
        raf = requestAnimationFrame(step);
      }
    };

    // give the speaker a moment to settle on the first line before
    // the text starts moving, instead of scrolling the instant they hit Start
    const startDelay = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 2000);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(raf);
    };
  }, [isRecording]);

  const fetchNewText = async () => {
    setAccuracy(null);

    setUserSpokenText("");

    setFinalTranscript("");

    setAnalysis(null);

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
          let i = 0;
          i < event.results.length;
          i++
        ) {
          transcript +=
            event.results[i][0].transcript +
            " ";
        }

        setUserSpokenText(
          transcript.trim()
        );
      };

      rec.onerror = (err: any) => {
        console.log(
          "Speech recognition error:",
          err
        );

        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, [loading, isAuth]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      const recorder =
        new MediaRecorder(stream);

      const chunks: Blob[] = [];

      recorder.ondataavailable = (
        event
      ) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          setIsAnalyzing(true);

          const audioBlob = new Blob(
            chunks,
            {
              type: "audio/webm",
            }
          );

          const data =
            await uploadPronunciationAudio(
              {
                audioBlob,
                originalText:
                  textData?.content || "",
              }
            );

          console.log(
            "AI RESPONSE:",
            data
          );

          if (!data) {
            throw new Error(
              "No response received"
            );
          }

          if (data?.transcript) {
            setFinalTranscript(
              data.transcript
            );

            setUserSpokenText(
              data.transcript
            );
          }

          if (data?.analysis) {
            setAnalysis(data.analysis);

            setAccuracy(
              data.analysis
                .pronunciation_score || 0
            );
          }

          if (onComplete) {
            onComplete({
              ...data.analysis,
              transcript:
                data.transcript,
            });
          }
        } catch (error) {
          console.error(
            "Analyze Error:",
            error
          );
        } finally {
          setIsAnalyzing(false);
        }
      };

      recorder.start(1000);

      recognition?.start();

      setMediaRecorder(recorder);

      setIsRecording(true);

      setUserSpokenText("");

      setAccuracy(null);

      setAnalysis(null);

      setFinalTranscript("");
    } catch (error) {
      console.error(
        "Microphone access denied:",
        error
      );
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();

    recognition?.stop();

    setIsRecording(false);
  };

  const ScoreCard = ({
    title,
    score,
  }: {
    title: string;
    score: number;
  }) => (
    <div className="rounded-2xl bg-[#0d1324] border border-white/5 p-4">
      <p className="text-slate-400 text-sm mb-2">
        {title}
      </p>

      <div className="text-3xl font-black text-cyan-400">
        {score}%
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-cyan-500/20 blur-3xl rounded-full" />

      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-violet-500/20 blur-3xl rounded-full" />

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

        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
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

                <div className="flex items-center gap-3">
                  {isRecording && isLongText && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-400/20 text-violet-300 text-xs font-bold uppercase">
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                      Auto-Scroll
                    </div>
                  )}

                  <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-bold uppercase">
                    {textData?.difficulty_level ||
                      "Loading"}
                  </div>
                </div>
              </div>

              <div
                ref={textScrollRef}
                className={`custom-scrollbar min-h-[260px] md:min-h-[320px] max-h-[320px] md:max-h-[380px] overflow-y-auto flex ${
                  isLongText ? "items-start" : "items-center"
                } justify-center rounded-[2rem] bg-[#0d1324] border border-white/5 p-6 md:p-10`}
              >
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

              <div className="custom-scrollbar min-h-[180px] max-h-[320px] overflow-y-auto rounded-[1.5rem] bg-[#0d1324] border border-white/5 p-6 text-slate-300 italic leading-relaxed">
                {userSpokenText ||
                  (isRecording
                    ? "Listening to your voice..."
                    : "Your spoken text will appear here...")}
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
                  loading ||
                  !recognition ||
                  isAnalyzing
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
                {isAnalyzing
                  ? "Analyzing..."
                  : isLocked
                  ? "Upgrade to Pro 🔒"
                  : isRecording
                  ? "Stop & Analyze"
                  : "Start Reading"}
              </button>
            </div>

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
          </div>
        </div>

        {analysis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-3xl rounded-[2rem] bg-[#0b1120] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* HEADER */}
              <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10">
                <div>
                  <p className="uppercase tracking-[0.2em] text-cyan-400 text-xs font-bold mb-1">
                    AI SPEECH ANALYSIS
                  </p>

                  <h3 className="text-2xl font-black text-white">
                    Pronunciation Report
                  </h3>
                </div>

                <button
                  onClick={() => setAnalysis(null)}
                  className="w-11 h-11 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="custom-scrollbar p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                
                {/* SCORE GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <ScoreCard
                    title="Pronunciation"
                    score={
                      analysis.pronunciation_score
                    }
                  />

                  <ScoreCard
                    title="Fluency"
                    score={
                      analysis.fluency_score
                    }
                  />

                  <ScoreCard
                    title="Grammar"
                    score={
                      analysis.grammar_score
                    }
                  />

                  <ScoreCard
                    title="Confidence"
                    score={
                      analysis.confidence_score
                    }
                  />
                </div>

                {/* FEEDBACK */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
                  <h4 className="font-black text-lg mb-3 text-cyan-400">
                    AI Feedback
                  </h4>

                  <p className="text-slate-300 leading-relaxed">
                    {analysis.feedback}
                  </p>
                </div>

                {/* IMPROVEMENTS */}
                {!!analysis.improvements?.length && (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
                    <h4 className="font-black text-lg mb-4 text-violet-400">
                      Improvements
                    </h4>

                    <ul className="space-y-3">
                      {analysis.improvements.map(
                        (
                          item: string,
                          idx: number
                        ) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-slate-300"
                          >
                            <span className="text-cyan-400 mt-1">
                              •
                            </span>

                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* MISTAKES */}
                {!!analysis.mistakes?.length && (
                  <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-5">
                    <h4 className="font-black text-lg mb-4 text-red-400">
                      Mistakes Detected
                    </h4>

                    <ul className="space-y-3">
                      {analysis.mistakes.map(
                        (
                          item: string,
                          idx: number
                        ) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-slate-300"
                          >
                            <span className="text-red-400 mt-1">
                              •
                            </span>

                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* FINAL TRANSCRIPT */}
                {finalTranscript && (
                  <div className="mt-6 rounded-2xl bg-[#111827] border border-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold mb-3">
                      Final AI Transcript
                    </p>

                    <p className="text-slate-300 leading-relaxed">
                      {finalTranscript}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}