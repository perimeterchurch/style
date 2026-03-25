import * as react from 'react';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ClassValue } from 'clsx';

/**
 * Shared component types
 * Used by all component variant files and component props
 */
/**
 * Defines the classes for a single visual variant.
 * Each component's .variants.ts file exports a Record<string, VariantDefinition>.
 */
interface VariantDefinition {
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
interface SizeDefinition {
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
type BaseVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost';
/**
 * Base size type.
 */
type BaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/**
 * Base props for all components
 */
interface BaseComponentProps {
    /** Test identifier */
    'data-testid'?: string;
}
/**
 * Props for interactive components (buttons, inputs, etc.)
 */
interface InteractiveProps extends BaseComponentProps {
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
interface WidthProps {
    /** Expand to full width */
    fullWidth?: boolean;
}
/**
 * Helper to build className from a VariantDefinition
 */
declare function resolveVariant(definition: VariantDefinition, options?: {
    outline?: boolean;
}): string;

declare const buttonVariants: Record<string, VariantDefinition>;
declare const buttonSizes: Record<string, SizeDefinition>;
type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'disabled'>, InteractiveProps, WidthProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'button' | 'submit' | 'reset';
    outline?: boolean;
}
declare function ButtonRoot({ variant, size, type, outline, fullWidth, disabled, isLoading, className, children, 'aria-label': ariaLabel, ...props }: ButtonProps): react_jsx_runtime.JSX.Element;
declare namespace ButtonRoot {
    var displayName: string;
}
declare function ButtonIcon({ children, className }: {
    children: ReactNode;
    className?: string;
}): react_jsx_runtime.JSX.Element;
declare namespace ButtonIcon {
    var displayName: string;
}
declare function ButtonLabel({ children, className }: {
    children: ReactNode;
    className?: string;
}): react_jsx_runtime.JSX.Element;
declare namespace ButtonLabel {
    var displayName: string;
}
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>> & {
    Root: typeof ButtonRoot;
    Icon: typeof ButtonIcon;
    Label: typeof ButtonLabel;
};

declare const cardVariants: Record<string, VariantDefinition>;
type CardVariant = keyof typeof cardVariants;

interface CardProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
    variant?: CardVariant;
    hoverable?: boolean;
}
interface CardSectionProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
}
declare const Card: react.ForwardRefExoticComponent<CardProps & react.RefAttributes<HTMLDivElement>> & {
    Header: react.ForwardRefExoticComponent<CardSectionProps & react.RefAttributes<HTMLDivElement>>;
    Body: react.ForwardRefExoticComponent<CardSectionProps & react.RefAttributes<HTMLDivElement>>;
    Footer: react.ForwardRefExoticComponent<CardSectionProps & react.RefAttributes<HTMLDivElement>>;
};

declare const badgeVariants: Record<string, VariantDefinition>;
declare const badgeSizes: Record<string, SizeDefinition>;
type BadgeVariant = keyof typeof badgeVariants;
type BadgeSize = keyof typeof badgeSizes;

interface BadgeProps extends ComponentPropsWithoutRef<'span'>, BaseComponentProps {
    /** Visual variant */
    variant?: BadgeVariant;
    /** Badge size */
    size?: BadgeSize;
    /** Show a colored dot before the label */
    dot?: boolean;
    /** Outline style instead of filled */
    outline?: boolean;
}
declare const Badge: react.ForwardRefExoticComponent<BadgeProps & react.RefAttributes<HTMLSpanElement>>;

declare const inputSizes: Record<string, SizeDefinition>;
type InputSize = keyof typeof inputSizes;

interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>, BaseComponentProps, WidthProps {
    /** Input size */
    size?: InputSize;
    /** Error message (truthy value triggers error state) */
    error?: string;
}
interface InputRootProps extends BaseComponentProps, WidthProps {
    /** Input size */
    size?: InputSize;
    /** Error message */
    error?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Children */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}
