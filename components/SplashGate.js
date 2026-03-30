"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Montserrat } from "next/font/google";

export const SPLASH_DISMISSED_SESSION_KEY = "pro-x-splash-dismissed";

/** Call before navigating to `/` so SplashGate shows the experience, not the splash. */
export function markSplashDismissedForSession() {
  try {
    sessionStorage.setItem(SPLASH_DISMISSED_SESSION_KEY, "1");
  } catch {
    /* private mode */
  }
}

const STORAGE_KEY = SPLASH_DISMISSED_SESSION_KEY;

const splashSans = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-splash-sans"
});

export default function SplashGate({ children }) {
  const [gateReady, setGateReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    try {
      setShowSplash(sessionStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setShowSplash(true);
    }
    setGateReady(true);
  }, []);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    setShowSplash(false);
  }, []);

  if (!gateReady) {
    return (
      <div
        className={`splash-screen splash-screen--preload ${splashSans.variable}`}
        aria-hidden
      />
    );
  }

  if (showSplash) {
    return (
      <div
        className={`splash-screen ${splashSans.variable}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="splash-headline"
        aria-describedby="splash-tagline"
      >
        <div className="splash-screen__grain" aria-hidden />
        <div className="splash-screen__grid" aria-hidden />
        <div className="splash-screen__glass">
          <div className="splash-screen__content">
            <p className="splash-screen__eyebrow">Presented by</p>

            <h1
              id="splash-headline"
              className="splash-screen__headline splash-screen__pro-x"
            >
              PRO X
            </h1>

            <p id="splash-tagline" className="splash-screen__tagline">
              1 Mln m² of real estate exclusive to you
            </p>

            {/* <div className="splash-screen__divider" aria-hidden /> */}

            <div className="splash-screen__logo-wrap">
              <Image
                src="/branding/xplanstudio-logo.png"
                alt="XPLANSTUDIO"
                width={400}
                height={139}
                className="splash-screen__logo"
                priority
                sizes="(max-width: 480px) 48vw, 248px"
              />
            </div>

            <button type="button" className="splash-screen__cta" onClick={dismiss}>
              Continue to Experience Pro X
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
