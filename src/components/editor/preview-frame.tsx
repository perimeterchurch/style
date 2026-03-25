"use client";

import { useRef, useEffect, useCallback } from "react";
import { useEditorStore } from "@/lib/editor-store";

export function PreviewFrame({
  src = "/preview/showcase",
}: {
  src?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { lightTokens, darkTokens, activeMode } = useEditorStore();
  const tokens = activeMode === "light" ? lightTokens : darkTokens;

  // Keep latest values in refs so handleLoad always has current state
  const tokensRef = useRef(tokens);
  const modeRef = useRef(activeMode);
  tokensRef.current = tokens;
  modeRef.current = activeMode;

  const sendTokens = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      {
        type: "UPDATE_TOKENS",
        tokens: tokensRef.current,
        mode: modeRef.current,
      },
      window.location.origin,
    );
  }, []);

  // Send tokens whenever they change
  useEffect(() => {
    sendTokens();
  }, [tokens, activeMode, sendTokens]);

  // When iframe loads a new page, wait a tick for the listener to mount, then send
  function handleLoad() {
    // Small delay ensures PreviewMessageListener has mounted in the new page
    setTimeout(sendTokens, 50);
  }

  return (
    <iframe
      ref={iframeRef}
      src={src}
      onLoad={handleLoad}
      className="w-full h-full border-0"
      title="Component Preview"
    />
  );
}
