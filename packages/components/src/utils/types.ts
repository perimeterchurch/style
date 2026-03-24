/**
 * Shared component types
 * Used by all component props
 */

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
