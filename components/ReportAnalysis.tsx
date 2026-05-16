"use client";

import { useEffect, useState } from "react";

import {
  fetchProfileAnalysis,
  fetchWeeklyReport,
} from "@/services/reportAnalysis";

interface Props {
  user: any;
}

interface AnalysisData {
  overall_score: number;

  grammar: number;

  fluency: number;

  pronunciation: number;

  vocabulary: number;

  verbs: number;

  listening: number;

  confidence: number;

  total_attempts: number;

  ai_tips: string[];
}

interface WeeklyItem {
  day: string;

  date: string;

  score: number;

  xp: number;

  minutes: number;

  attempts: number;
}

export default function ReportAnalysis({
  user,
}: Props) {
  const [analysis, setAnalysis] =
    useState<AnalysisData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [weeklyData, setWeeklyData] =
    useState<WeeklyItem[]>([]);

  const [bestScore, setBestScore] =
    useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) return;

        const analysisData =
          await fetchProfileAnalysis(
            token
          );

        setAnalysis(analysisData);

        const weekly =
          await fetchWeeklyReport(
            token
          );

        setWeeklyData(
          weekly.weekly_progress || []
        );

        setBestScore(
          weekly.best_score || 0
        );
      } catch (err) {
        console.error(
          "Analysis fetch error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const progressData = weeklyData || [];

  const skillsData = [
    {
      skill: "Grammar",
      score:
        analysis?.grammar || 0,
      icon: "📘",
    },

    {
      skill: "Vocabulary",
      score:
        analysis?.vocabulary || 0,
      icon: "🧠",
    },

    {
      skill: "Fluency",
      score:
        analysis?.fluency || 0,
      icon: "⚡",
    },

    {
      skill: "Pronunciation",
      score:
        analysis?.pronunciation ||
        0,
      icon: "🎙️",
    },

    {
      skill: "Listening",
      score:
        analysis?.listening || 0,
      icon: "🎧",
    },

    {
      skill: "Verbs",
      score:
        analysis?.verbs || 0,
      icon: "✍️",
    },

    {
      skill: "Confidence",
      score:
        analysis?.confidence || 0,
      icon: "🚀",
    },
  ];

  if (loading) {
    return (
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-3xl p-12 text-center text-slate-300">
        Loading your AI analysis...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div
        className="relative overflow-hidden rounded-[2.5rem]
        border border-white/10
        bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10
        backdrop-blur-3xl p-8 lg:p-10"
      >
        <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold mb-4">
              AI PERFORMANCE REPORT
            </p>

            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Your Learning Analysis
            </h2>

            <p className="text-slate-400 max-w-2xl leading-relaxed text-lg">
              Track your fluency,
              vocabulary, grammar,
              pronunciation, and
              overall speaking growth
              powered by AI insights.
            </p>
          </div>

          <div
            className="w-44 h-44 rounded-[2rem]
            bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600
            flex flex-col items-center justify-center
            shadow-[0_20px_80px_rgba(59,130,246,0.45)]"
          >
            <p className="text-sm uppercase tracking-widest text-white/80">
              Overall
            </p>

            <h1 className="text-5xl font-black text-white mt-2">
              {analysis?.overall_score ||
                0}
              %
            </h1>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Overall Score"
          value={`${
            analysis?.overall_score ||
            0
          }%`}
          icon="🏆"
        />

        <StatCard
          title="Total XP"
          value={user.total_xp || 0}
          icon="⚡"
        />

        <StatCard
          title="Current Streak"
          value={`${
            user.streak || 0
          } Days`}
          icon="🔥"
        />

        <StatCard
          title="Total Attempts"
          value={
            analysis?.total_attempts ||
            0
          }
          icon="🎯"
        />
      </div>

      {/* WEEKLY PROGRESS */}
      <div
        className="rounded-[2.5rem]
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <h3 className="text-3xl font-black text-white">
              Weekly Progress
            </h3>

            <p className="text-slate-400 mt-2">
              Your learning
              consistency this week
            </p>
          </div>

          <div
            className="rounded-2xl bg-cyan-500/10
            border border-cyan-500/20
            px-6 py-4"
          >
            <p className="text-cyan-300 text-sm">
              Best Score
            </p>

            <h2 className="text-4xl font-black text-white">
              {bestScore}%
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {progressData.length > 0 ? (
            progressData.map(
              (item, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white/[0.03] border border-white/5 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-lg">
                        {item.day}
                      </h4>

                      <p className="text-xs text-slate-500">
                        {
                          item.attempts
                        }{" "}
                        attempts
                      </p>
                    </div>

                    <div className="text-right">
                      <h3 className="text-2xl font-black text-cyan-300">
                        {item.score}%
                      </h3>
                    </div>
                  </div>

                  <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 transition-all duration-1000"
                      style={{
                        width: `${item.score}%`,
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-5 text-sm text-slate-400 mt-4">
                    <span>
                      ⚡ {item.xp} XP
                    </span>

                    <span>
                      ⏱️{" "}
                      {item.minutes} mins
                    </span>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-10 text-slate-500">
              No weekly data
              available.
            </div>
          )}
        </div>
      </div>

      {/* SKILLS */}
      <div
        className="rounded-[2.5rem]
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl p-8"
      >
        <div className="mb-10">
          <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold mb-3">
            SKILL ANALYSIS
          </p>

          <h3 className="text-3xl font-black text-white">
            Skill Breakdown
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {skillsData.map((item) => (
            <div
              key={item.skill}
              className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl
                    bg-gradient-to-br from-cyan-500 to-violet-600
                    flex items-center justify-center text-2xl"
                  >
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {item.skill}
                    </h4>

                    <p className="text-slate-500 text-sm">
                      AI evaluated
                      performance
                    </p>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-white">
                  {item.score}%
                </h3>
              </div>

              <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    item.score >= 85
                      ? "bg-gradient-to-r from-emerald-400 to-green-500"
                      : item.score >= 70
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                      : item.score >= 50
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                      : "bg-gradient-to-r from-rose-500 to-red-600"
                  }`}
                  style={{
                    width: `${item.score}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI INSIGHTS */}
      <div
        className="relative overflow-hidden rounded-[2.5rem]
        bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-700
        p-8 shadow-[0_20px_100px_rgba(59,130,246,0.35)]"
      >
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-20 h-20 rounded-[2rem]
              bg-white/10 backdrop-blur-xl
              flex items-center justify-center text-4xl"
            >
              🧠
            </div>

            <div>
              <p className="uppercase tracking-[0.25em] text-cyan-100 text-xs font-bold mb-2">
                AI INSIGHTS
              </p>

              <h3 className="text-3xl font-black text-white">
                Personalized Tips
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {analysis?.ai_tips
              ?.length ? (
              analysis.ai_tips.map(
                (tip, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur-xl"
                  >
                    <div className="flex gap-4">
                      <div className="text-2xl">
                        🚀
                      </div>

                      <p className="text-blue-50 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur-xl">
                <div className="flex gap-4">
                  <div className="text-2xl">
                    📚
                  </div>

                  <p className="text-blue-50">
                    Keep practicing
                    daily to improve
                    your English
                    fluency and
                    confidence.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* STAT CARD */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;

  value: any;

  icon: string;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-[2rem]
      border border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl p-6
      hover:-translate-y-2 transition-all duration-500"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-cyan-500/10 to-violet-500/10"></div>

      <div className="relative z-10">
        <div
          className="w-16 h-16 rounded-2xl
          bg-gradient-to-br from-cyan-500 to-violet-600
          flex items-center justify-center text-3xl mb-5"
        >
          {icon}
        </div>

        <p className="text-slate-400 text-sm">
          {title}
        </p>

        <h2 className="text-4xl font-black mt-3 text-white">
          {value}
        </h2>
      </div>
    </div>
  );
}