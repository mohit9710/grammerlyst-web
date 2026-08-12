"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import useUser from "@/hooks/userProfile";

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuth } = useUser();

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Build your daily habit and learn the essentials.",
      buttonText: "Current Plan",
      featured: false,
      features: [
        { text: "Basic verbs + grammar", included: true },
        { text: "Sentence polisher (limited)", included: true },
        { text: "All games", included: true },
        { text: "1 Roleplay demo", included: true },
        { text: "Analytics & streak tools", included: false },
      ],
    },
    {
      name: "Basic",
      price: "₹199",
      period: "per month",
      yearlyPrice: "₹1499/year",
      description: "Start speaking English with AI guidance.",
      buttonText: "Get Basic",
      featured: false,
      tag: "Starter",
      features: [
        { text: "All verbs + grammar", included: true },
        { text: "Unlimited games", included: true },
        { text: "Roleplay (15 min/day)", included: true },
        { text: "Sentence polisher (limited)", included: true },
        { text: "No Ads", included: true },
      ],
    },
    {
      name: "Pro",
      price: "₹299",
      period: "per month",
      yearlyPrice: "₹2499/year",
      description: "Unlock full fluency with unlimited AI practice.",
      buttonText: "Go Pro",
      featured: true,
      tag: "Most Popular",
      features: [
        { text: "Everything in Basic", included: true },
        { text: "Unlimited Roleplay", included: true },
        { text: "Unlimited Polisher", included: true },
        { text: "AI Pronunciation Feedback", included: true },
        { text: "Analytics + streak boosters", included: true },
      ],
    },
  ];

  const handleCheckout = (planName: string) => {
    if (planName === "Free") return;

    const planId =
      planName === "Basic"
        ? "basic"
        : planName === "Pro"
        ? "pro"
        : "free";

    router.push(`/checkout?planId=${planId}`);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20 px-4">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-900 text-transparent bg-clip-text mb-6">
            Simple Pricing
          </h1>
          <p className="text-slate-500 text-lg">
            Choose the plan that fits your fluency journey.
          </p>
        </div>

        {/* Plans */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 hover:scale-105 ${
                plan.featured
                  ? "bg-slate-900 text-white shadow-2xl"
                  : "bg-white border shadow-lg"
              }`}
            >
              {/* Tag */}
              {plan.tag && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-xs rounded-full font-bold">
                  {plan.tag}
                </span>
              )}

              {/* Title */}
              <h3 className={`text-xl font-bold mb-4 ${plan.featured ? "text-blue-400" : ""}`}>
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-sm text-slate-400">/ {plan.period}</span>
                </div>

                {plan.yearlyPrice && (
                  <p className="text-green-500 text-xs mt-1 font-semibold">
                    {plan.yearlyPrice} (Save ~40%)
                  </p>
                )}
              </div>

              <p className={`text-sm mb-6 ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>
                {plan.description}
              </p>

              {/* Features */}
              <div className="flex-grow space-y-3 mb-6">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span>{f.included ? "✅" : "❌"}</span>
                    <span className={!f.included ? "line-through text-gray-400" : ""}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => handleCheckout(plan.name)}
                disabled={plan.name === "Free"}
                className={`py-3 rounded-xl font-bold transition-all ${
                  plan.name === "Free"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : plan.featured
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-sm text-slate-400">
          💡 Upgrade anytime to unlock your full fluency potential.
        </div>

      </main>

      <Footer />
    </>
  );
}