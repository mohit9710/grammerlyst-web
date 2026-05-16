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

  const socketRef = useRef<WebSocket | null>(null);

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

    setInput("");
    setIsProcessing(true);

    // ADD USER + EMPTY BOT MESSAGE
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userText,
      },
      {
        role: "bot",
        content: "",
      },
    ]);

    if (!socketRef.current) return;

    let streamedText = "";

    socketRef.current.send(
      JSON.stringify({
        role_title: dailyRole.title,
        user_input: userText,
      })
    );

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // =========================
      // STREAMING RESPONSE
      // =========================
      if (data.type === "chunk") {
        // backend se sirf text chunk aaye
        if (typeof data.content === "string") {
          streamedText += data.content;

          // JSON visible na ho
          const cleanText = streamedText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/\{[\s\S]*?"reply"\s*:/g, "")
            .replace(/"correction"[\s\S]*/g, "")
            .replace(/^\s*"/, "")
            .replace(/"\s*$/, "");

          setMessages((prev) => {
            const updated = [...prev];

            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: cleanText,
            };

            return updated;
          });
        }
      }

      // =========================
      // FINAL RESPONSE
      // =========================
      if (data.type === "done") {
        setIsProcessing(false);

        let parsed: any = null;

        try {
          parsed =
            typeof data.data === "string"
              ? JSON.parse(data.data)
              : data.data;
        } catch (err) {
          console.log("JSON Parse Error");
        }

        // FINAL CLEAN RESPONSE
        const finalReply =
          parsed?.reply ||
          streamedText ||
          "Sorry, I didn't understand.";

        // GRAMMAR CORRECTION FIX
        let correctionData = undefined;

        if (
          parsed?.correction &&
          (parsed.correction.fixed ||
            parsed.correction.explanation)
        ) {
          correctionData = {
            fixed: parsed.correction.fixed,
            explanation: parsed.correction.explanation,
          };
        }

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "bot",
            content: finalReply,
            correction: correctionData,
            originalInput: userText,
          };

          return updated;
        });

        speakResponse(finalReply);
      }
    };
  };

  const replayVoice = (text: string) => speakResponse(text);

  useEffect(() => {
    const socket = new WebSocket(
      "ws://127.0.0.1:9000/sentence/ws/roleplay"
    );

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    socket.onerror = (err) => {
      console.error("WebSocket Error", err);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
    <Navbar />

    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid lg:grid-cols-12 gap-6 min-h-[calc(100vh-220px)]">

        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col gap-6">
          
          {/* ROLE CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-40"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-4xl shadow-lg mb-6">
                {dailyRole.avatar}
              </div>

              <span className="inline-flex px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black tracking-widest uppercase">
                {dailyRole.title}
              </span>

              <h2 className="text-3xl font-black text-slate-900 mt-5 leading-tight">
                Daily Speaking Mission
              </h2>

              <p className="text-slate-600 leading-relaxed mt-4">
                {dailyRole.scenario}
              </p>

              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">
                  Learning Goal
                </p>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {dailyRole.instruction}
                </p>
              </div>
            </div>
          </div>

          {/* VOICE TIPS */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl">
            <h3 className="text-2xl font-black mb-5">
              Speaking Tips
            </h3>

            <div className="space-y-4 text-blue-100">
              <div className="flex gap-3">
                <span>🎯</span>
                <p>Speak slowly and clearly.</p>
              </div>

              <div className="flex gap-3">
                <span>🧠</span>
                <p>Use complete English sentences.</p>
              </div>

              <div className="flex gap-3">
                <span>🚀</span>
                <p>Try professional vocabulary.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* CHAT AREA */}
        <section className="lg:col-span-8 flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="px-6 md:px-8 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
                {dailyRole.avatar}
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  AI Roleplay Tutor
                </h2>

                <p className="text-sm text-slate-500">
                  Practice real-life English conversations
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">
                Live AI
              </span>
            </div>
          </div>

          {/* CHAT BODY */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 bg-gradient-to-b from-slate-50 to-white"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="max-w-[90%] md:max-w-[75%]">

                  {/* CHAT BUBBLE */}
                  <div
                    className={`relative px-6 py-5 rounded-[1.8rem] shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                    }`}
                  >
                    <p className="leading-relaxed text-[15px] md:text-base whitespace-pre-wrap">
                      {msg.content}
                    </p>

                    {/* REPLAY */}
                    {msg.role === "bot" && (
                      <button
                        onClick={() =>
                          replayVoice(msg.content)
                        }
                        className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
                      >
                        🔊 Replay Voice
                      </button>
                    )}
                  </div>

                  {/* CORRECTION BOX */}
                  {msg.role === "bot" &&
                    msg.correction?.fixed && (
                      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 animate-in slide-in-from-bottom-2 duration-300">
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">
                            ✨
                          </span>

                          <p className="text-xs font-black uppercase tracking-widest text-amber-700">
                            Grammar Feedback
                          </p>
                        </div>

                        <p className="text-sm text-slate-400 line-through mb-2">
                          {msg.originalInput}
                        </p>

                        <p className="font-bold text-slate-900 text-lg">
                          {msg.correction.fixed}
                        </p>

                        <p className="mt-3 text-sm text-amber-900 bg-white/60 rounded-xl p-3 italic leading-relaxed">
                          {msg.correction.explanation}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* THINKING */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-6 py-5 rounded-[1.8rem] rounded-bl-md shadow-sm">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT SECTION */}
          <div className="p-4 md:p-6 border-t border-slate-100 bg-white">
            
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-[1.5rem] p-3"
            >
              {/* MIC */}
              <button
                type="button"
                onClick={startListening}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-lg"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                🎙️
              </button>

              {/* INPUT */}
              <input
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                placeholder={
                  isListening
                    ? "Listening..."
                    : "Type your message..."
                }
                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-base px-2"
              />

              {/* SEND */}
              <button
                disabled={
                  !input.trim() || isProcessing
                }
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white px-7 py-4 rounded-2xl font-black transition-all shadow-lg"
              >
                {isProcessing
                  ? "Sending..."
                  : "Send"}
              </button>
            </form>

            {/* LIMIT */}
            {limitReached && (
              <button
                onClick={() =>
                  router.push("/pricing")
                }
                className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-black transition-all"
              >
                Upgrade for More Chats 🚀
              </button>
            )}
          </div>
        </section>
      </div>
    </main>

    <Footer />
  </div>
);
}