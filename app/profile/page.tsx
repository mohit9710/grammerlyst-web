"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  fetchUserProfile,
  updateUserProfile,
} from "@/services/userService";
import { fetchReferralDashboard } from "@/services/referralService";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [user, setUser] = useState<any>(null);
  const [referralData, setReferralData] = useState<any>(null);

  // ✅ Load profile + referral stats
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return router.replace("/auth/login");

    Promise.all([
      fetchUserProfile(token),
      fetchReferralDashboard(token),
    ])
      .then(([userRes, referralRes]) => {
        setUser(userRes);
        setReferralData(referralRes);
        setLoading(false);
      })
      .catch(() => router.push("/auth/login"));
  }, [router]);

  // ✅ Image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev: any) => ({
          ...prev,
          profile_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save profile
  const handleSave = async () => {
    const token = localStorage.getItem("access_token") || "";

    try {
      const updatedUser = await updateUserProfile(token, {
        firstName: user.first_name,
        lastName: user.last_name,
        imageFile: selectedFile,
      });

      setUser((prev: any) => ({ ...prev, ...updatedUser }));
      setIsEditing(false);
      setSelectedFile(null);
    } catch {
      alert("Failed to update profile");
    }
  };

  if (loading || !user)
    return <div className="p-20 text-center font-bold">Loading...</div>;

  // ✅ Referral link
  const referralLink = `${window.location.origin}/auth/signup?ref=${user.referral_code}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* PROFILE CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar */}
            <div
              className="relative group cursor-pointer"
              onClick={() =>
                isEditing && fileInputRef.current?.click()
              }
            >
              <div className="w-32 h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-5xl overflow-hidden">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>

              {isEditing && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                  <i className="fas fa-camera"></i>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="flex gap-4">
                  <input
                    value={user.first_name}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        first_name: e.target.value,
                      })
                    }
                    className="border-b w-full"
                  />
                  <input
                    value={user.last_name}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        last_name: e.target.value,
                      })
                    }
                    className="border-b w-full"
                  />
                </div>
              ) : (
                <h1 className="text-4xl font-black">
                  {user.first_name} {user.last_name}
                </h1>
              )}

              <p className="text-slate-500 mt-1">{user.email}</p>
            </div>

            <button
              onClick={() =>
                isEditing ? handleSave() : setIsEditing(true)
              }
              className="px-6 py-3 rounded-xl bg-blue-600 text-white"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        {/* 🔥 REFERRAL SECTION */}
        <div className="bg-white rounded-[2rem] shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Invite & Earn
          </h2>

          <p className="text-slate-500 mb-4">
            Share your referral link and earn rewards.
          </p>

          <div className="flex gap-2">
            <input
              value={referralLink}
              readOnly
              className="flex-1 border px-4 py-3 rounded-xl"
            />
            <button
              onClick={() =>
                navigator.clipboard.writeText(referralLink)
              }
              className="bg-blue-600 text-white px-4 rounded-xl"
            >
              Copy
            </button>
          </div>
        </div>

        {/* 📊 REFERRAL STATS */}
        {referralData && (
          <div className="grid md:grid-cols-4 gap-4">
            <Stat title="Total Referrals" value={referralData.total_referrals} />
            <Stat title="Successful" value={referralData.completed_referrals} />
            <Stat title="Rewards" value={referralData.total_reward_value+' Days'} />
            <Stat title="Earnings ₹" value={referralData.total_earning} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ✅ Stat Card
function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-2xl font-black mt-2">{value}</h2>
    </div>
  );
}