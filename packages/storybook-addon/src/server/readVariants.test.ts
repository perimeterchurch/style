import { describe, it, expect } from 'vitest';
import { parseVariantsFile, resolveVariantsPath, validateVariantName } from './readVariants.ts';

const SAMPLE_VARIANTS_FILE = `import type { VariantDefinition, SizeDefinition } from '../../utils/types';

export const buttonVariants: Record<string, VariantDefinition> = {
    primary: {
        base: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        hover: 'hover:bg-[var(--color-primary-hover)]',
        active: 'active:bg-[var(--color-primary-active)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
        outline:
            'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]',
    },
    secondary: {
        base: 'bg-[var(--color-stone-100)] text-[var(--color-stone-700)]',
        hover: 'hover:bg-[var(--color-stone-200)]',
        active: 'active:bg-[var(--color-stone-300)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50',
        _meta: { clonedFrom: 'primary' },
    },
    ghost: {
        base: 'bg-transparent text-[var(--color-stone-700)]',
        hover: 'hover:bg-[var(--color-stone-100)]',
        active: 'active:bg-[var(--color-stone-200)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2',
    },
};

export const buttonSizes: Record<string, SizeDefinition> = {
    xs: { padding: 'px-2 py-1', fontSize: 'text-xs', iconSize: 12, radius: 'rounded' },
    sm: { padding: 'px-3 py-1.5', fontSize: 'text-sm', iconSize: 14, radius: 'rounded-md' },
    md: { padding: 'px-4 py-2', fontSize: 'text-base', iconSize: 16, radius: 'rounded-lg' },
};

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
`;

describe('parseVariantsFile', () => {
    it('extracts variant names from buttonVariants', () => {
        const result = parseVariantsFile(SAMPLE_VARIANTS_FILE);
        expect(result.variants).toBeDefined();
        expect(Object.keys(result.variants)).toEqual(['primary', 'secondary', 'ghost']);
    });

    it('extracts size names from buttonSizes', () => {
        const result = parseVariantsFile(SAMPLE_VARIANTS_FILE);
        expect(result.sizes).toBeDefined();
        expect(Object.keys(result.sizes)).toEqual(['xs', 'sm', 'md']);
    });

    it('handles string values containing colons', () => {
        const result = parseVariantsFile(SAMPLE_VARIANTS_FILE);
        expect(result.variants.primary.hover).toBe('hover:bg-[var(--color-primary-hover)]');
    });

    it('handles nested _meta objects', () => {
        const result = parseVariantsFile(SAMPLE_VARIANTS_FILE);
        expect(result.variants.secondary._meta).toEqual({ clonedFrom: 'primary' });
    });

    it('correctly parses size definitions with numeric values', () => {
        const result = parseVariantsFile(SAMPLE_VARIANTS_FILE);
        expect(result.sizes.md.iconSize).toBe(16);
        expect(result.sizes.md.padding).toBe('px-4 py-2');
    });

    it('returns empty objects for file with no exports', () => {
        const result = parseVariantsFile('// empty file');
        expect(result.variants).toEqual({});
        expect(result.sizes).toEqual({});
    });
});

describe('resolveVariantsPath', () => {
    it('maps Components/Primitives/Button to file path', () => {
        const path = resolveVariantsPath('Components/Primitives/Button');
        expect(path).toContain('primitives/Button/Button.variants.ts');
    });

    it('maps Components/Composite/Tabs to file path', () => {
        const path = resolveVariantsPath('Components/Composite/Tabs');
        expect(path).toContain('composite/Tabs/Tabs.variants.ts');
    });
});

describe('validateVariantName', () => {
    it('accepts valid JS identifiers', () => {
        expect(validateVariantName('primary')).toBe(true);
        expect(validateVariantName('darkMode')).toBe(true);
        expect(validateVariantName('size2xl')).toBe(true);
        expect(validateVariantName('_private')).toBe(true);
    });

    it('rejects names starting with digits', () => {
        expect(validateVariantName('2xl')).toBe(false);
    });

    it('rejects names with hyphens', () => {
        expect(validateVariantName('dark-mode')).toBe(false);
    });

    it('rejects empty strings', () => {
        expect(validateVariantName('')).toBe(false);
    });

    it('rejects names with spaces', () => {
        expect(validateVariantName('dark mode')).toBe(false);
    });
});
