import "./globals.css";
import type { ReactNode } from "react";
import Script from "next/script";
import ClientRootEffects from "@/components/ClientRootEffects";
import PageTracking from "@/components/PageTracking";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
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

        {/* Font Awesome, loaded non-render-blocking via the media=print swap trick */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          media="print"
          id="fa-stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.getElementById('fa-stylesheet').media='all';",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          />
        </noscript>

        <meta name="google-site-verification" content="_w6MUtyAqKpo8QuNX7PBJ3ITrY4F_hntC0FGTU5-Rxs" />
      </head>

      <body>
        {children}
        <ClientRootEffects />
        <PageTracking />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5149688839251960"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
