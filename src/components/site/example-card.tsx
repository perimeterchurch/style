"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChevronDownIcon, CopyIcon, CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ExampleCardProps {
  name: string;
  children: React.ReactNode;
  codeHtml: string;
  rawCode: string;
}

export function ExampleCard({
  name,
  children,
  codeHtml,
  rawCode,
}: ExampleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-2">
        <h4 className="text-sm font-medium">{name}</h4>
      </div>

      <div className="flex items-center justify-center p-8">{children}</div>

      <div className="border-t">
        <div className="flex items-center justify-between px-4 py-1.5">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDownIcon
              className={cn(
                "size-3.5 transition-transform",
                expanded && "rotate-180",
              )}
            />
            {expanded ? "Hide code" : "Show code"}
          </button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <CheckIcon className="size-3" />
            ) : (
              <CopyIcon className="size-3" />
            )}
          </Button>
        </div>

        {expanded && (
          <div
            className="overflow-x-auto border-t text-sm [&_pre]:p-4"
            dangerouslySetInnerHTML={{ __html: codeHtml }}
          />
        )}
      </div>
    </div>
  );
}
