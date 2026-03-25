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
  Avatar: () => Avatar,
  Badge: () => Badge,
  Button: () => Button,
  Card: () => Card,
  Checkbox: () => Checkbox,
  EmptyState: () => EmptyState,
  FilterChip: () => FilterChip,
  IndeterminateProgress: () => IndeterminateProgress,
  Input: () => Input,
  Label: () => Label,
  LoadingSpinner: () => LoadingSpinner2,
  SearchInput: () => SearchInput,
  Select: () => Select,
  Skeleton: () => Skeleton,
  Switch: () => Switch,
  Textarea: () => Textarea,
  cn: () => cn,
  resolveVariant: () => resolveVariant
});
module.exports = __toCommonJS(index_exports);

// src/primitives/Button/index.tsx
var import_react = require("react");

// src/utils/types.ts
function resolveVariant(definition, options) {
  if (options?.outline && definition.outline) {
    return [
      definition.outline,
      definition.hover,
      definition.active,
      definition.focus,
      definition.disabled
    ].filter(Boolean).join(" ");
  }
  return [
    definition.base,
    definition.hover,
    definition.active,
    definition.focus,
    definition.disabled
  ].filter(Boolean).join(" ");
}

// src/utils/cn.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/primitives/Button/Button.variants.ts
var buttonVariants = {
  primary: {
    base: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
    hover: "hover:bg-[var(--color-primary-hover)]",
    active: "active:bg-[var(--color-primary-active)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
    outline: "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]"
  },
  secondary: {
    base: "bg-[var(--color-stone-100)] text-[var(--color-stone-700)] dark:bg-[var(--color-stone-800)] dark:text-[var(--color-stone-300)]",
    hover: "hover:bg-[var(--color-stone-200)] dark:hover:bg-[var(--color-stone-700)]",
    active: "active:bg-[var(--color-stone-300)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
    outline: "border-2 border-[var(--color-stone-300)] text-[var(--color-stone-700)] hover:bg-[var(--color-stone-100)] dark:border-[var(--color-stone-600)] dark:text-[var(--color-stone-300)] dark:hover:bg-[var(--color-stone-800)]"
  },
  success: {
    base: "bg-[var(--color-success)] text-[var(--color-success-foreground)]",
    hover: "hover:bg-[var(--color-success-hover)]",
    active: "active:bg-[var(--color-success-active)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)]/50 focus-visible:ring-offset-2",
    outline: "border-2 border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-[var(--color-success-foreground)]"
  },
  warning: {
    base: "bg-[var(--color-warning)] text-[var(--color-warning-foreground)]",
    hover: "hover:bg-[var(--color-warning-hover)]",
    active: "active:bg-[var(--color-warning-active)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warning)]/50 focus-visible:ring-offset-2",
    outline: "border-2 border-[var(--color-warning)] text-[var(--color-warning)] hover:bg-[var(--color-warning)] hover:text-[var(--color-warning-foreground)]"
  },
  error: {
    base: "bg-[var(--color-error)] text-[var(--color-error-foreground)]",
    hover: "hover:bg-[var(--color-error-hover)]",
    active: "active:bg-[var(--color-error-active)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)]/50 focus-visible:ring-offset-2",
    outline: "border-2 border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-[var(--color-error-foreground)]"
  },
  info: {
    base: "bg-[var(--color-info)] text-[var(--color-info-foreground)]",
    hover: "hover:bg-[var(--color-info-hover)]",
    active: "active:bg-[var(--color-info-active)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]/50 focus-visible:ring-offset-2",
    outline: "border-2 border-[var(--color-info)] text-[var(--color-info)] hover:bg-[var(--color-info)] hover:text-[var(--color-info-foreground)]"
  },
  ghost: {
    base: "bg-transparent text-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]",
    hover: "hover:bg-[var(--color-stone-100)] dark:hover:bg-[var(--color-stone-800)]",
    active: "active:bg-[var(--color-stone-200)] dark:active:bg-[var(--color-stone-700)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
    outline: "border-2 border-[var(--color-stone-200)] text-[var(--color-stone-700)] hover:bg-[var(--color-stone-100)] dark:border-[var(--color-stone-700)] dark:text-[var(--color-stone-300)] dark:hover:bg-[var(--color-stone-800)]"
  }
};
var buttonSizes = {
  xs: { padding: "px-2 py-1", fontSize: "text-xs", iconSize: 12, radius: "rounded" },
  sm: { padding: "px-3 py-1.5", fontSize: "text-sm", iconSize: 14, radius: "rounded-md" },
  md: { padding: "px-4 py-2", fontSize: "text-base", iconSize: 16, radius: "rounded-lg" },
  lg: { padding: "px-5 py-2.5", fontSize: "text-lg", iconSize: 18, radius: "rounded-xl" },
  xl: { padding: "px-6 py-3", fontSize: "text-xl", iconSize: 20, radius: "rounded-2xl" }
};

