"use client";

import { useEditorStore } from "@/lib/editor-store";
import { useThemeManagerStore } from "@/lib/theme-manager-store";
import { TOKEN_GROUPS } from "@/lib/default-tokens";
import { exportAsCSS, exportAsRegistryTheme } from "@/lib/export-theme";
import { ThemeSelector } from "@/components/editor/theme-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Moon, Sun, RotateCcw, Copy, FileDown, Undo2, Redo2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Attempt to convert an oklch() string to a hex color for the native color
 * picker. This is a rough approximation — oklch precision comes in Spec 2.
 * Falls back to #808080 if parsing fails.
 */
function oklchToHex(oklch: string): string {
  const match = oklch.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/,
  );
  if (!match) {
    // Maybe it's already hex
    if (oklch.startsWith("#")) return oklch;
    return "#808080";
  }

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // Convert oklch -> approximate sRGB via simplified path
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab -> linear sRGB (approximate matrix)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bv = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  function toSRGB(x: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 255;
    const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(255, v * 255)));
  }

  const R = toSRGB(r);
  const G = toSRGB(g);
  const B = toSRGB(bv);

  return `#${R.toString(16).padStart(2, "0")}${G.toString(16).padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;
}

function hexToOklch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // sRGB -> linear
  function toLinear(c: number): number {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);

  // Linear sRGB -> LMS (approximate)
  const l = Math.cbrt(0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl);
  const m = Math.cbrt(0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl);
  const s = Math.cbrt(0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl);

  // LMS -> OKLab
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const C = Math.sqrt(A * A + B2 * B2);
  let H = (Math.atan2(B2, A) * 180) / Math.PI;
  if (H < 0) H += 360;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${Math.round(H)})`;
}

const NON_COLOR_TOKENS = new Set(["radius"]);
function isColorToken(name: string): boolean {
  return !NON_COLOR_TOKENS.has(name);
}

function TokenInput({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  if (!isColorToken(name)) {
    // Radius slider
    const numValue = parseFloat(value) || 0.625;
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">{name}</Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            {numValue}rem
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1.5"
          step="0.125"
          value={numValue}
          onChange={(e) => onChange(`${e.target.value}rem`)}
          className="w-full accent-primary"
        />
      </div>
    );
  }

  const hexValue = oklchToHex(value);

  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{name}</Label>
      <div className="flex gap-1.5 items-center">
        <div className="relative shrink-0">
          <input
            type="color"
            value={hexValue}
            onChange={(e) => onChange(hexToOklch(e.target.value))}
            className="w-8 h-8 rounded border border-input cursor-pointer p-0 bg-transparent"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs font-mono h-8"
        />
      </div>
    </div>
  );
}

export function TokenControls() {
  const { lightTokens, darkTokens, activeMode, setToken, setActiveMode, resetToDefaults, undo, redo, past, future } =
    useEditorStore();
  const activeTheme = useThemeManagerStore((s) => {
    const slug = s.activeThemeSlug;
    return slug ? s.savedThemes.find(t => t.slug === slug) : null;
  });
  const themeName = activeTheme?.slug ?? "custom-theme";
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  const tokens = activeMode === "light" ? lightTokens : darkTokens;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b space-y-2">
        <h2 className="text-sm font-semibold">Theme Editor</h2>
        <ThemeSelector />
        <div className="flex gap-1.5">
          <Button
            variant={activeMode === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMode("light")}
          >
            <Sun className="size-3.5" />
            Light
          </Button>
          <Button
            variant={activeMode === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMode("dark")}
          >
            <Moon className="size-3.5" />
            Dark
          </Button>
          <div className="ml-auto flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={!canUndo}
              onClick={() => {
                undo();
                toast("Undo");
              }}
            >
              <Undo2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!canRedo}
              onClick={() => {
                redo();
                toast("Redo");
              }}
            >
              <Redo2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetToDefaults();
                toast("Tokens reset to defaults");
              }}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={async () => {
              try {
                const css = exportAsCSS(lightTokens, darkTokens);
                await navigator.clipboard.writeText(css);
                toast.success("CSS copied to clipboard");
              } catch {
                toast.error("Failed to copy to clipboard");
              }
            }}
          >
            <FileDown className="size-3.5" />
            Export CSS
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={async () => {
              try {
                const json = exportAsRegistryTheme(
                  themeName,
                  lightTokens,
                  darkTokens,
                );
                await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
                toast.success("Theme JSON copied to clipboard");
              } catch {
                toast.error("Failed to copy to clipboard");
              }
            }}
          >
            <Copy className="size-3.5" />
            Copy JSON
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {TOKEN_GROUPS.map((group) => (
            <div key={group.label} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h3>
              {group.tokens.map((tokenName) => {
                const value = tokens[tokenName];
                if (value === undefined) return null;
                return (
                  <TokenInput
                    key={tokenName}
                    name={tokenName}
                    value={value}
                    onChange={(v) => setToken(tokenName, v)}
                  />
                );
              })}
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
