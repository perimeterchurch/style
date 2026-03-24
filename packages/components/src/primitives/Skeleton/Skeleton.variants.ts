export type SkeletonVariant = 'line' | 'circle' | 'card';

export const skeletonVariantClass: Record<SkeletonVariant, string> = {
    line: 'skeleton-line',
    circle: 'skeleton-circle',
    card: 'skeleton-card',
};
