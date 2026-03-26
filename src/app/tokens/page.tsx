import { readFileSync } from "node:fs";

import { TOKEN_GROUPS } from "@/lib/token-usage";
import { TokenPageClient } from "@/components/site/token-page-client";

interface ThemeFile {
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

function readTokenValues(): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  const raw = readFileSync("registry/themes/default.json", "utf-8");
  const theme = JSON.parse(raw) as ThemeFile;
  return {
    light: theme.cssVars.light,
    dark: theme.cssVars.dark,
  };
}

const tokenValues = readTokenValues();

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Design Tokens</h1>
        <p className="mt-1 text-muted-foreground">
          All CSS custom properties from the default theme. Click any token to
          copy its CSS variable name.
        </p>
      </div>

      <TokenPageClient
        groups={TOKEN_GROUPS}
        values={tokenValues}
      />
    </div>
  );
}