// src/primitives/Button/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function LoadingSpinner() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      className: "animate-spin h-4 w-4",
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "circle",
          {
            className: "opacity-25",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "4"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            className: "opacity-75",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          }
        )
      ]
    }
  );
}
function getButtonClassName(variant, size, outline, fullWidth, className) {
  const variantDef = buttonVariants[variant];
  const sizeDef = buttonSizes[size];
  return cn(
    "inline-flex items-center justify-center gap-2",
    "font-medium transition-all duration-200",
    "min-h-11",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    resolveVariant(variantDef, { outline }),
    !outline && variant !== "ghost" && "shadow-sm hover:shadow-md",
    sizeDef.padding,
    sizeDef.fontSize,
    sizeDef.radius,
    fullWidth && "w-full",
    className
  );
}
var SimpleButton = (0, import_react.forwardRef)(
  ({
    variant = "primary",
    size = "md",
    type = "button",
    fullWidth = false,
    outline = false,
    disabled = false,
    isLoading = false,
    className,
    children,
    "aria-label": ariaLabel,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        ref,
        type,
        disabled: isDisabled,
        "aria-label": ariaLabel,
        "aria-busy": isLoading,
        className: getButtonClassName(variant, size, outline, fullWidth, className),
        ...props,
        children: [
          isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSpinner, {}),
          children
        ]
      }
    );
  }
);
SimpleButton.displayName = "Button";
var ButtonContext = (0, import_react.createContext)({
  variant: "primary",
  size: "md"
});
function ButtonRoot({
  variant = "primary",
  size = "md",
  type = "button",
  outline = false,
  fullWidth = false,
  disabled = false,
  isLoading = false,
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}) {
  const isDisabled = disabled || isLoading;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonContext.Provider, { value: { variant, size }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "button",
    {
      type,
      disabled: isDisabled,
      "aria-label": ariaLabel,
      "aria-busy": isLoading,
      className: getButtonClassName(variant, size, outline, fullWidth, className),
      ...props,
      children: [
        isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSpinner, {}),
        children
      ]
    }
  ) });
}
ButtonRoot.displayName = "Button.Root";
function ButtonIcon({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("inline-flex shrink-0", className), "aria-hidden": "true", children });
}
ButtonIcon.displayName = "Button.Icon";
function ButtonLabel({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className, children });
}
ButtonLabel.displayName = "Button.Label";
var Button = Object.assign(SimpleButton, {
  Root: ButtonRoot,
  Icon: ButtonIcon,
  Label: ButtonLabel
});

// src/primitives/Card/index.tsx
var import_react2 = require("react");

// src/primitives/Card/Card.variants.ts
var cardVariants = {
  default: {
    base: "rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] shadow-sm transition-all duration-200"
  }
};

// src/primitives/Card/index.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var CardRoot = (0, import_react2.forwardRef)(
  ({ variant = "default", hoverable = false, className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      ref,
      className: cn(
        cardVariants[variant].base,
        hoverable && "hover:shadow-md hover:-translate-y-0.5",
        className
      ),
      ...props,
      children
    }
  )
);
CardRoot.displayName = "Card";
var CardHeader = (0, import_react2.forwardRef)(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props, children })
);
CardHeader.displayName = "Card.Header";
var CardBody = (0, import_react2.forwardRef)(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref, className: cn("p-6 pt-0", className), ...props, children })
);
CardBody.displayName = "Card.Body";
var CardFooter = (0, import_react2.forwardRef)(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props, children })
);
CardFooter.displayName = "Card.Footer";
var Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter
});

// src/primitives/Badge/index.tsx
var import_react3 = require("react");

