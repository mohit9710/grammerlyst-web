"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchPronunciation } from "@/services/pronunciationService";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import useUser from "@/hooks/userProfile";
import Pronunciation from "@/components/Pronunciation";

// Define the API Response Type
interface TextData {
  id: number;
  content: string;
  difficulty_level: string;
  category: string;
  created_at: string;
}

export default function PronunciationTest() {
  const [textData, setTextData] = useState<TextData | null>(null);
  // ✅ SEO Dynamic Meta + URL update
  useEffect(() => {
    if (textData) {
      document.title = `Practice: "${textData.content.slice(
        0,
        40
      )}..." | Pronunciation Lab`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          `Practice pronunciation with this sentence: "${textData.content}". Improve your speaking accuracy with AI feedback.`
        );
      }

      const newPath = `/pronunciation?text=${encodeURIComponent(
        textData.content.slice(0, 50)
      )}`;
      window.history.pushState({ path: newPath }, "", newPath);
    }
  }, [textData]);

  return (
    <>
      {/* ✅ Structured Data (SEO BOOST) */}
      {textData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LearningResource",
              name: "Pronunciation Practice",
              description: textData.content,
              educationalLevel: textData.difficulty_level,
              provider: {
                "@type": "Organization",
                name: "Grammrlyst",
              },
            }),
          }}
        />
      )}

      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />

         <Pronunciation />

        <Footer />
      </div>
    </>
  );
}