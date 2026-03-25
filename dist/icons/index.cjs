"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Icon: () => Icon,
  getIcon: () => getIcon,
  getIconNames: () => getIconNames,
  registerIcon: () => registerIcon
});
module.exports = __toCommonJS(index_exports);

// src/Icon.tsx
var import_react = require("react");

// src/registry.ts
var import_lucide_react = require("lucide-react");
var lucideIcons = {
  loader: import_lucide_react.Loader2,
  "chevron-down": import_lucide_react.ChevronDown,
  "chevron-left": import_lucide_react.ChevronLeft,
  "chevron-right": import_lucide_react.ChevronRight,
  "chevron-up": import_lucide_react.ChevronUp,
  search: import_lucide_react.Search,
  x: import_lucide_react.X,
  check: import_lucide_react.Check,
  plus: import_lucide_react.Plus,
  minus: import_lucide_react.Minus,
  "alert-circle": import_lucide_react.AlertCircle,
  info: import_lucide_react.Info,
  calendar: import_lucide_react.Calendar,
  filter: import_lucide_react.Filter,
  "arrow-left": import_lucide_react.ArrowLeft,
  "arrow-right": import_lucide_react.ArrowRight,
  eye: import_lucide_react.Eye,
  "eye-off": import_lucide_react.EyeOff,
  copy: import_lucide_react.Copy,
  "external-link": import_lucide_react.ExternalLink,
  "more-horizontal": import_lucide_react.MoreHorizontal,
  "more-vertical": import_lucide_react.MoreVertical,
  settings: import_lucide_react.Settings,
  user: import_lucide_react.User,
  mail: import_lucide_react.Mail,
  phone: import_lucide_react.Phone,
  "map-pin": import_lucide_react.MapPin,
  clock: import_lucide_react.Clock,
  star: import_lucide_react.Star,
  heart: import_lucide_react.Heart,
  trash: import_lucide_react.Trash2,
  edit: import_lucide_react.Edit,
  download: import_lucide_react.Download,
  upload: import_lucide_react.Upload
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
var Icon = (0, import_react.forwardRef)(
  ({ name, size = 16, className, ...props }, ref) => {
    const resolved = getIcon(name);
    if (!resolved) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[style/icons] Unknown icon: "${name}"`);
      }
      return null;
    }
    return (0, import_react.createElement)(resolved, {
      ref,
      width: size,
      height: size,
      className,
      ...props
    });
  }
);
Icon.displayName = "Icon";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Icon,
  getIcon,
  getIconNames,
  registerIcon
});
//# sourceMappingURL=index.cjs.map