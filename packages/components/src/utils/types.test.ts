import { describe, expect, it } from 'vitest';
import { resolveVariant, type VariantDefinition } from './types';

const testVariant: VariantDefinition = {
    base: 'bg-blue-500 text-white',
    hover: 'hover:bg-blue-600',
    active: 'active:bg-blue-700',
    focus: 'focus-visible:ring-2',
    outline: 'border border-blue-500 text-blue-500',
};

describe('resolveVariant', () => {
    it('returns filled classes by default', () => {
        const result = resolveVariant(testVariant);
        expect(result).toContain('bg-blue-500');
        expect(result).toContain('hover:bg-blue-600');
        expect(result).not.toContain('border');
    });

    it('returns outline classes when outline is true', () => {
        const result = resolveVariant(testVariant, { outline: true });
        expect(result).toContain('border border-blue-500');
        expect(result).not.toContain('bg-blue-500 text-white');
    });

    it('handles variant with no optional fields', () => {
        const minimal: VariantDefinition = { base: 'bg-red-500' };
        const result = resolveVariant(minimal);
        expect(result).toBe('bg-red-500');
    });
});
