"use client";

import { useState, useMemo, useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaygroundControls } from "./playground-controls";
import { demoImports } from "@/lib/demo-imports";

import type { ControlsConfig } from "@/lib/demo-types";

interface ComponentPlaygroundProps {
  slug: string;
  controls: ControlsConfig;
  componentName: string;
  defaultCodeHtml: string;
}

function buildDefaults(controls: ControlsConfig): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const [name, descriptor] of Object.entries(controls)) {
    defaults[name] = descriptor.default;
  }
  return defaults;
}

export function ComponentPlayground({
  slug,
  controls,
  componentName,
  defaultCodeHtml,
}: ComponentPlaygroundProps) {
  const defaults = useMemo(() => buildDefaults(controls), [controls]);
  const [values, setValues] = useState<Record<string, unknown>>(defaults);
  const [Playground, setPlayground] = useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);

  useEffect(() => {
    const importFn = demoImports[slug];
    if (!importFn) return;
    importFn().then((mod) => {
      setPlayground(
        () => mod.Playground as React.ComponentType<Record<string, unknown>>,
      );
    });
  }, [slug]);

  const nonDefaultEntries = useMemo(() => {
    return Object.entries(values).filter(
      ([key, val]) => val !== defaults[key],
    );
  }, [values, defaults]);

  function handleChange(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="flex min-h-48 items-center justify-center rounded-lg border bg-background p-8">
            {Playground ? (
              <Playground {...values} />
            ) : (
              <div className="text-sm text-muted-foreground">Loading...</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="code">
          <div className="space-y-2">
            {nonDefaultEntries.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Current props:{" "}
                {nonDefaultEntries
                  .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                  .join(", ")}
              </p>
            )}
            <div
              className="overflow-x-auto rounded-lg border text-sm [&_pre]:p-4"
              dangerouslySetInnerHTML={{ __html: defaultCodeHtml }}
            />
          </div>
        </TabsContent>
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
