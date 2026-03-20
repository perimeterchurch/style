import { describe, it, expect } from 'vitest';
import { validateTokenName, updateTokensInCss } from './writeTokens';

describe('validateTokenName', () => {
    it('accepts valid token names', () => {
        expect(validateTokenName('--color-primary')).toBe(true);
        expect(validateTokenName('--spacing-2xl')).toBe(true);
        expect(validateTokenName('--font-size-sm')).toBe(true);
        expect(validateTokenName('--z-dropdown')).toBe(true);
    });

    it('rejects names without leading double-dash', () => {
        expect(validateTokenName('color-primary')).toBe(false);
        expect(validateTokenName('-color-primary')).toBe(false);
    });

    it('rejects names with uppercase letters', () => {
        expect(validateTokenName('--Color-Primary')).toBe(false);
        expect(validateTokenName('--color-PRIMARY')).toBe(false);
    });

    it('rejects empty or whitespace names', () => {
        expect(validateTokenName('')).toBe(false);
        expect(validateTokenName('  ')).toBe(false);
    });
});

const SAMPLE_CSS = `
@theme {
    --color-primary: #5b5bd6;
    --color-background: #ffffff;
    --font-size-sm: 0.875rem;
}

:root,
.storybook-root {
    --color-primary: #5b5bd6;
    --color-background: #ffffff;
    --spacing-sm: 0.75rem;
}
`;

describe('updateTokensInCss', () => {
    it('updates a token that exists in both blocks', () => {
        const result = updateTokensInCss(SAMPLE_CSS, {
            '--color-primary': '#ff0000',
        });
        // Both blocks should be updated
        expect(result).toContain('--color-primary: #ff0000;');
        // Should appear twice (once in @theme, once in :root)
        const matches = result.match(/--color-primary: #ff0000/g);
        expect(matches?.length).toBe(2);
    });

    it('updates a token that exists only in @theme', () => {
        const result = updateTokensInCss(SAMPLE_CSS, {
            '--font-size-sm': '1rem',
        });
        expect(result).toContain('--font-size-sm: 1rem;');
    });

    it('updates a token that exists only in :root', () => {
        const result = updateTokensInCss(SAMPLE_CSS, {
            '--spacing-sm': '1rem',
        });
        expect(result).toContain('--spacing-sm: 1rem;');
    });

    it('preserves unmodified tokens', () => {
        const result = updateTokensInCss(SAMPLE_CSS, {
            '--color-primary': '#ff0000',
        });
        expect(result).toContain('--color-background: #ffffff;');
        expect(result).toContain('--font-size-sm: 0.875rem;');
        expect(result).toContain('--spacing-sm: 0.75rem;');
    });

    it('throws on invalid token name', () => {
        expect(() => updateTokensInCss(SAMPLE_CSS, { 'color-primary': '#ff0000' })).toThrowError(
            /invalid token name/i,
        );
    });

    it('throws on uppercase token name', () => {
        expect(() => updateTokensInCss(SAMPLE_CSS, { '--Color-Primary': '#ff0000' })).toThrowError(
            /invalid token name/i,
        );
    });

    it('handles multiple updates at once', () => {
        const result = updateTokensInCss(SAMPLE_CSS, {
            '--color-primary': '#ff0000',
            '--spacing-sm': '2rem',
        });
        expect(result).toContain('--color-primary: #ff0000;');
        expect(result).toContain('--spacing-sm: 2rem;');
    });
});
