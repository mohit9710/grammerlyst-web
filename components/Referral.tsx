"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchReferralDashboard } from "@/services/referralService";

export default function Referral() {
  const router = useRouter();

  const [referralData, setReferralData] =
    useState<any>(null);

  const [referralLink, setReferralLink] =
    useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    fetchReferralDashboard(token)
      .then((referralRes) => {
        setReferralData(referralRes);

        // ✅ Safe client-side referral link
        if (referralRes?.referral_code) {
          setReferralLink(
            `${window.location.origin}/auth/signup?ref=${referralRes.referral_code}`
          );
        }

        setLoading(false);
      })
      .catch(() => {
        router.push("/auth/login");
      });
  }, [router]);

  if (loading) return null;

  return (
    <>
      {/* 🔥 REFERRAL SECTION */}
      <div className="bg-white rounded-[2rem] shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Invite & Earn
        </h2>

        <p className="text-slate-500 mb-4">
          Share your referral link and earn
          rewards.
        </p>

        <div className="flex gap-2">
          <input
            value={referralLink}
            readOnly
            className="flex-1 border px-4 py-3 rounded-xl"
          />

          <button
            onClick={() => {
              navigator.clipboard.writeText(
                referralLink
              );

              alert("Referral link copied");
            }}
            className="bg-blue-600 text-white px-4 rounded-xl"
          >
            Copy
          </button>
        </div>
      </div>

      {/* 📊 REFERRAL STATS */}
      {referralData && (
        <div className="grid md:grid-cols-4 gap-4">
          <Stat
            title="Total Referrals"
            value={
              referralData.total_referrals || 0
            }
          />

          <Stat
            title="Successful"
            value={
              referralData.completed_referrals ||
              0
            }
          />

          <Stat
            title="Rewards"
            value={`${referralData.total_reward_value || 0
              } Days`}
          />

          <Stat
            title="Earnings ₹"
            value={
              referralData.total_earning || 0
            }
          />
        </div>
      )}
    </>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="text-2xl font-black mt-2">
        {value}
      </h2>
    </div>
  );
}