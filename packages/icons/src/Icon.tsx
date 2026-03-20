import { createElement, forwardRef, type SVGProps } from 'react';
import { getIcon, type IconName } from './registry';

export interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ name, size = 16, className, ...props }, ref) => {
        const resolved = getIcon(name);

        if (!resolved) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`[style/icons] Unknown icon: "${name}"`);
            }
            return null;
        }

        return createElement(resolved, {
            ref,
            width: size,
            height: size,
            className,
            ...props,
        });
    },
);

Icon.displayName = 'Icon';
