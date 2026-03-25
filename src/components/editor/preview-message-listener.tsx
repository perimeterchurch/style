"use client";

import { useEffect } from "react";

export function PreviewMessageListener() {
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "UPDATE_TOKENS") {
        const { tokens, mode } = e.data as {
          tokens: Record<string, string>;
          mode: string;
        };
        for (const [name, value] of Object.entries(tokens)) {
          document.documentElement.style.setProperty(`--${name}`, value);
        }
        document.documentElement.classList.toggle("dark", mode === "dark");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
