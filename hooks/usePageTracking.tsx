"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { initAnalytics } from "@/services/firebaseService";

const TRACKED_ROUTES = [
  "/role-play",
  "/sentence-polisher",
  "/verbs",
  "/grammar",
  "/games",
  "/games/syntax-defender",
  "/games/speed-typer",
  "/games/word-scramble"
];

export default function usePageTracking() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!TRACKED_ROUTES.includes(pathname)) return;
    if (lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;

    initAnalytics().then((analytics) => {
      if (!analytics) return;

      logEvent(analytics, "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    });
  }, [pathname]);
}