// src/primitives/Badge/Badge.variants.ts
var badgeVariants = {
  primary: {
    base: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    outline: "border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent"
  },
  secondary: {
    base: "bg-[var(--color-stone-100)] text-[var(--color-stone-700)] dark:bg-[var(--color-stone-800)] dark:text-[var(--color-stone-300)]",
    outline: "border border-[var(--color-stone-300)] text-[var(--color-stone-700)] bg-transparent dark:border-[var(--color-stone-600)] dark:text-[var(--color-stone-300)]"
  },
  success: {
    base: "bg-[var(--color-success)]/10 text-[var(--color-success)] dark:bg-[var(--color-success)]/10 dark:text-[var(--color-success)]",
    outline: "border border-[var(--color-success)] text-[var(--color-success)] bg-transparent dark:border-[var(--color-success)] dark:text-[var(--color-success)]"
  },
  warning: {
    base: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] dark:bg-[var(--color-warning)]/10 dark:text-[var(--color-warning)]",
    outline: "border border-[var(--color-warning)] text-[var(--color-warning)] bg-transparent dark:border-[var(--color-warning)] dark:text-[var(--color-warning)]"
  },
  error: {
    base: "bg-[var(--color-error)]/10 text-[var(--color-error)] dark:bg-[var(--color-error)]/10 dark:text-[var(--color-error)]",
    outline: "border border-[var(--color-error)] text-[var(--color-error)] bg-transparent dark:border-[var(--color-error)] dark:text-[var(--color-error)]"
  },
  info: {
    base: "bg-[var(--color-info)]/10 text-[var(--color-info)] dark:bg-[var(--color-info)]/10 dark:text-[var(--color-info)]",
    outline: "border border-[var(--color-info)] text-[var(--color-info)] bg-transparent dark:border-[var(--color-info)] dark:text-[var(--color-info)]"
  },
  ghost: {
    base: "bg-transparent text-[var(--color-stone-600)] dark:text-[var(--color-stone-400)]",
    outline: "border border-[var(--color-stone-200)] text-[var(--color-stone-600)] bg-transparent dark:border-[var(--color-stone-700)] dark:text-[var(--color-stone-400)]"
  }
};
var badgeDotColors = {
  primary: "bg-[var(--color-primary)]",
  secondary: "bg-[var(--color-stone-400)] dark:bg-[var(--color-stone-500)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  error: "bg-[var(--color-error)]",
  info: "bg-[var(--color-info)]",
  ghost: "bg-[var(--color-stone-400)] dark:bg-[var(--color-stone-500)]"
};
var badgeSizes = {
  sm: { padding: "px-2 py-0.5", fontSize: "text-xs" },
  md: { padding: "px-2.5 py-1", fontSize: "text-xs" }
};

// src/primitives/Badge/index.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var Badge = (0, import_react3.forwardRef)(
  ({
    variant = "secondary",
    size = "md",
    dot = false,
    outline = false,
    className,
    children,
    ...props
  }, ref) => {
    const variantDef = badgeVariants[variant];
    const sizeDef = badgeSizes[size];
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "span",
      {
        ref,
        className: cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium",
          "transition-colors duration-200",
          outline && variantDef.outline ? variantDef.outline : variantDef.base,
          sizeDef.padding,
          sizeDef.fontSize,
          className
        ),
        ...props,
        children: [
          dot && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "span",
            {
              className: cn("h-1.5 w-1.5 rounded-full shrink-0", badgeDotColors[variant]),
              "aria-hidden": "true"
            }
          ),
          children
        ]
      }
    );
  }
);
Badge.displayName = "Badge";

// src/primitives/Input/index.tsx
var import_react4 = require("react");

// src/primitives/Input/Input.variants.ts
var inputBaseClasses = [
  "flex rounded-lg border bg-[var(--color-background)]",
  "transition-all duration-200",
  "dark:bg-[var(--color-stone-900)] dark:text-[var(--color-stone-100)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50"
].join(" ");
var inputSizeClasses = {
  xs: "h-7 px-2 py-1",
  sm: "h-8 px-2.5 py-1.5",
  md: "h-10 px-3 py-2",
  lg: "h-12 px-4 py-2.5",
  xl: "h-14 px-5 py-3"
};
var inputTextSizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl"
};
function getInputBorderClasses(hasError) {
  return hasError ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]/50" : "border-[var(--color-stone-300)] dark:border-[var(--color-stone-600)]";
}

