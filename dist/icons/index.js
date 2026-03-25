// src/Icon.tsx
import { createElement, forwardRef } from "react";

// src/registry.ts
import {
  Loader2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Search,
  X,
  Check,
  Plus,
  Minus,
  AlertCircle,
  Info,
  Calendar,
  Filter,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  MoreHorizontal,
  MoreVertical,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  Heart,
  Trash2,
  Edit,
  Download,
  Upload
} from "lucide-react";
var lucideIcons = {
  loader: Loader2,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  search: Search,
  x: X,
  check: Check,
  plus: Plus,
  minus: Minus,
  "alert-circle": AlertCircle,
  info: Info,
  calendar: Calendar,
  filter: Filter,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  eye: Eye,
  "eye-off": EyeOff,
  copy: Copy,
  "external-link": ExternalLink,
  "more-horizontal": MoreHorizontal,
  "more-vertical": MoreVertical,
  settings: Settings,
  user: User,
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  clock: Clock,
  star: Star,
  heart: Heart,
  trash: Trash2,
  edit: Edit,
  download: Download,
  upload: Upload
};
var customIcons = {};
function getIcon(name) {
  return lucideIcons[name] ?? customIcons[name];
}
function registerIcon(name, icon) {
  customIcons[name] = icon;
}
function getIconNames() {
  return [...Object.keys(lucideIcons), ...Object.keys(customIcons)];
}

// src/Icon.tsx
var Icon = forwardRef(
  ({ name, size = 16, className, ...props }, ref) => {
    const resolved = getIcon(name);
    if (!resolved) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[style/icons] Unknown icon: "${name}"`);
      }
      return null;
    }
    return createElement(resolved, {
      ref,
      width: size,
      height: size,
      className,
      ...props
    });
  }
);
Icon.displayName = "Icon";
export {
  Icon,
  getIcon,
  getIconNames,
  registerIcon
};
//# sourceMappingURL=index.js.map