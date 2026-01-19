"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { fetchQuizData, QuizQuestion } from "@/services/quiz"; // Ensure QuizQuestion interface is exported
import { fetchUserProfile } from "@/services/userService";

export default function Quizzes() {
  const router = useRouter();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser]=useState(false);
  
  const progressPercentage = questions.length > 0 ? (currentStep / questions.length) * 100 : 0;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // Fetching real data from your FastAPI /quiz/{lesson_id} endpoint
    fetchQuizData(1, token)
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

      fetchUserProfile(token)
            .then((data) => {
              setUser(data);
              setLoading(false);
            })
            .catch(() => router.push("/auth/login"));
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
        <p className="text-slate-500">No questions found for this lesson.</p>
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
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${isFinished ? 100 : progressPercentage}%` }}
          ></div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 min-h-[400px] flex flex-col justify-center">
          {!isFinished ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                Question {currentStep + 1} of {questions.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-4 mb-8">
                {currentQuestion.question_text}
              </h2>

              <div className="grid gap-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.is_correct)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-700 flex justify-between items-center group"
                  >
                    {option.option_text}
                    <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"></i>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-trophy text-4xl"></i>
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-2">Quiz Complete!</h2>
              <p className="text-xl text-slate-500 mb-8">
                You scored{" "}
                <span className="font-bold text-blue-600">{score}</span> out of{" "}
                <span className="font-bold">{questions.length}</span>
              </p>

              <button
                onClick={restartQuiz}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2 mx-auto"
              >
                <i className="fas fa-redo"></i> Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}