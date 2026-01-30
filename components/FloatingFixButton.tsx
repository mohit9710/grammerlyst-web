"use client";

import { useRouter } from "next/navigation";

export default function FloatingFixButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/chatbot")}
      className="
        fixed bottom-6 right-6 z-50
        bg-orange-500 hover:bg-orange-600
        text-white font-bold
        px-6 py-4 rounded-full
        shadow-2xl
        flex items-center gap-2
        transition-transform hover:scale-105
      "
    >
      🧠 Fix My Sentence
    </button>
  );
}
