"use client";

import { lazy, Suspense } from "react";

import type { TemplateSlug } from "@/templates";

const templateComponents: Record<
  TemplateSlug,
  React.LazyExoticComponent<React.ComponentType>
> = {
  dashboard: lazy(() => import("@/templates/dashboard")),
  settings: lazy(() => import("@/templates/settings")),
  login: lazy(() => import("@/templates/login")),
  "data-table": lazy(() => import("@/templates/data-table")),
  "marketing-landing": lazy(() => import("@/templates/marketing-landing")),
};

export function TemplatePreviewThumb({ slug }: { slug: string }) {
  const Template = templateComponents[slug as TemplateSlug];
  if (!Template) return null;

  return (
    <div className="pointer-events-none absolute inset-0 origin-top-left scale-[0.25]">
      <div className="h-[calc(100%/0.25)] w-[calc(100%/0.25)]">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Loading...
            </div>
          }
        >
          <Template />
        </Suspense>
      </div>
    </div>
  );
}