declare function InputRoot({ size, error, fullWidth, disabled, className, children, ...props }: InputRootProps): react_jsx_runtime.JSX.Element;
declare namespace InputRoot {
    var displayName: string;
}
declare function InputError({ className, children }: {
    className?: string;
    children?: ReactNode;
}): react_jsx_runtime.JSX.Element | null;
declare namespace InputError {
    var displayName: string;
}
declare const Input: react.ForwardRefExoticComponent<InputProps & react.RefAttributes<HTMLInputElement>> & {
    Root: typeof InputRoot;
    Field: react.ForwardRefExoticComponent<Omit<Omit<react.DetailedHTMLProps<react.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, "size"> & BaseComponentProps & react.RefAttributes<HTMLInputElement>>;
    Error: typeof InputError;
};

declare const labelVariants: Record<string, VariantDefinition>;
type LabelVariant = keyof typeof labelVariants;

interface LabelProps extends ComponentPropsWithoutRef<'label'>, BaseComponentProps {
    /** Show required indicator */
    required?: boolean;
    /** Disabled state (visual only) */
    disabled?: boolean;
    /** Visual variant */
    variant?: LabelVariant;
}
declare const Label: react.ForwardRefExoticComponent<LabelProps & react.RefAttributes<HTMLLabelElement>>;

declare const skeletonVariants: Record<string, VariantDefinition>;
type SkeletonVariant = keyof typeof skeletonVariants;

interface SkeletonProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
    /** Shape variant */
    variant?: SkeletonVariant;
    /** Width (string or number in px) */
    width?: string | number;
    /** Height (string or number in px) */
    height?: string | number;
    /** Custom border radius */
    rounded?: string;
}
declare const Skeleton: react.ForwardRefExoticComponent<SkeletonProps & react.RefAttributes<HTMLDivElement>>;

declare const spinnerSizes: Record<string, SizeDefinition>;
type SpinnerSize = keyof typeof spinnerSizes;

interface LoadingSpinnerProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
    /** Spinner size */
    size?: SpinnerSize;
    /** Optional label for screen readers */
    label?: string;
}
declare const LoadingSpinner: react.ForwardRefExoticComponent<LoadingSpinnerProps & react.RefAttributes<HTMLDivElement>>;

declare const selectSizes: Record<string, SizeDefinition>;
type SelectSize = keyof typeof selectSizes;

interface SelectOption {
    value: string;
    label: string;
}
interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'size'>, BaseComponentProps, WidthProps {
    /** Predefined options (alternative to children) */
    options?: SelectOption[];
    /** Input size */
    size?: SelectSize;
    /** Show error state */
    error?: boolean;
}
interface SelectRootProps extends BaseComponentProps, WidthProps {
    /** Input size */
    size?: SelectSize;
    /** Show error state */
    error?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Children */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}
declare function SelectRoot({ size, error, fullWidth, disabled, className, children, ...props }: SelectRootProps): react_jsx_runtime.JSX.Element;
declare namespace SelectRoot {
    var displayName: string;
}
declare const Select: react.ForwardRefExoticComponent<SelectProps & react.RefAttributes<HTMLSelectElement>> & {
    Root: typeof SelectRoot;
    Field: react.ForwardRefExoticComponent<Omit<Omit<react.DetailedHTMLProps<react.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, "ref">, "size"> & BaseComponentProps & {
        options?: SelectOption[];
    } & react.RefAttributes<HTMLSelectElement>>;
};

declare const textareaSizes: Record<string, SizeDefinition>;
type TextareaSize = keyof typeof textareaSizes;

interface TextareaProps extends ComponentPropsWithoutRef<'textarea'>, BaseComponentProps, WidthProps {
    /** Input size */
    size?: TextareaSize;
    /** Show error state */
    error?: boolean;
}
declare const Textarea: react.ForwardRefExoticComponent<TextareaProps & react.RefAttributes<HTMLTextAreaElement>>;

declare const checkboxSizes: Record<string, SizeDefinition>;
type CheckboxSize = keyof typeof checkboxSizes;

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'>, BaseComponentProps {
    /** Show error state */
    error?: boolean;
    /** Associated label text */
    label?: string;
    /** Checkbox size */
    size?: CheckboxSize;
}
declare const Checkbox: react.ForwardRefExoticComponent<CheckboxProps & react.RefAttributes<HTMLInputElement>>;

declare const switchSizes: Record<string, SizeDefinition>;
type SwitchSize = keyof typeof switchSizes;

