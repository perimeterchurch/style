export type ChipVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'ghost';
export type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const chipVariantClass: Record<ChipVariant, string> = {
    primary: 'chip-primary',
    secondary: 'chip-secondary',
    success: 'chip-success',
    warning: 'chip-warning',
    error: 'chip-error',
    info: 'chip-info',
    ghost: 'chip-ghost',
};

export const chipSizeClass: Record<ChipSize, string> = {
    xs: 'chip-xs',
    sm: 'chip-sm',
    md: 'chip-md',
    lg: 'chip-lg',
    xl: 'chip-xl',
};
