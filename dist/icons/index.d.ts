import * as react from 'react';
import { ComponentType, SVGProps } from 'react';
import { LucideIcon } from 'lucide-react';

type CustomIcon = ComponentType<SVGProps<SVGSVGElement> & {
    ref?: React.Ref<SVGSVGElement>;
}>;
declare const lucideIcons: Record<string, LucideIcon>;
declare function getIcon(name: string): LucideIcon | CustomIcon | undefined;
declare function registerIcon(name: string, icon: CustomIcon): void;
declare function getIconNames(): string[];
type IconName = keyof typeof lucideIcons | (string & {});

interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number;
}
declare const Icon: react.ForwardRefExoticComponent<Omit<IconProps, "ref"> & react.RefAttributes<SVGSVGElement>>;

export { Icon, type IconName, type IconProps, getIcon, getIconNames, registerIcon };
