"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  {
    category: "Verbs",
    question: "Which sentence uses the Present Perfect tense correctly?",
    options: [
      "I have saw that movie.",
      "I have seen that movie.",
      "I seen that movie.",
      "I had see that movie.",
    ],
    correct: 1, // Index of the correct answer
  },
  {
    category: "Grammar",
    question: "Identify the passive voice sentence:",
    options: [
      "The chef cooked dinner.",
      "The dinner was cooked by the chef.",
      "The chef is cooking dinner.",
      "The chef had cooked dinner.",
    ],
    correct: 1,
  },
  {
    category: "Conditionals",
    question: "If it rains, the ground ____ wet.",
    options: ["gets", "got", "will getting", "had gotten"],
    correct: 0,
  },
];

export default function Quizzes() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const progressPercentage = (currentStep / QUESTIONS.length) * 100;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.replace("/auth/login");
  }, []);

  const handleAnswer = (selectedIndex) => {
    // Check if correct
    if (selectedIndex === QUESTIONS[currentStep].correct) {
      setScore(score + 1);
    }

    // Move to next or finish
    const nextStep = currentStep + 1;
    if (nextStep < QUESTIONS.length) {
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
                {QUESTIONS[currentStep].category} — Question {currentStep + 1}{" "}
                of {QUESTIONS.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-4 mb-8">
                {QUESTIONS[currentStep].question}
              </h2>

              <div className="grid gap-4">
                {QUESTIONS[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-700 flex justify-between items-center group"
                  >
                    {option}
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
              <h2 className="text-4xl font-black text-slate-800 mb-2">
                Quiz Complete!
              </h2>
              <p className="text-xl text-slate-500 mb-8">
                You scored{" "}
                <span className="font-bold text-blue-600">{score}</span> out of{" "}
                <span className="font-bold">{QUESTIONS.length}</span>
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
