import { describe, it, expect } from 'vitest';
import { parseTokensFromCss, categorizeTokens } from './readTokens';

const SAMPLE_CSS = `
@theme {
    --color-primary: #5b5bd6;
    --color-primary-hover: #4e4eca;
    --color-background: #ffffff;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --shadow-sm: 0 1px 3px 0 rgb(28 25 23 / 0.08), 0 1px 2px -1px rgb(28 25 23 / 0.08);
    --shadow-md: 0 4px 6px -1px rgb(28 25 23 / 0.08), 0 2px 4px -2px rgb(28 25 23 / 0.06);
}

:root,
.storybook-root {
    --color-primary: #6b6be6;
    --color-primary-hover: #4e4eca;
    --color-background: #ffffff;
    --spacing-sm: 0.75rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --font-weight-normal: 400;
    --font-weight-bold: 700;
    --line-height-normal: 1.5;
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --z-dropdown: 1000;
}
`;

describe('parseTokensFromCss', () => {
    it('extracts tokens from both @theme and :root blocks', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);

        // tokens from @theme only
        expect(tokens['--font-size-sm']).toBe('0.875rem');
        expect(tokens['--font-size-base']).toBe('1rem');
        expect(tokens['--radius-sm']).toBe('0.375rem');
        expect(tokens['--shadow-sm']).toBe(
            '0 1px 3px 0 rgb(28 25 23 / 0.08), 0 1px 2px -1px rgb(28 25 23 / 0.08)',
        );

        // tokens from :root only
        expect(tokens['--spacing-sm']).toBe('0.75rem');
        expect(tokens['--font-weight-normal']).toBe('400');
        expect(tokens['--transition-fast']).toBe('150ms cubic-bezier(0.4, 0, 0.2, 1)');
        expect(tokens['--z-dropdown']).toBe('1000');
    });

    it(':root values take precedence over @theme values', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        // --color-primary differs: @theme=#5b5bd6, :root=#6b6be6
        expect(tokens['--color-primary']).toBe('#6b6be6');
    });

    it('handles shadow values with commas correctly', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        expect(tokens['--shadow-md']).toBe(
            '0 4px 6px -1px rgb(28 25 23 / 0.08), 0 2px 4px -2px rgb(28 25 23 / 0.06)',
        );
    });

    it('returns empty object for empty CSS', () => {
        expect(parseTokensFromCss('')).toEqual({});
    });
});

describe('categorizeTokens', () => {
    it('groups tokens into correct categories', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        const categorized = categorizeTokens(tokens);

        expect(categorized.Colors).toBeDefined();
        expect(categorized.Typography).toBeDefined();
        expect(categorized.Spacing).toBeDefined();
        expect(categorized.Shadows).toBeDefined();
        expect(categorized.Radii).toBeDefined();
        expect(categorized.Transitions).toBeDefined();
    });

    it('places color tokens under Colors with sub-groups', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        const categorized = categorizeTokens(tokens);

        expect(categorized.Colors.Primary).toBeDefined();
        expect(categorized.Colors.Primary['--color-primary']).toBe('#6b6be6');
        expect(categorized.Colors.Surface).toBeDefined();
        expect(categorized.Colors.Surface['--color-background']).toBe('#ffffff');
    });

    it('places font-size and font-weight under Typography with sub-groups', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        const categorized = categorizeTokens(tokens);

        expect(categorized.Typography['Font Size']['--font-size-sm']).toBe('0.875rem');
        expect(categorized.Typography['Font Weight']['--font-weight-bold']).toBe('700');
        expect(categorized.Typography['Line Height']['--line-height-normal']).toBe('1.5');
    });

    it('places spacing tokens under Spacing', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        const categorized = categorizeTokens(tokens);

        expect(categorized.Spacing['--spacing-sm']).toBe('0.75rem');
        expect(categorized.Spacing['--spacing-lg']).toBe('1.5rem');
    });

    it('places shadow tokens under Shadows', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        const categorized = categorizeTokens(tokens);

        expect(categorized.Shadows['--shadow-sm']).toBeDefined();
    });

    it('places radius tokens under Radii', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        const categorized = categorizeTokens(tokens);

        expect(categorized.Radii['--radius-sm']).toBe('0.375rem');
    });

    it('places transition tokens under Transitions', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        const categorized = categorizeTokens(tokens);

        expect(categorized.Transitions['--transition-fast']).toBe(
            '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        );
    });

    it('does not include z-index in any standard category', () => {
        const tokens = parseTokensFromCss(SAMPLE_CSS);
        const categorized = categorizeTokens(tokens);

        // z-index tokens go to an Other/uncategorized bucket
        expect(categorized.Other).toBeDefined();
        expect(categorized.Other['--z-dropdown']).toBe('1000');
    });
});
