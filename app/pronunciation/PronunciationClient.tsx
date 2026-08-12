"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Pronunciation from "@/components/Pronunciation";
import { fetchMyPlan } from "@/services/purchaseService";
import { saveAttempt } from "@/services/reportAnalysis";

interface TextData {
  id: number;
  content: string;
  difficulty_level: string;
  category: string;
  created_at: string;
}

export default function PronunciationTest() {
  const [plan, setPlan] = useState<any>(null);

  const [planLoading, setPlanLoading] =
    useState(true);

  const [textData, setTextData] =
    useState<TextData | null>(null);

  const router = useRouter();

  // =====================================================
  // FETCH USER PLAN
  // =====================================================

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const data = await fetchMyPlan();

        setPlan(data);
      } catch (err) {
        console.error(
          "Plan fetch error:",
          err
        );

        setPlan({
          active: false,
        });
      } finally {
        setPlanLoading(false);
      }
    };

    loadPlan();
  }, []);

  // =====================================================
  // REDIRECT IF NOT ACTIVE
  // =====================================================

  useEffect(() => {
    if (
      !planLoading &&
      !plan?.active
    ) {
      // router.replace("/pricing");
    }
  }, [
    plan,
    planLoading,
    router,
  ]);

  // =====================================================
  // SEO META UPDATE
  // =====================================================

  useEffect(() => {
    if (!textData) return;

    document.title = `Practice: "${textData.content.slice(
      0,
      40
    )}..." | Pronunciation Lab`;

    let metaDesc =
      document.querySelector(
        'meta[name="description"]'
      );

    if (!metaDesc) {
      metaDesc =
        document.createElement(
          "meta"
        );

      metaDesc.setAttribute(
        "name",
        "description"
      );

      document.head.appendChild(
        metaDesc
      );
    }

    metaDesc.setAttribute(
      "content",
      `Practice pronunciation with this sentence: "${textData.content}". Improve your speaking accuracy with AI feedback.`
    );

    const newPath = `/pronunciation?text=${encodeURIComponent(
      textData.content.slice(
        0,
        50
      )
    )}`;

    window.history.pushState(
      { path: newPath },
      "",
      newPath
    );
  }, [textData]);

  // =====================================================
  // SAVE ATTEMPT
  // =====================================================

  const handleSaveAttempt =
    async (result: any) => {
      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) return;
          await saveAttempt(
            token,
            {
              exercise_type:
                "pronunciation",
              
              question:
                result.original_text ||
                textData?.content ||
                "",

              user_answer:
                result.transcript || "",

              corrected_answer:
                result.corrected_text || "",

              accuracy_score:
                result.accuracy_score || 0,

              pronunciation_score:
                result.accuracy_score || 0,

              vocabulary_score:
                result.vocabulary_score || 0,

              verb_score:
                result.verb_score || 0,

              confidence_score:
                result.confidence_score || 0,

              xp_earned:
                result.xp_earned || 15,

              duration_seconds:
                result.duration_seconds || 60,
            }
          );
      } catch (err) {
        console.error(
          "Save attempt failed:",
          err
        );
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (planLoading) {
    return (
      <div className="p-10 text-center">
        Checking access...
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* SEO Structured Data */}
      {textData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context":
                "https://schema.org",

              "@type":
                "LearningResource",

              name:
                "Pronunciation Practice",

              description:
                textData.content,

              educationalLevel:
                textData.difficulty_level,

              provider: {
                "@type":
                  "Organization",

                name:
                  "Grammrlyst",
              },
            }),
          }}
        />
      )}

      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />

        <Pronunciation
          plan={plan}
          onComplete={
            handleSaveAttempt
          }
          onTextChange={
            setTextData
          }
        />

        <Footer />
      </div>
    </>
  );
}