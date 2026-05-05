"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { completePurchase } from "@/services/purchaseService";

const PLAN_CONFIG = {
  free: {
    name: "Free",
    monthly: 0,
    yearly: 0,
    period: "forever",
  },
  basic: {
    name: "Basic",
    monthly: 199,
    yearly: 1499,
    period: "per month",
  },
  pro: {
    name: "Pro",
    monthly: 299,
    yearly: 2499,
    period: "per month",
  },
};

export default function CheckoutClient({ planId }: any) {
  const router = useRouter();
  const [plan, setPlan] = useState(planId || "pro");
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const selectedPlan = PLAN_CONFIG[plan];
  const [billing, setBilling] = useState("monthly");

  const price =
  billing === "yearly"
    ? selectedPlan?.yearly ?? 0
    : selectedPlan?.monthly ?? 0;


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.replace("/auth/login");
  }, [router]);

  // ✅ Step 1: Show QR
  const handlePayment = () => {
    if (plan === "free") {
      router.push("/dashboard");
      return;
    }

    setQrImage("/QRCODE_AXIS.jpeg"); // 👉 public folder me rakho
  };

  // ✅ Step 2: Confirm payment
  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      // await completePurchase(token, {
      //   amount: selectedPlan.price,
      //   plan_name: selectedPlan.name,
      // });

      alert("Payment done. Wait for confirmation. Thanks!!");
      router.push("/dashboard");
      // router.push(`/pricing?is_paid=1&plan=${plan}`);

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 min-h-[calc(100vh-80px)]">

        {/* LEFT */}
        <div className="lg:col-span-7 p-10 bg-white border-r">
          <h1 className="text-2xl font-bold mb-6">Choose Your Plan</h1>

          {/* Billing Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                billing === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                billing === "yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              Yearly (Save 40%)
            </button>
          </div>

          <div className="space-y-5">
            {Object.entries(PLAN_CONFIG).map(([key, value]) => {
              const planPrice =
                billing === "yearly" ? value.yearly : value.monthly;

              return (
                <div
                  key={key}
                  onClick={() => setPlan(key)}
                  className={`p-6 border rounded-xl cursor-pointer transition ${
                    plan === key
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-blue-400"
                  }`}
                >
                  <h2 className="font-bold text-lg">{value.name}</h2>

                  <p className="text-slate-500 text-sm capitalize">
                    {billing === "yearly" ? "per year" : value.period}
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    ₹{planPrice}
                    {planPrice !== 0 &&
                      (billing === "monthly" ? " / month" : " / year")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 bg-slate-50 p-10 flex flex-col justify-between">

          <div>
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-bold">{selectedPlan.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Billing</span>
                <span className="font-bold capitalize">{billing}</span>
              </div>

              <div className="flex justify-between">
                <span>Price</span>
                <span className="font-bold">₹{price}</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{price}</span>
              </div>
            </div>

            {/* QR Modal */}
            {qrImage && (
              <div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                onClick={() => setQrImage(null)} // 🔥 click outside close
              >
                <div
                  className="relative bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()} // 🔥 prevent close on inside click
                >
                  <button
                    onClick={() => setQrImage(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-xl"
                  >
                    ✕
                  </button>

                  <h2 className="text-2xl font-bold mb-4">Scan & Pay</h2>

                  <img
                    src={qrImage}
                    alt="UPI QR"
                    className="w-72 h-72 mx-auto"
                  />

                  <p className="text-sm text-slate-500 mt-4">
                    Scan using GPay / PhonePe / Paytm
                  </p>

                  <button
                    onClick={handlePaymentSuccess}
                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
                  >
                    I Have Paid ✅
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : plan === "free"
              ? "Start Free"
              : `Pay ₹${price}`}
          </button>
        </div>
      </main>
    </>
  );
}