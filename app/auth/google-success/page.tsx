"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSuccess() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      // ✅ Store tokens
      localStorage.setItem("access_token", accessToken);

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      // ✅ Redirect to home/dashboard
      router.push("/");
    } else {
      router.push("/auth/login");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Logging you in...</p>
    </div>
  );
}