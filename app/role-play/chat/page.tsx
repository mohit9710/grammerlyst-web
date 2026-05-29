"use client";

import {
  useState,
  useEffect,
  useRef,
  Suspense,
} from "react";

import Navbar from "@/components/Navbar";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

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

// ============================================
// MAIN PAGE
// ============================================

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading Roleplay...
        </div>
      }
    >
      <RoleplayChat />
    </Suspense>
  );
}

// ============================================
// CHAT COMPONENT
// ============================================

function RoleplayChat() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] =
    useState("");

  const [isListening, setIsListening] =
    useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [limitReached, setLimitReached] =
    useState(false);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const recognitionRef =
    useRef<any>(null);

  const socketRef =
    useRef<WebSocket | null>(null);

  const isSpacePressedRef =
    useRef(false);

  const [dailyRole, setDailyRole] =
    useState<Role>({
      title: "AI Tutor",
      scenario:
        "Practice speaking English naturally.",
      instruction:
        "Speak confidently and naturally.",
      avatar: "🎭",
      voiceType: "neutral",
    });

  // ============================================
  // TEXT TO SPEECH
  // ============================================

  const speakResponse = (
    text: string
  ) => {
    if (
      typeof window === "undefined"
    )
      return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    const voices =
      window.speechSynthesis.getVoices();

    const selectedVoice =
      voices.find(
        (v) => v.lang === "en-IN"
      ) ||
      voices.find(
        (v) => v.lang === "en-US"
      );

    if (selectedVoice) {
      utterance.voice =
        selectedVoice;
    }

    switch (
      dailyRole.voiceType
    ) {
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

    window.speechSynthesis.speak(
      utterance
    );
  };

  // ============================================
  // LOAD ROLE DATA
  // ============================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {
      router.replace(
        "/auth/login"
      );

      return;
    }

    const roleData: Role = {
      title:
        searchParams.get(
          "title"
        ) || "AI Tutor",

      scenario:
        searchParams.get(
          "scenario"
        ) ||
        "Practice speaking English naturally.",

      instruction:
        searchParams.get(
          "instruction"
        ) ||
        "Speak confidently and naturally.",

      avatar:
        searchParams.get(
          "avatar"
        ) || "🎭",

      voiceType:
        (searchParams.get(
          "voiceType"
        ) as VoiceType) ||
        "neutral",
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
  }, [router, searchParams]);

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
      console.log(
        "WebSocket Connected"
      );
    };

    socket.onclose = () => {
      console.log(
        "WebSocket Closed"
      );
    };

    socket.onerror = (err) => {
      console.log(
        "WebSocket Error:",
        err
      );
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
      if (e.code !== "Space")
        return;

      const active =
        document.activeElement;

      const isTyping =
        active &&
        (active.tagName ===
          "INPUT" ||
          active.tagName ===
            "TEXTAREA" ||
          (
            active as HTMLElement
          ).isContentEditable);

      if (isTyping) return;

      e.preventDefault();

      if (
        isSpacePressedRef.current
      )
        return;

      isSpacePressedRef.current =
        true;

      startListening();
    };

    const handleKeyUp = (
      e: KeyboardEvent
    ) => {
      if (e.code !== "Space")
        return;

      e.preventDefault();

      isSpacePressedRef.current =
        false;

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
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition not supported"
      );

      return;
    }

    if (recognitionRef.current)
      return;

    window.speechSynthesis?.cancel();

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults =
      true;

    recognition.continuous =
      true;

    recognition.onresult = (
      event: any
    ) => {
      let transcript = "";

      for (
        let i =
          event.resultIndex;
        i <
        event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0]
            .transcript;
      }

      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);

      recognitionRef.current =
        null;
    };

    recognition.onerror = () => {
      setIsListening(false);

      recognitionRef.current =
        null;
    };

    recognitionRef.current =
      recognition;

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

  const handleSendMessage =
    async (
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

      socketRef.current.send(
        JSON.stringify({
          role_title:
            dailyRole.title,
          user_input: userText,
        })
      );
    };

  return (
    <div className="min-h-screen bg-[#081120] text-white flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4">
            {dailyRole.title}
          </h1>

          <p className="text-slate-400 mb-10">
            {
              dailyRole.scenario
            }
          </p>

          <form
            onSubmit={
              handleSendMessage
            }
            className="flex gap-4"
          >
            <input
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              placeholder="Speak naturally..."
              className="bg-white/10 px-6 py-4 rounded-2xl outline-none min-w-[400px]"
            />

            <button
              type="submit"
              className="bg-blue-600 px-8 py-4 rounded-2xl font-black"
            >
              Send
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}