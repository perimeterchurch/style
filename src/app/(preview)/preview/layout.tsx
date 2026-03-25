import { DEFAULT_LIGHT_TOKENS } from '@/lib/default-tokens';

function buildRootVars(tokens: Record<string, string>): string {
    return Object.entries(tokens)
        .map(([k, v]) => `  --${k}: ${v};`)
        .join('\n');
}

function buildThemeBlock(): string {
    const mappings = [
        'background',
        'foreground',
        'card',
        'card-foreground',
        'popover',
        'popover-foreground',
        'primary',
        'primary-foreground',
        'secondary',
        'secondary-foreground',
        'muted',
        'muted-foreground',
        'accent',
        'accent-foreground',
        'destructive',
        'destructive-foreground',
        'border',
        'input',
        'ring',
        'chart-1',
        'chart-2',
        'chart-3',
        'chart-4',
        'chart-5',
        'success',
        'success-foreground',
        'warning',
        'warning-foreground',
        'info',
        'info-foreground',
        'sidebar',
        'sidebar-foreground',
        'sidebar-primary',
        'sidebar-primary-foreground',
        'sidebar-accent',
        'sidebar-accent-foreground',
        'sidebar-border',
        'sidebar-ring',
    ];

    const colorLines = mappings.map((name) => `  --color-${name}: var(--${name});`).join('\n');

    return `@theme inline {
${colorLines}
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}`;
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
    const rootVars = buildRootVars(DEFAULT_LIGHT_TOKENS);
    const themeBlock = buildThemeBlock();

    return (
        <html lang="en">
            <head>
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" async />
                <style
                    type="text/tailwindcss"
                    dangerouslySetInnerHTML={{
                        __html: `
@custom-variant dark (&:is(.dark *));

${themeBlock}

@layer base {
  * {
    border-color: var(--color-border);
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
  }
}`,
                    }}
                />
                <style
                    dangerouslySetInnerHTML={{
                        __html: `:root {\n${rootVars}\n}`,
                    }}
                />
            </head>
            <body className="p-6 font-sans antialiased">
                {children}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'UPDATE_TOKENS') {
    var tokens = e.data.tokens;
    var mode = e.data.mode;
    Object.keys(tokens).forEach(function(name) {
      document.documentElement.style.setProperty('--' + name, tokens[name]);
    });
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
});`,
                    }}
                />
            </body>
        </html>
    );
}
