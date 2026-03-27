"use client";

import { Suspense, useState } from "react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { templateComponents, type TemplateSlug } from "@/templates";

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
  const { copied, copy } = useCopyToClipboard();

  const Template = templateComponents[slug];

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
            onClick={() => copy(rawCode)}
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
