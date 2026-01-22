"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Build your daily habit and learn the essentials.",
      buttonText: "Current Plan",
      featured: false,
      color: "blue",
      features: [
        { text: "Basic verb list (common only)", included: true },
        { text: "Basic grammar lessons", included: true },
        { text: "Limited daily quizzes", included: true },
        { text: "AI Chatbot access", included: false },
        { text: "Progress analytics", included: false },
      ],
    },
    {
      name: "Lifetime Pass",
      price: "₹99",
      period: "once",
      description: "Pay once, own the core experience forever.",
      buttonText: "Get Lifetime Access",
      featured: false,
      special: true, // Unique styling for the one-time offer
      tag: "Best Value",
      features: [
        { text: "All 1000+ Verbs", included: true },
        { text: "Full grammar lessons", included: true },
        { text: "Unlimited quizzes", included: true },
        { text: "No Ads forever", included: true },
        { text: "AI Chatbot access", included: false },
      ],
    },
    {
      name: "Basic Pro",
      price: "₹199",
      period: "per month",
      description: "The complete AI-powered learning suite.",
      buttonText: "Go Pro",
      featured: true,
      tag: "Recommended",
      features: [
        { text: "Everything in Lifetime", included: true },
        { text: "AI chatbot (20 msgs/day)", included: true },
        { text: "Detailed Progress Analytics", included: true },
        { text: "Scene analysis tools", included: true },
        { text: "Priority Support", included: true },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 py-20 px-4">
        
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-900 mb-6 tracking-tight">
            Simple Pricing
          </h1>
          <p className="text-slate-500 text-lg">Choose the path that fits your learning goals.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 rounded-[2rem] transition-all duration-300 ${
                plan.featured
                  ? "bg-slate-900 text-white shadow-2xl scale-105 z-10 border-none"
                  : plan.special 
                  ? "bg-white border-2 border-amber-400 shadow-amber-100 shadow-xl"
                  : "bg-white border border-slate-200 shadow-lg"
              }`}
            >
              {plan.tag && (
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  plan.special ? "bg-amber-400 text-amber-900" : "bg-blue-600 text-white"
                }`}>
                  {plan.tag}
                </span>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-4 ${plan.featured ? "text-blue-400" : "text-slate-800"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className={`${plan.featured ? "text-slate-400" : "text-slate-500"} font-medium text-sm`}>
                    / {plan.period}
                  </span>
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3 text-sm">
                    <i className={`fas ${feature.included ? "fa-check-circle" : "fa-times-circle"} mt-1 ${
                      feature.included 
                        ? (plan.special ? "text-amber-500" : "text-blue-500") 
                        : "text-slate-300"
                    }`}></i>
                    <span className={!feature.included ? "text-slate-400 line-through" : ""}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => !plan.buttonText.includes("Current") && router.push("/checkout")}
                className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
                  plan.featured
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : plan.special
                    ? "bg-amber-400 hover:bg-amber-500 text-amber-950"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
            <p className="text-slate-400 text-sm">
                <i className="fas fa-info-circle mr-2"></i>
                The <strong>Lifetime Pass</strong> includes all current and future verbs added to the library.
            </p>
        </div>
      </main>
    </>
  );
}