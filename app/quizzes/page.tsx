"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { fetchQuizData, QuizQuestion } from "@/services/quiz";
import { fetchUserProfile } from "@/services/userService";

export default function Quizzes() {
  const router = useRouter();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const progressPercentage =
    questions.length > 0
      ? (currentStep / questions.length) * 100
      : 0;

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    Promise.all([
      fetchUserProfile(token),
      fetchQuizData(1, token),
    ])
      .then(([userData, quizData]) => {
        setUser(userData);
        setQuestions(quizData);
      })
      .catch((err) => {
        console.error(err);
        router.replace("/auth/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const nextStep = currentStep + 1;
    if (nextStep < questions.length) {
      setCurrentStep(nextStep);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setIsFinished(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">
          No questions found for this lesson.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500"
            style={{ width: `${isFinished ? 100 : progressPercentage}%` }}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border min-h-[400px] flex flex-col justify-center">
          {!isFinished ? (
            <>
              <span className="text-blue-600 font-bold uppercase text-sm">
                Question {currentStep + 1} of {questions.length}
              </span>

              <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-8">
                {currentQuestion.question_text}
              </h2>

              <div className="grid gap-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.is_correct)}
                    className="p-5 rounded-2xl border hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    {option.option_text}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-4xl font-black mb-4">
                Quiz Complete 🎉
              </h2>
              <p className="text-xl mb-8">
                Score:{" "}
                <span className="font-bold text-blue-600">
                  {score}
                </span>{" "}
                / {questions.length}
              </p>

              <button
                onClick={restartQuiz}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
