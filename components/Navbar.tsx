"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoImg from "../resources/logo.png";
import useUser from "@/hooks/userProfile";
import { Bell, CheckCheck } from "lucide-react";
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuth } = useUser();

  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] =
  useState(false);

  const [notifications, setNotifications] =
  useState([
    {
      id: 1,
      title: "🔥 Daily Speaking Challenge",
      message:
        "Complete today's speaking mission and earn XP.",
      read: false,
    },
    {
      id: 2,
      title: "🎧 New AI Roleplay Added",
      message:
        "Practice English with new Doctor scenario.",
      read: false,
    },
    {
      id: 3,
      title: "⚡ XP Reward",
      message:
        "You earned +120 XP yesterday.",
      read: true,
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    router.push("/dashboard");
    window.location.reload();
  };

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };


  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Speaking", href: "/daily-speaking" },
    { label: "AI Tutor", href: "/chatbot-page" },
    { label: "Pronunciation", href: "/pronunciation" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-slate-950 border-b border-white/5"
      }`}
    >
      <nav className="w-full px-5 md:px-10 lg:px-14">
        <div className="h-[82px] flex items-center justify-between">
          
          {/* LEFT */}
          <div className="flex items-center gap-10">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center">
              <div className="relative flex items-center gap-3">
                
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 rounded-full"></div>

                  <Image
                    src={LogoImg}
                    alt="Grammrlyst Logo"
                    className="relative h-12 md:h-14 w-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>

            {/* NAV LINKS */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "bg-white text-slate-900 shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            
            {!isAuth ? (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:flex text-slate-300 hover:text-white font-semibold transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10">Get Started</span>

                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition"></div>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                
                {/* XP */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black shadow-lg">
                    ⚡
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">
                      XP
                    </p>

                    <p className="text-sm font-bold text-white">
                      {user?.total_xp || 0}
                    </p>
                  </div>
                </div>

                {/* PROFILE */}
                <Link
                  href="/profile"
                  className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-2xl transition-all duration-300"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 rounded-full"></div>

                    <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black shadow-xl">
                      {user?.first_name?.charAt(0) || "U"}
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-white leading-none">
                      {user?.first_name || "User"}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Continue Learning
                    </p>
                  </div>
                </Link>

                {/* NOTIFICATIONS */}
                

                {/* LOGOUT */}
                <button
                  onClick={logoutHandler}
                  className="w-12 h-12 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition-all duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}