"use client";

import { useState } from "react";

import { TokenGrid } from "@/components/site/token-grid";
import { TokenTable } from "@/components/site/token-table";

import type { TokenGroup } from "@/lib/token-usage";

type ViewMode = "grid" | "table";

interface TokenPageClientProps {
  groups: TokenGroup[];
  values: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export function TokenPageClient({ groups, values }: TokenPageClientProps) {
  const [view, setView] = useState<ViewMode>("grid");

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg border bg-muted p-1 w-fit">
        <button
          type="button"
          onClick={() => setView("grid")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            view === "grid"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Grid
        </button>
        <button
          type="button"
          onClick={() => setView("table")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            view === "table"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Table
        </button>
      </div>

      {view === "grid" ? (
        <TokenGrid groups={groups} values={values} />
      ) : (
        <TokenTable groups={groups} values={values} />
      )}
    </div>
  );
}