// src/primitives/Input/index.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var SimpleInput = (0, import_react4.forwardRef)(
  ({ className, size = "md", error, fullWidth = false, disabled, onKeyDown, ...props }, ref) => {
    const hasError = Boolean(error);
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "input",
      {
        ref,
        disabled,
        "aria-invalid": hasError,
        onKeyDown: (e) => {
          if (e.key === "Escape") e.currentTarget.blur();
          onKeyDown?.(e);
        },
        className: cn(
          inputBaseClasses,
          "placeholder:text-[var(--color-stone-400)] dark:placeholder:text-[var(--color-stone-500)]",
          inputSizeClasses[size],
          inputTextSizes[size],
          getInputBorderClasses(hasError),
          fullWidth ? "w-full" : "w-auto",
          className
        ),
        ...props
      }
    );
  }
);
SimpleInput.displayName = "Input";
var InputContext = (0, import_react4.createContext)({
  size: "md",
  error: void 0,
  fullWidth: false,
  disabled: false
});
function InputRoot({
  size = "md",
  error,
  fullWidth = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(InputContext.Provider, { value: { size, error, fullWidth, disabled }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: cn("flex flex-col gap-1", fullWidth && "w-full", className), ...props, children }) });
}
InputRoot.displayName = "Input.Root";
var InputField = (0, import_react4.forwardRef)(({ className, onKeyDown, disabled: disabledProp, ...props }, ref) => {
  const ctx = (0, import_react4.useContext)(InputContext);
  const hasError = Boolean(ctx.error);
  const isDisabled = disabledProp ?? ctx.disabled;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "input",
    {
      ref,
      disabled: isDisabled,
      "aria-invalid": hasError,
      onKeyDown: (e) => {
        if (e.key === "Escape") e.currentTarget.blur();
        onKeyDown?.(e);
      },
      className: cn(
        inputBaseClasses,
        "placeholder:text-[var(--color-stone-400)] dark:placeholder:text-[var(--color-stone-500)]",
        inputSizeClasses[ctx.size],
        inputTextSizes[ctx.size],
        getInputBorderClasses(hasError),
        ctx.fullWidth ? "w-full" : "w-auto",
        className
      ),
      ...props
    }
  );
});
InputField.displayName = "Input.Field";
function InputError({ className, children }) {
  const ctx = (0, import_react4.useContext)(InputContext);
  const message = children ?? ctx.error;
  if (!message) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: cn("text-sm text-[var(--color-error)]", className), role: "alert", children: message });
}
InputError.displayName = "Input.Error";
var Input = Object.assign(SimpleInput, {
  Root: InputRoot,
  Field: InputField,
  Error: InputError
});

// src/primitives/Label/index.tsx
var import_react5 = require("react");

// src/primitives/Label/Label.variants.ts
var labelVariants = {
  default: {
    base: "text-sm font-medium leading-none text-[var(--color-stone-900)] dark:text-[var(--color-stone-100)]"
  }
};

// src/primitives/Label/index.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var Label = (0, import_react5.forwardRef)(
  ({ className, children, required = false, disabled = false, variant = "default", ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "label",
      {
        ref,
        className: cn(
          labelVariants[variant].base,
          "cursor-pointer",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          disabled && "opacity-70 cursor-not-allowed",
          className
        ),
        ...props,
        children: [
          children,
          required && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-[var(--color-error)] ml-1", "aria-hidden": "true", children: "*" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "sr-only", children: "(required)" })
          ] })
        ]
      }
    );
  }
);
Label.displayName = "Label";

// src/primitives/Skeleton/index.tsx
var import_react6 = require("react");

// src/primitives/Skeleton/Skeleton.variants.ts
var skeletonVariants = {
  line: {
    base: "rounded-md"
  },
  circle: {
    base: "rounded-full"
  },
  card: {
    base: "rounded-xl"
  }
};

// src/primitives/Skeleton/index.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var Skeleton = (0, import_react6.forwardRef)(
  ({ variant = "line", width, height, rounded, className, style, ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        ref,
        "aria-live": "polite",
        "aria-busy": "true",
        className: cn(
          "animate-shimmer",
          rounded ?? skeletonVariants[variant].base,
          className
        ),
        style: {
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style
        },
        ...props
      }
    );
  }
);
Skeleton.displayName = "Skeleton";

// src/primitives/LoadingSpinner/index.tsx
var import_react7 = require("react");

// src/primitives/LoadingSpinner/LoadingSpinner.variants.ts
var spinnerSizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10"
};

// src/primitives/LoadingSpinner/index.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function SpinnerIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
    }
  );
}
var LoadingSpinner2 = (0, import_react7.forwardRef)(
  ({ size = "md", label = "Loading", className, "aria-label": ariaLabel, ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        ref,
        role: "status",
        "aria-label": ariaLabel ?? label,
        className: cn("inline-block", className),
        ...props,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            SpinnerIcon,
            {
              className: cn(
                "animate-spin text-[var(--color-primary)]",
                spinnerSizeClasses[size]
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "sr-only", children: label })
        ]
      }
    );
  }
);
LoadingSpinner2.displayName = "LoadingSpinner";

