"use client";

import { useEffect, useState } from "react";
import { updateXP } from "@/services/userService";

export default function ArcadeBonusBanner() {
  const [bonusStatus, setBonusStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    updateXP(token, 50, true, "Arcade Entry")
      .then(() => {
        setBonusStatus("Daily Arcade Bonus +50 XP");
      })
      .catch(() => {
        console.log("Bonus already claimed");
      });
  }, []);

  if (!bonusStatus) return null;

  return (
    <div className="mt-8 inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-6 py-3 rounded-2xl backdrop-blur-xl animate-pulse">
      <span className="text-xl">⚡</span>
      <span className="font-bold">{bonusStatus}</span>
    </div>
  );
}
