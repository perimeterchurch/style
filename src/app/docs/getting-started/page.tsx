import { highlight } from "@/lib/highlight";

const CODE_BLOCKS = {
  addComponent: `pnpm dlx shadcn@latest add @perimeter/button`,
  addBase: `pnpm dlx shadcn@latest add @perimeter/perimeter-base`,
  componentsJson: `{
  "registries": {
    "perimeter": {
      "url": "https://style.perimeter.church/r"
    }
  }
}`,
  dataTheme: `<!-- Apply a project theme -->
<html data-theme="metrics">
  ...
</html>`,
  darkMode: `<!-- Toggle dark mode with the .dark class -->
<html class="dark">
  ...
</html>

<!-- Or combine with a project theme -->
<html class="dark" data-theme="metrics">
  ...
</html>`,
  usageExample: `import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <Button variant="default">
      Click me
    </Button>
  );
}`,
} as const;

interface HighlightedBlocks {
  addComponent: string;
  addBase: string;
  componentsJson: string;
  dataTheme: string;
  darkMode: string;
  usageExample: string;
}

async function highlightAllBlocks(): Promise<HighlightedBlocks> {
  const [
    addComponent,
    addBase,
    componentsJson,
    dataTheme,
    darkMode,
    usageExample,
  ] = await Promise.all([
    highlight(CODE_BLOCKS.addComponent, "bash"),
    highlight(CODE_BLOCKS.addBase, "bash"),
    highlight(CODE_BLOCKS.componentsJson, "json"),
    highlight(CODE_BLOCKS.dataTheme, "tsx"),
    highlight(CODE_BLOCKS.darkMode, "tsx"),
    highlight(CODE_BLOCKS.usageExample, "tsx"),
  ]);

  return {
    addComponent,
    addBase,
    componentsJson,
    dataTheme,
    darkMode,
    usageExample,
  };
}

export default async function GettingStartedPage() {
  const code = await highlightAllBlocks();

  return (
    <article className="prose prose-stone dark:prose-invert mx-auto max-w-3xl">
      <h1>Getting Started</h1>
      <p>
        Perimeter Style is a shadcn-compatible component registry. You can
        install individual components or the full base set directly into your
        project using the shadcn CLI.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>
          <strong>Node.js</strong> 18 or later
        </li>
        <li>
          <strong>pnpm</strong> as your package manager
        </li>
        <li>
          A project with <strong>shadcn</strong> initialized (Tailwind CSS v4 +
          TypeScript)
        </li>
      </ul>

      <h2>Configure the Registry</h2>
      <p>
        Add the Perimeter registry to your <code>components.json</code>:
      </p>
      <div
        className="not-prose overflow-x-auto rounded-lg border text-sm [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: code.componentsJson }}
      />

      <h2>Install a Component</h2>
      <p>
        Use the shadcn CLI to add a single component. For example, to add the
        Button:
      </p>
      <div
        className="not-prose overflow-x-auto rounded-lg border text-sm [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: code.addComponent }}
      />
      <p>
        This copies the component source into your project and installs any
        required dependencies.
      </p>

      <h2>Install the Full Base</h2>
      <p>To install all base components at once:</p>
      <div
        className="not-prose overflow-x-auto rounded-lg border text-sm [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: code.addBase }}
      />

      <h2>Usage</h2>
      <p>
        Import installed components from your project&apos;s component
        directory:
      </p>
      <div
        className="not-prose overflow-x-auto rounded-lg border text-sm [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: code.usageExample }}
      />

      <h2>Theming</h2>
      <p>
        Perimeter Style includes project-specific themes that override the base
        tokens. Apply a theme by setting the <code>data-theme</code> attribute
        on your <code>&lt;html&gt;</code> element:
      </p>
      <div
        className="not-prose overflow-x-auto rounded-lg border text-sm [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: code.dataTheme }}
      />
      <p>
        Available themes: <code>perimeter-api</code>, <code>metrics</code>. When
        no <code>data-theme</code> is set, the default warm stone palette is
        used.
      </p>

      <h2>Dark Mode</h2>
      <p>
        Dark mode is controlled by adding the <code>.dark</code> class to the{" "}
        <code>&lt;html&gt;</code> element. This works independently of the
        project theme:
      </p>
      <div
        className="not-prose overflow-x-auto rounded-lg border text-sm [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: code.darkMode }}
      />
      <p>
        All components automatically respond to the dark mode class through CSS
        custom property inheritance.
      </p>
    </article>
  );
}
