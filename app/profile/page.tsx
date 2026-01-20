"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { fetchUserProfile, updateUserProfile } from "@/services/userService";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({ 
    name: "User Name", 
    email: "user@example.com",
    streak: 5,
    points: 1250
  });

  // Mock data for progress
  const learningProgress = [
    { subject: "Tenses", progress: 85, color: "bg-blue-500" },
    { subject: "Conditionals", progress: 40, color: "bg-purple-500" },
    { subject: "Passive Voice", progress: 60, color: "bg-green-500" },
  ];

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    if (!token) router.replace("/auth/login");
    
    fetchUserProfile(token)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => router.push("/auth/login"));
  }, [router]);

  const handleSave = async () => {
    const token = localStorage.getItem("access_token") || "";
    try {
      const updated = await updateUserProfile(token, { name: user.name });
      setUser(updated);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading Grammrlyst Profile...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Profile & Edit Section */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100 mb-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-5xl shadow-2xl shadow-blue-200">
              <i className="fas fa-user-graduate"></i>
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <input 
                  type="text" 
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="text-3xl font-black text-slate-900 border-b-2 border-blue-600 outline-none bg-blue-50/50 px-2 rounded-t-lg w-full md:w-auto"
                />
              ) : (
                <h1 className="text-4xl font-black text-slate-900">{user.name}</h1>
              )}
              <p className="text-slate-500 font-medium mt-1">{user.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl font-bold border border-orange-100">
                  <i className="fas fa-fire"></i> {user.streak} Day Streak
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold border border-blue-100">
                  <i className="fas fa-star"></i> {user.points} XP
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all ${
                isEditing ? "bg-green-600 text-white" : "bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-600"
              }`}
            >
              {isEditing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Progress Tracks */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
              <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-tasks text-blue-600"></i> Course Progress
              </h3>
              <div className="space-y-8">
                {learningProgress.map((item) => (
                  <div key={item.subject}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-slate-700">{item.subject}</span>
                      <span className="text-sm font-black text-slate-400">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`${item.color} h-full rounded-full transition-all duration-1000`} 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Streak Calendar & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <i className="fas fa-calendar-alt text-orange-500"></i> Activity
              </h3>
              <div className="flex justify-between items-center mb-6">
                {weekDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{day}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      i < 5 ? "bg-orange-500 text-white shadow-lg shadow-orange-100" : "bg-slate-50 text-slate-300 border border-slate-100"
                    }`}>
                      {i < 5 ? <i className="fas fa-check text-xs"></i> : ""}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-slate-500 text-sm italic">
                You're on a roll! 2 more days to reach your goal.
              </p>
            </div>

            <button 
              onClick={() => router.push("/grammar")}
              className="w-full group bg-slate-900 text-white p-6 rounded-[2rem] font-bold flex justify-between items-center hover:bg-blue-600 transition-all duration-300 shadow-xl"
            >
              <div className="text-left">
                <span className="block text-sm opacity-60">Pick up where you left off</span>
                <span className="text-lg">Continue Learning</span>
              </div>
              <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}