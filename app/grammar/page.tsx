"use client";

import { useEffect, useState } from "react";
import "../../styles/grammar.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  fetchGrammarTopics,
  fetchLessonsByTopic,
  GrammarTopic,
  GrammarLesson,
} from "@/services/grammar";
import { fetchUserProfile } from "@/services/userService";

export default function GrammarWorkshop() {
  const router = useRouter();

  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [activeTopic, setActiveTopic] = useState<GrammarTopic | null>(null);
  const [lessons, setLessons] = useState<GrammarLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  // SEO
  useEffect(() => {
    document.title = "English Grammar Guide | Learn Rules & Usage | Grammrlyst";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute(
      "content",
      "Master English grammar with our comprehensive guide. From tenses to punctuation, learn the rules that make your writing perfect."
    );
  }, []);

  // Auth + Topics
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    Promise.all([
      fetchUserProfile(token),
      fetchGrammarTopics(token),
    ])
      .then(([userData, topicData]) => {
        setUser(userData);
        setTopics(topicData);
        if (topicData.length > 0) {
          setActiveTopic(topicData[0]);
        }
      })
      .catch(() => router.replace("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  // Lessons per topic
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !activeTopic) return;

    fetchLessonsByTopic(activeTopic.id, token)
      .then(setLessons)
      .catch(() => setLessons([]));
  }, [activeTopic]);

  if (loading) {
    return <div className="text-center py-20">Loading Grammar Workshop...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="fas fa-list-ul"></i> Select a Topic
            </h2>

            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`w-full text-left p-5 rounded-2xl border transition-all group flex justify-between items-center ${
                  activeTopic?.id === topic.id
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
                }`}
              >
                <div>
                  <span className="block font-bold text-lg">
                    {topic.title}
                  </span>
                  <span className="text-sm opacity-70">
                    Level: {topic.level}
                  </span>
                </div>
                <i className="fas fa-chevron-right"></i>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-8">
            {activeTopic && (
              <div className="bg-white rounded-3xl p-10 shadow-xl border">
                <h3 className="text-3xl font-black mb-4">
                  {activeTopic.title} Overview
                </h3>

                <p className="text-slate-600 mb-8">
                  {activeTopic.description}
                </p>

                {lessons.length ? (
                  lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="p-6 mb-4 rounded-xl bg-slate-50"
                    >
                      <h4 className="font-bold text-xl">
                        {lesson.title}
                      </h4>
                      <p className="italic text-slate-700">
                        "{lesson.example_sentence}"
                      </p>
                      {lesson.formula && (
                        <p className="text-sm mt-2">
                          <strong>Formula:</strong> {lesson.formula}
                        </p>
                      )}
                      {lesson.content_body && (
                        <p className="mt-2 text-sm text-slate-600">
                          {lesson.content_body}
                        </p>
                      )}
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
    </>
  );
}
