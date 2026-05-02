"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchPronunciation } from "@/services/pronunciationService";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import useUser from "@/hooks/userProfile";

interface TextData {
  id: number;
  content: string;
  difficulty_level: string;
  category: string;
  created_at: string;
}

interface Props {
  textData: TextData | null;
  loading: boolean;
  recognition: any;
  isRecording: boolean;
  userSpokenText: string;
  accuracy: number | null;
  onNext: () => void;
  onToggleRecording: () => void;
}

const calculateAccuracy = (original: string, spoken: string): number => {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .trim();

  const s1Words = clean(original).split(/\s+/);
  const s2Words = clean(spoken).split(/\s+/);

  let commonCount = 0;
  const map = new Map<string, number>();

  s1Words.forEach((w) => map.set(w, (map.get(w) || 0) + 1));

  s2Words.forEach((w) => {
    if (map.has(w) && (map.get(w) as number) > 0) {
      commonCount++;
      map.set(w, (map.get(w) as number) - 1);
    }
  });

  return s1Words.length
    ? Math.round((commonCount / s1Words.length) * 100)
    : 0;
};

export default function Pronunciation() {

    const [textData, setTextData] = useState<TextData | null>(null);
    const [userSpokenText, setUserSpokenText] = useState("");
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const { user, isAuth, loading } = useUser();

    const router = useRouter();

    const fetchNewText = async () => {
      setAccuracy(null);
      setUserSpokenText("");
  
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token") || ""
          : "";
  
      if (!token) return router.replace("/auth/login");
  
      try {
        const data: unknown = await fetchPronunciation(token);
  
        if (Array.isArray(data) && data.length > 0) {
          setTextData(data[0] as TextData);
        } else if (data && typeof data === "object" && "content" in data) {
          setTextData(data as TextData);
        } else {
          setTextData(null);
        }
      } catch (error) {
        console.error("Error fetching text:", error);
        setTextData(null);
      } finally {
      }
    };

    useEffect(() => {

    if (loading) return;

    if (!isAuth) {
      router.replace("/auth/login");
      return;
    }

    // if (user && !user.is_paid) {
    //   router.replace("/pricing");
    // }
    fetchNewText();

    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) return;

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-IN";

      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserSpokenText(transcript);
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);

      setRecognition(rec);
    }
  }, [loading, isAuth, user]);

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);

      if (textData?.content) {
        setAccuracy(calculateAccuracy(textData.content, userSpokenText));
      }
    } else {
      setUserSpokenText("");
      setAccuracy(null);

      try {
        recognition.start();
        setIsRecording(true);
      } catch {}
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
          {/* ✅ Hidden SEO content */}
          <div className="sr-only">
            <h1>English Pronunciation Practice</h1>
            <p>
              Practice sentence: {textData?.content}. Improve your speaking and
              pronunciation skills using AI.
            </p>
          </div>

          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Pronunciation Lab
              </h1>
              <p className="text-slate-500 font-medium italic">
                Level:{" "}
                <span className="text-blue-600 uppercase font-bold">
                  {textData?.difficulty_level || "..."}
                </span>
              </p>
            </div>

            <button
              onClick={fetchNewText}
              disabled={loading}
              className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              Next Text
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 flex flex-col justify-center min-h-[400px]">
              {loading ? (
                <div className="text-center text-slate-400 font-bold animate-pulse">
                  Fetching from Database...
                </div>
              ) : (
                <p className="text-3xl md:text-4xl font-bold text-slate-800 text-center leading-[1.6]">
                  {textData?.content || "No text available"}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border text-center">
                <button
                  disabled={loading || !recognition}
                  onClick={() => {
                    if (!user?.is_paid) {
                      router.push("/pricing");
                      return;
                    }
                    toggleRecording();
                  }}
                  className={`w-full py-5 rounded-2xl font-black text-lg ${
                    !user?.is_paid
                      ? "bg-yellow-500 text-white"
                      : isRecording
                      ? "bg-red-50 text-red-600 border-2 border-red-200"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {!user?.is_paid
                    ? "Upgrade to Pro"
                    : isRecording
                    ? "Stop & Analyze"
                    : "Start Reading"}
                </button>

                <div className="mt-6 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                    Live Transcription
                  </label>

                  <div className="bg-slate-50 p-4 rounded-xl min-h-[100px] text-sm italic">
                    {userSpokenText ||
                      (isRecording
                        ? "Listening..."
                        : "Click start to begin...")}
                  </div>
                </div>
              </div>

              {accuracy !== null && (
                <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-b-8 border-blue-600 text-center">
                  <div className="text-7xl font-black">{accuracy}%</div>
                </div>
              )}
            </div>
          </div>
        </main>
  );
}