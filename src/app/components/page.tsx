import Link from "next/link";

import manifest from "@/lib/demo-manifest.json";

interface ManifestEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
  install: string;
  demoFile: string;
}

function groupByCategory(
  entries: ManifestEntry[],
): Record<string, ManifestEntry[]> {
  const groups: Record<string, ManifestEntry[]> = {};
  for (const entry of entries) {
    const cat = entry.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(entry);
  }
  return groups;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ComponentsIndexPage() {
  const grouped = groupByCategory(manifest as ManifestEntry[]);
  const categories = Object.keys(grouped).sort();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Components</h1>
        <p className="mt-1 text-muted-foreground">
          Browse all components by category.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const components = grouped[category];
          return (
            <Link
              key={category}
              href={`/components/${category}`}
              className="group rounded-lg border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent/50"
            >
              <h2 className="text-lg font-semibold group-hover:text-primary">
                {capitalize(category)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {components.length}{" "}
                {components.length === 1 ? "component" : "components"}
              </p>
              <ul className="mt-3 space-y-1">
                {components.map((entry) => (
                  <li
                    key={entry.slug}
                    className="text-sm text-muted-foreground"
                  >
                    {entry.name}
                  </li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
