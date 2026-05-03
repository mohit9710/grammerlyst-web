"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchReferralDashboard } from "@/services/referralService";

export default function ReferralDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    fetchReferralDashboard(token)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-black mb-10">
          Referral Dashboard
        </h1>

        <div className="grid md:grid-cols-4 gap-6">
          
          <Card title="Total Referrals" value={data.total_referrals} />
          <Card title="Successful Referrals" value={data.completed_referrals} />
          <Card title="Rewards Earned" value={data.total_reward_value} />
          <Card title="Total Earnings (₹)" value={data.total_earning} />

        </div>

        <div className="mt-10">
          <Card 
            title="Pending Earnings" 
            value={`₹ ${data.pending_earning}`} 
            highlight 
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

function Card({ title, value, highlight = false }: any) {
  return (
    <div
      className={`p-6 rounded-2xl shadow ${
        highlight ? "bg-green-100" : "bg-white"
      }`}
    >
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-3xl font-black mt-2">{value}</h2>
    </div>
  );
}