interface SwitchProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'>, BaseComponentProps {
    /** Associated label text */
    label?: string;
    /** Switch size */
    size?: SwitchSize;
}
declare const Switch: react.ForwardRefExoticComponent<SwitchProps & react.RefAttributes<HTMLInputElement>>;

declare const avatarSizes: Record<string, SizeDefinition>;
type AvatarSize = keyof typeof avatarSizes;

interface AvatarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'>, BaseComponentProps {
    /** Image source URL */
    src?: string;
    /** Alt text for image */
    alt?: string;
    /** Fallback initials, text, or icon element */
    fallback?: ReactNode;
    /** Avatar size */
    size?: AvatarSize;
}
declare const Avatar: react.ForwardRefExoticComponent<AvatarProps & react.RefAttributes<HTMLDivElement>>;

declare const chipVariants: Record<string, VariantDefinition>;
declare const chipSizes: Record<string, SizeDefinition>;
type ChipVariant = keyof typeof chipVariants;
type ChipSize = keyof typeof chipSizes;

interface FilterChipProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>, BaseComponentProps {
    /** Chip label text */
    label: string;
    /** Callback when remove button is clicked */
    onRemove?: () => void;
    /** Visual variant */
    variant?: ChipVariant;
    /** Chip size */
    size?: ChipSize;
}
declare const FilterChip: react.ForwardRefExoticComponent<FilterChipProps & react.RefAttributes<HTMLSpanElement>>;

declare const emptyStateVariants: Record<string, VariantDefinition>;
type EmptyStateVariant = keyof typeof emptyStateVariants;

interface EmptyStateProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
    /** Icon or illustration */
    icon?: ReactNode;
    /** Title text */
    title: string;
    /** Description text */
    description?: string;
    /** Optional action button */
    action?: ReactNode;
    /** Visual variant */
    variant?: EmptyStateVariant;
}
declare const EmptyState: react.ForwardRefExoticComponent<EmptyStateProps & react.RefAttributes<HTMLDivElement>>;

declare const progressVariants: Record<string, VariantDefinition>;
type ProgressVariant = keyof typeof progressVariants;

interface IndeterminateProgressProps extends BaseComponentProps {
    /** Whether the progress bar is visible */
    visible: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Visual variant */
    variant?: ProgressVariant;
}
declare const IndeterminateProgress: react.ForwardRefExoticComponent<IndeterminateProgressProps & react.RefAttributes<HTMLDivElement>>;

declare const searchInputVariants: Record<string, VariantDefinition>;
type SearchInputVariant = keyof typeof searchInputVariants;

interface SearchInputProps extends BaseComponentProps {
    /** Current search value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Debounce delay in ms */
    debounce?: number;
    /** Additional CSS classes */
    className?: string;
    /** Visual variant */
    variant?: SearchInputVariant;
}
declare const SearchInput: react.ForwardRefExoticComponent<SearchInputProps & react.RefAttributes<HTMLDivElement>>;

/**
 * className utility
 * Merges Tailwind CSS classes with proper precedence handling
 */

declare function cn(...inputs: ClassValue[]): string;

export { Avatar, type AvatarProps, type AvatarSize, Badge, type BadgeProps, type BadgeSize, type BadgeVariant, type BaseComponentProps, type BaseSize, type BaseVariant, Button, type ButtonProps, type ButtonSize, type ButtonVariant, Card, type CardProps, type CardSectionProps, type CardVariant, Checkbox, type CheckboxProps, type CheckboxSize, type ChipSize, type ChipVariant, EmptyState, type EmptyStateProps, type EmptyStateVariant, FilterChip, type FilterChipProps, IndeterminateProgress, type IndeterminateProgressProps, Input, type InputProps, type InputRootProps, type InputSize, type InteractiveProps, Label, type LabelProps, type LabelVariant, LoadingSpinner, type LoadingSpinnerProps, type ProgressVariant, SearchInput, type SearchInputProps, type SearchInputVariant, Select, type SelectOption, type SelectProps, type SelectRootProps, type SelectSize, type SizeDefinition, Skeleton, type SkeletonProps, type SkeletonVariant, type SpinnerSize, Switch, type SwitchProps, type SwitchSize, Textarea, type TextareaProps, type TextareaSize, type VariantDefinition, type WidthProps, cn, resolveVariant };
