"use client";

import { useEffect, useState } from "react";
import "../../styles/grammar.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function GrammarWorkshop() {
  const router = useRouter();

  // Track the active topic with state
  const [activeTopic, setActiveTopic] = useState("tenses");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.replace("/auth/login");
  }, []);

  const topics = [
    {
      id: "tenses",
      title: "Verb Tenses",
      subtitle: "Past, Present, and Future",
      icon: "fa-clock",
      color: "blue",
    },
    {
      id: "conditionals",
      title: "Conditionals",
      subtitle: "If-then logical structures",
      icon: "fa-project-diagram",
      color: "purple",
    },
    {
      id: "passive",
      title: "Active vs Passive",
      subtitle: "Voice and Emphasis",
      icon: "fa-exchange-alt",
      color: "green",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="fas fa-list-ul"></i> Select a Topic
            </h2>

            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all group flex justify-between items-center ${
                  activeTopic === topic.id
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
                }`}
              >
                <div>
                  <span
                    className={`block font-bold text-lg ${
                      activeTopic === topic.id ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {topic.title}
                  </span>
                  <span
                    className={`text-sm ${
                      activeTopic === topic.id ? "text-blue-100" : "opacity-70"
                    }`}
                  >
                    {topic.subtitle}
                  </span>
                </div>
                <i
                  className={`fas fa-chevron-right ${
                    activeTopic === topic.id
                      ? "text-white"
                      : "text-slate-300 group-hover:text-blue-500"
                  }`}
                ></i>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            {activeTopic === "tenses" && (
              <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-clock text-xl"></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">
                    Verb Tenses Overview
                  </h3>
                </div>
                <p className="text-slate-600 text-lg mb-8">
                  Verb tenses tell us when an action happened. Let's look at the
                  "Perfect" forms.
                </p>

                <div className="space-y-6 mt-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900 text-xl mb-2">
                      Present Perfect
                    </h4>
                    <p className="text-blue-800 italic mb-3">
                      "I have finished my homework."
                    </p>
                    <span className="text-sm font-bold uppercase tracking-wider text-blue-400 underline">
                      Formula: Has/Have + Past Participle
                    </span>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-slate-400">
                    <h4 className="font-bold text-slate-900 text-xl mb-2">
                      Past Perfect
                    </h4>
                    <p className="text-slate-800 italic mb-3">
                      "The train had left before I arrived."
                    </p>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400 underline">
                      Formula: Had + Past Participle
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === "conditionals" && (
              <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-project-diagram text-xl"></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">
                    The Conditionals
                  </h3>
                </div>
                <p className="text-slate-600 text-lg mb-8">
                  Conditionals describe the result of something that might
                  happen or might have happened.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="border-2 border-purple-50 p-6 rounded-2xl hover:bg-purple-50/50 transition-colors">
                    <h4 className="font-bold text-purple-600 mb-2 underline">
                      Zero Conditional
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      General truths and facts. <br />
                      <strong>If you heat ice, it melts.</strong>
                    </p>
                  </div>
                  <div className="border-2 border-purple-50 p-6 rounded-2xl hover:bg-purple-50/50 transition-colors">
                    <h4 className="font-bold text-purple-600 mb-2 underline">
                      First Conditional
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Real possibilities in the future. <br />
                      <strong>If it rains, I will stay home.</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === "passive" && (
              <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-exchange-alt text-xl"></i>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">
                    Active vs Passive Voice
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="bg-green-50 p-6 rounded-2xl">
                    <p className="font-black text-green-700 text-xs uppercase mb-2">
                      Active
                    </p>
                    <p className="text-xl font-bold">
                      "The chef prepared the meal."
                    </p>
                  </div>
                  <div className="bg-slate-100 p-6 rounded-2xl">
                    <p className="font-black text-slate-500 text-xs uppercase mb-2">
                      Passive
                    </p>
                    <p className="text-xl font-bold">
                      "The meal was prepared by the chef."
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 mt-6">
                  Use <b>Passive Voice</b> when the action or the object is more
                  important than the person performing the action.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
