"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function AIChatTutor() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I am your AI English Tutor. You can chat with me to practice, or type a sentence you want me to correct. Try saying: 'He go to school yesterday.'",
    },
  ]);

  const [input, setInput] = useState("");
  const [corrections, setCorrections] = useState<
    { original: string; fixed: string; rule: string }[]
  >([]);

  /* Auth check + auto scroll */
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, router]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      processAIResponse(input);
    }, 600);

    setInput("");
  };

  const processAIResponse = (text: string) => {
    if (text.toLowerCase().includes("he go")) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "That's almost correct! In the past tense, we use 'went' instead of 'go'.",
        },
      ]);

      setCorrections((prev) => [
        {
          original: text,
          fixed: "He went to school yesterday.",
          rule: "Past Tense Irregular Verbs",
        },
        ...prev,
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Great sentence! Keep practicing." },
      ]);
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 h-[calc(100vh-80px)] overflow-hidden">
        {/* Chat Section */}
        <div className="lg:col-span-8 flex flex-col bg-white border-r">
          {/* Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              🤖
            </div>
            <div>
              <h2 className="font-bold text-slate-800">EduAI Tutor</h2>
              <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 border rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-6 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a sentence to check..."
                className="flex-1 p-4 rounded-xl border focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700">
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Correction Lab */}
        <div className="lg:col-span-4 bg-slate-50 p-6 overflow-y-auto">
          <h3 className="text-lg font-bold mb-6">✨ Correction Lab</h3>

          {corrections.length === 0 ? (
            <div className="p-5 bg-white rounded-xl opacity-60 italic text-center">
              Corrections will appear here.
            </div>
          ) : (
            corrections.map((c, i) => (
              <div
                key={i}
                className="p-5 bg-white rounded-xl shadow border-l-4 border-red-400 mb-4"
              >
                <p className="text-xs text-slate-400 uppercase mb-2">
                  {c.rule}
                </p>
                <p className="text-red-500 line-through">{c.original}</p>
                <p className="text-green-600 font-bold">{c.fixed}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
