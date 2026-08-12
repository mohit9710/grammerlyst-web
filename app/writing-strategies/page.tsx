"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  fetchStrategyTopics,
  fetchStrategiesByTopic,
  StrategyTopic,
  StrategyItem,
} from "@/services/writingStrategies";

import { saveAttempt } from "@/services/reportAnalysis";

const TASK_BADGE_STYLES: Record<string, string> = {
  "Task 1": "bg-amber-500/10 border-amber-500/20 text-amber-300",
  "Task 2": "bg-pink-500/10 border-pink-500/20 text-pink-300",
  General: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300",
};

export default function IeltsWritingStrategies() {
  const [topics, setTopics] = useState<StrategyTopic[]>([]);

  const [activeTopic, setActiveTopic] =
    useState<StrategyTopic | null>(null);

  const [items, setItems] = useState<StrategyItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [savingItemId, setSavingItemId] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [selectedTaskType, setSelectedTaskType] =
    useState("All");

  // =====================================================
  // SEO
  // =====================================================

  useEffect(() => {
    document.title =
      "IELTS Writing Strategies | Task 1 & Task 2 Tips | Grammrlyst";

    let metaDesc = document.querySelector(
      'meta[name="description"]'
    );

    if (!metaDesc) {
      metaDesc = document.createElement("meta");

      metaDesc.setAttribute("name", "description");

      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute(
      "content",
      "Master IELTS Writing Task 1 and Task 2 with proven strategies, structure templates, and examiner tips."
    );
  }, []);

  // =====================================================
  // FETCH TOPICS
  // =====================================================

  useEffect(() => {
    fetchStrategyTopics()
      .then((data) => {
        setTopics(data);

        if (data.length > 0) {
          setActiveTopic(data[0]);
        }
      })
      .catch(() => setTopics([]))
      .finally(() => setLoading(false));
  }, []);

  // =====================================================
  // FETCH STRATEGY ITEMS
  // =====================================================

  useEffect(() => {
    if (!activeTopic) return;

    fetchStrategiesByTopic(activeTopic.id)
      .then(setItems)
      .catch(() => setItems([]));
  }, [activeTopic]);

  // =====================================================
  // SAVE ATTEMPT
  // =====================================================

  const handleStrategyRead = async (item: StrategyItem) => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    if (savingItemId === item.id) return;

    try {
      setSavingItemId(item.id);

      await saveAttempt(token, {
        exercise_type: "writing",
        question: item.title,
        user_answer: item.example || "",
        corrected_answer: item.example || "",
        ai_feedback: `User studied IELTS writing strategy: ${item.title}`,
        accuracy_score: 85,
        grammar_score: 90,
        vocabulary_score: 80,
        confidence_score: 80,
        xp_earned: 10,
        duration_seconds: 60,
      });
    } catch (err) {
      console.error("Save attempt failed", err);
    } finally {
      setSavingItemId(null);
    }
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const taskTypes = useMemo(() => {
    const unique = [...new Set(topics.map((t) => t.taskType))];

    return ["All", ...unique];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch = topic.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTaskType =
        selectedTaskType === "All"
          ? true
          : topic.taskType === selectedTaskType;

      return matchesSearch && matchesTaskType;
    });
  }, [topics, search, selectedTaskType]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white text-xl font-bold">
        Loading IELTS Writing Strategies...
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/20 blur-3xl rounded-full"></div>

        <div className="absolute top-20 right-0 w-[30rem] h-[30rem] bg-pink-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-10 lg:py-14">
          {/* HERO */}
          <div className="mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>

              <span className="text-sm text-slate-300">
                IELTS Writing Prep
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
              IELTS Writing
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
                Strategy Guide
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
              Browse proven strategies, structure templates, and examiner
              tips for every part of IELTS Writing Task 1 and Task 2.
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
                    Strategy Topics
                  </h2>

                  {/* SEARCH */}
                  <input
                    type="text"
                    placeholder="Search strategies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all mb-4"
                  />

                  {/* TASK TYPE FILTER */}
                  <select
                    value={selectedTaskType}
                    onChange={(e) =>
                      setSelectedTaskType(e.target.value)
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 transition-all"
                  >
                    {taskTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-[#0f172a]"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TOPICS */}
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopic(topic)}
                      className={`group relative w-full overflow-hidden rounded-[1.5rem] border p-4 xl:p-5 text-left transition-all duration-300 ${
                        activeTopic?.id === topic.id
                          ? "border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-pink-600/20"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/20"
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-lg">
                              {topic.title}
                            </h3>

                            <p className="text-sm text-slate-400 mt-1">
                              {topic.taskType}
                            </p>
                          </div>

                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 flex items-center justify-center shadow-xl">
                            ✍️
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {filteredTopics.length === 0 && (
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
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5 ${TASK_BADGE_STYLES[activeTopic.taskType]}`}
                      >
                        <span className="text-sm font-semibold">
                          {activeTopic.taskType}
                        </span>
                      </div>

                      <h2 className="text-4xl font-black mb-4">
                        {activeTopic.title}
                      </h2>

                      <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                        {activeTopic.description}
                      </p>
                    </div>

                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-r from-amber-500 to-pink-600 flex items-center justify-center text-5xl shadow-2xl">
                      🎯
                    </div>
                  </div>

                  {/* STRATEGY ITEMS */}
                  {items.length > 0 ? (
                    <div className="space-y-8">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:p-8 hover:border-amber-400/30 transition-all duration-300"
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-amber-500 to-pink-600 transition-all duration-500"></div>

                          <div className="relative z-10">
                            <div className="flex items-start justify-between gap-5 mb-5">
                              <h3 className="text-2xl font-black">
                                {item.title}
                              </h3>

                              <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 flex items-center justify-center text-2xl shadow-xl">
                                📝
                              </div>
                            </div>

                            {item.structure && (
                              <div className="mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-5 py-4">
                                <p className="text-sm text-amber-300 font-semibold mb-2">
                                  Structure / Template
                                </p>

                                <p className="font-mono text-base text-white whitespace-pre-line leading-relaxed">
                                  {item.structure}
                                </p>
                              </div>
                            )}

                            {item.example && (
                              <div className="mb-5 rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
                                <p className="text-sm text-pink-300 font-semibold mb-2">
                                  Example
                                </p>

                                <p className="italic text-slate-200 leading-relaxed">
                                  “{item.example}”
                                </p>
                              </div>
                            )}

                            {item.tips.length > 0 && (
                              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                                <p className="text-sm text-indigo-300 font-semibold mb-3">
                                  Examiner Tips
                                </p>

                                <ul className="space-y-2">
                                  {item.tips.map((tip, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-3 text-slate-300 leading-relaxed"
                                    >
                                      <span className="text-amber-400 mt-1">
                                        ✔
                                      </span>

                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* ACTIONS */}
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                              <button
                                onClick={() =>
                                  handleStrategyRead(item)
                                }
                                disabled={savingItemId === item.id}
                                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 font-bold hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                              >
                                {savingItemId === item.id
                                  ? "Saving..."
                                  : "Mark as Studied"}
                              </button>

                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span>⚡ +10 XP</span>

                                <span>•</span>

                                <span>Writing Strategy</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center">
                      <div className="text-6xl mb-5">📚</div>

                      <h3 className="text-2xl font-bold mb-3">
                        No Strategies Available
                      </h3>

                      <p className="text-slate-400">
                        Strategies for this topic will appear here.
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