// src/primitives/Select/index.tsx
var import_react8 = require("react");

// src/primitives/Select/Select.variants.ts
var selectBaseClasses = [
  "flex rounded-lg border bg-[var(--color-background)]",
  "transition-all duration-200",
  "dark:bg-[var(--color-stone-900)] dark:text-[var(--color-stone-100)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50"
].join(" ");
var selectSizeClasses = {
  xs: "h-7 px-2 py-1",
  sm: "h-8 px-2.5 py-1.5",
  md: "h-10 px-3 py-2",
  lg: "h-12 px-4 py-2.5",
  xl: "h-14 px-5 py-3"
};
var selectTextSizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl"
};
function getSelectBorderClasses(hasError) {
  return hasError ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]/50" : "border-[var(--color-stone-300)] dark:border-[var(--color-stone-600)]";
}

// src/primitives/Select/index.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
function ChevronDownIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "m6 9 6 6 6-6" })
    }
  );
}
var SimpleSelect = (0, import_react8.forwardRef)(
  ({
    className,
    options,
    size = "md",
    error = false,
    fullWidth = false,
    disabled,
    children,
    onKeyDown,
    ...props
  }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: cn("relative", fullWidth ? "w-full" : "w-auto"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "select",
        {
          ref,
          disabled,
          "aria-invalid": error,
          onKeyDown: (e) => {
            if (e.key === "Escape") e.currentTarget.blur();
            onKeyDown?.(e);
          },
          className: cn(
            selectBaseClasses,
            "cursor-pointer",
            selectSizeClasses[size],
            selectTextSizes[size],
            getSelectBorderClasses(error),
            fullWidth ? "w-full" : "w-auto",
            "appearance-none",
            "pr-9",
            className
          ),
          ...props,
          children: options ? options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: opt.value, children: opt.label }, opt.value)) : children
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ChevronDownIcon, { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-stone-400)]" })
    ] });
  }
);
SimpleSelect.displayName = "Select";
var SelectContext = (0, import_react8.createContext)({
  size: "md",
  error: false,
  fullWidth: false,
  disabled: false
});
function SelectRoot({
  size = "md",
  error = false,
  fullWidth = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(SelectContext.Provider, { value: { size, error, fullWidth, disabled }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: cn("flex flex-col gap-1", fullWidth && "w-full", className), ...props, children }) });
}
SelectRoot.displayName = "Select.Root";
var SelectField = (0, import_react8.forwardRef)(({ className, options, children, onKeyDown, disabled: disabledProp, ...props }, ref) => {
  const ctx = (0, import_react8.useContext)(SelectContext);
  const isDisabled = disabledProp ?? ctx.disabled;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: cn("relative", ctx.fullWidth ? "w-full" : "w-auto"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "select",
      {
        ref,
        disabled: isDisabled,
        "aria-invalid": ctx.error,
        onKeyDown: (e) => {
          if (e.key === "Escape") e.currentTarget.blur();
          onKeyDown?.(e);
        },
        className: cn(
          selectBaseClasses,
          "cursor-pointer",
          selectSizeClasses[ctx.size],
          selectTextSizes[ctx.size],
          getSelectBorderClasses(ctx.error),
          ctx.fullWidth ? "w-full" : "w-auto",
          "appearance-none",
          "pr-9",
          className
        ),
        ...props,
        children: options ? options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("option", { value: opt.value, children: opt.label }, opt.value)) : children
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ChevronDownIcon, { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-stone-400)]" })
  ] });
});
SelectField.displayName = "Select.Field";
var Select = Object.assign(SimpleSelect, {
  Root: SelectRoot,
  Field: SelectField
});

// src/primitives/Textarea/index.tsx
var import_react9 = require("react");

// src/primitives/Textarea/Textarea.variants.ts
var textareaBaseClasses = [
  "flex rounded-lg border bg-[var(--color-background)]",
  "transition-all duration-200",
  "dark:bg-[var(--color-stone-900)] dark:text-[var(--color-stone-100)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50"
].join(" ");
var textareaTextSizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl"
};
function getTextareaBorderClasses(hasError) {
  return hasError ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]/50" : "border-[var(--color-stone-300)] dark:border-[var(--color-stone-600)]";
}

