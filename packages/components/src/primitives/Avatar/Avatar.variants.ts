import type { SizeDefinition } from '../../utils/types';

export const avatarSizeClasses: Record<string, string> = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
};

export const avatarSizes: Record<string, SizeDefinition> = {
    xs: { padding: '', fontSize: 'text-xs' },
    sm: { padding: '', fontSize: 'text-sm' },
    md: { padding: '', fontSize: 'text-base' },
    lg: { padding: '', fontSize: 'text-lg' },
    xl: { padding: '', fontSize: 'text-xl' },
};

export type AvatarSize = keyof typeof avatarSizes;
