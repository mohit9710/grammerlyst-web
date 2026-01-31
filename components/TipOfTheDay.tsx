"use client";

import { useEffect, useState } from "react";
import { getTipOfTheDay } from "@/services/tips";

interface Tip {
  wrong: string;
  correct: string;
  explanation: string;
}

export default function TipOfTheDay() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTip() {
      try {
        const data = await getTipOfTheDay();
        setTip(data);
      } catch (error) {
        console.error("Failed to load tip", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTip();
  }, []);

  if (loading) return null;
  if (!tip) return null;

  return (
    <section className="mb-20 mt-4">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-10 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black">💡 Tip of the Day</h3>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            Daily
          </span>
        </div>

        <div className="space-y-3 text-lg">
          <p className="opacity-80">❌ {tip.wrong}</p>
          <p className="font-bold text-xl">✅ {tip.correct}</p>
        </div>

        <p className="mt-6 text-indigo-100">
          🧠 {tip.explanation}
        </p>

        <button className="mt-8 bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:scale-105 transition">
          Practice this tip →
        </button>
      </div>
    </section>
  );
}
