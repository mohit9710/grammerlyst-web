"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
<<<<<<< HEAD
import { useRouter } from "next/navigation";

export default function AIChatTutor() {
  const router = useRouter();

=======

export default function AIChatTutor() {
>>>>>>> fdf56822e42bb147ca4f81e974eafedbc3ab1ab1
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I am your AI English Tutor. You can chat with me to practice, or type a sentence you want me to correct. Try saying: 'He go to school yesterday.'",
    },
  ]);
  const [input, setInput] = useState("");
  const [corrections, setCorrections] = useState([]);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
<<<<<<< HEAD
    const token = localStorage.getItem("access_token");
    if (!token) router.replace("/auth/login");

=======
>>>>>>> fdf56822e42bb147ca4f81e974eafedbc3ab1ab1
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI Response & Correction logic
    setTimeout(() => {
      processAIResponse(input);
    }, 600);

    setInput("");
  };

  const processAIResponse = (text) => {
    // Simple logic to demonstrate the "Correction Lab"
    if (text.toLowerCase().includes("he go")) {
      const botMsg = {
        role: "bot",
        content:
          "That's almost correct! In the past tense, we use 'went' instead of 'go'.",
      };
      const newCorrection = {
        original: text,
        fixed: "He went to school yesterday.",
        rule: "Past Tense Irregular Verbs",
      };
      setMessages((prev) => [...prev, botMsg]);
      setCorrections((prev) => [newCorrection, ...prev]);
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
      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-0 h-[calc(100vh-80px)] overflow-hidden">
        {/* Chat Section */}
        <div className="lg:col-span-8 flex flex-col bg-white border-r">
          {/* Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h2 className="font-bold text-slate-800">EduAI Tutor</h2>
              <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                Online
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/30"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[80%] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a sentence to check..."
                className="flex-1 p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Correction Sidebar */}
        <div className="lg:col-span-4 bg-slate-50 p-6 overflow-y-auto no-scrollbar">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-magic text-blue-600"></i> Correction Lab
          </h3>

          <div className="space-y-4">
            {corrections.length === 0 ? (
              <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-100 opacity-60 italic text-center">
                Corrections will appear here after you send a message.
              </div>
            ) : (
              corrections.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white shadow-md border-l-4 border-red-400 animate-in fade-in slide-in-from-right-4"
                >
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                    {item.rule}
                  </p>
                  <p className="text-red-500 line-through text-sm mb-1">
                    {item.original}
                  </p>
                  <p className="text-green-600 font-bold text-lg">
                    {item.fixed}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-10 bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <i className="fas fa-lightbulb"></i> Quick Tip
            </h4>
            <p className="text-blue-100 text-sm leading-relaxed">
              Ask me "What is the difference between 'Since' and 'For'?" for a
              quick lesson!
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
