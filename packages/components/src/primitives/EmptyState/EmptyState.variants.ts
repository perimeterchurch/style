import type { VariantDefinition } from '../../utils/types';

export const emptyStateVariants: Record<string, VariantDefinition> = {
    default: {
        base: 'flex flex-col items-center justify-center text-center p-8',
    },
};

export type EmptyStateVariant = keyof typeof emptyStateVariants;
