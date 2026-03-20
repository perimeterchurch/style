import type { SizeDefinition } from '../../utils/types';

export const switchSizeClasses: Record<
    string,
    { track: string; knob: string; translate: string }
> = {
    xs: {
        track: 'h-4 w-7',
        knob: 'before:h-3 before:w-3',
        translate: 'checked:before:translate-x-3',
    },
    sm: {
        track: 'h-5 w-9',
        knob: 'before:h-4 before:w-4',
        translate: 'checked:before:translate-x-4',
    },
    md: {
        track: 'h-6 w-11',
        knob: 'before:h-5 before:w-5',
        translate: 'checked:before:translate-x-5',
    },
    lg: {
        track: 'h-7 w-13',
        knob: 'before:h-6 before:w-6',
        translate: 'checked:before:translate-x-6',
    },
    xl: {
        track: 'h-8 w-15',
        knob: 'before:h-7 before:w-7',
        translate: 'checked:before:translate-x-7',
    },
};

export const switchLabelSizeClasses: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
};

export const switchSizes: Record<string, SizeDefinition> = {
    xs: { padding: '', fontSize: 'text-xs' },
    sm: { padding: '', fontSize: 'text-sm' },
    md: { padding: '', fontSize: 'text-sm' },
    lg: { padding: '', fontSize: 'text-base' },
    xl: { padding: '', fontSize: 'text-lg' },
};

export type SwitchSize = keyof typeof switchSizes;
