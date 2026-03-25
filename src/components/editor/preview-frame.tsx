"use client";

import { useRef, useEffect } from "react";
import { useEditorStore } from "@/lib/editor-store";

export function PreviewFrame({
  src = "/preview/showcase",
}: {
  src?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { lightTokens, darkTokens, activeMode } = useEditorStore();
  const tokens = activeMode === "light" ? lightTokens : darkTokens;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      { type: "UPDATE_TOKENS", tokens, mode: activeMode },
      window.location.origin,
    );
  }, [tokens, activeMode]);

  function handleLoad() {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "UPDATE_TOKENS", tokens, mode: activeMode },
      window.location.origin,
    );
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