// src/primitives/Textarea/index.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var Textarea = (0, import_react9.forwardRef)(
  ({ className, size = "md", error = false, fullWidth = false, disabled, onKeyDown, ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "textarea",
      {
        ref,
        disabled,
        "aria-invalid": error,
        onKeyDown: (e) => {
          if (e.key === "Escape") e.currentTarget.blur();
          onKeyDown?.(e);
        },
        className: cn(
          textareaBaseClasses,
          "min-h-[80px] px-3 py-2",
          "placeholder:text-[var(--color-stone-400)] dark:placeholder:text-[var(--color-stone-500)]",
          "resize-y",
          textareaTextSizes[size],
          getTextareaBorderClasses(error),
          fullWidth ? "w-full" : "w-auto",
          className
        ),
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/primitives/Checkbox/index.tsx
var import_react10 = require("react");

// src/primitives/Checkbox/Checkbox.variants.ts
var checkboxSizeClasses = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6"
};
var checkboxLabelSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg"
};

// src/primitives/Checkbox/index.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var CHECKMARK_SVG = "checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDNMNC41IDguNUwyIDYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')]";
var Checkbox = (0, import_react10.forwardRef)(
  ({ className, error = false, label, size = "md", disabled, id, ...props }, ref) => {
    const checkboxId = id || (label ? `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}` : void 0);
    const checkbox = /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "input",
      {
        ref,
        type: "checkbox",
        id: checkboxId,
        disabled,
        "aria-invalid": error,
        className: cn(
          "rounded border-2 shrink-0",
          "transition-all duration-200",
          "active:scale-95",
          checkboxSizeClasses[size],
          error ? "border-[var(--color-error)]" : "border-[var(--color-stone-300)] dark:border-[var(--color-stone-600)]",
          "checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "appearance-none cursor-pointer",
          CHECKMARK_SVG,
          "checked:bg-center checked:bg-no-repeat",
          !label && className
        ),
        ...props
      }
    );
    if (label) {
      return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cn("inline-flex items-center gap-2", className), children: [
        checkbox,
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "label",
          {
            htmlFor: checkboxId,
            className: cn(
              "cursor-pointer select-none",
              "text-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]",
              checkboxLabelSizeClasses[size],
              disabled && "cursor-not-allowed opacity-50"
            ),
            children: label
          }
        )
      ] });
    }
    return checkbox;
  }
);
Checkbox.displayName = "Checkbox";

// src/primitives/Switch/index.tsx
var import_react11 = require("react");

// src/primitives/Switch/Switch.variants.ts
var switchSizeClasses = {
  xs: {
    track: "h-4 w-7",
    knob: "before:h-3 before:w-3",
    translate: "checked:before:translate-x-3"
  },
  sm: {
    track: "h-5 w-9",
    knob: "before:h-4 before:w-4",
    translate: "checked:before:translate-x-4"
  },
  md: {
    track: "h-6 w-11",
    knob: "before:h-5 before:w-5",
    translate: "checked:before:translate-x-5"
  },
  lg: {
    track: "h-7 w-13",
    knob: "before:h-6 before:w-6",
    translate: "checked:before:translate-x-6"
  },
  xl: {
    track: "h-8 w-15",
    knob: "before:h-7 before:w-7",
    translate: "checked:before:translate-x-7"
  }
};
var switchLabelSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg"
};

// src/primitives/Switch/index.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var Switch = (0, import_react11.forwardRef)(
  ({ className, label, size = "md", disabled, id, ...props }, ref) => {
    const switchId = id || (label ? `switch-${label.replace(/\s+/g, "-").toLowerCase()}` : void 0);
    const sizeConfig = switchSizeClasses[size];
    const switchInput = /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "input",
      {
        ref,
        type: "checkbox",
        role: "switch",
        id: switchId,
        disabled,
        className: cn(
          "relative shrink-0 appearance-none rounded-full",
          "transition-colors duration-200 cursor-pointer",
          "active:scale-95",
          sizeConfig.track,
          "bg-[var(--color-stone-300)] checked:bg-[var(--color-primary)]",
          "dark:bg-[var(--color-stone-600)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          'before:content-[""] before:absolute before:top-[2px] before:left-[2px]',
          "before:rounded-full before:bg-[var(--color-background)]",
          "before:transition-transform before:duration-200",
          "before:shadow-sm",
          sizeConfig.knob,
          sizeConfig.translate,
          !label && className
        ),
        ...props
      }
    );
    if (label) {
      return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: cn("inline-flex items-center gap-2", className), children: [
        switchInput,
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "label",
          {
            htmlFor: switchId,
            className: cn(
              "cursor-pointer select-none",
              "text-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]",
              switchLabelSizeClasses[size],
              disabled && "cursor-not-allowed opacity-50"
            ),
            children: label
          }
        )
      ] });
    }
    return switchInput;
  }
);
Switch.displayName = "Switch";

