import { Variants, HTMLMotionProps, SpringOptions } from 'framer-motion';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

declare const springs: {
    snappy: {
        type: "spring";
        stiffness: number;
        damping: number;
    };
    gentle: {
        type: "spring";
        stiffness: number;
        damping: number;
    };
    bouncy: {
        type: "spring";
        stiffness: number;
        damping: number;
    };
};
declare const durations: {
    fast: number;
    base: number;
    slow: number;
    entrance: number;
};
declare const easings: {
    easeOut: readonly [0.16, 1, 0.3, 1];
    easeInOut: readonly [0.4, 0, 0.2, 1];
};
declare const staggers: {
    fast: number;
    base: number;
    slow: number;
};
declare const transitions: {
    /** Quick tween for micro-interactions */
    fast: {
        duration: number;
        ease: readonly [0.16, 1, 0.3, 1];
    };
    /** Default tween for most animations */
    base: {
        duration: number;
        ease: readonly [0.16, 1, 0.3, 1];
    };
    /** Slower tween for emphasis */
    slow: {
        duration: number;
        ease: readonly [0.16, 1, 0.3, 1];
    };
    /** Entrance animation with gentle easing */
    entrance: {
        duration: number;
        ease: readonly [0.16, 1, 0.3, 1];
    };
    /** Snappy spring for interactive feedback */
    snappy: {
        type: "spring";
        stiffness: number;
        damping: number;
    };
    /** Gentle spring for layout shifts */
    gentle: {
        type: "spring";
        stiffness: number;
        damping: number;
    };
    /** Bouncy spring for playful elements */
    bouncy: {
        type: "spring";
        stiffness: number;
        damping: number;
    };
};
declare const fadeVariants: Variants;
declare const slideUpVariants: Variants;
declare const slideDownVariants: Variants;
declare const scaleInVariants: Variants;
declare const slideRightVariants: Variants;
declare const slideLeftVariants: Variants;
/**
 * Directional page slide for multi-page modals/panels.
 * Pass `custom` as 1 (forward) or -1 (back) to control direction.
 */
declare const pageSlideVariants: Variants;
declare const modalBackdropVariants: Variants;
declare const modalPanelVariants: Variants;
/**
 * Creates a stagger container variant.
 * Children using `staggerItemVariants` will animate in sequence.
 */
declare function staggerContainer(staggerDelay?: number): Variants;
declare const staggerItemVariants: Variants;

interface FadeInProps extends HTMLMotionProps<'div'> {
    /** Delay before the animation starts (seconds) */
    delay?: number;
}
declare function FadeIn({ delay, transition, ...props }: FadeInProps): react_jsx_runtime.JSX.Element;

interface SlideUpProps extends HTMLMotionProps<'div'> {
    /** Delay before the animation starts (seconds) */
    delay?: number;
}
declare function SlideUp({ delay, transition, ...props }: SlideUpProps): react_jsx_runtime.JSX.Element;

interface ScaleInProps extends HTMLMotionProps<'div'> {
    /** Delay before the animation starts (seconds) */
    delay?: number;
}
declare function ScaleIn({ delay, transition, ...props }: ScaleInProps): react_jsx_runtime.JSX.Element;

interface AnimatedListProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    /** Delay between each child animation (seconds) */
    staggerDelay?: number;
    /** Custom variants for each list item */
    itemVariants?: Variants;
    /** Render as div, ul, or ol */
    as?: 'div' | 'ul' | 'ol';
}
declare function AnimatedList({ children, staggerDelay, itemVariants, as: Tag, ...props }: AnimatedListProps): react_jsx_runtime.JSX.Element;

interface AnimatedPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    /** Whether the panel is open */
    open: boolean;
    /** Callback when the panel should close */
    onClose: () => void;
    /** Panel width in pixels */
    width?: number;
    /** Show a backdrop overlay behind the panel */
    backdrop?: boolean;
    /** Additional class names for the panel */
    className?: string;
    /** Override class names for the backdrop overlay */
    backdropClassName?: string;
    children: React.ReactNode;
}
declare function AnimatedPanel({ open, onClose, width, backdrop, className, backdropClassName, children, style, ...props }: AnimatedPanelProps): react_jsx_runtime.JSX.Element;

interface CountUpProps {
    /** Target number value */
    value: number;
    /** Spring configuration for the animation */
    springConfig?: SpringOptions;
    /** Format function for the displayed number */
    format?: (value: number) => string;
    /** Additional class names */
    className?: string;
}
declare function CountUp({ value, springConfig, format, className, }: CountUpProps): react_jsx_runtime.JSX.Element;

interface SkeletonTransitionProps {
    /** Whether the content is loading */
    isLoading: boolean;
    /** Skeleton placeholder to show while loading */
    skeleton: ReactNode;
    /** Actual content to show when loaded */
    children: ReactNode;
}
declare function SkeletonTransition({ isLoading, skeleton, children }: SkeletonTransitionProps): react_jsx_runtime.JSX.Element;

export { AnimatedList, type AnimatedListProps, AnimatedPanel, type AnimatedPanelProps, CountUp, type CountUpProps, FadeIn, type FadeInProps, ScaleIn, type ScaleInProps, SkeletonTransition, type SkeletonTransitionProps, SlideUp, type SlideUpProps, durations, easings, fadeVariants, modalBackdropVariants, modalPanelVariants, pageSlideVariants, scaleInVariants, slideDownVariants, slideLeftVariants, slideRightVariants, slideUpVariants, springs, staggerContainer, staggerItemVariants, staggers, transitions };
