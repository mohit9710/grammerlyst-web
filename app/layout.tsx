"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import FloatingFixButton from "@/components/FloatingFixButton";
import { usePathname } from "next/navigation";
import usePageTracking from "@/hooks/usePageTracking";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const pathname = usePathname();
  usePageTracking();
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      // Login hote hi streak sync karein
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-activity`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon-v2.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* External CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        ></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        {/* <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        /> */}
        <Script
          async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5149688839251960"
          crossOrigin="anonymous"
        />
      </head>

      <body>{children}
        {isLoggedIn && pathname !== "/role-play" && <FloatingFixButton />}
      </body>
    </html>
  );
}
