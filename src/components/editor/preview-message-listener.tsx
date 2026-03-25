"use client";

import { useEffect } from "react";

export function PreviewMessageListener() {
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "UPDATE_TOKENS") {
        const { tokens, mode } = e.data as {
          tokens: Record<string, string>;
          mode: string;
        };
        // Clear all previous inline token overrides before applying new ones
        // This prevents stale light-mode values from persisting in dark mode
        const style = document.documentElement.style;
        for (let i = style.length - 1; i >= 0; i--) {
          const prop = style.item(i);
          if (prop.startsWith("--")) {
            style.removeProperty(prop);
          }
        }
        // Apply the current mode's tokens
        for (const [name, value] of Object.entries(tokens)) {
          style.setProperty(`--${name}`, value);
        }
        document.documentElement.classList.toggle("dark", mode === "dark");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
