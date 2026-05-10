"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  fetchPlans,
  Plan,
} from "@/services/purchaseService";

type BillingType = "monthly" | "yearly";

interface CheckoutClientProps {
  planId: string;
}

export default function CheckoutClient({
  planId,
}: CheckoutClientProps) {
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [billing, setBilling] =
    useState<BillingType>("monthly");

  const [selectedPlan, setSelectedPlan] =
    useState<Plan | null>(null);

  const [loading, setLoading] = useState(true);

  // ✅ Load plans
  useEffect(() => {
    loadPlans();
  }, []);

  // ✅ Update selected plan when billing changes
  useEffect(() => {
    if (plans.length > 0) {
      const defaultPlan = plans.find(
        (p) =>
          p.sub_name === "pro" &&
          p.billing_type === billing
      );

      if (defaultPlan) {
        setSelectedPlan(defaultPlan);
      }
    }
  }, [billing, plans]);

  const loadPlans = async () => {
    try {
      setLoading(true);

      const data = await fetchPlans();

      setPlans(data);

      // ✅ default selected plan
      const defaultPlan = data.find(
        (p) =>
          p.sub_name === "pro" &&
          p.billing_type === "monthly"
      );

      if (defaultPlan) {
        setSelectedPlan(defaultPlan);
      }
    } catch (err) {
      console.error("Failed to fetch plans", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter based on billing
  const filteredPlans = plans.filter(
    (plan) => plan.billing_type === billing
  );

  // ✅ Payment handler
  const handlePayment = () => {
    if (!selectedPlan) return;

    console.log("Selected Plan:", selectedPlan);

    // router.push(...)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 min-h-screen">

        {/* LEFT SIDE */}
        <div className="lg:col-span-7 p-10 border-r bg-white">

          <h1 className="text-3xl font-bold mb-8">
            Choose Your Plan
          </h1>

          {/* BILLING TOGGLE */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                billing === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                billing === "yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              Yearly
            </button>
          </div>

          {/* PLAN LIST */}
          <div className="space-y-5">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`border rounded-2xl p-6 cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id
                    ? "border-blue-600 bg-blue-50"
                    : "hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">
                      {plan.name}
                    </h2>

                    <p className="text-slate-500 text-sm mt-1">
                      {billing === "monthly"
                        ? "Billed monthly"
                        : "Billed yearly"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ₹{plan.price}
                    </p>

                    <p className="text-sm text-slate-500">
                      /{" "}
                      {billing === "monthly"
                        ? "month"
                        : "year"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-5 p-10 bg-slate-50 flex flex-col justify-between">

          <div>
            <h2 className="text-2xl font-bold mb-8">
              Order Summary
            </h2>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">

              <div className="flex justify-between">
                <span className="text-slate-600">
                  Plan
                </span>

                <span className="font-semibold">
                  {selectedPlan?.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">
                  Billing
                </span>

                <span className="font-semibold capitalize">
                  {billing}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">
                  Duration
                </span>

                <span className="font-semibold">
                  {selectedPlan?.duration} days
                </span>
              </div>

              <div className="border-t pt-5 flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>
                  ₹{selectedPlan?.price}
                </span>
              </div>
            </div>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={handlePayment}
            disabled={!selectedPlan}
            className="mt-10 w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50"
          >
            Pay ₹{selectedPlan?.price}
          </button>
        </div>
      </main>
    </>
  );
}