"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/index.css";
import Navbar from "@/components/Navbar";
import Link from "next/link"; 
import TipOfTheDay from "@/components/TipOfTheDay";
import { fetchUserProfile } from "@/services/userService";

// 1. Interface define karein taaki user.first_name par error na aaye
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  streak: number;
  points: number;
  total_xp: number;
  bonus: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  // 2. State ko interface assign karein
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUserProfile(token)
        .then((data: UserProfile) => {
          setUser(data);
          setIsAuth(true);
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          setIsAuth(false);
          router.push("/auth/login");
        });
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <header className="bg-white py-16 px-6 border-b">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Welcome back, {user?.first_name || "Scholar"}!
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Your journey to English mastery continues here.
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        {isAuth && <TipOfTheDay />}

        <h2 className="text-2xl font-bold text-slate-800 mb-8">
          Learning Modules
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Module Links */}
          <ModuleLink href="/verbs" color="blue" icon="fa-font" title="Verb Workshop" desc="Master visual vocabulary." />
          <ModuleLink href="/grammar" color="purple" icon="fa-project-diagram" title="Grammar Rules" desc="Deep dive into tenses." />
          <ModuleLink href="/games" color="rose" icon="fa-gamepad" title="Language Games" desc="Fun arcade challenges." />
          <ModuleLink href="/chatbot" color="orange" icon="fa-robot" title="AI Chat Tutor" desc="Instant corrections." />
        </div>

        {/* Updated Progress Section */}
        <div className="mt-16 bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl">
          <div className="mb-8 md:mb-0">
            <h3 className="text-3xl font-bold mb-2">Track Your Progress</h3>
            <div className="flex items-center gap-3">
              <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-black uppercase">
                Level {Math.floor((user?.total_xp || 0) / 1000) + 1}
              </span>
              <p className="text-slate-400">Streak: 🔥 {user?.streak || 0} Days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <StatCard value={user?.total_xp || 0} label="Total XP" color="text-blue-400" />
            <StatCard value={`+${user?.bonus || 0}`} label="Bonus" color="text-emerald-400" />
            <StatCard value={user?.points || 0} label="Points" color="text-rose-400" />
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        &copy; 2026 Grammrlyst Learning Inc.
      </footer>
    </>
  );
}

// 3. Helper Components (Taaki code clean rahe)
function ModuleLink({ href, color, icon, title, desc }: any) {
  const colorMap: any = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-600",
    orange: "bg-orange-100 text-orange-600"
  };
  return (
    <Link href={href} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center">
      <div className={`w-16 h-16 ${colorMap[color]} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6">{desc}</p>
      <span className="font-bold text-sm">Explore →</span>
    </Link>
  );
}

function StatCard({ value, label, color }: any) {
  return (
    <div className="text-center">
      <div className={`text-4xl font-black ${color}`}>{value}</div>
      <div className="text-slate-500 text-sm uppercase font-bold tracking-widest">{label}</div>
    </div>
  );
}