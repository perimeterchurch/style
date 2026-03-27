"use client";

import { createHighlighter, type Highlighter } from "shiki/bundle/web";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["tsx"],
    });
  }
  return highlighterPromise;
}

export async function highlightClient(code: string): Promise<string> {
  const h = await getHighlighter();
  return h.codeToHtml(code, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
  });
}
