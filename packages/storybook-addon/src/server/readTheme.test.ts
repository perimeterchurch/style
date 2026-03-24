import { describe, it, expect } from 'vitest';
import { parseThemeTokens } from './readTheme.ts';

describe('parseThemeTokens', () => {
    it('extracts token overrides from theme CSS', () => {
        const css = `[data-theme='dark'] {\n    --color-background: #1c1917;\n    --btn-radius: 9999px;\n}`;
        expect(parseThemeTokens(css)).toEqual({
            '--color-background': '#1c1917',
            '--btn-radius': '9999px',
        });
    });
    it('returns empty for no declarations', () => {
        expect(parseThemeTokens("[data-theme='x'] {}")).toEqual({});
    });
    it('handles var() references', () => {
        const css = "[data-theme='x'] { --btn-shadow: var(--shadow-md); }";
        expect(parseThemeTokens(css)['--btn-shadow']).toBe('var(--shadow-md)');
    });
    it('handles color-mix()', () => {
        const css =
            "[data-theme='x'] { --btn-border: color-mix(in oklab, var(--btn-bg), #000 8%); }";
        expect(parseThemeTokens(css)['--btn-border']).toBe(
            'color-mix(in oklab, var(--btn-bg), #000 8%)',
        );
    });
});
