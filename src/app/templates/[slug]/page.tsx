import { readFile } from "node:fs/promises";
import { join } from "node:path";

import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { highlight } from "@/lib/highlight";
import { TEMPLATE_ENTRIES, TEMPLATE_SLUGS } from "@/templates";

import { TemplateDetailClient } from "./template-detail-client";

import type { TemplateSlug } from "@/templates";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TEMPLATE_SLUGS.map((slug) => ({ slug }));
}

async function readTemplateSource(slug: string): Promise<string> {
  const filePath = join(process.cwd(), "src", "templates", `${slug}.tsx`);
  return readFile(filePath, "utf-8");
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const entry = TEMPLATE_ENTRIES.find((e) => e.slug === slug);
  if (!entry) notFound();

  const templateSlug = slug as TemplateSlug;
  const { meta } = entry;

  const sourceCode = await readTemplateSource(templateSlug);
  const codeHtml = await highlight(sourceCode);

  const installParts = meta.components.map((c) => `@perimeter/${c}`);
  const installCommand = `pnpm dlx shadcn@latest add ${installParts.join(" ")}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{meta.name}</h1>
        <p className="mt-1 text-muted-foreground">{meta.description}</p>
      </div>

      {/* Component list */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Components used:
        </span>
        {meta.components.map((comp) => (
          <Link key={comp} href={`/components`}>
            <Badge variant="secondary">{comp}</Badge>
          </Link>
        ))}
      </div>

      {/* Preview / Code toggle */}
      <TemplateDetailClient
        slug={templateSlug}
        codeHtml={codeHtml}
        rawCode={sourceCode}
      />

      {/* Install command */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Install Components</h2>
        <p className="text-sm text-muted-foreground">
          Install all components used in this template with a single command.
        </p>
        <pre className="overflow-x-auto rounded-lg border bg-muted px-4 py-3 text-sm">
          <code>{installCommand}</code>
        </pre>
      </section>
    </div>
  );
}
