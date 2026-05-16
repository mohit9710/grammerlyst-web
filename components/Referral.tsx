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

  const [loading, setLoading] =
    useState(true);

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {
      router.replace("/auth/login");

      return;
    }

    fetchReferralDashboard(token)
      .then((referralRes) => {
        setReferralData(referralRes);

        if (
          referralRes?.referral_code
        ) {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(
      referralLink
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div
        className="rounded-[2.5rem]
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl
        p-10 text-center text-slate-300"
      >
        Loading referral dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div
        className="relative overflow-hidden
        rounded-[2.5rem]
        border border-white/10
        bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10
        backdrop-blur-3xl
        p-8 lg:p-10"
      >
        {/* GLOWS */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold mb-4">
              REFERRAL PROGRAM
            </p>

            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              Invite Friends
              <br />

              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Earn Rewards
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Share your referral
              link with friends and
              earn rewards when they
              join and start learning
              English with AI.
            </p>

            {/* LINK BOX */}
            <div
              className="mt-8 rounded-[2rem]
              border border-white/10
              bg-white/[0.05]
              backdrop-blur-2xl
              p-5"
            >
              <p className="text-slate-400 text-sm mb-3">
                Your Referral Link
              </p>

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  value={referralLink}
                  readOnly
                  className="flex-1 px-5 py-4 rounded-2xl
                  bg-white/[0.05]
                  border border-white/10
                  text-white
                  outline-none"
                />

                <button
                  onClick={handleCopy}
                  className="px-6 py-4 rounded-2xl
                  bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600
                  text-white font-bold
                  hover:scale-[1.03]
                  transition-all duration-300
                  shadow-[0_10px_40px_rgba(59,130,246,0.35)]"
                >
                  {copied
                    ? "Copied ✓"
                    : "Copy Link"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="rounded-[2.5rem]
            border border-white/10
            bg-white/[0.05]
            backdrop-blur-3xl
            p-8"
          >
            <div className="flex items-center gap-5 mb-8">
              <div
                className="w-20 h-20 rounded-[2rem]
                bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600
                flex items-center justify-center
                text-4xl shadow-2xl"
              >
                🎁
              </div>

              <div>
                <p className="text-cyan-300 uppercase tracking-widest text-xs font-bold mb-2">
                  BONUS SYSTEM
                </p>

                <h2 className="text-3xl font-black text-white">
                  Earn More
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <RewardPoint text="Invite friends and earn rewards instantly." />

              <RewardPoint text="Unlock premium benefits with successful referrals." />

              <RewardPoint text="Track all your earnings in real-time." />

              <RewardPoint text="Grow your learning community together." />
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      {referralData && (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <Stat
            title="Total Referrals"
            value={
              referralData.total_referrals ||
              0
            }
            icon="👥"
            gradient="from-cyan-500 to-blue-600"
          />

          <Stat
            title="Successful"
            value={
              referralData.completed_referrals ||
              0
            }
            icon="✅"
            gradient="from-emerald-500 to-green-600"
          />

          <Stat
            title="Rewards"
            value={`${
              referralData.total_reward_value ||
              0
            } Days`}
            icon="🎉"
            gradient="from-orange-500 to-amber-500"
          />

          <Stat
            title="Earnings ₹"
            value={
              referralData.total_earning ||
              0
            }
            icon="💰"
            gradient="from-violet-500 to-indigo-600"
          />
        </div>
      )}

      {/* EXTRA SECTION */}
      <div
        className="rounded-[2.5rem]
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl
        p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold mb-4">
              HOW IT WORKS
            </p>

            <h2 className="text-3xl font-black text-white mb-4">
              Simple Referral Process
            </h2>

            <p className="text-slate-400 max-w-2xl leading-relaxed">
              Share your unique
              referral link with
              friends. When they sign
              up and start learning,
              you receive rewards and
              bonuses automatically.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StepCard
              number="1"
              text="Share Link"
            />

            <StepCard
              number="2"
              text="Friend Joins"
            />

            <StepCard
              number="3"
              text="Earn Rewards"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================================================
   STAT CARD
======================================================= */

function Stat({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;

  value: any;

  icon: string;

  gradient: string;
}) {
  return (
    <div
      className="group relative overflow-hidden
      rounded-[2rem]
      border border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-6
      hover:-translate-y-2
      transition-all duration-500"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500 bg-gradient-to-br ${gradient}`}
      ></div>

      <div className="relative z-10">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient}
          flex items-center justify-center text-3xl mb-5 shadow-xl`}
        >
          {icon}
        </div>

        <p className="text-slate-400 text-sm">
          {title}
        </p>

        <h2 className="text-4xl font-black text-white mt-3">
          {value}
        </h2>
      </div>
    </div>
  );
}

/* =======================================================
   REWARD POINT
======================================================= */

function RewardPoint({
  text,
}: {
  text: string;
}) {
  return (
    <div
      className="flex items-center gap-4
      rounded-2xl
      bg-white/[0.05]
      border border-white/10
      p-4"
    >
      <div
        className="w-10 h-10 rounded-xl
        bg-gradient-to-br from-cyan-500 to-violet-600
        flex items-center justify-center"
      >
        ✨
      </div>

      <p className="text-slate-300 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

/* =======================================================
   STEP CARD
======================================================= */

function StepCard({
  number,
  text,
}: {
  number: string;

  text: string;
}) {
  return (
    <div
      className="rounded-[1.5rem]
      border border-white/10
      bg-white/[0.05]
      backdrop-blur-xl
      p-5 text-center min-w-[110px]"
    >
      <div
        className="w-14 h-14 mx-auto rounded-2xl
        bg-gradient-to-br from-cyan-500 to-violet-600
        flex items-center justify-center
        text-white font-black text-xl mb-4"
      >
        {number}
      </div>

      <p className="text-slate-300 font-medium text-sm">
        {text}
      </p>
    </div>
  );
}