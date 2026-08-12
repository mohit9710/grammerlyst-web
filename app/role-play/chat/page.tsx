"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { chatbotService } from "@/services/chatbotService";
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

type VoiceType =
  | "professional"
  | "calm"
  | "formal"
  | "neutral";

interface Role {
  title: string;
  scenario: string;
  instruction: string;
  avatar: string;
  voiceType: VoiceType;
}

export default function RoleplayChat() {
  return (
    <Suspense fallback={null}>
      <RoleplayChatInner />
    </Suspense>
  );
}

function RoleplayChatInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const isSpacePressedRef = useRef(false);

  const [dailyRole, setDailyRole] = useState<Role>({
    title: "AI Tutor",
    scenario: "Practice speaking English naturally.",
    instruction: "Speak confidently and naturally.",
    avatar: "🎭",
    voiceType: "neutral",
  });

  // ============================================
  // TEXT TO SPEECH
  // ============================================
  const speakResponse = (text: string) => {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    const voices =
      window.speechSynthesis.getVoices();

    const selectedVoice =
      voices.find((v) => v.lang === "en-IN") ||
      voices.find((v) => v.lang === "en-US");

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    switch (dailyRole.voiceType) {
      case "professional":
        utterance.rate = 0.92;
        utterance.pitch = 0.9;
        break;

      case "formal":
        utterance.rate = 0.9;
        utterance.pitch = 0.88;
        break;

      case "calm":
        utterance.rate = 0.85;
        utterance.pitch = 0.8;
        break;

      default:
        utterance.rate = 0.96;
        utterance.pitch = 1;
    }

    window.speechSynthesis.speak(utterance);
  };

  // ============================================
  // LOAD ROLE DATA
  // ============================================
  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const roleData: Role = {
      title:
        searchParams.get("title") ||
        "AI Tutor",

      scenario:
        searchParams.get("scenario") ||
        "Practice speaking English naturally.",

      instruction:
        searchParams.get("instruction") ||
        "Speak confidently and naturally.",

      avatar:
        searchParams.get("avatar") || "🎭",

      voiceType:
        (searchParams.get(
          "voiceType"
        ) as VoiceType) || "neutral",
    };

    setDailyRole(roleData);

    const greeting = `Hello 👋 I am your ${roleData.title}. ${roleData.scenario} Let's begin our conversation.`;

    setMessages([
      {
        role: "bot",
        content: greeting,
      },
    ]);

    setTimeout(() => {
      speakResponse(greeting);
    }, 800);
  }, []);

  // ============================================
  // AUTO SCROLL
  // ============================================
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ============================================
  // WEBSOCKET
  // ============================================
  useEffect(() => {
    const socket =
      chatbotService.createRoleplaySocket();

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onclose = () => {
      console.log("WebSocket Closed");
    };

    socket.onerror = (err) => {
      console.log("WebSocket Error:", err);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  // ============================================
  // SPACE HOLD SPEAK
  // ============================================
  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.code !== "Space") return;

      const active =
        document.activeElement;

      const isTyping =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement)
            .isContentEditable);

      if (isTyping) return;

      e.preventDefault();

      if (isSpacePressedRef.current)
        return;

      isSpacePressedRef.current = true;

      startListening();
    };

    const handleKeyUp = (
      e: KeyboardEvent
    ) => {
      if (e.code !== "Space") return;

      e.preventDefault();

      isSpacePressedRef.current = false;

      stopListening();
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );
    };
  }, []);

  // ============================================
  // START LISTENING
  // ============================================
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition not supported"
      );
      return;
    }

    if (recognitionRef.current) return;

    window.speechSynthesis?.cancel();

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (
      event: any
    ) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    recognition.start();

    setIsListening(true);
  };

  // ============================================
  // STOP LISTENING
  // ============================================
  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  // ============================================
  // SEND MESSAGE
  // ============================================
  const handleSendMessage = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    if (
      !input.trim() ||
      isProcessing ||
      !socketRef.current
    )
      return;

    const userText = input;

    setInput("");
    setIsProcessing(true);

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

    let streamedText = "";

    socketRef.current.send(
      JSON.stringify({
        role_title: dailyRole.title,
        user_input: userText,
      })
    );

    socketRef.current.onmessage = async (
      event
    ) => {
      const data = JSON.parse(
        event.data
      );

      // ============================
      // STREAMING RESPONSE
      // ============================
      if (data.type === "chunk") {
        if (
          typeof data.content ===
          "string"
        ) {
          streamedText += data.content;

          let cleanReply = "";

          try {
            const parsed =
              JSON.parse(
                streamedText
              );

            cleanReply =
              parsed.reply || "";
          } catch {
            const match =
              streamedText.match(
                /"reply"\s*:\s*"([^"]*)/
              );

            cleanReply =
              match?.[1] || "";
          }

          cleanReply = cleanReply
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"');

          setMessages((prev) => {
            const updated = [...prev];

            updated[
              updated.length - 1
            ] = {
              role: "bot",
              content: cleanReply,
            };

            return updated;
          });
        }
      }

      // ============================
      // FINAL RESPONSE
      // ============================
      if (data.type === "done") {
        setIsProcessing(false);

        let parsed: any = null;

        try {
          parsed =
            typeof data.data ===
            "string"
              ? JSON.parse(
                  data.data
                )
              : data.data;
        } catch (err) {
          console.log(
            "JSON Parse Error"
          );
        }

        const finalReply =
          parsed?.reply ||
          streamedText ||
          "Sorry, I didn't understand.";

        let correctionData =
          undefined;

        if (
          parsed?.correction &&
          (parsed.correction.fixed ||
            parsed.correction
              .explanation)
        ) {
          correctionData = {
            fixed:
              parsed.correction.fixed,
            explanation:
              parsed.correction
                .explanation,
          };
        }

        setMessages((prev) => {
          const updated = [...prev];

          updated[
            updated.length - 1
          ] = {
            role: "bot",
            content: finalReply,
            correction:
              correctionData,
            originalInput:
              userText,
          };

          return updated;
        });

        try {
          const token =
            localStorage.getItem("access_token");

          if (token) {
            await saveAttempt(token, {
              exercise_type: "roleplay",

              question: dailyRole.title,

              user_answer: userText,

              corrected_answer:
                correctionData?.fixed || userText,

              ai_feedback:
                correctionData?.explanation ||
                finalReply,

              accuracy_score: 85,

              grammar_score:
                correctionData?.fixed ? 95 : 80,

              vocabulary_score: 78,

              confidence_score: 82,

              xp_earned: 15,

              duration_seconds: 60,
            });
          }
        } catch (err) {
          console.log(
            "Failed to save roleplay attempt",
            err
          );
        }

        speakResponse(finalReply);
      }

      // ============================
      // LIMIT
      // ============================
      if (
        data.type ===
        "limit_reached"
      ) {
        setLimitReached(true);
      }
    };
  };

  // ============================================
  // UI
  // ============================================
  return (
    <div className="min-h-screen bg-[#081120] text-white flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="hidden lg:flex w-[360px] border-r border-white/10 bg-white/[0.03] backdrop-blur-xl flex-col">
          <div className="p-8 border-b border-white/10">
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl shadow-2xl mb-6">
              {dailyRole.avatar}
            </div>

            <div className="inline-flex px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-black tracking-widest uppercase">
              AI Scenario
            </div>

            <h1 className="text-4xl font-black leading-tight mt-5">
              {dailyRole.title}
            </h1>

            <p className="text-slate-400 leading-relaxed mt-4">
              {dailyRole.scenario}
            </p>
          </div>

          <div className="p-8">
            <div className="bg-white/[0.04] border border-white/10 rounded-[28px] p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-blue-300 font-black mb-3">
                Speaking Goal
              </div>

              <p className="text-slate-300 leading-relaxed">
                {
                  dailyRole.instruction
                }
              </p>
            </div>
          </div>
        </aside>

        {/* CHAT */}
        <section className="flex-1 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="h-24 border-b border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 md:px-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl">
                {dailyRole.avatar}
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  AI Roleplay Session
                </h2>

                <p className="text-sm text-slate-400">
                  Practice real English
                  conversations
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>

              <span className="text-sm font-bold text-emerald-300">
                Live AI
              </span>
            </div>
          </div>

          {/* BODY */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-10 py-10 space-y-8"
          >
            {messages.map(
              (msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="max-w-[90%] md:max-w-[70%]">
                    <div
                      className={`rounded-[28px] px-6 py-5 shadow-xl ${
                        msg.role ===
                        "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 rounded-br-md"
                          : "bg-white/[0.05] border border-white/10 rounded-bl-md"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>

                      {msg.role ===
                        "bot" &&
                        msg.content && (
                          <button
                            onClick={() =>
                              speakResponse(
                                msg.content
                              )
                            }
                            className="mt-4 text-xs text-blue-300 hover:text-blue-200 font-bold"
                          >
                            🔊 Replay
                            Voice
                          </button>
                        )}
                    </div>

                    {/* CORRECTION */}
                    {msg.correction
                      ?.fixed && (
                      <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
                        <div className="text-xs uppercase tracking-widest text-yellow-300 font-black mb-3">
                          Grammar
                          Feedback
                        </div>

                        <p className="text-sm text-red-300 line-through">
                          {
                            msg.originalInput
                          }
                        </p>

                        <p className="text-lg font-bold text-white mt-2">
                          {
                            msg
                              .correction
                              .fixed
                          }
                        </p>

                        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                          {
                            msg
                              .correction
                              .explanation
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* THINKING */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/[0.05] border border-white/10 px-6 py-5 rounded-[28px] rounded-bl-md">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>

                    <span className="w-2 h-2 rounded-full bg-white animate-bounce delay-100"></span>

                    <span className="w-2 h-2 rounded-full bg-white animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-4 md:p-6 border-t border-white/10 bg-[#0f172a]">
            <form
              onSubmit={
                handleSendMessage
              }
              className="bg-white/[0.05] border border-white/10 rounded-[28px] p-3 flex items-center gap-3"
            >
              {/* MIC */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onMouseDown={(
                    e
                  ) => {
                    e.preventDefault();
                    startListening();
                  }}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    stopListening();
                  }}
                  onMouseLeave={(
                    e
                  ) => {
                    e.preventDefault();
                    stopListening();
                  }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${
                    isListening
                      ? "bg-red-500 animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.6)]"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  🎤
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-tight">
                  Hold{" "}
                  <span className="font-bold text-white">
                    Space
                  </span>{" "}
                  to speak
                </p>
              </div>

              {/* INPUT */}
              <input
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                placeholder={
                  isListening
                    ? "Listening..."
                    : "Speak naturally..."
                }
                className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 px-3"
              />

              {/* SEND */}
              <button
                type="submit"
                disabled={
                  !input.trim() ||
                  isProcessing
                }
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 px-8 py-4 rounded-2xl font-black"
              >
                {isProcessing
                  ? "Thinking..."
                  : "Send"}
              </button>
            </form>

            {/* LIMIT */}
            {limitReached && (
              <button
                onClick={() =>
                  router.push(
                    "/pricing"
                  )
                }
                className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-2xl font-black"
              >
                Upgrade for
                Unlimited Chats 🚀
              </button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}