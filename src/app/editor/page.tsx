"use client";

import { useEffect, useState } from "react";

import { PreviewPanel } from "@/components/editor/preview-panel";
import { TokenControls } from "@/components/editor/token-controls";
import { useEditorStore } from "@/lib/editor-store";
import { Button } from "@/components/ui/button";

const PREVIEW_TABS = [
  { label: "Showcase", key: "showcase" },
  { label: "Forms", key: "forms" },
  { label: "Dashboard", key: "dashboard" },
] as const;

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<string>(PREVIEW_TABS[0].key);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        const state = useEditorStore.getState();
        if (e.shiftKey) {
          state.redo();
        } else {
          state.undo();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-80 min-w-64 max-w-xl border-r bg-background flex flex-col overflow-y-auto resize-x">
        <TokenControls />
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex gap-1 p-2 border-b bg-muted/50">
          {PREVIEW_TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex-1">
          <PreviewPanel activeTab={activeTab} />
        </div>
      </main>
    </div>
  );
}
