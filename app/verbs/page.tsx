"use client";

import { useRef, useState, useMemo } from "react";
import "../../styles/verbs.css";
import Navbar from "@/components/Navbar";

const VERBS_DATA = [
  {
    word: "Resilient",
    meaning:
      "The ability to withstand or recover quickly from difficult conditions.",
    example:
      "The local economy proved to be incredibly resilient after the crisis.",
  },
  {
    word: "Advocate",
    meaning: "Publicly recommend or support a particular cause or policy.",
    example:
      "Teachers often advocate for more creative freedom in the classroom.",
  },
  {
    word: "Exacerbate",
    meaning: "To make a problem, bad situation, or negative feeling worse.",
    example: "Skipping breakfast might exacerbate your lack of focus.",
  },
];

export default function VerbsCarousel() {
  const sliderRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerb, setSelectedVerb] = useState(null);

  // Filter verbs based on search input
  const filteredVerbs = useMemo(() => {
    return VERBS_DATA.filter((v) =>
      v.word.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const scroll = (dir) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: dir === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  const speakText = (text) => {
    if (!text) return;
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center py-12 px-4 bg-slate-50 min-h-screen">
        {/* Header & Search */}
        <div className="text-center mb-12 w-full max-w-4xl">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Verb Workshop
          </h1>
          <div className="relative max-w-2xl mx-auto mt-8">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
            <input
              type="text"
              placeholder="Search for a verb..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-none shadow-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-xl font-medium"
            />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-[90%] lg:max-w-7xl">
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-15px] md:left-[-30px] top-1/2 -translate-y-1/2 z-30 bg-white p-5 rounded-full shadow-2xl hover:bg-blue-600 hover:text-white transition-all text-slate-700"
          >
            <i className="fas fa-arrow-left text-xl"></i>
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-[-15px] md:right-[-30px] top-1/2 -translate-y-1/2 z-30 bg-white p-5 rounded-full shadow-2xl hover:bg-blue-600 hover:text-white transition-all text-slate-700"
          >
            <i className="fas fa-arrow-right text-xl"></i>
          </button>

          <div
            ref={sliderRef}
            className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-10 px-6"
          >
            {filteredVerbs.map((verb, index) => (
              <div
                key={index}
                className="verb-card snap-center cursor-pointer"
                onClick={() => setSelectedVerb(verb)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <h3 className="text-3xl font-extrabold text-slate-800">
                      {verb.word}
                    </h3>
                  </div>
                  <div className="card-back">
                    <p className="text-lg leading-relaxed">{verb.meaning}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Box */}
        <div className="mt-12 w-full max-w-4xl bg-white border-t-4 border-blue-600 p-10 rounded-2xl shadow-xl min-h-[180px] flex items-center">
          {!selectedVerb ? (
            <div className="w-full text-center">
              <p className="text-slate-400 italic text-xl">
                Select a card to reveal its usage example...
              </p>
            </div>
          ) : (
            <div className="w-full flex justify-between items-center gap-6 animate-in fade-in duration-500">
              <div className="flex-1">
                <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3 block">
                  Usage: {selectedVerb.word}
                </span>
                <p className="text-slate-800 text-2xl font-semibold leading-snug italic">
                  "{selectedVerb.example}"
                </p>
              </div>
              <button
                onClick={() => speakText(selectedVerb.example)}
                className="bg-blue-50 text-blue-600 p-5 rounded-full hover:bg-blue-600 hover:text-white transition-all"
              >
                <i className="fas fa-volume-up text-2xl"></i>
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
