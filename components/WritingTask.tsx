"use client";

import { fetchMyPlan } from "@/services/purchaseService";
import {
  fetchRandomWritingPrompt,
  fetchWritingProgress,
  submitWriting,
  WritingAnalysis,
  WritingPrompt,
  WritingProgress,
} from "@/services/writingService";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAttempt } from "@/services/reportAnalysis";

const countWords = (text: string) => {
  const trimmed = text.trim();

  if (!trimmed) return 0;

  return trimmed.split(/\s+/).length;
};

export default function WritingTask() {
  const router = useRouter();

  // =========================================
  // STATES
  // =========================================

  const [plan, setPlan] =
    useState<any>(null);

  const [planLoading, setPlanLoading] =
    useState(true);

  const [prompt, setPrompt] =
    useState<WritingPrompt | null>(null);

  const [loadingPrompt, setLoadingPrompt] =
    useState(true);

  const [content, setContent] =
    useState("");

  const [analysis, setAnalysis] =
    useState<WritingAnalysis | null>(
      null
    );

  const [progress, setProgress] =
    useState<WritingProgress | null>(
      null
    );

  const [submitting, setSubmitting] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  // =========================================
  // REFS
  // =========================================

  const startTimeRef = useRef<number>(
    Date.now()
  );

  // =========================================
  // DERIVED
  // =========================================

  const wordCount = countWords(content);

  const minWords = prompt?.min_words || 50;

  const isLocked = !plan?.active;

  // =========================================
  // SEO
  // =========================================

  useEffect(() => {
    document.title =
      "Writing Practice | Improve English Writing Skills";

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
      "Practice English writing with AI-powered prompts and instant feedback on grammar, vocabulary, clarity, and coherence."
    );
  }, []);

  // =========================================
  // LOAD PROMPT
  // =========================================

  const loadPrompt = async () => {
    setLoadingPrompt(true);

    try {
      const data =
        await fetchRandomWritingPrompt();

      setPrompt(data);
    } catch (err) {
      console.error(
        "Writing prompt fetch error:",
        err
      );
    } finally {
      setLoadingPrompt(false);
    }
  };

  useEffect(() => {
    loadPrompt();
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
  // LOAD PROGRESS
  // =========================================

  const loadProgress = async () => {
    try {
      const data =
        await fetchWritingProgress();

      setProgress(data);
    } catch (err) {
      console.error(
        "Writing progress fetch error:",
        err
      );
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  // =========================================
  // SUBMIT + SAVE ATTEMPT
  // =========================================

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setSubmitting(true);
    setErrorMsg("");

    const durationSeconds = Math.round(
      (Date.now() - startTimeRef.current) /
        1000
    );

    try {
      const response = await submitWriting({
        content,
        title: prompt?.title,
        prompt_id: prompt?.id,
        save: true,
      });

      setAnalysis(response.analysis);

      loadProgress();

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(
              "access_token"
            )
          : null;

      if (!token) return;

      const { analysis: a } = response;

      const payload = {
        exercise_type: "writing",

        question: prompt?.title || "",

        user_answer: content,

        corrected_answer:
          a.corrected_text || "",

        ai_feedback: a.feedback || "",

        accuracy_score: a.overall_score,

        grammar_score: a.grammar_score,

        vocabulary_score:
          a.vocabulary_score,

        fluency_score: a.coherence_score,

        confidence_score: a.clarity_score,

        xp_earned:
          a.overall_score >= 90
            ? 20
            : a.overall_score >= 70
            ? 15
            : 10,

        duration_seconds: durationSeconds,
      };

      await saveAttempt(token, payload);
    } catch (err: any) {
      console.error(
        "Submit writing error:",
        err
      );

      setErrorMsg(
        err?.message ||
          "Failed to submit writing. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // NEXT PROMPT
  // =========================================

  const handleNextPrompt = () => {
    setContent("");
    setAnalysis(null);
    setErrorMsg("");
    startTimeRef.current = Date.now();
    loadPrompt();
  };

  // =========================================
  // LOADING
  // =========================================

  if (planLoading || loadingPrompt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-3xl shadow border">
          <p className="text-slate-600 font-semibold">
            Loading writing practice...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // NO PROMPT
  // =========================================

  if (!prompt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-3xl shadow border">
          <p className="text-slate-600 font-semibold">
            No writing prompts found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/20 blur-[140px] rounded-full" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* HERO */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                AI Writing Lab
              </span>

              <span className="px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/20 text-orange-300 text-xs font-bold uppercase tracking-widest">
                🔥 Daily Practice
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-5">
              Writing
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                {" "}
                Arena
              </span>
            </h1>

            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
              Sharpen your English writing with real-world prompts and instant AI feedback.
            </p>
          </div>
        </div>

        {/* PROMPT HERO */}

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-xl p-8 lg:p-10 mb-8">

          <div className="relative z-10">
            <div className="flex gap-3 mb-5 flex-wrap">
              <span className="px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                {prompt.difficulty}
              </span>

              <span className="px-4 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-500/20">
                {prompt.category}
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black mb-5 leading-tight">
              {prompt.title}
            </h2>

            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              {prompt.prompt_text}
            </p>

            <div className="flex items-center gap-6 mt-8 flex-wrap">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">
                  Word Count
                </p>

                <p className="text-3xl font-black">
                  {wordCount}
                  <span className="text-slate-500 text-lg">
                    {" "}
                    / {minWords}
                  </span>
                </p>
              </div>

              <div className="h-12 w-px bg-white/10" />

              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">
                  Overall Score
                </p>

                <p className="text-3xl font-black text-emerald-400">
                  {analysis
                    ? `${analysis.overall_score}%`
                    : "--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-8">

            <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8">

              {isLocked && (
                <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center rounded-[2.5rem] text-center px-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-3xl mb-5 shadow-2xl">
                    🔒
                  </div>

                  <h4 className="text-2xl font-black mb-2">
                    Pro Feature
                  </h4>

                  <p className="text-slate-400 max-w-sm mb-6">
                    Upgrade to Pro to write responses and get instant AI-powered feedback.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/pricing")
                    }
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-all px-8 py-4 rounded-2xl font-black"
                  >
                    Upgrade to Pro 🔒
                  </button>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">

                <div>
                  <h3 className="text-3xl font-black mb-2">
                    Your Response
                  </h3>

                  <p className="text-slate-400">
                    Write at least {minWords} words to complete this task.
                  </p>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
                disabled={
                  isLocked || submitting
                }
                placeholder="Start writing your response here..."
                className="w-full h-64 rounded-[2rem] bg-white/5 border border-white/10 outline-none resize-none p-6 text-lg text-white placeholder:text-slate-500 disabled:opacity-50"
              />

              {errorMsg && (
                <p className="text-red-400 font-semibold mt-4">
                  {errorMsg}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-6">

                <button
                  onClick={() => {
                    if (isLocked) {
                      router.push("/pricing");
                      return;
                    }

                    handleSubmit();
                  }}
                  disabled={
                    submitting ||
                    (!isLocked &&
                      wordCount === 0)
                  }
                  className={`hover:scale-105 transition-all px-8 py-4 rounded-2xl font-black disabled:opacity-50 disabled:hover:scale-100 ${
                    isLocked
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600"
                  }`}
                >
                  {submitting
                    ? "Analyzing..."
                    : isLocked
                    ? "Upgrade to Pro 🔒"
                    : "Submit Response"}
                </button>

                <button
                  onClick={handleNextPrompt}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all"
                >
                  Next Prompt
                </button>
              </div>
            </div>

            {/* FEEDBACK */}

            {analysis && (
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 space-y-8">

                <div>
                  <h3 className="text-2xl font-black mb-5">
                    AI Feedback
                  </h3>

                  <div className="bg-black/20 border border-white/5 rounded-3xl p-6 text-slate-200 leading-relaxed text-lg">
                    {analysis.feedback}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ScorePill
                    label="Grammar"
                    value={
                      analysis.grammar_score
                    }
                  />

                  <ScorePill
                    label="Vocabulary"
                    value={
                      analysis.vocabulary_score
                    }
                  />

                  <ScorePill
                    label="Clarity"
                    value={
                      analysis.clarity_score
                    }
                  />

                  <ScorePill
                    label="Coherence"
                    value={
                      analysis.coherence_score
                    }
                  />
                </div>

                {analysis.strengths?.length >
                  0 && (
                  <FeedbackList
                    title="Strengths"
                    items={
                      analysis.strengths
                    }
                    color="emerald"
                  />
                )}

                {analysis.mistakes?.length >
                  0 && (
                  <FeedbackList
                    title="Mistakes"
                    items={
                      analysis.mistakes
                    }
                    color="red"
                  />
                )}

                {analysis.improvements
                  ?.length > 0 && (
                  <FeedbackList
                    title="Suggested Improvements"
                    items={
                      analysis.improvements
                    }
                    color="violet"
                  />
                )}

                {analysis.corrected_text && (
                  <div>
                    <p className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-4">
                      Corrected Version
                    </p>

                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6 text-slate-200 leading-relaxed text-lg">
                      {
                        analysis.corrected_text
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT */}

          <div className="space-y-8">

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 text-center">

              <p className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-6">
                Latest Score
              </p>

              <div className="text-6xl font-black text-emerald-400">
                {analysis
                  ? `${analysis.overall_score}%`
                  : progress
                  ? `${progress.latest_score}%`
                  : "--"}
              </div>
            </div>

            {progress && (
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8">
                <p className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-6">
                  Your Progress
                </p>

                <div className="space-y-5">
                  <ProgressRow
                    label="Total Submissions"
                    value={
                      progress.total_submissions
                    }
                  />

                  <ProgressRow
                    label="Average Score"
                    value={`${progress.average_score}%`}
                  />

                  <ProgressRow
                    label="Best Score"
                    value={`${progress.best_score}%`}
                  />

                  <ProgressRow
                    label="Trend"
                    value={`${progress.trend} (${progress.trend_delta > 0 ? "+" : ""}${progress.trend_delta})`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// =========================================
// SCORE PILL
// =========================================

function ScorePill({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
        {label}
      </p>

      <p className="text-2xl font-black text-cyan-400">
        {value}%
      </p>
    </div>
  );
}

// =========================================
// FEEDBACK LIST
// =========================================

function FeedbackList({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "emerald" | "red" | "violet";
}) {
  const colorMap: Record<string, string> = {
    emerald:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    red: "bg-red-500/10 border-red-500/20 text-red-300",
    violet:
      "bg-violet-500/10 border-violet-500/20 text-violet-300",
  };

  return (
    <div>
      <p className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-4">
        {title}
      </p>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className={`px-5 py-3 rounded-2xl border font-medium ${colorMap[color]}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// =========================================
// PROGRESS ROW
// =========================================

function ProgressRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400 font-semibold">
        {label}
      </span>

      <span className="text-white font-black">
        {value}
      </span>
    </div>
  );
}
