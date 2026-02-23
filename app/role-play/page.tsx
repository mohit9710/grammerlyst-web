"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { chatbotService } from "@/services/chatbotService";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "bot";
  content: string;
  correction?: {
    fixed: string | null;
    explanation: string | null;
  };
  originalInput?: string;
}

export default function RoleplayChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dailyRole, setDailyRole] = useState({
    title: "Job Interviewer",
    scenario: "You are applying for a Senior Designer role at a tech firm.",
    instruction: "Try to use professional vocabulary and explain your work process.",
    avatar: "👔"
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isSpacePressedRef = useRef(false);
  // --- TTS Function (Bot Voice) ---
  const speakResponse = (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Optional: Pick a specific voice (English)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
    voices.find(v => v.lang === "en-US" && v.name.includes("Google")) ||
    voices.find(v => v.lang === "en-US");

    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const roles = [
      { title: "Hotel Receptionist", scenario: "You are checking into a luxury hotel in London.", instruction: "Practice polite requests and formal greetings.", avatar: "🛎️" },
      { title: "Doctor", scenario: "You are explaining a recurring headache to a specialist.", instruction: "Use descriptive words for symptoms.", avatar: "🩺" },
      { title: "Barista", scenario: "You are ordering a complex drink for a group of friends.", instruction: "Practice modifiers and quantities.", avatar: "☕" }
    ];
    const today = new Date().getDay() % roles.length;
    const selectedRole = roles[today];
    setDailyRole(selectedRole);
    
    const initialGreeting = `Hello! I am your ${selectedRole.title}. ${selectedRole.scenario} Shall we begin?`;
    setMessages([{ role: "bot", content: initialGreeting }]);
    
    // Speak initial greeting
    setTimeout(() => speakResponse(initialGreeting), 1000);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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

        e.preventDefault(); // 🚫 stop page scroll
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
        recognitionRef.current?.stop(); // 🧹 cleanup
    };
    }, []);


  const startListening = () => {
    const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Browser does not support voice speech.");
        return;
    }

    if (recognitionRef.current) return;

    // 🔇 stop bot speaking while user talks
    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
    };

    recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;

        // ✅ ONLY auto-send if space was used
        if (!isSpacePressedRef.current) {
        setTimeout(() => handleSendMessage(), 120);
        }
    };

    recognition.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };  

  const stopListening = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userText = input;
    const userMsg: Message = { role: "user", content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    try {
      const response = await chatbotService.sendRoleplay(dailyRole.title, userText);
      
      const botMsg: Message = {
        role: "bot",
        content: response.reply,
        correction: response.correction ?? undefined,
        originalInput: userText
      };
      
      setMessages(prev => [...prev, botMsg]);
      
      // --- TRIGGER BOT VOICE ---
      speakResponse(response.reply);

    } catch (err) {
      const errorText = "I'm having trouble staying in character. Please try again!";
      setMessages(prev => [...prev, { role: "bot", content: errorText }]);
      speakResponse(errorText);
    } finally {
      setIsProcessing(false);
    }
  };

  const replayVoice = (text: string) => {
    speakResponse(text);
  };

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
                    
                    {/* Bubble Container */}
                    <div className="relative max-w-[85%]">
                    <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base ${
                        msg.role === "user" 
                        ? "bg-slate-900 text-white rounded-tr-none" 
                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                    }`}>
                        {msg.content}
                    </div>

                    {/* 2. REPLAY BUTTON (Only for Bot messages) */}
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

                    {/* Correction Card (unchanged) */}
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
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
              <button 
                type="button"
                onClick={startListening}
                className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'bg-white text-slate-400 hover:text-slate-600 shadow-sm'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Message your tutor..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
              />
              <button 
                disabled={!input.trim() || isProcessing}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-20"
              >
                Send
              </button>
            </form>

            <p className="text-[10px] text-slate-400 mt-1">
                🎙️ Hold SPACE to speak
                </p>
          </div>
        </div>
      </main>
    </div>
  );
}