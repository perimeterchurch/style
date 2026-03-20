import type { VariantDefinition } from '../../utils/types';

export const progressVariants: Record<string, VariantDefinition> = {
    default: {
        base: 'absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden',
    },
};

export type ProgressVariant = keyof typeof progressVariants;
