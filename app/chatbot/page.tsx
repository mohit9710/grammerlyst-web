"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { chatbotService, CorrectionResponse } from "@/services/chatbotService";

export default function AIChatTutor() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<CorrectionResponse[]>([]);

  /* Auth check */
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      router.replace("/auth/login");
    }
  }, [router]);

  const handleFix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Calling the API service
      const result = await chatbotService.correctSentence(input);
      
      // Update the list with the real API response
      setCorrections((prev) => [result, ...prev]);
      setInput("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      // Auto-hide error after 4 seconds
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-slate-900 tracking-tight mb-3">
            Sentence <span className="font-semibold text-blue-600">Polisher</span>
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Refine your English instantly with AI-powered grammar correction.
          </p>
        </div>

        {/* Input Area */}
        <div className="relative mb-16">
          <form onSubmit={handleFix} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row items-center p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or paste a sentence..."
                className="w-full p-4 text-lg border-none focus:ring-0 text-slate-700 placeholder:text-slate-300"
              />
              <button
                disabled={!input.trim() || isProcessing}
                className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center min-w-[120px]"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Polishing
                  </span>
                ) : "Correct"}
              </button>
            </div>
          </form>

          {/* Error Message Toast */}
          {error && (
            <div className="absolute -bottom-10 left-0 right-0 text-center animate-in fade-in slide-in-from-top-2">
              <span className="text-red-500 text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Results / History Section */}
        <div className="space-y-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
            {corrections.length > 0 ? "Corrections" : "Your edits will appear here"}
          </h2>

          <div className="grid gap-6">
            {corrections.map((c, i) => (
              <div 
                key={i} 
                className={`bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-3xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${i === 0 ? 'ring-2 ring-blue-500/10' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {c.rule}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(c.fixed)}
                    className="text-slate-400 hover:text-blue-600 text-xs flex items-center gap-1 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    Copy
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-xs text-slate-400 mb-2 font-medium">Original</p>
                    <p className="text-slate-500 line-through decoration-red-300/60 text-lg">
                      {c.original}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 text-slate-200">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                    <p className="text-xs text-blue-500 mb-2 font-medium">Refined</p>
                    <p className="text-slate-900 font-semibold text-xl leading-snug">
                      {c.fixed}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}