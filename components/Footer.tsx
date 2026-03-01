"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@/services/userService";

export default function Footer() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white">Grammrlyst</h2>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Improve your English skills with interactive lessons, vocabulary building, and real conversation practice.
          </p>

          {isAuth && user && (
            <p className="mt-4 text-sm text-blue-400">
              Logged in as {user.name}
            </p>
          )}
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-blue-400 transition">About</Link></li>
            <li><Link href="/careers" className="hover:text-blue-400 transition">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-blue-400 transition">Blog</Link></li>
            <li><Link href="/press" className="hover:text-blue-400 transition">Press</Link></li>
          </ul>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            {isAuth && (
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition">
                  Dashboard
                </Link>
              </li>
            )}
            <li><Link href="/analytics" className="hover:text-blue-400 transition">Analytics</Link></li>
            <li><Link href="/reports" className="hover:text-blue-400 transition">Reports</Link></li>
            <li><Link href="/api" className="hover:text-blue-400 transition">API</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:text-blue-400 transition">Help Center</Link></li>
            <li><Link href="/docs" className="hover:text-blue-400 transition">Documentation</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
            <li><Link href="/status" className="hover:text-blue-400 transition">System Status</Link></li>
            {isAuth && (
              <li>
                <button
                  onClick={logoutHandler}
                  className="text-red-400 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} MyDashboard. All rights reserved.
      </div>
    </footer>
  );
}