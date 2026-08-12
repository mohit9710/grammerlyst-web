"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import "../../styles/verbs.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { fetchVerbs, Verb, markVerbViewed } from "@/services/verbs";
import { saveAttempt } from "@/services/reportAnalysis";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";

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
      if (selectedVerb) {
        // 1. Title Update
        document.title = `${selectedVerb.base} - Meaning, Examples & Pronunciation | Grammrlyst`;

        // 2. Meta Description Update
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', `Learn the verb "${selectedVerb.base}". Meaning: ${selectedVerb.meaning}. Example: ${selectedVerb.example}`);
        }

        // 3. Update URL without refreshing (SEO-friendly deep linking)
        const newPath = `/verbs?word=${selectedVerb.base.toLowerCase()}`;
        window.history.pushState({ path: newPath }, '', newPath);
      }
  }, [selectedVerb]);
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // router.replace("/auth/login");
      // return;
    }

    setLoading(true);

    Promise.all([
      fetchVerbs(1, 30),
    ])
      .then(([verbsData]) => {
        setVerbs(verbsData);
        
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
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_45%,_#ffffff)] py-10 px-4 sm:px-6 overflow-hidden">
  
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300/20 blur-3xl rounded-full"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-300/20 blur-3xl rounded-full"></div>

        {/* SEO SECTION */}
        <div className="sr-only">
          {verbs.map(v => (
            <article key={v.id}>
              <h2>{v.base} meaning</h2>
              <p>{v.meaning}</p>
              <p>Example: {v.example}</p>
            </article>
          ))}
        </div>

        {/* HERO */}
        <div className="relative z-10 max-w-5xl mx-auto text-center mb-14">
          
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-bold text-sm mb-6">
            ⚡ AI Powered Learning
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Verb
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              {" "}Workshop
            </span>
          </h1>

          <p className="text-slate-500 text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            Master English verbs with interactive flashcards,
            pronunciation practice and real-world examples.
          </p>

          {/* SEARCH */}
          <div className="relative mt-8 max-w-2xl mx-auto group">
            
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10"></i>

            <input
              type="text"
              placeholder="Search verbs..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="relative w-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl pl-14 pr-5 py-4 text-base outline-none focus:ring-4 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        {/* VERBS SLIDER */}
        <div className="relative max-w-7xl mx-auto mb-14">

          {filteredVerbs.length > 0 ? (
            <>
              {/* LEFT */}
              <button
                onClick={() => scroll("left")}
                className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-full shadow-2xl hover:bg-blue-600 hover:text-white transition-all text-slate-700 border border-slate-100"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* CARDS */}
              <div
                ref={sliderRef}
                className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-5 px-1"
              >
                {filteredVerbs.map((verb, index) => {
                  const isLocked =
                    verb.type === "paid" &&
                    !user.isPro;

                  const stage =
                    verb.progress?.stage || 0;

                  return (
                    <div
                      key={index}
                      onClick={async () => {
                        if (isLocked) {
                          router.replace("/pricing");
                          return;
                        }

                        const token =
                          localStorage.getItem(
                            "access_token"
                          );

                        if (token) {
                          try {
                            await markVerbViewed(
                              verb.id,
                              token
                            );

                            await saveAttempt(
                              token,
                              {
                                exercise_type:
                                  "verbs",

                                question: `Meaning of ${verb.base}`,

                                user_answer:
                                  verb.base,

                                corrected_answer:
                                  verb.meaning,

                                accuracy_score: 100,

                                vocabulary_score: 95,

                                verb_score: 100,

                                confidence_score: 90,

                                xp_earned: 5,

                                duration_seconds: 20,
                              }
                            );
                          } catch (err) {
                            console.error(err);
                          }
                        }

                        setSelectedVerb(verb);
                      }}
                      className={`snap-center min-w-[220px] sm:min-w-[240px] lg:min-w-[250px] relative rounded-[2rem] overflow-hidden transition-all duration-300 cursor-pointer
                      ${
                        selectedVerb?.id ===
                        verb.id
                          ? "scale-[1.03] ring-4 ring-blue-500 shadow-2xl"
                          : "hover:-translate-y-1 hover:shadow-2xl"
                      }`}
                    >

                      {/* PROGRESS */}
                      <span
                        className={`absolute top-4 right-4 z-20 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider
                        ${
                          !verb.progress
                            ? "bg-slate-100 text-slate-500"
                            : stage === 3
                            ? "bg-emerald-500 text-white"
                            : stage === 2
                            ? "bg-blue-500 text-white"
                            : "bg-amber-400 text-white"
                        }`}
                      >
                        {!verb.progress
                          ? "New"
                          : stage === 3
                          ? "Mastered"
                          : stage === 2
                          ? "Learnt"
                          : "Started"}
                      </span>

                      {/* LOCK */}
                      {isLocked && (
                        <div className="absolute inset-0 z-30 bg-slate-900/70 backdrop-blur-md flex flex-col items-center justify-center rounded-[2rem]">
                          <i className="fas fa-lock text-white text-2xl mb-3"></i>

                          <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-blue-600 px-3 py-1 rounded-full">
                            Pro Only
                          </span>
                        </div>
                      )}

                      {/* CARD */}
                      <div className="bg-white border border-white/60 shadow-xl rounded-[2rem] p-7 h-[250px] flex flex-col justify-between">
                        
                        <div>
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg mb-6">
                            <i className="fas fa-language text-xl"></i>
                          </div>

                          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3">
                            {verb.base}
                          </h3>

                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                            {isLocked
                              ? "Upgrade to unlock meaning and examples."
                              : verb.meaning}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Tap to Learn
                          </span>

                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT */}
              <button
                onClick={() => scroll("right")}
                className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-full shadow-2xl hover:bg-blue-600 hover:text-white transition-all text-slate-700 border border-slate-100"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-20 text-center">
              <p className="text-slate-400 text-lg font-medium">
                No verbs found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        <AdUnit slot="XXXXXXXXXX" className="max-w-4xl mx-auto mb-14" />

        {/* DETAILS */}
        <div className="max-w-4xl mx-auto">

          {!selectedVerb ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl p-12 text-center">
              
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-hand-pointer text-3xl"></i>
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-3">
                Select Any Verb
              </h3>

              <p className="text-slate-500 text-lg">
                Click on any flashcard above to explore
                its meaning and usage.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-4 duration-500">

              {/* HEADER */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex flex-col sm:flex-row justify-between gap-6">

                <div>
                  <p className="uppercase tracking-[0.25em] text-blue-100 text-xs font-bold mb-3">
                    Verb Details
                  </p>

                  <h2 className="text-4xl font-black text-white mb-2">
                    {selectedVerb.base}
                  </h2>

                  <p className="text-blue-100">
                    Meaning & pronunciation
                  </p>
                </div>

                <button
                  onClick={() =>
                    speakText(
                      `${selectedVerb.base}. ${selectedVerb.meaning}`
                    )
                  }
                  className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-105 transition-all"
                >
                  <i className="fas fa-volume-up text-3xl"></i>
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-8 sm:p-10 space-y-8">

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-3 block">
                    Meaning
                  </label>

                  <p className="text-2xl font-semibold text-slate-800 leading-relaxed">
                    {selectedVerb.meaning}
                  </p>
                </div>

                <div className="h-px bg-slate-100"></div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-3 block">
                    Example Sentence
                  </label>

                  <div className="bg-slate-50 rounded-3xl border border-slate-100 p-7 relative overflow-hidden">
                    
                    <div className="absolute top-3 left-4 text-7xl text-slate-100 font-black">
                      "
                    </div>

                    <p className="relative z-10 text-lg sm:text-xl italic font-semibold text-slate-700 leading-relaxed">
                      {selectedVerb.example ||
                        `The word ${selectedVerb.base} is used to describe an action.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {selectedVerb && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "DefinedTerm",
                "name": selectedVerb.base,
                "description": selectedVerb.meaning,
                "inDefinedTermSet": "https://www.grammrlyst.com/verbs",
                "termCode": selectedVerb.base,
                "usageInfo": selectedVerb.example
              })
            }}
          />
        )}
        <Footer />
    </>
  );
}