"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

declare global {
  interface Window {
    google: any;
  }
}

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id:
        "996427956752-kdipj4a4e9v2p4s05roqpqgf8iho5i26.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);

      const idToken = response.credential;

      // ✅ Send to backend
      const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error("Google login failed");

      // ✅ Store token
      localStorage.setItem("access_token", data.access_token);

      // ✅ Redirect
      window.location.href = "/";
    } catch (err) {
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    if (!window.google) {
      console.error("Google SDK not loaded");
      return;
    }

    window.google.accounts.id.prompt(); // 🔥 opens popup
  };

  return {
    loginWithGoogle,
    loading,
  };
};