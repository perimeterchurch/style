"use client";

import { useState } from "react";
import { PreviewFrame } from "@/components/editor/preview-frame";
import { TokenControls } from "@/components/editor/token-controls";
import { Button } from "@/components/ui/button";

const PREVIEW_TABS = [
  { label: "Showcase", path: "/preview/showcase" },
  { label: "Forms", path: "/preview/forms" },
  { label: "Dashboard", path: "/preview/dashboard" },
] as const;

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<string>(PREVIEW_TABS[0].path);

  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r bg-background flex flex-col overflow-y-auto">
        <TokenControls />
      </aside>
      <main className="flex-1 flex flex-col">
        <div className="flex gap-1 p-2 border-b bg-muted/50">
          {PREVIEW_TABS.map((tab) => (
            <Button
              key={tab.path}
              variant={activeTab === tab.path ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.path)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex-1">
          <PreviewFrame src={activeTab} />
        </div>
      </main>
    </div>
  );
}
