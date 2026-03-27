"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { CSSProperties } from "react";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const listRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({});

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const activeTab = list.querySelector<HTMLElement>("[data-active]");
    if (!activeTab) return;

    const isVertical = list.closest("[data-orientation=vertical]") !== null;

    const skipTransition = isFirstRender.current;
    if (isFirstRender.current) isFirstRender.current = false;

    const transition = skipTransition
      ? "none"
      : "transform 200ms ease-out, width 200ms ease-out, height 200ms ease-out";

    if (isVertical) {
      const h = activeTab.offsetHeight * 0.6;
      const y = activeTab.offsetTop + activeTab.offsetHeight * 0.2;
      setIndicatorStyle({
        position: "absolute",
        right: -4,
        width: 2,
        height: h,
        transform: `translateY(${y}px)`,
        borderRadius: 9999,
        backgroundColor: "var(--foreground)",
        transition,
      });
    } else {
      const w = activeTab.offsetWidth * 0.6;
      const x = activeTab.offsetLeft + activeTab.offsetWidth * 0.2;
      setIndicatorStyle({
        position: "absolute",
        bottom: -4,
        height: 2,
        width: w,
        transform: `translateX(${x}px)`,
        borderRadius: 9999,
        backgroundColor: "var(--foreground)",
        transition,
      });
    }
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list || variant !== "line") return;

    updateIndicator();

    const mutationObserver = new MutationObserver(updateIndicator);
    const tabs = list.querySelectorAll("[data-slot='tabs-trigger']");
    for (const tab of tabs) {
      mutationObserver.observe(tab, {
        attributes: true,
        attributeFilter: ["data-active"],
      });
    }

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(list);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [variant, updateIndicator]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        tabsListVariants({ variant }),
        variant === "line" && "relative",
        className,
      )}
      {...props}
    >
      {children}
      {variant === "line" && (
        <span data-slot="tabs-indicator" style={indicatorStyle} />
      )}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