// src/primitives/Avatar/index.tsx
var import_react12 = require("react");

// src/primitives/Avatar/Avatar.variants.ts
var avatarSizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl"
};

// src/primitives/Avatar/index.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var Avatar = (0, import_react12.forwardRef)(
  ({ src, alt = "", fallback = "?", size = "md", className, ...props }, ref) => {
    const [imageError, setImageError] = (0, import_react12.useState)(false);
    const showImage = src && !imageError;
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "div",
      {
        ref,
        className: cn(
          "relative inline-flex items-center justify-center",
          "rounded-full overflow-hidden",
          "bg-[var(--color-stone-200)] text-[var(--color-stone-600)]",
          "dark:bg-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]",
          "font-medium select-none shrink-0",
          "transition-all duration-200",
          avatarSizeClasses[size],
          className
        ),
        ...props,
        children: showImage ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "img",
          {
            src,
            alt,
            onError: () => setImageError(true),
            className: "h-full w-full object-cover"
          }
        ) : typeof fallback === "string" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "uppercase", children: fallback }) : fallback
      }
    );
  }
);
Avatar.displayName = "Avatar";

// src/primitives/FilterChip/index.tsx
var import_react13 = require("react");

// src/primitives/FilterChip/FilterChip.variants.ts
var chipVariants = {
  primary: {
    base: "bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[var(--color-primary)]"
  },
  secondary: {
    base: "bg-[var(--color-stone-100)] text-[var(--color-stone-700)] dark:bg-[var(--color-stone-800)] dark:text-[var(--color-stone-300)]"
  },
  success: {
    base: "bg-[var(--color-success)]/10 text-[var(--color-success)] dark:bg-[var(--color-success)]/10 dark:text-[var(--color-success)]"
  },
  warning: {
    base: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] dark:bg-[var(--color-warning)]/10 dark:text-[var(--color-warning)]"
  },
  error: {
    base: "bg-[var(--color-error)]/10 text-[var(--color-error)] dark:bg-[var(--color-error)]/10 dark:text-[var(--color-error)]"
  },
  info: {
    base: "bg-[var(--color-info)]/10 text-[var(--color-info)] dark:bg-[var(--color-info)]/10 dark:text-[var(--color-info)]"
  },
  ghost: {
    base: "bg-transparent text-[var(--color-stone-600)] dark:text-[var(--color-stone-400)] border border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)]"
  }
};
var chipSizes = {
  xs: { padding: "px-1.5 py-0.5 gap-1", fontSize: "text-xs" },
  sm: { padding: "px-2 py-0.5 gap-1", fontSize: "text-xs" },
  md: { padding: "px-2.5 py-1 gap-1.5", fontSize: "text-sm" },
  lg: { padding: "px-3 py-1.5 gap-1.5", fontSize: "text-sm" },
  xl: { padding: "px-3.5 py-2 gap-2", fontSize: "text-base" }
};
var chipRemoveSizes = {
  xs: "h-3 w-3",
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
  xl: "h-4.5 w-4.5"
};

// src/primitives/FilterChip/index.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function XIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("path", { d: "M18 6 6 18" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("path", { d: "m6 6 12 12" })
      ]
    }
  );
}
var FilterChip = (0, import_react13.forwardRef)(
  ({ label, onRemove, variant = "primary", size = "md", className, ...props }, ref) => {
    const variantDef = chipVariants[variant];
    const sizeDef = chipSizes[size];
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
      "span",
      {
        ref,
        className: cn(
          "inline-flex items-center rounded-full font-medium",
          "transition-all duration-200",
          "hover:shadow-sm",
          variantDef.base,
          sizeDef.padding,
          sizeDef.fontSize,
          className
        ),
        ...props,
        children: [
          label,
          onRemove && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                onRemove();
              },
              className: cn(
                "inline-flex items-center justify-center shrink-0",
                "rounded-full opacity-60 hover:opacity-100 hover:scale-110",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
              ),
              "aria-label": `Remove ${label}`,
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(XIcon, { className: chipRemoveSizes[size] })
            }
          )
        ]
      }
    );
  }
);
FilterChip.displayName = "FilterChip";

// src/primitives/EmptyState/index.tsx
var import_react14 = require("react");

// src/primitives/EmptyState/EmptyState.variants.ts
var emptyStateVariants = {
  default: {
    base: "flex flex-col items-center justify-center text-center p-8"
  }
};

