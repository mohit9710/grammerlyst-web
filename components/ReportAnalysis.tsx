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

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) return;

        // =========================
        // PROFILE ANALYSIS
        // =========================

        const analysisData =
          await fetchProfileAnalysis(
            token
          );

        setAnalysis(analysisData);

        // =========================
        // WEEKLY REPORT
        // =========================

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

  // =====================================================
  // WEEKLY DATA
  // =====================================================

  const progressData = weeklyData || [];

  // =====================================================
  // SKILLS DATA
  // =====================================================

  const skillsData = [
    {
      skill: "Grammar",
      score:
        analysis?.grammar || 0,
    },

    {
      skill: "Vocabulary",
      score:
        analysis?.vocabulary || 0,
    },

    {
      skill: "Fluency",
      score:
        analysis?.fluency || 0,
    },

    {
      skill: "Pronunciation",
      score:
        analysis?.pronunciation ||
        0,
    },

    {
      skill: "Listening",
      score:
        analysis?.listening || 0,
    },

    {
      skill: "Verbs",
      score:
        analysis?.verbs || 0,
    },

    {
      skill: "Confidence",
      score:
        analysis?.confidence || 0,
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border p-10 text-center">
        Loading analysis...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white rounded-[2rem] shadow border p-8">
        <h2 className="text-3xl font-black mb-2">
          Your Learning Analysis
        </h2>

        <p className="text-slate-500">
          Track your English
          learning performance and
          daily progress.
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Overall Score"
          value={`${
            analysis?.overall_score ||
            0
          }%`}
        />

        <StatCard
          title="Total XP"
          value={user.total_xp || 0}
        />

        <StatCard
          title="Current Streak"
          value={`${
            user.streak || 0
          } Days`}
        />

        <StatCard
          title="Total Attempts"
          value={
            analysis?.total_attempts ||
            0
          }
        />
      </div>

      {/* WEEKLY PROGRESS */}
      <div className="bg-white rounded-[2rem] shadow border p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black">
              Weekly Progress
            </h3>

            <p className="text-slate-500 mt-1">
              Your learning
              consistency this week
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">
              Best Score
            </p>

            <h2 className="text-3xl font-black text-blue-600">
              {bestScore}%
            </h2>
          </div>
        </div>

        <div className="space-y-5">
          {progressData.length > 0 ? (
            progressData.map(
              (item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-semibold">
                        {item.day}
                      </span>

                      <span className="text-xs text-slate-400 ml-2">
                        (
                        {
                          item.attempts
                        }{" "}
                        attempts)
                      </span>
                    </div>

                    <span className="text-slate-500">
                      {item.score}%
                    </span>
                  </div>

                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{
                        width: `${item.score}%`,
                      }}
                    />
                  </div>

                  <div className="flex gap-4 text-xs text-slate-400 mt-1">
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
            <p className="text-slate-400">
              No weekly data available.
            </p>
          )}
        </div>
      </div>

      {/* SKILL ANALYSIS */}
      <div className="bg-white rounded-[2rem] shadow border p-8">
        <h3 className="text-2xl font-black mb-8">
          Skill Breakdown
        </h3>

        <div className="space-y-6">
          {skillsData.map((item) => (
            <div key={item.skill}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">
                  {item.skill}
                </span>

                <span className="font-bold">
                  {item.score}%
                </span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.score >= 85
                      ? "bg-green-500"
                      : item.score >= 70
                      ? "bg-blue-500"
                      : item.score >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl">
        <h3 className="text-2xl font-black mb-6">
          AI Insights
        </h3>

        <div className="space-y-4 text-blue-100">
          {analysis?.ai_tips?.length ? (
            analysis.ai_tips.map(
              (tip, index) => (
                <div
                  key={index}
                  className="flex gap-3"
                >
                  <span>🚀</span>

                  <p>{tip}</p>
                </div>
              )
            )
          ) : (
            <div className="flex gap-3">
              <span>📚</span>

              <p>
                Keep practicing daily
                to improve your
                English fluency.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;

  value: any;
}) {
  return (
    <div className="bg-white rounded-2xl shadow border p-6 text-center">
      <p className="text-slate-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-black mt-2 text-slate-800">
        {value}
      </h2>
    </div>
  );
}