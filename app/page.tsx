"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/index.css";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    router.replace("/dashboard");
    
  }, []);

  return <></>;
}
