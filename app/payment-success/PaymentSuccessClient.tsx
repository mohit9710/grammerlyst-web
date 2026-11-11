
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Copy,
} from "lucide-react";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("razorpay_payment_id");
  const paymentLinkId = searchParams.get("razorpay_payment_link_id");
  const paymentStatus = searchParams.get("razorpay_payment_link_status");
  const signature = searchParams.get("razorpay_signature");

  const isPaid =
    paymentStatus === "paid" &&
    !!paymentId &&
    !!paymentLinkId &&
    !!signature;

  const copyPaymentId = async () => {
    if (paymentId) {
      await navigator.clipboard.writeText(paymentId);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">

      <div className="flex justify-center mb-6">
        <div className="bg-green-50 p-5 rounded-full">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
        {isPaid ? "Payment Successful!" : "Payment Verification Pending"}
      </h1>

      <p className="text-slate-500 mb-8">
        {isPaid
          ? "Thank you for choosing Grammrlyst. Your payment details have been received."
          : "We could not confirm your payment details. Please contact support if you have completed your payment."}
      </p>

      <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-5">

        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-900">
            Transaction Details
          </h2>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-slate-500 mb-2">Payment ID</p>

          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-slate-900 break-all">
              {paymentId || "Not available"}
            </p>

            {paymentId && (
              <button onClick={copyPaymentId} type="button">
                <Copy className="w-5 h-5 text-blue-600" />
              </button>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-slate-500 mb-2">Payment Link ID</p>
          <p className="font-semibold text-slate-900 break-all">
            {paymentLinkId || "Not available"}
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-slate-500 mb-2">Payment Status</p>

          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
            isPaid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {isPaid ? "Paid - Awaiting Server Verification" : "Pending"}
          </span>
        </div>

      </div>

      <div className="mt-8 flex justify-center items-center gap-2 text-sm text-slate-500">
        <ShieldCheck className="w-5 h-5 text-green-600" />
        Secure payment powered by Razorpay
      </div>

      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition"
      >
        Go to Dashboard
        <ArrowRight size={18} />
      </Link>

    </div>
  );
}
