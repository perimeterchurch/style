"use client";

import { useState } from "react";
import { useThemeManagerStore } from "@/lib/theme-manager-store";
import { useEditorStore } from "@/lib/editor-store";
import { exportAsRegistryTheme } from "@/lib/export-theme";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, FilePlus2, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

type DialogMode = "save" | "saveAs" | "create" | null;

const CREATE_NEW_VALUE = "__create_new__";

export function ThemeSelector() {
  const { savedThemes, activeThemeSlug, loadTheme, saveTheme, saveThemeAs, deleteTheme } =
    useThemeManagerStore();
  const lightTokens = useEditorStore((s) => s.lightTokens);
  const darkTokens = useEditorStore((s) => s.darkTokens);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [themeName, setThemeName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const activeTheme = activeThemeSlug
    ? savedThemes.find((t) => t.slug === activeThemeSlug)
    : null;

  function handleSelectChange(value: string | null, _eventDetails?: unknown) {
    if (value === null) return;
    if (value === CREATE_NEW_VALUE) {
      setThemeName("");
      setDialogMode("create");
      return;
    }
    loadTheme(value);
    const theme = savedThemes.find((t) => t.slug === value);
    if (theme) {
      toast.success(`Loaded "${theme.name}"`);
    }
  }

  function handleDialogSubmit() {
    const name = themeName.trim();
    if (!name) {
      toast.error("Theme name cannot be empty");
      return;
    }

    if (dialogMode === "save") {
      saveTheme(name);
      toast.success(`Saved "${name}"`);
    } else {
      // saveAs and create both create new
      saveThemeAs(name);
      toast.success(`Created "${name}"`);
    }

    setDialogMode(null);
    setThemeName("");
  }

  function handleDelete() {
    if (!activeThemeSlug || !activeTheme) return;
    const deleted = deleteTheme(activeThemeSlug);
    if (deleted) {
      toast.success(`Deleted "${activeTheme.name}"`);
    } else {
      toast.error("Cannot delete preset themes");
    }
    setDeleteOpen(false);
  }

  function handleDownload() {
    const slug = activeTheme?.slug ?? "custom-theme";
    const name = activeTheme?.slug ?? "custom-theme";
    const json = exportAsRegistryTheme(name, lightTokens, darkTokens);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Theme downloaded");
  }

  function handleSaveClick() {
    if (activeTheme && !activeTheme.isPreset) {
      // Overwrite existing
      saveTheme(activeTheme.name);
      toast.success(`Saved "${activeTheme.name}"`);
    } else {
      // No active theme or it's a preset — prompt for name
      setThemeName(activeTheme?.name ?? "");
      setDialogMode("save");
    }
  }

  const dialogTitle =
    dialogMode === "save"
      ? "Save Theme"
      : dialogMode === "saveAs"
        ? "Save Theme As"
        : "Create New Theme";

  return (
    <div className="space-y-2">
      <Select
        value={activeThemeSlug ?? undefined}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Unsaved Changes" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Themes</SelectLabel>
            {savedThemes.map((theme) => (
              <SelectItem key={theme.slug} value={theme.slug}>
                {theme.name}
                {theme.isPreset ? " (preset)" : ""}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value={CREATE_NEW_VALUE}>
              Create New Theme
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex gap-1.5">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleSaveClick}>
          <Save className="size-3.5" />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            setThemeName(activeTheme?.name ?? "");
            setDialogMode("saveAs");
          }}
        >
          <FilePlus2 className="size-3.5" />
          Save As
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!activeTheme || activeTheme.isPreset}
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="size-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="size-3.5" />
        </Button>
      </div>

      {/* Name dialog for Save / Save As / Create */}
      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialogMode(null);
            setThemeName("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Enter a name for your theme.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="My Theme"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleDialogSubmit();
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Theme</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{activeTheme?.name}&rdquo;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
