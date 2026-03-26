import type { ComponentType } from "react";

interface TemplateMeta {
  name: string;
  description: string;
  components: string[];
}

interface TemplateModule {
  meta: TemplateMeta;
  default: ComponentType;
}

const TEMPLATE_SLUGS = [
  "dashboard",
  "settings",
  "login",
  "data-table",
  "marketing-landing",
] as const;

type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];

const templateImports: Record<TemplateSlug, () => Promise<TemplateModule>> = {
  dashboard: () => import("./dashboard"),
  settings: () => import("./settings"),
  login: () => import("./login"),
  "data-table": () => import("./data-table"),
  "marketing-landing": () => import("./marketing-landing"),
};

export { TEMPLATE_SLUGS, templateImports };
export type { TemplateMeta, TemplateModule, TemplateSlug };
