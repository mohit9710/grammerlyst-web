"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import Image component
import LogoImg from "../resources/grammrlyst_logo.png"; // Rename for clarity

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
      {/* Brand Logo & Name */}
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-90 transition group"
      >
        <div className="relative w-10 h-10 overflow-hidden rounded-lg">
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

      {/* Navigation Links - Now Unhidden */}
      {/* <div className="hidden md:flex gap-8 items-center">
        <Link 
          href="/verbs" 
          className="text-slate-600 font-bold hover:text-blue-600 transition text-sm uppercase tracking-wide"
        >
          Verbs
        </Link>
        <Link
          href="/grammar"
          className="text-slate-600 font-bold hover:text-blue-600 transition text-sm uppercase tracking-wide"
        >
          Grammar
        </Link>
        <Link
          href="/quizzes"
          className="text-slate-600 font-bold hover:text-blue-600 transition text-sm uppercase tracking-wide"
        >
          Quizzes
        </Link>
      </div> */}

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {!isAuth ? (
          <>
            <Link
              href="/auth/login"
              className="text-slate-600 font-bold hover:text-blue-600 transition px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={logoutHandler}
            className="border-2 border-slate-100 text-slate-600 px-6 py-2 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}