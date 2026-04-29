"use client";

// Thin top progress bar shown during Next.js App Router page navigation.
// Intercepts link clicks to start, finishes when the pathname changes.

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type State = { visible: boolean; pct: number; opacity: number };

const IDLE: State = { visible: false, pct: 0, opacity: 1 };

export default function NavigationProgress() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [bar, setBar] = useState<State>(IDLE);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const after = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const start = useCallback(() => {
    clearTimers();
    // Mount at pct=0, then use double-rAF so the 0% state is painted before the
    // first increment — this makes the CSS transition animate from 0→30 correctly.
    setBar({ visible: true, pct: 0, opacity: 1 });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setBar((s) => ({ ...s, pct: 30 }));
        after(() => setBar((s) => ({ ...s, pct: 55 })), 400);
        after(() => setBar((s) => ({ ...s, pct: 72 })), 1000);
        after(() => setBar((s) => ({ ...s, pct: 83 })), 2500);
      })
    );
  }, [clearTimers, after]);

  const finish = useCallback(() => {
    clearTimers();
    setBar((s) => ({ ...s, pct: 100, opacity: 1 }));
    after(() => setBar((s) => ({ ...s, opacity: 0 })), 150);
    after(() => setBar(IDLE), 450);
  }, [clearTimers, after]);

  // Intercept link clicks to start the bar.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      // Skip external links, hash links, and non-navigation hrefs.
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      try {
        const dest = new URL(href, window.location.href);
        if (dest.pathname === window.location.pathname) return;
      } catch {
        return;
      }
      start();
    }
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearTimers();
    };
  }, [start, clearTimers]);

  // Complete the bar when the pathname actually changes.
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      finish();
    }
  }, [pathname, finish]);

  if (!bar.visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none"
      style={{ opacity: bar.opacity, transition: "opacity 300ms ease" }}
    >
      <div
        className="h-full bg-blue-500"
        style={{
          width: `${bar.pct}%`,
          transition: bar.pct === 0 ? "none" : "width 400ms ease-out",
        }}
      />
    </div>
  );
}
