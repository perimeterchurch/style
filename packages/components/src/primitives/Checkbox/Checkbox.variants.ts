import type { SizeDefinition } from '../../utils/types';

export const checkboxSizeClasses: Record<string, string> = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
};

export const checkboxLabelSizeClasses: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
};

export const checkboxSizes: Record<string, SizeDefinition> = {
    xs: { padding: '', fontSize: 'text-xs' },
    sm: { padding: '', fontSize: 'text-sm' },
    md: { padding: '', fontSize: 'text-sm' },
    lg: { padding: '', fontSize: 'text-base' },
    xl: { padding: '', fontSize: 'text-lg' },
};

export type CheckboxSize = keyof typeof checkboxSizes;
