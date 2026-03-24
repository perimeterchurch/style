import { describe, it, expect } from 'vitest';
import { parseThemeNameFromCss } from './listThemes.ts';

describe('parseThemeNameFromCss', () => {
    it('extracts theme name from data-theme selector', () => {
        const css = "[data-theme='dark'] { --color-bg: #000; }";
        expect(parseThemeNameFromCss(css)).toBe('dark');
    });
    it('handles double quotes', () => {
        const css = '[data-theme="easter-2026"] { --color-primary: #c41e3a; }';
        expect(parseThemeNameFromCss(css)).toBe('easter-2026');
    });
    it('returns null for CSS without data-theme', () => {
        expect(parseThemeNameFromCss(':root { --x: 1; }')).toBeNull();
    });
    it('returns null for empty CSS', () => {
        expect(parseThemeNameFromCss('')).toBeNull();
    });
});
