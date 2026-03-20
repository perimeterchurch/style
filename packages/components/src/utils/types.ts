/**
 * Shared component types
 * Used by all component variant files and component props
 */

/**
 * Defines the classes for a single visual variant.
 * Each component's .variants.ts file exports a Record<string, VariantDefinition>.
 */
export interface VariantDefinition {
    /** Base classes always applied */
    base: string;
    /** Hover state classes */
    hover?: string;
    /** Active/pressed state classes */
    active?: string;
    /** Focus-visible state classes */
    focus?: string;
    /** Disabled state classes — MUST use `disabled:` prefix (e.g., `disabled:opacity-50`) */
    disabled?: string;
    /** Outline mode classes (border-based instead of filled) */
    outline?: string;
    /** Metadata for addon-created variants */
    _meta?: {
        clonedFrom?: string;
        createdAt?: string;
    };
}

/**
 * Defines the classes for a single size variant.
 */
export interface SizeDefinition {
    /** Padding classes */
    padding: string;
    /** Font size class */
    fontSize: string;
    /** Icon size in pixels */
    iconSize?: number;
    /** Border radius class */
    radius?: string;
}

/**
 * Base variant type — the 7 standard semantic variants.
 */
export type BaseVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'ghost';

/**
 * Base size type.
 */
export type BaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Base props for all components
 */
export interface BaseComponentProps {
    /** Test identifier */
    'data-testid'?: string;
}

/**
 * Props for interactive components (buttons, inputs, etc.)
 */
export interface InteractiveProps extends BaseComponentProps {
    /** Disable interaction */
    disabled?: boolean;
    /** Show loading state */
    isLoading?: boolean;
    /** Accessible label */
    'aria-label'?: string;
}

/**
 * Props for components that support full width
 */
export interface WidthProps {
    /** Expand to full width */
    fullWidth?: boolean;
}

/**
 * Helper to build className from a VariantDefinition
 */
export function resolveVariant(
    definition: VariantDefinition,
    options?: { outline?: boolean },
): string {
    if (options?.outline && definition.outline) {
        return [
            definition.outline,
            definition.hover,
            definition.active,
            definition.focus,
            definition.disabled,
        ]
            .filter(Boolean)
            .join(' ');
    }
    return [
        definition.base,
        definition.hover,
        definition.active,
        definition.focus,
        definition.disabled,
    ]
        .filter(Boolean)
        .join(' ');
}
