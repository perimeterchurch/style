"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaygroundControls } from "./playground-controls";

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

  // Load only the single demo Playground for this slug — not all 55
  const PlaygroundComponent = useMemo(
    () =>
      dynamic(
        () =>
          import(`@registry/ui/perimeter/${slug}.demo`).then(
            (mod) => mod.Playground,
          ),
        {
          loading: () => (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ),
        },
      ),
    [slug],
  );

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
            <PlaygroundComponent {...values} />
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
