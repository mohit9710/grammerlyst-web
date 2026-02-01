"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import "../../styles/verbs.css";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@/services/userService";
import { fetchVerbs, Verb, markVerbViewed } from "@/services/verbs";

interface UserProfile {
  name?: string;
  email?: string;
  streak?: number;
  points?: number;
  isPro?: boolean;
}

export default function VerbsCarousel() {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  /* SEO */
  useEffect(() => {
    document.title = "Verb Workshop | Master English Verbs | Grammrlyst";

    const metaDesc =
      document.querySelector('meta[name="description"]') ||
      document.createElement("meta");

    metaDesc.setAttribute("name", "description");
    metaDesc.setAttribute(
      "content",
      "Master English verbs with interactive flashcards, audio pronunciations, and real-world examples."
    );
    document.head.appendChild(metaDesc);

    // JSON-LD safely injected
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      name: "English Verb Workshop",
      description: "Interactive flashcards to master English verbs",
      provider: {
        "@type": "Organization",
        name: "Grammrlyst",
        url: "https://www.grammrlyst.com",
      },
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  /* Auth + Data */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    Promise.all([fetchVerbs(1, 30, token), fetchUserProfile(token)])
      .then(([verbsData, userData]) => {
        setVerbs(verbsData);
        setUser({
          ...userData,
          isPro: true,
        });
      })
      .catch(() => router.replace("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const filteredVerbs = useMemo(
    () =>
      verbs.filter((v) =>
        v.base.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, verbs]
  );

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const amount = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const speakText = (text: string) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  if (loading) {
    return <div className="p-20 text-center font-bold">Loading Verbs…</div>;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen py-12 px-4">
        {/* SEARCH */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-6xl font-black mb-6">Verb Workshop</h1>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search verbs..."
            className="w-full p-5 rounded-2xl border shadow"
          />
        </div>

        {/* CAROUSEL */}
        <div className="relative max-w-7xl mx-auto">
          <button onClick={() => scroll("left")} className="absolute left-0">
            ◀
          </button>

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x"
          >
            {filteredVerbs.map((verb) => {
              const locked = verb.type === "paid" && !user?.isPro;
              const stage = verb.progress?.stage ?? 0;

              return (
                <div
                  key={verb.id}
                  onClick={async () => {
                    if (locked) {
                      router.replace("/pricing");
                      return;
                    }
                    const token = localStorage.getItem("access_token");
                    if (token) await markVerbViewed(verb.id, token);
                    setSelectedVerb(verb);
                  }}
                  className={`verb-card snap-center ${
                    stage === 3 ? "mastered-glow" : ""
                  }`}
                >
                  <h3>{verb.base}</h3>
                  <p>{locked ? "Pro only" : verb.meaning}</p>
                </div>
              );
            })}
          </div>

          <button onClick={() => scroll("right")} className="absolute right-0">
            ▶
          </button>
        </div>

        {/* DETAILS */}
        {selectedVerb && (
          <div className="max-w-4xl mx-auto mt-12 bg-white p-10 rounded-3xl">
            <h2 className="text-4xl font-bold mb-4">
              {selectedVerb.base}
            </h2>
            <p className="text-xl mb-6">{selectedVerb.meaning}</p>
            <button
              onClick={() =>
                speakText(`${selectedVerb.base}. ${selectedVerb.meaning}`)
              }
            >
              🔊 Speak
            </button>
          </div>
        )}
      </main>
    </>
  );
}
