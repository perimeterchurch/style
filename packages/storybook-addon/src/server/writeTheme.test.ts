import { describe, it, expect } from 'vitest';
import { generateThemeCss, generateBaseImport } from './writeTheme.ts';

describe('generateThemeCss', () => {
    it('generates a data-theme selector block', () => {
        const css = generateThemeCss('christmas', {
            '--color-primary': '#c41e3a',
            '--color-background': '#1a472a',
        });
        expect(css).toContain("[data-theme='christmas']");
        expect(css).toContain('--color-primary: #c41e3a;');
        expect(css).toContain('--color-background: #1a472a;');
    });

    it('wraps tokens in a properly formatted block', () => {
        const css = generateThemeCss('dark', {
            '--color-background': '#000000',
        });
        const lines = css.trim().split('\n');
        expect(lines[0]).toBe("[data-theme='dark'] {");
        expect(lines[lines.length - 1]).toBe('}');
    });

    it('indents token declarations with 4 spaces', () => {
        const css = generateThemeCss('warm', {
            '--color-primary': '#ff6600',
        });
        expect(css).toContain('    --color-primary: #ff6600;');
    });

    it('handles empty token set', () => {
        const css = generateThemeCss('empty', {});
        expect(css).toContain("[data-theme='empty']");
        expect(css).toContain('{');
        expect(css).toContain('}');
    });
});

describe('generateBaseImport', () => {
    const baseCss = `@import './tokens.css';
@import './theme-dark.css';

:root {
    --color-primary: #5b5bd6;
}`;

    it('adds import after last existing theme import', () => {
        const result = generateBaseImport(baseCss, 'christmas');
        const lines = result.split('\n');
        const importIdx = lines.findIndex((l) => l.includes('theme-christmas'));
        const darkIdx = lines.findIndex((l) => l.includes('theme-dark'));
        expect(importIdx).toBeGreaterThan(darkIdx);
        expect(lines[importIdx]).toBe("@import './theme-christmas.css';");
    });

    it('does not duplicate an existing import', () => {
        const cssWithImport = `@import './tokens.css';
@import './theme-dark.css';
@import './theme-christmas.css';

:root {
    --color-primary: #5b5bd6;
}`;
        const result = generateBaseImport(cssWithImport, 'christmas');
        const matches = result.match(/theme-christmas/g);
        expect(matches?.length).toBe(1);
    });

    it('adds import after last @import if no theme imports exist', () => {
        const noThemeCss = `@import './tokens.css';
@import './reset.css';

:root {
    --color-primary: #5b5bd6;
}`;
        const result = generateBaseImport(noThemeCss, 'warm');
        const lines = result.split('\n');
        const importIdx = lines.findIndex((l) => l.includes('theme-warm'));
        const resetIdx = lines.findIndex((l) => l.includes('reset.css'));
        expect(importIdx).toBeGreaterThan(resetIdx);
    });

    it('handles CSS with no imports', () => {
        const noImportCss = `:root {
    --color-primary: #5b5bd6;
}`;
        const result = generateBaseImport(noImportCss, 'warm');
        expect(result).toContain("@import './theme-warm.css';");
    });
});
