"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    // Force the background color and min-height here
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-12 md:p-20 border border-slate-100 text-center animate-in zoom-in-95 duration-700">
          
          {/* Visual Element */}
          <div className="relative mb-10 flex justify-center">
            <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner">
              <i className="fas fa-search text-5xl"></i>
            </div>
          </div>

          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            Oops! Syntax Error.
          </h2>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, 
            or perhaps it never had a subject and a verb to begin with.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              <i className="fas fa-home"></i> Go Home
            </Link>
            
            <Link 
              href="/grammar"
              className="bg-white text-slate-600 border-2 border-slate-100 px-10 py-4 rounded-2xl font-bold hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-graduation-cap"></i> Resume Learning
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}