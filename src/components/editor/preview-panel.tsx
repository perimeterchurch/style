"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/lib/editor-store";

import { Showcase } from "@/components/preview/showcase";
import { Forms } from "@/components/preview/forms";
import { Dashboard } from "@/components/preview/dashboard";

const PREVIEW_COMPONENTS: Record<string, React.ComponentType> = {
  showcase: Showcase,
  forms: Forms,
  dashboard: Dashboard,
};

export function PreviewPanel({ activeTab }: { activeTab: string }) {
  const { lightTokens, darkTokens, activeMode } = useEditorStore();
  const tokens = activeMode === "light" ? lightTokens : darkTokens;

  const tokenStyles = useMemo(() => {
    const styles: Record<string, string> = {};
    for (const [name, value] of Object.entries(tokens)) {
      styles[`--${name}`] = value;
    }
    return styles;
  }, [tokens]);

  const PreviewComponent = PREVIEW_COMPONENTS[activeTab] ?? Showcase;

  return (
    <div
      className={`h-full overflow-auto ${activeMode === "dark" ? "dark" : ""}`}
      style={tokenStyles}
    >
      <div className="p-6 bg-background text-foreground min-h-full">
        <PreviewComponent />
      </div>
    </div>
  );
}
