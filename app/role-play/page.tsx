"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { chatbotService } from "@/services/chatbotService";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

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
  const [loading, setLoading] = useState(true);
  const [dailyRole, setDailyRole] = useState({
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
      { title: "Doctor", scenario: "You are explaining a recurring headache to a specialist.", instruction: "Use descriptive words for symptoms.", avatar: "🩺", voiceType: "calm" },
      { title: "Barista", scenario: "You are ordering a complex drink for a group of friends.", instruction: "Practice modifiers and quantities.", avatar: "☕", voiceType: "neutral" },
      { title: "Airport Officer", scenario: "You are asking for visa details at the airport.", instruction: "Use polite, professional English.", avatar: "🛫", voiceType: "professional" },
      { title: "Tour Guide", scenario: "You are giving a guided tour at a museum.", instruction: "Explain facts clearly and engagingly.", avatar: "🎤", voiceType: "neutral" },
      { title: "Customer Support", scenario: "You are helping a customer with a billing issue.", instruction: "Be patient and clear in instructions.", avatar: "📞", voiceType: "professional" },
      { title: "Teacher", scenario: "You are explaining basic physics to students.", instruction: "Use simple examples and clear explanations.", avatar: "📚", voiceType: "calm" },
      { title: "Police Officer", scenario: "You are questioning a witness about a theft.", instruction: "Use formal and precise questions.", avatar: "👮‍♂️", voiceType: "formal" },
      { title: "Chef", scenario: "You are giving instructions for making a complex dish.", instruction: "Explain step by step clearly.", avatar: "👨‍🍳", voiceType: "neutral" },
      { title: "Flight Attendant", scenario: "You are welcoming passengers onboard.", instruction: "Be polite, clear, and professional.", avatar: "🛫", voiceType: "professional" },
      { title: "Bank Teller", scenario: "You are helping a client open a new account.", instruction: "Use formal banking vocabulary.", avatar: "🏦", voiceType: "formal" },
      { title: "Software Engineer", scenario: "You are explaining your latest project in a team meeting.", instruction: "Use technical terms clearly.", avatar: "💻", voiceType: "neutral" },
      { title: "Marketing Manager", scenario: "You are pitching a new campaign to stakeholders.", instruction: "Use confident and persuasive language.", avatar: "📊", voiceType: "professional" },
      { title: "Lawyer", scenario: "You are giving legal advice to a client.", instruction: "Explain complex ideas in simple terms.", avatar: "⚖️", voiceType: "formal" },
      { title: "Journalist", scenario: "You are interviewing a celebrity.", instruction: "Ask concise and engaging questions.", avatar: "📝", voiceType: "neutral" },
      { title: "Tourist", scenario: "You are asking for directions in a foreign city.", instruction: "Use polite and clear English.", avatar: "🧳", voiceType: "neutral" },
      { title: "Fitness Trainer", scenario: "You are coaching a client in the gym.", instruction: "Use motivational and clear instructions.", avatar: "🏋️‍♂️", voiceType: "professional" },
      { title: "HR Manager", scenario: "You are conducting a job interview.", instruction: "Ask professional questions and give feedback.", avatar: "💼", voiceType: "professional" },
      { title: "IT Support", scenario: "You are troubleshooting a network issue for an employee.", instruction: "Use clear technical instructions.", avatar: "🖥️", voiceType: "calm" },
      { title: "Librarian", scenario: "You are helping a visitor find specific books.", instruction: "Use polite and precise instructions.", avatar: "📖", voiceType: "calm" },
      { title: "Taxi Driver", scenario: "You are asking for the destination of a passenger.", instruction: "Be clear and friendly.", avatar: "🚕", voiceType: "neutral" },
      { title: "Conference Speaker", scenario: "You are giving a presentation to an international audience.", instruction: "Speak confidently and clearly.", avatar: "🎙️", voiceType: "professional" },
      { title: "Fashion Designer", scenario: "You are explaining your design inspiration.", instruction: "Use creative vocabulary and style terms.", avatar: "👗", voiceType: "formal" },
      { title: "Real Estate Agent", scenario: "You are showing a house to a potential buyer.", instruction: "Describe features clearly and persuasively.", avatar: "🏠", voiceType: "professional" },
      { title: "Photographer", scenario: "You are directing a model for a photoshoot.", instruction: "Give clear, concise guidance.", avatar: "📸", voiceType: "neutral" },
      { title: "Customer", scenario: "You are returning a defective product.", instruction: "Use polite but firm language.", avatar: "🛍️", voiceType: "neutral" },
      { title: "Receptionist", scenario: "You are welcoming guests to a spa.", instruction: "Use calm and polite English.", avatar: "💆‍♀️", voiceType: "calm" },
      { title: "Nurse", scenario: "You are explaining a medical procedure to a patient.", instruction: "Use comforting and clear language.", avatar: "🩺", voiceType: "calm" },
      { title: "Judge", scenario: "You are giving instructions in a courtroom.", instruction: "Use formal and authoritative language.", avatar: "⚖️", voiceType: "formal" },
      { title: "Actor", scenario: "You are practicing a dramatic scene.", instruction: "Use expressive and emotional language.", avatar: "🎭", voiceType: "neutral" },
      { title: "Student", scenario: "You are asking a teacher about an assignment.", instruction: "Be polite and clear in your questions.", avatar: "🎓", voiceType: "neutral" },
      { title: "Politician", scenario: "You are giving a speech at a public event.", instruction: "Speak confidently and persuasively.", avatar: "🏛️", voiceType: "professional" },
      { title: "Mechanic", scenario: "You are explaining a car problem to a customer.", instruction: "Use simple, clear language.", avatar: "🔧", voiceType: "neutral" },
      { title: "Chef", scenario: "You are teaching a cooking class.", instruction: "Give instructions clearly and step-by-step.", avatar: "👨‍🍳", voiceType: "calm" },
      { title: "Event Planner", scenario: "You are explaining a schedule to staff.", instruction: "Use professional, clear instructions.", avatar: "📅", voiceType: "professional" },
      { title: "Pilot", scenario: "You are briefing your co-pilot before a flight.", instruction: "Use precise and formal language.", avatar: "✈️", voiceType: "formal" },
      { title: "Scientist", scenario: "You are presenting research findings to colleagues.", instruction: "Use clear and technical language.", avatar: "🔬", voiceType: "formal" },
      { title: "Musician", scenario: "You are explaining the meaning of a song to fans.", instruction: "Be expressive and descriptive.", avatar: "🎵", voiceType: "neutral" },
      { title: "Dentist", scenario: "You are explaining dental care to a patient.", instruction: "Be calm and professional.", avatar: "🦷", voiceType: "calm" },
      { title: "Yoga Instructor", scenario: "You are guiding a class through poses.", instruction: "Speak slowly and clearly.", avatar: "🧘‍♀️", voiceType: "calm" },
      { title: "Coach", scenario: "You are motivating a sports team before a match.", instruction: "Use confident and energetic language.", avatar: "🏀", voiceType: "professional" },
      { title: "Entrepreneur", scenario: "You are pitching a business idea to investors.", instruction: "Use persuasive, professional language.", avatar: "💡", voiceType: "professional" },
      { title: "Translator", scenario: "You are interpreting a conversation between two people.", instruction: "Be precise and neutral.", avatar: "🈯", voiceType: "neutral" },
      { title: "Pilot Trainer", scenario: "You are teaching a trainee pilot the flight controls.", instruction: "Explain clearly and systematically.", avatar: "✈️", voiceType: "formal" },
      { title: "Volunteer Coordinator", scenario: "You are instructing volunteers at an event.", instruction: "Use polite and clear language.", avatar: "🤝", voiceType: "calm" },
      { title: "Retail Manager", scenario: "You are briefing staff on a sales promotion.", instruction: "Speak clearly and professionally.", avatar: "🏬", voiceType: "professional" },
      { title: "Receptionist", scenario: "You are greeting visitors at an office.", instruction: "Be polite and formal.", avatar: "💁‍♀️", voiceType: "formal" },
      { title: "Tech Support", scenario: "You are guiding a user through software installation.", instruction: "Use clear and precise instructions.", avatar: "💻", voiceType: "neutral" },
      { title: "Journalist", scenario: "You are writing questions for an interview.", instruction: "Use concise and clear language.", avatar: "📝", voiceType: "neutral" },
      { title: "Photographer Assistant", scenario: "You are helping set up a photoshoot.", instruction: "Follow instructions precisely.", avatar: "📸", voiceType: "calm" },
      { title: "Actor Coach", scenario: "You are training actors for a stage play.", instruction: "Use expressive and motivating language.", avatar: "🎭", voiceType: "neutral" },
      { title: "Store Clerk", scenario: "You are assisting customers with purchases.", instruction: "Be polite and clear.", avatar: "🛍️", voiceType: "calm" },
      { title: "Delivery Driver", scenario: "You are explaining a delivery route.", instruction: "Use clear directions.", avatar: "🚚", voiceType: "neutral" },
      { title: "Tourist Guide", scenario: "You are describing landmarks to tourists.", instruction: "Be engaging and clear.", avatar: "🗽", voiceType: "neutral" },
      { title: "Wedding Planner", scenario: "You are coordinating a wedding ceremony.", instruction: "Give clear and professional instructions.", avatar: "💒", voiceType: "professional" },
      { title: "Public Speaker", scenario: "You are addressing an audience on climate change.", instruction: "Speak confidently and clearly.", avatar: "🎙️", voiceType: "professional" },
      { title: "Counselor", scenario: "You are helping someone with stress management.", instruction: "Use calm and supportive language.", avatar: "🧑‍⚕️", voiceType: "calm" },
      { title: "Police Chief", scenario: "You are briefing officers before a mission.", instruction: "Use authoritative and clear language.", avatar: "👮‍♂️", voiceType: "formal" },
      { title: "Flight Controller", scenario: "You are guiding a plane safely to land.", instruction: "Speak clearly and precisely.", avatar: "🛫", voiceType: "formal" },
      { title: "Entrepreneur Mentor", scenario: "You are advising a startup founder.", instruction: "Use professional and constructive language.", avatar: "💼", voiceType: "professional" },
      { title: "Chef Instructor", scenario: "You are teaching a cooking technique.", instruction: "Give step-by-step instructions clearly.", avatar: "👨‍🍳", voiceType: "calm" },
      { title: "Radio Host", scenario: "You are interviewing a guest live on air.", instruction: "Speak clearly and engagingly.", avatar: "🎧", voiceType: "neutral" },
      { title: "Museum Curator", scenario: "You are explaining an exhibit to visitors.", instruction: "Use informative and clear language.", avatar: "🏛️", voiceType: "neutral" },
      { title: "Investor", scenario: "You are asking questions about a business pitch.", instruction: "Be precise and professional.", avatar: "💰", voiceType: "formal" },
      { title: "Translator", scenario: "You are translating a speech for a diplomat.", instruction: "Use clear and neutral language.", avatar: "🌐", voiceType: "neutral" },
      { title: "Actor", scenario: "You are performing an emotional monologue.", instruction: "Be expressive and clear.", avatar: "🎭", voiceType: "neutral" },
      { title: "Teacher", scenario: "You are teaching English grammar to students.", instruction: "Be clear and structured.", avatar: "📚", voiceType: "calm" },
      { title: "Singer", scenario: "You are explaining the lyrics of a song.", instruction: "Use expressive language.", avatar: "🎤", voiceType: "neutral" },
      { title: "Politician", scenario: "You are giving an official statement.", instruction: "Speak confidently and formally.", avatar: "🏛️", voiceType: "formal" },
      { title: "Software Trainer", scenario: "You are teaching a team to use new software.", instruction: "Be patient and clear.", avatar: "💻", voiceType: "calm" },
      { title: "Fitness Coach", scenario: "You are explaining exercises to a client.", instruction: "Use clear and motivational language.", avatar: "🏋️‍♂️", voiceType: "professional" },
      { title: "Customer", scenario: "You are complaining about a delayed order.", instruction: "Be polite but firm.", avatar: "🛍️", voiceType: "neutral" },
      { title: "Tourist", scenario: "You are asking about public transport options.", instruction: "Use polite and clear questions.", avatar: "🧳", voiceType: "neutral" },
      { title: "Waiter", scenario: "You are taking orders at a busy restaurant.", instruction: "Be polite and concise.", avatar: "🍽️", voiceType: "calm" },
      { title: "Chef", scenario: "You are explaining a new recipe to kitchen staff.", instruction: "Be clear and organized.", avatar: "👨‍🍳", voiceType: "professional" },
      { title: "DJ", scenario: "You are announcing the next track to the audience.", instruction: "Speak energetically and clearly.", avatar: "🎧", voiceType: "neutral" },
      { title: "Nurse", scenario: "You are explaining medication instructions.", instruction: "Be calm and precise.", avatar: "🩺", voiceType: "calm" },
      { title: "Pilot", scenario: "You are giving a pre-flight briefing.", instruction: "Use professional and clear language.", avatar: "✈️", voiceType: "formal" },
      { title: "Coach", scenario: "You are giving feedback to athletes after training.", instruction: "Be constructive and clear.", avatar: "🏀", voiceType: "professional" },
      { title: "Actor Director", scenario: "You are directing actors for a film scene.", instruction: "Use expressive and clear instructions.", avatar: "🎬", voiceType: "neutral" },
      { title: "Event Host", scenario: "You are welcoming guests to a formal dinner.", instruction: "Speak politely and clearly.", avatar: "🎉", voiceType: "formal" },
      { title: "Travel Agent", scenario: "You are recommending travel packages to clients.", instruction: "Be clear and persuasive.", avatar: "🌍", voiceType: "professional" },
      { title: "Medical Specialist", scenario: "You are explaining a diagnosis to a patient.", instruction: "Be precise and reassuring.", avatar: "🩺", voiceType: "calm" },
      { title: "Reporter", scenario: "You are reporting a breaking news story live.", instruction: "Speak clearly and confidently.", avatar: "📰", voiceType: "professional" },
      { title: "Librarian", scenario: "You are helping a student find research resources.", instruction: "Be clear and patient.", avatar: "📚", voiceType: "calm" },
    ];

    const today = new Date().getDay() % roles.length;
    const selectedRole = roles[today];
    setDailyRole(selectedRole);

    const initialGreeting = `Hello! I am your ${selectedRole.title}. ${selectedRole.scenario} Shall we begin?`;
    setMessages([{ role: "bot", content: initialGreeting }]);
    setLoading(false);
    // Speak initial greeting
    setTimeout(() => speakResponse(initialGreeting), 1000);
  }, []);

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

  const [error, setError] = useState<string | null>(null);

