import type { LucideIcon } from 'lucide-react';
import {
    Loader2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
    Search, X, Check, Plus, Minus, AlertCircle, Info, Calendar,
    Filter, ArrowLeft, ArrowRight, Eye, EyeOff, Copy, ExternalLink,
    MoreHorizontal, MoreVertical, Settings, User, Mail, Phone,
    MapPin, Clock, Star, Heart, Trash2, Edit, Download, Upload,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type CustomIcon = ComponentType<SVGProps<SVGSVGElement> & { ref?: React.Ref<SVGSVGElement> }>;

const lucideIcons: Record<string, LucideIcon> = {
    loader: Loader2,
    'chevron-down': ChevronDown,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'chevron-up': ChevronUp,
    search: Search,
    x: X,
    check: Check,
    plus: Plus,
    minus: Minus,
    'alert-circle': AlertCircle,
    info: Info,
    calendar: Calendar,
    filter: Filter,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    eye: Eye,
    'eye-off': EyeOff,
    copy: Copy,
    'external-link': ExternalLink,
    'more-horizontal': MoreHorizontal,
    'more-vertical': MoreVertical,
    settings: Settings,
    user: User,
    mail: Mail,
    phone: Phone,
    'map-pin': MapPin,
    clock: Clock,
    star: Star,
    heart: Heart,
    trash: Trash2,
    edit: Edit,
    download: Download,
    upload: Upload,
};

const customIcons: Record<string, CustomIcon> = {};

export function getIcon(name: string): LucideIcon | CustomIcon | undefined {
    return lucideIcons[name] ?? customIcons[name];
}

export function registerIcon(name: string, icon: CustomIcon): void {
    customIcons[name] = icon;
}

export function getIconNames(): string[] {
    return [...Object.keys(lucideIcons), ...Object.keys(customIcons)];
}

export type IconName = keyof typeof lucideIcons | (string & {});
