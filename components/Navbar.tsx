"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoImg from "../resources/logo.png"; // Ensure your new PNG is saved here
import { fetchUserProfile } from "@/services/userService";

export default function Navbar() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUserProfile(token)
        .then((data) => {
          setUser(data);
          setIsAuth(true);
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          setIsAuth(false);
        });
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    setIsAuth(false);
    router.push("/");
  };

  return (
    <nav className="bg-white border-b px-8 py-1 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* 1. Brand Logo Area - Adjusted for Wide Logo */}
      <Link href="/" className="flex items-center group">
        <div className="relative h-12 md:h-20">
          <Image
            src={LogoImg}
            alt="Grammrlyst Logo"
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      </Link>

      {/* 2. User Actions Area */}
      <div className="flex items-center gap-3">
        {!isAuth ? (
          <>
            <Link href="/auth/login" className="text-slate-600 font-bold hover:text-blue-600 px-4 transition text-sm md:text-base">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 text-sm md:text-base">
              Get Started
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <Link 
              href="/profile" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white hover:shadow-sm transition group"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-100">
                <i className="fas fa-user-circle"></i>
              </div>
              <span className="hidden sm:inline font-bold text-slate-700 group-hover:text-blue-600 text-sm">
                Profile
              </span>
            </Link>

            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            <button
              onClick={logoutHandler}
              className="p-2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}