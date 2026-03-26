"use client";

import { useCallback, useState } from "react";

interface CopyInstallButtonProps {
  command: string;
}

export function CopyInstallButton({ command }: CopyInstallButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [command]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group inline-flex w-full max-w-xl items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 text-left font-mono text-sm transition-colors hover:bg-accent/50"
    >
      <span className="truncate text-muted-foreground">$ {command}</span>
      <span className="shrink-0 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