// 2. handleSendMessage function ko update karein
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    setError(null); // Purana error clear karein
    const userText = input;
    // ... (rest of your existing logic)

    try {
      const response = await chatbotService.sendRoleplay(dailyRole.title, userText);
      // ... (rest of your logic)
    } catch (err: any) {
      // Backend error check karein
      if (err.response?.status === 429 || err.message?.includes("limit reached")) {
        setError("Free daily limit reached. Upgrade to continue.");
      } else {
        const errorText = "I'm having trouble staying in character. Please try again!";
        setMessages((prev) => [...prev, { role: "bot", content: errorText }]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const replayVoice = (text: string) => speakResponse(text);

  if (loading) return <div className="p-20 text-center font-bold">Loading Roleplay Chat...</div>;

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

          {/* --- Chat Area ke andar, Input section se pehle add karein --- */}
          {error && (
            <div className="mx-4 mb-2 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 text-rose-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="text-sm font-bold">{error}</span>
              </div>
              <button 
                onClick={() => router.push("/")} 
                className="bg-rose-600 text-white px-4 py-1.5 rounded-lg text-xs font-black hover:bg-rose-700 transition-all shadow-sm shadow-rose-200"
              >
                UPGRADE
              </button>
            </div>
          )}
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
            <p className="text-[10px] text-slate-400 mt-1">🎙️ Hold SPACE to speak</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}