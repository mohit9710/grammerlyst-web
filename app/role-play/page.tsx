"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { chatbotService } from "@/services/chatbotService";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { useUserPlan } from "@/hooks/usePlan";
import { saveAttempt } from "@/services/reportAnalysis";

interface Message {
  role: "user" | "bot";
  content: string;
  correction?: {
    fixed: string | null;
    explanation: string | null;
  };
  originalInput?: string;
}

type VoiceType = "professional" | "calm" | "formal" | "neutral";

interface Role {
  title: string;
  scenario: string;
  instruction: string;
  avatar: string;
  voiceType: VoiceType;
}

export default function RoleplayChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { plan, loading } = useUserPlan();

  const [dailyRole, setDailyRole] = useState<Role>({
    title: "Job Interviewer",
    scenario: "You are applying for a Senior Designer role at a tech firm.",
    instruction: "Try to use professional vocabulary and explain your work process.",
    avatar: "👔",
    voiceType: "professional", // ✅ Added voiceType for TTS
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isSpacePressedRef = useRef(false);

  // --- TTS Function ---
  const speakResponse = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const indianVoice =
      voices.find((v) => v.lang === "en-IN") || voices.find((v) => v.lang === "en-US");
    utterance.voice = indianVoice || voices[0];

    // Voice style based on dailyRole
    switch (dailyRole.voiceType) {
      case "professional":
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        break;
      case "calm":
        utterance.rate = 0.85;
        utterance.pitch = 0.85;
        break;
      case "formal":
        utterance.rate = 0.9;
        utterance.pitch = 0.85;
        break;
      default:
        utterance.rate = 1;
        utterance.pitch = 1;
    }

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const roles: Role[] = [
      { title: "Hotel Receptionist", scenario: "You are checking into a luxury hotel in London.", instruction: "Practice polite requests and formal greetings.", avatar: "🛎️", voiceType: "formal" },
    ];

    const today = new Date().getDay() % roles.length;
    const selectedRole = roles[today];
    setDailyRole(selectedRole);

    const initialGreeting = `Hello! I am your ${selectedRole.title}. ${selectedRole.scenario} Shall we begin?`;
    setMessages([{ role: "bot", content: initialGreeting }]);
    setTimeout(() => speakResponse(initialGreeting), 1000);

    // SEO & Meta Effects
    document.title = "Roleplay Chat | Practice English Conversations with AI";

    // Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      "Practice real-life English conversations with AI roleplay scenarios like interviews, doctor visits, and daily situations. Improve your speaking confidence and fluency."
    );

    // ✅ Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }

    metaKeywords.setAttribute(
      'content',
      "english speaking practice,roleplay chat,AI conversation practice,learn english speaking,english conversation app,interview practice english,spoken english practice"
    );
  }, []);

  const [usage, setUsage] = useState<{
    used: number;
    limit: number | "unlimited";
    remaining: number | "unlimited";
  } | null>(null);

  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // --- Voice Recognition ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (isSpacePressedRef.current) return;

      const active = document.activeElement;
      const isTyping =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);

      if (isTyping) return;

      e.preventDefault();
      isSpacePressedRef.current = true;
      startListening();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      isSpacePressedRef.current = false;
      stopListening();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser does not support voice speech.");
      return;
    }

    if (recognitionRef.current) return;
    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      if (!isSpacePressedRef.current) setTimeout(() => handleSendMessage(), 120);
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => recognitionRef.current?.stop();

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userText = input;
    const userMsg: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    try {
      const response = await chatbotService.sendRoleplay(
        dailyRole.title,
        userText
      );

      // ✅ update usage from backend
      if (response.usage) {
        setUsage(response.usage);

        if (response.usage.remaining === 0) {
          setLimitReached(true);
        }
      }

      const botMsg: Message = {
        role: "bot",
        content: response.reply,
        correction: response.correction ?? undefined,
        originalInput: userText,
      };

      setMessages((prev) => [...prev, botMsg]);
      speakResponse(response.reply);

      try {
      const token =
        localStorage.getItem(
          "access_token"
        );

      if (token) {

        await saveAttempt(
          token,
          {
            exercise_type:
              "roleplay",

            question:
              dailyRole.scenario,

            user_answer:
              userText,

            corrected_answer:
              response.correction
                ?.fixed ||
              response.reply,

            ai_feedback:
              response.correction
                ?.explanation ||
              response.reply,

            accuracy_score:
              response.correction
                ?.fixed
                ? 85
                : 75,

            grammar_score:
              response.correction
                ?.fixed
                ? 85
                : 75,

            fluency_score:
              80,

            vocabulary_score:
              80,

            confidence_score:
              80,

            xp_earned:
              15,

            duration_seconds:
              60,
          }
        );
      }

    } catch (saveError) {

      console.error(
        "Save attempt failed:",
        saveError
      );
    }

    } catch (err: any) {
      let errorText = "Something went wrong. Please try again.";

      if (err.message.includes("daily limit")) {
        errorText = "You've reached your daily limit.";
        setLimitReached(true);
      }

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: errorText },
      ]);

      speakResponse(errorText);
    } finally {
      setIsProcessing(false);
    }
  };

  const replayVoice = (text: string) => speakResponse(text);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-6 p-4 md:p-6 h-[calc(100vh-80px)] overflow-hidden">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4 hidden lg:block">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-5xl mb-6">{dailyRole.avatar}</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-serif tracking-tight">Daily Mission</h2>
            <div className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">
              {dailyRole.title}
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">{dailyRole.scenario}</p>
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-sm text-indigo-800">
              <span className="font-bold block mb-1">💡 Learning Goal:</span>
              {dailyRole.instruction}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} space-y-3 group`}>
                <div className="relative max-w-[85%]">
                  <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>

                  {msg.role === "bot" && (
                    <button
                      onClick={() => replayVoice(msg.content)}
                      className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-100 px-2 py-1 rounded-full shadow-sm"
                      title="Listen again"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                      REPLAY AUDIO
                    </button>
                  )}
                </div>

                {msg.role === "bot" && msg.correction?.fixed && (
                  <div className="max-w-[85%] bg-amber-50 border border-amber-200 rounded-2xl p-4 animate-in fade-in slide-in-from-left-2 duration-500">
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-[10px] uppercase tracking-tighter mb-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      Grammar Feedback
                    </div>
                    <p className="text-xs text-slate-400 line-through mb-1">"{msg.originalInput}"</p>
                    <p className="text-sm font-bold text-slate-900 mb-2">“{msg.correction.fixed}”</p>
                    <p className="text-xs text-amber-800 bg-white/50 p-2 rounded-lg italic">{msg.correction.explanation}</p>
                  </div>
                )}
              </div>
            ))}
            {isProcessing && <div className="text-xs text-slate-400 animate-pulse font-medium">Assistant is thinking...</div>}
          </div>

          {/* Input */}
          <>

            <form
              onSubmit={handleSendMessage}
              className="flex gap-2 bg-slate-100 p-2 rounded-2xl"
            >
              <button
                type="button"
                onClick={startListening}
                className={`p-3 rounded-xl transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-lg"
                    : "bg-white text-slate-400 hover:text-slate-600 shadow-sm"
                }`}
              >
                🎙️
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Message your tutor..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700"
              />

              <button
                disabled={!input.trim() || isProcessing}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold"
              >
                Send
              </button>
            </form>

            {limitReached && (
              <button
                onClick={() => router.push("/pricing")}
                className="w-full mt-3 bg-yellow-500 text-white py-3 rounded-xl font-bold"
              >
                Upgrade for More Chats
              </button>
            )}
          </>
        </div>
      </main>
      <Footer />
    </div>
  );
}