export type BadgeVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'ghost';
export type BadgeSize = 'sm' | 'md';

export const badgeVariantClass: Record<BadgeVariant, string> = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    ghost: 'badge-ghost',
};

export const badgeSizeClass: Record<BadgeSize, string> = {
    sm: 'badge-sm',
    md: '',
};
