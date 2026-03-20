import { describe, it, expect } from 'vitest';
import { updateVariantInFile, addVariantToFile, removeVariantFromFile } from './writeVariant.ts';

const SAMPLE_FILE = `import type { VariantDefinition, SizeDefinition } from '../../utils/types';

export const buttonVariants: Record<string, VariantDefinition> = {
    primary: {
        base: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        hover: 'hover:bg-[var(--color-primary-hover)]',
    },
    secondary: {
        base: 'bg-[var(--color-stone-100)]',
        hover: 'hover:bg-[var(--color-stone-200)]',
        _meta: { clonedFrom: 'primary' },
    },
};

export const buttonSizes: Record<string, SizeDefinition> = {
    sm: { padding: 'px-3 py-1.5', fontSize: 'text-sm', iconSize: 14, radius: 'rounded-md' },
    md: { padding: 'px-4 py-2', fontSize: 'text-base', iconSize: 16, radius: 'rounded-lg' },
};
`;

describe('updateVariantInFile', () => {
    it('updates an existing variant definition', () => {
        const newDef = {
            base: 'bg-red-500 text-white',
            hover: 'hover:bg-red-600',
        };
        const result = updateVariantInFile(SAMPLE_FILE, 'Variants', 'primary', newDef);
        expect(result).toContain("base: 'bg-red-500 text-white'");
        expect(result).toContain("hover: 'hover:bg-red-600'");
        // secondary should still be there
        expect(result).toContain('secondary');
    });

    it('updates an existing size definition', () => {
        const newDef = {
            padding: 'px-5 py-3',
            fontSize: 'text-lg',
            iconSize: 20,
            radius: 'rounded-xl',
        };
        const result = updateVariantInFile(SAMPLE_FILE, 'Sizes', 'md', newDef);
        expect(result).toContain("padding: 'px-5 py-3'");
        expect(result).toContain("fontSize: 'text-lg'");
        // sm should still be there
        expect(result).toContain('sm:');
    });
});

describe('addVariantToFile', () => {
    it('adds a new variant entry', () => {
        const newDef = {
            base: 'bg-green-500 text-white',
            hover: 'hover:bg-green-600',
        };
        const result = addVariantToFile(SAMPLE_FILE, 'Variants', 'success', newDef);
        expect(result).toContain('success:');
        expect(result).toContain("base: 'bg-green-500 text-white'");
        // existing variants should remain
        expect(result).toContain('primary:');
        expect(result).toContain('secondary:');
    });

    it('adds a new size entry', () => {
        const newDef = {
            padding: 'px-6 py-3',
            fontSize: 'text-xl',
            iconSize: 20,
            radius: 'rounded-2xl',
        };
        const result = addVariantToFile(SAMPLE_FILE, 'Sizes', 'xl', newDef);
        expect(result).toContain('xl:');
        expect(result).toContain("padding: 'px-6 py-3'");
    });
});

describe('removeVariantFromFile', () => {
    it('removes a variant entry', () => {
        const result = removeVariantFromFile(SAMPLE_FILE, 'Variants', 'secondary');
        expect(result).not.toContain('secondary:');
        expect(result).toContain('primary:');
    });

    it('removes a variant with nested _meta object', () => {
        const result = removeVariantFromFile(SAMPLE_FILE, 'Variants', 'secondary');
        expect(result).not.toContain('clonedFrom');
        expect(result).toContain('primary:');
    });

    it('removes a size entry', () => {
        const result = removeVariantFromFile(SAMPLE_FILE, 'Sizes', 'sm');
        expect(result).not.toMatch(/\bsm:/);
        expect(result).toContain('md:');
    });

    it('preserves file structure after removal', () => {
        const result = removeVariantFromFile(SAMPLE_FILE, 'Variants', 'primary');
        // File should still have the export const and closing brace
        expect(result).toContain('export const buttonVariants');
        expect(result).toContain('export const buttonSizes');
    });
});
