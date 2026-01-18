"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoImg from "../resources/grammrlyst_logo.png";

export default function Navbar() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuth(!!token);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    setIsAuth(false);
    router.push("/");
  };

  return (
    <nav className="bg-white border-b px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* 1. Brand Logo Area */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-10 h-10">
          <Image 
            src={LogoImg} 
            alt="Grammrlyst Logo" 
            fill 
            className="object-contain" 
            priority 
          />
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-800 group-hover:text-blue-600 transition">
          Grammrlyst
        </span>
      </Link>

      {/* 2. Middle Navigation (Hidden on Mobile) */}
      {/* <div className="hidden md:flex gap-8 items-center">
        <Link href="/grammar" className="text-slate-600 font-bold hover:text-blue-600 transition text-sm uppercase tracking-wide">
          Workshop
        </Link>
        <Link href="/quizzes" className="text-slate-600 font-bold hover:text-blue-600 transition text-sm uppercase tracking-wide">
          Quizzes
        </Link>
      </div> */}

      {/* 3. User Actions Area */}
      <div className="flex items-center gap-3">
        {!isAuth ? (
          <>
            <Link href="/auth/login" className="text-slate-600 font-bold hover:text-blue-600 px-4 transition">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              Get Started
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {/* Profile Button */}
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

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            {/* Logout Button */}
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