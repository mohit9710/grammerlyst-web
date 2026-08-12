import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import ClientRootEffects from "@/components/ClientRootEffects";
import PageTracking from "@/components/PageTracking";

const SITE_URL = "https://grammrlyst.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Grammrlyst - AI English Fluency Platform | Speak, Write & Master English",
  description:
    "Learn English faster with AI-powered speaking practice, grammar lessons, pronunciation training, writing feedback, and vocabulary games.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Grammrlyst",
    title: "Grammrlyst - AI English Fluency Platform",
    description:
      "Learn English faster with AI-powered speaking practice, grammar lessons, pronunciation training, writing feedback, and vocabulary games.",
    images: ["/android-chrome-512x512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grammrlyst - AI English Fluency Platform",
    description:
      "Learn English faster with AI-powered speaking practice, grammar lessons, pronunciation training, writing feedback, and vocabulary games.",
    images: ["/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Grammrlyst",
      url: SITE_URL,
      logo: `${SITE_URL}/android-chrome-512x512.png`,
    },
    {
      "@type": "WebSite",
      name: "Grammrlyst",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/blog?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

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