// src/primitives/EmptyState/index.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
var EmptyState = (0, import_react14.forwardRef)(
  ({ icon, title, description, action, variant = "default", className, children, ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { ref, className: cn(emptyStateVariants[variant].base, className), ...props, children: [
      icon && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "div",
        {
          className: "mb-4 text-[var(--color-stone-400)] dark:text-[var(--color-stone-500)]",
          "aria-hidden": "true",
          children: icon
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h3", { className: "text-lg font-semibold text-[var(--color-stone-900)] dark:text-[var(--color-stone-100)] mb-2", children: title }),
      description && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "text-sm text-[var(--color-stone-500)] dark:text-[var(--color-stone-400)] mb-4 max-w-sm", children: description }),
      action && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "mt-2", children: action }),
      children
    ] });
  }
);
EmptyState.displayName = "EmptyState";

// src/primitives/IndeterminateProgress/index.tsx
var import_react15 = require("react");

// src/primitives/IndeterminateProgress/IndeterminateProgress.variants.ts
var progressVariants = {
  default: {
    base: "absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden"
  }
};

// src/primitives/IndeterminateProgress/index.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var IndeterminateProgress = (0, import_react15.forwardRef)(({ visible, variant = "default", className, ...props }, ref) => {
  if (!visible) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
    "div",
    {
      ref,
      role: "progressbar",
      "aria-label": "Loading",
      className: cn(progressVariants[variant].base, className),
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          "div",
          {
            className: "h-full w-1/3 bg-[var(--color-primary)] animate-indeterminate",
            style: {
              animation: "indeterminate-slide 1.5s ease-in-out infinite"
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("style", { children: `
                @keyframes indeterminate-slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }
            ` })
      ]
    }
  );
});
IndeterminateProgress.displayName = "IndeterminateProgress";

// src/primitives/SearchInput/index.tsx
var import_react16 = require("react");

// src/primitives/SearchInput/SearchInput.variants.ts
var searchInputVariants = {
  default: {
    base: [
      "h-10 w-full rounded-lg border pl-9 pr-9 text-sm",
      "bg-[var(--color-background)]",
      "border-[var(--color-input)]",
      "text-[var(--color-foreground)]",
      "placeholder:text-[var(--color-text-muted)]",
      "transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2",
      "focus-visible:border-[var(--color-primary)]"
    ].join(" ")
  }
};

// src/primitives/SearchInput/index.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
function SearchIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "m21 21-4.3-4.3" })
      ]
    }
  );
}
function XIcon2({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M18 6 6 18" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "m6 6 12 12" })
      ]
    }
  );
}
var SearchInput = (0, import_react16.forwardRef)(
  ({
    value,
    onChange,
    placeholder = "Search...",
    debounce = 300,
    variant = "default",
    className,
    ...props
  }, ref) => {
    const [localValue, setLocalValue] = (0, import_react16.useState)(value);
    const timerRef = (0, import_react16.useRef)(void 0);
    (0, import_react16.useEffect)(() => {
      setLocalValue(value);
    }, [value]);
    const debouncedOnChange = (0, import_react16.useCallback)(
      (val) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => onChange(val), debounce);
      },
      [onChange, debounce]
    );
    (0, import_react16.useEffect)(
      () => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      []
    );
    const handleChange = (val) => {
      setLocalValue(val);
      debouncedOnChange(val);
    };
    const handleClear = () => {
      setLocalValue("");
      if (timerRef.current) clearTimeout(timerRef.current);
      onChange("");
    };
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { ref, className: cn("relative flex items-center", className), ...props, children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "pointer-events-none absolute left-3 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(SearchIcon, { className: "h-4 w-4 text-[var(--color-text-muted)]" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        "input",
        {
          type: "text",
          value: localValue,
          onChange: (e) => handleChange(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              handleClear();
              e.currentTarget.blur();
            }
          },
          placeholder,
          className: searchInputVariants[variant].base,
          "aria-label": placeholder
        }
      ),
      localValue && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        "button",
        {
          type: "button",
          onClick: handleClear,
          className: "absolute right-3 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-foreground)]",
          "aria-label": "Clear search",
          children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(XIcon2, { className: "h-4 w-4" })
        }
      )
    ] });
  }
);
SearchInput.displayName = "SearchInput";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  FilterChip,
  IndeterminateProgress,
  Input,
  Label,
  LoadingSpinner,
  SearchInput,
  Select,
  Skeleton,
  Switch,
  Textarea,
  cn,
  resolveVariant
});
//# sourceMappingURL=index.cjs.map