"use client";

import { useEffect, useState } from "react";
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
    ) return;

    try {

      setSavingLessonId(
        lesson.id
      );

      await saveAttempt(token, {

        exercise_type:
          "grammar",

        question:
          lesson.title,

        user_answer:
          lesson.example_sentence || "",

        corrected_answer:
          lesson.example_sentence || "",

        ai_feedback:
          `User studied grammar topic: ${lesson.title}`,

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
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="text-center py-20">
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

      <main className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-12 gap-10">

          {/* SIDEBAR */}

          <div className="lg:col-span-4 space-y-4">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Select a Topic
            </h2>

            {topics.map((topic) => (

              <button
                key={topic.id}

                onClick={() =>
                  setActiveTopic(topic)
                }

                className={`w-full text-left p-5 rounded-2xl border transition ${
                  activeTopic?.id ===
                  topic.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600"
                }`}
              >

                <div>

                  <span className="block font-bold text-lg">
                    {topic.title}
                  </span>

                  <span className="text-sm opacity-70">
                    Level:
                    {" "}
                    {topic.level}
                  </span>

                </div>

              </button>

            ))}

          </div>

          {/* CONTENT */}

          <div className="lg:col-span-8">

            {activeTopic && (

              <div className="bg-white rounded-3xl p-10 shadow-xl border">

                <h3 className="text-3xl font-black mb-4">
                  {activeTopic.title}
                  {" "}
                  Overview
                </h3>

                <p className="text-slate-600 mb-8">
                  {activeTopic.description}
                </p>

                {lessons.length > 0 ? (

                  lessons.map((lesson) => (

                    <div
                      key={lesson.id}

                      className="p-6 mb-4 rounded-xl bg-slate-50"
                    >

                      <h4 className="font-bold text-xl">
                        {lesson.title}
                      </h4>

                      <p className="italic text-slate-700">
                        "
                        {lesson.example_sentence}
                        "
                      </p>

                      {lesson.formula && (

                        <p className="text-sm mt-2">

                          <strong>
                            Formula:
                          </strong>

                          {" "}
                          {lesson.formula}

                        </p>

                      )}

                      {lesson.content_body && (

                        <p className="mt-2 text-sm text-slate-600">
                          {lesson.content_body}
                        </p>

                      )}

                      {/* TRACK BUTTON */}

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

                        className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl"
                      >

                        {savingLessonId ===
                        lesson.id
                          ? "Saving..."
                          : "Mark as Studied"}

                      </button>

                    </div>

                  ))

                ) : (

                  <p className="italic text-slate-400">
                    No lessons available.
                  </p>

                )}

              </div>

            )}

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}