"use client";

import { useCallback, useState } from "react";

import type { TokenGroup } from "@/lib/token-usage";

interface TokenValues {
  light: Record<string, string>;
  dark: Record<string, string>;
}

interface TokenGridProps {
  groups: TokenGroup[];
  values: TokenValues;
}

export function TokenGrid({ groups, values }: TokenGridProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, token: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  }, []);

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.name}>
          <div className="mb-3">
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <p className="text-sm text-muted-foreground">
              Used by: {group.usedBy.join(", ")}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) => {
              const cssVar = `--${token}`;
              const lightValue = values.light[token] ?? "—";
              const darkValue = values.dark[token] ?? "—";
              const isCopied = copiedToken === token;

              return (
                <button
                  key={token}
                  type="button"
                  onClick={() => copyToClipboard(cssVar, token)}
                  className="group rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary/50"
                >
                  {!group.isNonColor && (
                    <div className="mb-2 flex gap-2">
                      <div
                        className="h-10 w-10 rounded border"
                        style={{ backgroundColor: lightValue }}
                        title={`Light: ${lightValue}`}
                      />
                      <div
                        className="h-10 w-10 rounded border bg-stone-900"
                        style={{ backgroundColor: darkValue }}
                        title={`Dark: ${darkValue}`}
                      />
                    </div>
                  )}
                  <p className="font-mono text-xs font-medium">
                    {isCopied ? (
                      <span className="text-primary">Copied!</span>
                    ) : (
                      cssVar
                    )}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {lightValue}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
