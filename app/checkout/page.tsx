"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // In a real app, you'd get these from a URL param or state management
  const orderDetails = {
    planName: "Lifetime Pass",
    price: 1,
    tax: 0,
    total: 1,
  };

  const handlePayment = async () => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/paytm/create-payment?amount=${orderDetails.total}`,
      { method: "POST" }
    );

    if (!res.ok) {
      throw new Error("Payment init failed");
    }

    const data = await res.json();

    if (!window.Paytm || !window.Paytm.CheckoutJS) {
      alert("Paytm SDK not loaded. Refresh page.");
      return;
    }

    const config = {
      root: "",
      flow: "DEFAULT",
      data: {
        orderId: data.orderId,
        token: data.txnToken,
        tokenType: "TXN_TOKEN",
        amount: data.amount,
      },
      handler: {
        notifyMerchant: function (eventName: string, data: any) {
          console.log("Paytm Event:", eventName, data);
        },
      },
    };

    // @ts-ignore
    await window.Paytm.CheckoutJS.init(config);

    // @ts-ignore
    window.Paytm.CheckoutJS.invoke();

  } catch (err) {
    console.error(err);
    alert("Payment failed. Try again.");
  }
};

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
              <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Checkout</h2>
              
              {/* Payment Method Selector */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-blue-600">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "upi", icon: "fa-mobile-alt", label: "UPI" },
                    { id: "card", icon: "fa-credit-card", label: "Card" },
                    { id: "net", icon: "fa-university", label: "Bank" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      <i className={`fas ${method.icon} text-xl mb-2`}></i>
                      <span className="text-xs font-bold uppercase">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input */}
              <div className="mt-10 space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                {paymentMethod === "upi" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                      type="text"
                      placeholder="Enter VPA (e.g., user@upi)"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xl"
            >
              Pay ₹{orderDetails.total}
              <i className="fas fa-arrow-right text-sm"></i>
            </button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white sticky top-8 shadow-2xl overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full"></div>
              
              <h3 className="text-xl font-bold mb-8 relative z-10">Order Summary</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center">
                  <div className="text-slate-400">
                    <p className="font-bold text-white">{orderDetails.planName}</p>
                    <p className="text-xs italic">Lifetime Access</p>
                  </div>
                  <span className="font-bold text-blue-400">₹{orderDetails.price}</span>
                </div>
                
                <div className="h-px bg-slate-800"></div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span>₹{orderDetails.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                </div>

                <div className="h-px bg-slate-800"></div>

                <div className="flex justify-between items-center text-xl font-black">
                  <span>Total</span>
                  <span className="text-blue-400">₹{orderDetails.total}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                  <i className="fas fa-lock text-sm"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Payment</p>
                  <p className="text-[11px] text-slate-500 leading-tight">SSL Encrypted Transaction</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => router.back()}
              className="w-full mt-6 text-slate-400 hover:text-slate-600 font-bold transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-chevron-left text-xs"></i>
              Back to Pricing
            </button>
          </div>

        </div>
      </main>
    </>
  );
}