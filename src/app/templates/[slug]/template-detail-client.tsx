"use client";

import { lazy, Suspense, useState } from "react";

import type { TemplateSlug } from "@/templates";

const templateComponents: Record<TemplateSlug, React.LazyExoticComponent<React.ComponentType>> = {
  dashboard: lazy(() => import("@/templates/dashboard")),
  settings: lazy(() => import("@/templates/settings")),
  login: lazy(() => import("@/templates/login")),
  "data-table": lazy(() => import("@/templates/data-table")),
  "marketing-landing": lazy(() => import("@/templates/marketing-landing")),
};

interface TemplateDetailClientProps {
  slug: TemplateSlug;
  codeHtml: string;
  rawCode: string;
}

export function TemplateDetailClient({
  slug,
  codeHtml,
  rawCode,
}: TemplateDetailClientProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const Template = templateComponents[slug];

  function handleCopy() {
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-4">
      {/* Toggle buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setView("preview")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            view === "preview"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setView("code")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            view === "code"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Code
        </button>
        {view === "code" && (
          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto rounded-lg border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Content */}
      {view === "preview" ? (
        <div className="overflow-hidden rounded-lg border">
          <Suspense
            fallback={
              <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
                Loading preview...
              </div>
            }
          >
            <Template />
          </Suspense>
        </div>
      ) : (
        <div
          className="overflow-auto rounded-lg border [&_pre]:max-h-[600px] [&_pre]:overflow-auto [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      )}
    </div>
  );
}
