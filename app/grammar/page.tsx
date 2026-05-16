"use client";

import { useEffect, useMemo, useState } from "react";
import "../../styles/grammar.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  fetchGrammarTopics,
  fetchLessonsByTopic,
  GrammarTopic,
  GrammarLesson,
} from "@/services/grammar";

import { saveAttempt } from "@/services/reportAnalysis";

export default function GrammarWorkshop() {
  const [topics, setTopics] = useState<
    GrammarTopic[]
  >([]);

  const [activeTopic, setActiveTopic] =
    useState<GrammarTopic | null>(null);

  const [lessons, setLessons] = useState<
    GrammarLesson[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [savingLessonId, setSavingLessonId] =
    useState<number | null>(null);

  const [search, setSearch] =
    useState("");

  const [selectedLevel, setSelectedLevel] =
    useState("All");

  // =====================================================
  // SEO
  // =====================================================

  useEffect(() => {
    document.title =
      "English Grammar Guide | Learn Rules | Grammrlyst";

    let metaDesc = document.querySelector(
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
      "Master English grammar with easy lessons and examples."
    );
  }, []);

  // =====================================================
  // FETCH TOPICS
  // =====================================================

  useEffect(() => {
    fetchGrammarTopics()
      .then((data) => {
        setTopics(data);

        if (data.length > 0) {
          setActiveTopic(data[0]);
        }
      })

      .catch(() => setTopics([]))

      .finally(() =>
        setLoading(false)
      );
  }, []);

  // =====================================================
  // FETCH LESSONS
  // =====================================================

  useEffect(() => {
    if (!activeTopic) return;

    fetchLessonsByTopic(
      activeTopic.id
    )
      .then(setLessons)

      .catch(() =>
        setLessons([])
      );
  }, [activeTopic]);

  // =====================================================
  // SAVE ATTEMPT
  // =====================================================

  const handleLessonRead = async (
    lesson: GrammarLesson
  ) => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) return;

    if (
      savingLessonId === lesson.id
    )
      return;

    try {
      setSavingLessonId(
        lesson.id
      );

      await saveAttempt(token, {
        exercise_type:
          "grammar",

        question: lesson.title,

        user_answer:
          lesson.example_sentence || "",

        corrected_answer:
          lesson.example_sentence || "",

        ai_feedback: `User studied grammar topic: ${lesson.title}`,

        accuracy_score: 85,

        grammar_score: 95,

        vocabulary_score: 75,

        confidence_score: 80,

        xp_earned: 10,

        duration_seconds: 60,
      });
    } catch (err) {
      console.error(
        "Save attempt failed",
        err
      );
    } finally {
      setSavingLessonId(null);
    }
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const levels = useMemo(() => {
    const unique = [
      ...new Set(
        topics.map((t) => t.level)
      ),
    ];

    return ["All", ...unique];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch =
        topic.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesLevel =
        selectedLevel === "All"
          ? true
          : topic.level ===
            selectedLevel;

      return (
        matchesSearch &&
        matchesLevel
      );
    });
  }, [
    topics,
    search,
    selectedLevel,
  ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white text-xl font-bold">
        Loading Grammar Workshop...
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050816] text-white overflow-x-hidden relative">
        {/* BACKGROUND GLOWS */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>

        <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-violet-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-10 lg:py-14">
          {/* HERO */}
          <div className="mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>

              <span className="text-sm text-slate-300">
                AI Grammar Learning
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
              Master English
              <br />

              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Grammar Rules
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
              Learn English grammar with structured lessons, formulas,
              examples, and AI-powered progress tracking.
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-12 gap-6 xl:gap-10">
            {/* SIDEBAR */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 xl:p-6 shadow-2xl">
                {/* FILTERS */}
                <div className="mb-8">
                  <h2 className="text-2xl font-black mb-5">
                    Grammar Topics
                  </h2>

                  {/* SEARCH */}
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all mb-4"
                  />

                  {/* LEVEL FILTER */}
                  <select
                    value={selectedLevel}
                    onChange={(e) =>
                      setSelectedLevel(
                        e.target.value
                      )
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  >
                    {levels.map(
                      (level) => (
                        <option
                          key={level}
                          value={level}
                          className="bg-[#0f172a]"
                        >
                          {level}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* TOPICS */}
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {filteredTopics.map(
                    (topic) => (
                      <button
                        key={topic.id}
                        onClick={() =>
                          setActiveTopic(
                            topic
                          )
                        }
                        className={`group relative w-full overflow-hidden rounded-[1.5rem] border p-4 xl:p-5 text-left transition-all duration-300 ${
                          activeTopic?.id ===
                          topic.id
                            ? "border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-600/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/20"
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-bold text-lg">
                                {
                                  topic.title
                                }
                              </h3>

                              <p className="text-sm text-slate-400 mt-1">
                                Level:{" "}
                                {
                                  topic.level
                                }
                              </p>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl">
                              📘
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  )}

                  {filteredTopics.length ===
                    0 && (
                    <div className="text-center py-10 text-slate-400">
                      No topics found.
                    </div>
                  )}
                </div>
                </div>
            </aside>

            {/* CONTENT */}
            <section className="lg:col-span-9">
              {activeTopic && (
                  <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
                  {/* TOPIC HEADER */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
                        <span className="text-cyan-300 text-sm font-semibold">
                          {
                            activeTopic.level
                          }{" "}
                          Level
                        </span>
                      </div>

                      <h2 className="text-4xl font-black mb-4">
                        {
                          activeTopic.title
                        }
                      </h2>

                      <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                        {
                          activeTopic.description
                        }
                      </p>
                    </div>

                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-5xl shadow-2xl">
                      ✨
                    </div>
                  </div>

                  {/* LESSONS */}
                  {lessons.length > 0 ? (
                    <div className="space-y-8">
                      {lessons.map(
                        (lesson) => (
                          <div
                            key={
                              lesson.id
                            }
                            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:p-8 hover:border-cyan-400/30 transition-all duration-300"
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-cyan-500 to-violet-600 transition-all duration-500"></div>

                            <div className="relative z-10">
                              <div className="flex items-start justify-between gap-5 mb-5">
                                <div>
                                  <h3 className="text-2xl font-black mb-2">
                                    {
                                      lesson.title
                                    }
                                  </h3>

                                  <p className="italic text-cyan-200 text-lg">
                                    “
                                    {
                                      lesson.example_sentence
                                    }
                                    ”
                                  </p>
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-xl">
                                  📖
                                </div>
                              </div>

                              {lesson.formula && (
                                <div className="mb-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 px-5 py-4">
                                  <p className="text-sm text-cyan-300 font-semibold mb-1">
                                    Grammar Formula
                                  </p>

                                  <p className="font-mono text-lg text-white">
                                    {
                                      lesson.formula
                                    }
                                  </p>
                                </div>
                              )}

                              {lesson.content_body && (
                                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-slate-300 leading-relaxed">
                                  {
                                    lesson.content_body
                                  }
                                </div>
                              )}

                              {/* ACTIONS */}
                              <div className="flex flex-wrap items-center gap-4 mt-6">
                                <button
                                  onClick={() =>
                                    handleLessonRead(
                                      lesson
                                    )
                                  }
                                  disabled={
                                    savingLessonId ===
                                    lesson.id
                                  }
                                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                                >
                                  {savingLessonId ===
                                  lesson.id
                                    ? "Saving..."
                                    : "Mark as Studied"}
                                </button>

                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <span>
                                    ⚡ +10 XP
                                  </span>

                                  <span>
                                    •
                                  </span>

                                  <span>
                                    Grammar
                                    Practice
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center">
                      <div className="text-6xl mb-5">
                        📚
                      </div>

                      <h3 className="text-2xl font-bold mb-3">
                        No Lessons Available
                      </h3>

                      <p className="text-slate-400">
                        Lessons for this topic
                        will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}