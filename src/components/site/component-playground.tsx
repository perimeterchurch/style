"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaygroundControls } from "./playground-controls";
import { CodeBlock } from "./code-block";
import { demoImports } from "@/lib/demo-imports";
import { highlightClient } from "@/lib/highlight-client";

import type { ControlsConfig } from "@/lib/demo-types";

interface ComponentPlaygroundProps {
  slug: string;
  controls: ControlsConfig;
  componentName: string;
  defaultCodeHtml: string;
  defaultCodeRaw: string;
}

function buildDefaults(controls: ControlsConfig): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const [name, descriptor] of Object.entries(controls)) {
    defaults[name] = descriptor.default;
  }
  return defaults;
}

function buildCodeSnippet(
  componentName: string,
  controls: ControlsConfig,
  values: Record<string, unknown>,
): string {
  const props = Object.entries(controls)
    .filter(([name]) => name !== "children")
    .map(([name, desc]) => {
      const val = values[name] ?? desc.default;
      if (typeof val === "boolean") return val ? name : `${name}={false}`;
      if (typeof val === "number") return `${name}={${val}}`;
      return `${name}="${val}"`;
    });

  const childrenVal = values["children"] ?? controls["children"]?.default;
  const children = childrenVal ? String(childrenVal) : "...";

  const propsStr = props.length > 0 ? " " + props.join(" ") : "";
  return `<${componentName}${propsStr}>${children}</${componentName}>`;
}

export function ComponentPlayground({
  slug,
  controls,
  componentName,
  defaultCodeHtml,
  defaultCodeRaw,
}: ComponentPlaygroundProps) {
  const defaults = useMemo(() => buildDefaults(controls), [controls]);
  const [values, setValues] = useState<Record<string, unknown>>(defaults);
  const [Playground, setPlayground] = useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);
  const [codeHtml, setCodeHtml] = useState(defaultCodeHtml);
  const [codeRaw, setCodeRaw] = useState(defaultCodeRaw);
  const [activeTab, setActiveTab] = useState("preview");
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const importFn = demoImports[slug];
    if (!importFn) return;
    importFn().then((mod) => {
      setPlayground(
        () => mod.Playground as React.ComponentType<Record<string, unknown>>,
      );
    });
  }, [slug]);

  const updateCodeHighlight = useCallback(
    (currentValues: Record<string, unknown>) => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => {
        const code = buildCodeSnippet(componentName, controls, currentValues);
        setCodeRaw(code);
        highlightClient(code).then(setCodeHtml);
      }, 150);
    },
    [componentName, controls],
  );

  function handleChange(name: string, value: unknown) {
    const next = { ...values, [name]: value };
    setValues(next);
    updateCodeHighlight(next);
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <div className="relative overflow-hidden rounded-lg border">
          <div
            className="transition-all duration-300 ease-in-out"
            style={{
              opacity: activeTab === "preview" ? 1 : 0,
              height: activeTab === "preview" ? "auto" : 0,
              overflow: activeTab === "preview" ? "visible" : "hidden",
            }}
          >
            <div className="flex min-h-48 items-center justify-center bg-background p-8">
              {Playground ? (
                <Playground {...values} />
              ) : (
                <div className="text-sm text-muted-foreground">Loading...</div>
              )}
            </div>
          </div>

          <div
            className="transition-all duration-300 ease-in-out"
            style={{
              opacity: activeTab === "code" ? 1 : 0,
              height: activeTab === "code" ? "auto" : 0,
              overflow: activeTab === "code" ? "visible" : "hidden",
            }}
          >
            <CodeBlock
              html={codeHtml}
              rawCode={codeRaw}
              className="rounded-none border-0"
            />
          </div>
        </div>
      </Tabs>

      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-sm font-medium">{componentName} Controls</h3>
        <PlaygroundControls
          controls={controls}
          values={values}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
