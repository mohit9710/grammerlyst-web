"use client";

import { useEffect, useState } from "react";
import { fetchMyPlan } from "@/services/purchaseService";

export const useUserPlan = () => {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const data = await fetchMyPlan();
        setPlan(data);
      } catch (err) {
        console.error(err);
        setPlan({ active: false });
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, []);

  return { plan, loading };
};