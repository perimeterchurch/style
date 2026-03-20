import type { VariantDefinition } from '../../utils/types';

export const skeletonVariants: Record<string, VariantDefinition> = {
    line: {
        base: 'rounded-md',
    },
    circle: {
        base: 'rounded-full',
    },
    card: {
        base: 'rounded-xl',
    },
};

export type SkeletonVariant = keyof typeof skeletonVariants;
