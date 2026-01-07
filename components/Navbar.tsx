"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Use Link for faster navigation

export default function Navbar() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    router.push("/auth/login");
  };

  return (
    <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Brand Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-black text-blue-600 hover:opacity-80 transition"
      >
        <i className="fas fa-book-open"></i> EduPlatform
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 items-center">
        <Link href="/" className="text-blue-600 font-bold">
          Home
        </Link>
        <Link
          href="/verbs"
          className="text-slate-600 font-bold hover:text-blue-600 transition"
        >
          Verbs
        </Link>
        <Link
          href="/grammar"
          className="text-slate-600 font-bold hover:text-blue-600 transition"
        >
          Grammar
        </Link>
        <Link
          href="/quizzes"
          className="text-slate-600 font-bold hover:text-blue-600 transition"
        >
          Quizzes
        </Link>
      </div>

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
              href="/auth/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-200"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={logoutHandler}
            className="border-2 border-slate-200 text-slate-600 px-6 py-2 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
