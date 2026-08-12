"use client";

import { useEffect, useRef } from "react";

// TODO: replace with real ad-unit slot IDs from your AdSense dashboard
// (Ads > By ad unit > Display ads) before these will actually serve ads.
export default function AdUnit({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string;
  format?: string;
  className?: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch {
      // AdSense script not ready yet / blocked by an ad blocker — safe to ignore
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-5149688839251960"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
