"use client";

import { useEffect, useState } from "react";
import { PreviewFrame } from "@/components/editor/preview-frame";
import { TokenControls } from "@/components/editor/token-controls";
import { useEditorStore } from "@/lib/editor-store";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const PREVIEW_TABS = [
  { label: "Showcase", path: "/preview/showcase" },
  { label: "Forms", path: "/preview/forms" },
  { label: "Dashboard", path: "/preview/dashboard" },
] as const;

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<string>(PREVIEW_TABS[0].path);

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
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-screen"
      id="editor-layout"
    >
      <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
        <aside className="h-full bg-background flex flex-col overflow-y-auto">
          <TokenControls />
        </aside>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <main className="flex flex-col h-full">
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
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
