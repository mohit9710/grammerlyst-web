"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Pronunciation from "@/components/Pronunciation";
import { fetchMyPlan } from "@/services/purchaseService";

// Define the API Response Type
interface TextData {
  id: number;
  content: string;
  difficulty_level: string;
  category: string;
  created_at: string;
}

export default function PronunciationTest() {
  const [plan, setPlan] = useState<any>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [textData, setTextData] = useState<TextData | null>(null);

  const router = useRouter();

  // ✅ Fetch plan
  useEffect(() => {
    const loadPlan = async () => {
      try {
        const data = await fetchMyPlan();
        setPlan(data);
      } catch (err) {
        console.error("Plan fetch error:", err);
        setPlan({ active: false });
      } finally {
        setPlanLoading(false);
      }
    };

    loadPlan();
  }, []);

  // ✅ Redirect if not active
  useEffect(() => {
    if (!planLoading && !plan?.active) {
      router.replace("/pricing"); // better than push (no back nav)
    }
  }, [plan, planLoading, router]);

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

  // ✅ Loading state
  if (planLoading) {
    return <div className="p-10 text-center">Checking access...</div>;
  }

  // ✅ Safety fallback (no flicker, no unauthorized render)
  if (!plan?.active) {
    return null; // OR custom upgrade UI
  }

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

        {/* ✅ Only render if active */}
        <Pronunciation />

        <Footer />
      </div>
    </>
  );
}