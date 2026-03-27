"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon, HashIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  html: string;
  rawCode: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  html,
  rawCode,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(showLineNumbers);

  async function handleCopy() {
    await navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border",
        className,
      )}
    >
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-background/80 backdrop-blur-sm"
          onClick={() => setLineNumbers((prev) => !prev)}
          aria-label={
            lineNumbers ? "Hide line numbers" : "Show line numbers"
          }
        >
          <HashIcon
            className={cn(
              "size-3.5 transition-colors",
              lineNumbers ? "text-foreground" : "text-muted-foreground",
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-background/80 backdrop-blur-sm"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-green-500" />
          ) : (
            <CopyIcon className="size-3.5 text-muted-foreground" />
          )}
        </Button>
      </div>
      <div
        className={cn(
          "overflow-x-auto text-sm [&_pre]:m-0 [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:p-4 [&_code]:font-mono",
          lineNumbers && "code-line-numbers",
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
