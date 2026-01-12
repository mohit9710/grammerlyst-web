"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/index.css";
import Navbar from "@/components/Navbar";
import Link from "next/link"; // Use Link for faster navigation

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token) router.replace("/auth/login");
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    router.push("/auth/login");
  };

  return (
    <>
      <Navbar />
      <header className="bg-white py-16 px-6 border-b">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Welcome back, Scholar!
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Your journey to English mastery continues here. Pick up where you
            left off or explore a new module below.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">
          Learning Modules
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link
            href="/verbs"
            className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-font"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Verb Workshop
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Master visual vocabulary with interactive flashcards.
            </p>
            <span className="text-blue-600 font-bold text-sm">
              Explore Verbs →
            </span>
          </Link>

          <Link
            href="/grammar"
            className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-project-diagram"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Grammar Rules
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Deep dive into tenses, clauses, and structure rules.
            </p>
            <span className="text-purple-600 font-bold text-sm">
              Study Rules →
            </span>
          </Link>

          <Link
            href="/quizzes"
            className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-tasks"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Practice Quizzes
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Test your knowledge with real-time feedback challenges.
            </p>
            <span className="text-emerald-600 font-bold text-sm">
              Start Quiz →
            </span>
          </Link>

          <Link
            href="/chatbot"
            className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-robot"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              AI Chat Tutor
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Chat with our AI to get instant sentence corrections.
            </p>
            <span className="text-orange-600 font-bold text-sm">
              Open Chat →
            </span>
          </Link>
        </div>

        <div className="mt-16 bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0">
            <h3 className="text-3xl font-bold mb-2">Track Your Progress</h3>
            <p className="text-slate-400">
              Sign up to save your quiz scores and vocabulary lists.
            </p>
          </div>
          <div className="flex gap-10">
            <div className="text-center">
              <div className="text-4xl font-black text-blue-400">12</div>
              <div className="text-slate-500 text-sm uppercase font-bold">
                Verbs Learnt
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400">85%</div>
              <div className="text-slate-500 text-sm uppercase font-bold">
                Quiz Avg
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        &copy; 2026 EduPlatform Learning Inc. • All Rights Reserved.
      </footer>
    </>
  );
}
