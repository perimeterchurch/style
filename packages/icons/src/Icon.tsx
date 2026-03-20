import { forwardRef, type SVGProps } from 'react';
import { getIcon, type IconName } from './registry';

export interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ name, size = 16, className, ...props }, ref) => {
        const IconComponent = getIcon(name);

        if (!IconComponent) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`[style/icons] Unknown icon: "${name}"`);
            }
            return null;
        }

        return (
            <IconComponent
                ref={ref}
                width={size}
                height={size}
                className={className}
                {...props}
            />
        );
    },
);

Icon.displayName = 'Icon';
