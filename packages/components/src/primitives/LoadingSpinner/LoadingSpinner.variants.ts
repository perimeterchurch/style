import type { SizeDefinition } from '../../utils/types';

export const spinnerSizes: Record<string, SizeDefinition> = {
    xs: { padding: '', fontSize: '', iconSize: 12 },
    sm: { padding: '', fontSize: '', iconSize: 16 },
    md: { padding: '', fontSize: '', iconSize: 24 },
    lg: { padding: '', fontSize: '', iconSize: 32 },
    xl: { padding: '', fontSize: '', iconSize: 40 },
};

export const spinnerSizeClasses: Record<string, string> = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
};

export type SpinnerSize = keyof typeof spinnerSizes;
