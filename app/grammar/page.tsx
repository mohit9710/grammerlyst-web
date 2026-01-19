"use client";

import { useEffect, useState } from "react";
import "../../styles/grammar.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { fetchGrammarTopics, fetchLessonsByTopic, GrammarTopic, GrammarLesson } from "@/services/grammar";
import { fetchUserProfile } from "@/services/userService";

export default function GrammarWorkshop() {
  const router = useRouter();

  // State for API data
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [activeTopic, setActiveTopic] = useState<GrammarTopic | null>(null);
  const [lessons, setLessons] = useState<GrammarLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const[user, setUser]=useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // Load sidebar topics initially
    fetchGrammarTopics(token)
      .then((data) => {
        setTopics(data);
        if (data.length > 0) {
          setActiveTopic(data[0]); // Set first topic as default
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  // Effect to load lessons whenever the active topic changes
  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    if (activeTopic) {
      fetchLessonsByTopic(activeTopic.id, token)
        .then(setLessons)
        .catch(() => setLessons([])); // Clear if no lessons found
    }
    fetchUserProfile(token)
          .then((data) => {
            setUser(data);
            setLoading(false);
          })
          .catch(() => router.push("/auth/login"));
  }, [activeTopic]);

  if (loading) return <div className="text-center py-20">Loading Grammar Workshop...</div>;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Sidebar Navigation - Dynamic */}
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
                  <span className={`block font-bold text-lg ${activeTopic?.id === topic.id ? "text-white" : "text-slate-800"}`}>
                    {topic.title}
                  </span>
                  <span className={`text-sm ${activeTopic?.id === topic.id ? "text-blue-100" : "opacity-70"}`}>
                    Level: {topic.level}
                  </span>
                </div>
                <i className={`fas fa-chevron-right ${activeTopic?.id === topic.id ? "text-white" : "text-slate-300 group-hover:text-blue-500"}`}></i>
              </button>
            ))}
          </div>

          {/* Content Area - Dynamic based on selected topic and its lessons */}
          <div className="lg:col-span-8">
            {activeTopic && (
              <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-book-open text-xl"></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">
                    {activeTopic.title} Overview
                  </h3>
                </div>
                <p className="text-slate-600 text-lg mb-8">
                  {activeTopic.description}
                </p>

                {/* Lessons mapping */}
                <div className="space-y-6 mt-6">
                  {lessons.length > 0 ? (
                    lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id} 
                        className={`p-6 rounded-2xl border-l-4 ${
                          index % 2 === 0 ? "bg-blue-50 border-blue-500" : "bg-slate-50 border-slate-400"
                        }`}
                      >
                        <h4 className={`font-bold text-xl mb-2 ${index % 2 === 0 ? "text-blue-900" : "text-slate-900"}`}>
                          {lesson.title}
                        </h4>
                        <p className={`${index % 2 === 0 ? "text-blue-800" : "text-slate-800"} italic mb-3`}>
                          "{lesson.example_sentence}"
                        </p>
                        {lesson.formula && (
                          <span className={`text-sm font-bold uppercase tracking-wider underline ${index % 2 === 0 ? "text-blue-400" : "text-slate-400"}`}>
                            Formula: {lesson.formula}
                          </span>
                        )}
                        {lesson.content_body && (
                           <p className="mt-4 text-slate-600 text-sm">{lesson.content_body}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No detailed lessons available for this topic yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}