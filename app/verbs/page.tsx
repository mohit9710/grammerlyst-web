"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import "../../styles/verbs.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@/services/userService";
import { fetchVerbs, Verb, markVerbViewed } from "@/services/verbs";

export default function VerbsCarousel() {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Added 'isPro' to the user state
  const [user, setUser] = useState({ 
    name: "User Name", 
    email: "user@example.com",
    streak: 5,
    points: 1250,
    isPro: false // Default to false
  });

  useEffect(() => {
    // 1. Update Document Title
    document.title = "Verb Workshop | Master English Verbs | Grammrlyst";

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Master English verbs with interactive flashcards, audio pronunciations, and real-world examples. Perfect for students and teachers.');

    // 3. Update OpenGraph Tags (for Social Media)
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Verb Workshop | Grammrlyst');
    document.head.appendChild(ogTitle);

  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    setLoading(true);

    Promise.all([
      fetchVerbs(1, 30, token),
      fetchUserProfile(token)
    ])
      .then(([verbsData, userData]) => {
        setVerbs(verbsData);
        setUser({
          ...userData,
          isPro: userData.isPro ?? false
        });
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [router]);


  const filteredVerbs = useMemo(() => {
    return verbs.filter((v) =>
      v.base.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, verbs]);

  const scroll = (dir: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8;
      sliderRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  
  const speakText = (text: string) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading Verbs...</div>;

  return (
    <>
    {/* SEO Structured Data (JSON-LD) */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalCredential", // Or 'Course'
          "name": "English Verb Workshop",
          "description": "Interactive flashcards and exercises to master English verbs.",
          "provider": {
            "@type": "Organization",
            "name": "Grammrlyst",
            "url": "https://www.grammrlyst.com"
          },
          "educationalLevel": "Beginner to Intermediate"
        })
      }}
    />
      <Navbar />
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 py-12 px-4">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-900 mb-6 tracking-tight">
            Verb Workshop
          </h1>
          <p className="text-slate-500 text-lg mb-10">
            Master the language with interactive flashcards
          </p>

          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
            <input
              type="text"
              placeholder="Search verbs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full pl-16 pr-6 py-6 rounded-2xl bg-white border border-slate-100 shadow-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xl"
            />
          </div>
        </div>

        {/* Carousel Section */}
        <div className="relative max-w-[95%] lg:max-w-7xl mx-auto mb-16">
          {filteredVerbs.length > 0 ? (
            <>
              <button onClick={() => scroll("left")} className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-md p-5 rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all text-slate-700 border border-slate-100">
                <i className="fas fa-chevron-left text-xl"></i>
              </button>

              <div ref={sliderRef} className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-10 px-4">
                {filteredVerbs.map((verb, index) => {
                  
                  // 2. LOGIC: Is this card locked for THIS user?
                  const isLocked = verb.type === "paid" && !user.isPro;

                  return (
                    <div
                      key={index}
                      onClick={async () => {
                        if (isLocked) {
                          router.replace("/pricing");
                          return;
                        }

                        const token = localStorage.getItem("access_token");
                        if (token) {
                          try {
                            await markVerbViewed(verb.id, token);
                          } catch (err) {
                            console.error("View mark failed", err);
                          }
                        }

                        setSelectedVerb(verb);
                      }}

                      className={`verb-card snap-center cursor-pointer transition-all duration-300 relative ${
                        selectedVerb?.base === verb.base ? "ring-4 ring-blue-500 ring-offset-8 scale-105" : "hover:scale-102"
                      }`}
                    >
                      {/* 3. Improved Lock UI */}
                      {isLocked && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-3xl transition-all">
                          <i className="fas fa-lock text-white text-3xl mb-2"></i>
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-blue-600 px-3 py-1 rounded-full">Pro</span>
                        </div>
                      )}

                      <div className="card-inner">
                        {verb.progress && (
  <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-bold
    bg-green-100 text-green-700">
    {verb.progress.stage === 3 ? "Mastered" :
     verb.progress.stage === 2 ? "Learning" : "Started"}
  </span>
)}
                        <div className="card-front flex items-center justify-center bg-white shadow-lg rounded-3xl border border-slate-100">
                          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                            {verb.base}
                          </h3>
                        </div>
                        <div className="card-back flex items-center justify-center p-8 bg-blue-600 rounded-3xl text-white">
                          <p className="text-center font-medium leading-relaxed">
                            {isLocked ? "Content Locked" : verb.meaning}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => scroll("right")} className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-md p-5 rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all text-slate-700 border border-slate-100">
                <i className="fas fa-chevron-right text-xl"></i>
              </button>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-xl font-medium">No verbs found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Action/Detail Area */}
        <div className="max-w-4xl mx-auto">
          {!selectedVerb ? (
            <div className="text-center p-12 rounded-3xl bg-slate-100/50 border border-slate-200 border-dashed">
              <i className="fas fa-hand-pointer text-slate-300 text-4xl mb-4 block"></i>
              <p className="text-slate-500 italic text-lg">Click a card above to see detailed usage</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex justify-between items-center">
                <div>
                  <h2 className="text-white text-4xl font-bold mb-1">{selectedVerb.base}</h2>
                  <p className="text-blue-100 font-medium">Verb Definition & Usage</p>
                </div>
                <button
                  onClick={() => speakText(`${selectedVerb.base}. ${selectedVerb.meaning}`)}
                  className="bg-white/20 hover:bg-white/30 text-white p-6 rounded-2xl backdrop-blur-md transition-all active:scale-95"
                >
                  <i className="fas fa-volume-up text-3xl"></i>
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-3 block">The Meaning</label>
                  <p className="text-slate-700 text-2xl font-medium leading-relaxed">{selectedVerb.meaning}</p>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-3 block">Example Sentence</label>
                  <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-indigo-500 relative">
                    <i className="fas fa-quote-left absolute top-4 left-4 text-slate-200 text-4xl -z-0"></i>
                    <p className="text-slate-800 text-xl italic font-semibold relative z-10">
                      "{selectedVerb.example  || `The word ${selectedVerb.base} is used to describe an action.`}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}