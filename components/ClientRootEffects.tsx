"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FloatingFixButton from "@/components/FloatingFixButton";

export default function ClientRootEffects() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-activity`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }, []);

  if (!isLoggedIn || pathname === "/role-play") return null;

  return <FloatingFixButton />;
}
