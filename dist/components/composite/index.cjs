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

// src/composite/index.ts
var index_exports = {};
__export(index_exports, {
  ComboSelect: () => ComboSelect,
  DateRangePicker: () => DateRangePicker,
  Dropdown: () => Dropdown,
  DropdownDivider: () => DropdownDivider,
  DropdownItem: () => DropdownItem,
  IconSelect: () => IconSelect,
  MultiIconSelect: () => MultiIconSelect,
  Pagination: () => Pagination,
  Tabs: () => Tabs
});
module.exports = __toCommonJS(index_exports);

// src/composite/ComboSelect/index.tsx
var import_react = require("react");
var import_react2 = require("@headlessui/react");

// src/utils/cn.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/composite/ComboSelect/ComboSelect.variants.ts
var comboSelectInputClasses = [
  "h-10 w-full rounded-lg border text-sm",
  "bg-[var(--color-background)]",
  "transition-colors duration-200",
  "border-[var(--color-input)]",
  "text-[var(--color-foreground)]",
  "placeholder:text-[var(--color-text-muted)]",
  "focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/50 focus:ring-offset-2",
  "focus:border-[var(--color-ring)]"
].join(" ");
var comboSelectOptionClasses = [
  "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm",
  "transition-colors duration-150",
  "text-[var(--color-popover-foreground)]",
  "data-[focus]:bg-[var(--color-accent)] data-[focus]:text-[var(--color-accent-foreground)]"
].join(" ");
var comboSelectPopoverClasses = [
  "absolute left-0 top-full z-[var(--z-dropdown,1000)] mt-1 w-full origin-top",
  "max-h-60 overflow-y-auto",
  "rounded-lg bg-[var(--color-popover)] shadow-lg ring-1 ring-[var(--color-border)]",
  "focus:outline-none",
  "py-1",
  "transition duration-200",
  "data-[closed]:scale-95 data-[closed]:opacity-0"
].join(" ");

// src/composite/ComboSelect/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function ChevronDownIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m6 9 6 6 6-6" })
    }
  );
}
function CheckIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 6 9 17l-5-5" })
    }
  );
}
function LoaderIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
    }
  );
}
function ComboSelectSimple(props) {
  const {
    options,
    placeholder = "Select...",
    placeholderIcon,
    fullWidth = false,
    loading = false,
    disabled = false,
    showAllOption = false,
    allOptionLabel = "All",
    emptyText = "No results found",
    className
  } = props;
  const isMultiple = props.multiple === true;
  const [query, setQuery] = (0, import_react.useState)("");
  const allOptions = (0, import_react.useMemo)(
    () => [
      ...!isMultiple && showAllOption ? [{ value: "", label: allOptionLabel }] : [],
      ...options
    ],
    [options, showAllOption, allOptionLabel, isMultiple]
  );
  const filtered = (0, import_react.useMemo)(() => {
    if (!query) return allOptions;
    const lower = query.toLowerCase();
    return allOptions.filter((o) => o.label.toLowerCase().includes(lower));
  }, [allOptions, query]);
  const effectivePlaceholder = (0, import_react.useMemo)(() => {
    if (isMultiple) {
      const count = props.value.length;
      return count === 0 ? placeholder : `${placeholder} (${count})`;
    }
    const selected = allOptions.find(
      (o) => o.value === props.value
    );
    return selected?.label || placeholder;
  }, [isMultiple, props, allOptions, placeholder]);
  const innerContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: cn("relative min-w-0", fullWidth && "w-full"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3", children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderIcon, { className: "h-3.5 w-3.5 animate-spin text-[var(--color-primary)]" }) : placeholderIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex items-center text-[var(--color-text-muted)]", children: placeholderIcon }) : null }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react2.ComboboxInput,
      {
        className: cn(
          comboSelectInputClasses,
          placeholderIcon || loading ? "pl-8" : "pl-3",
          "pr-8",
          loading && "opacity-70",
          className
        ),
        placeholder: effectivePlaceholder,
        displayValue: () => query,
        onChange: (e) => setQuery(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Escape") e.currentTarget.blur();
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.ComboboxButton, { className: "absolute inset-y-0 right-0 flex items-center pr-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDownIcon, { className: "h-3.5 w-3.5 text-[var(--color-text-muted)]" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.ComboboxOptions, { transition: true, className: comboSelectPopoverClasses, children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "px-3 py-2 text-sm text-[var(--color-text-muted)]", children: emptyText }) : filtered.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react2.ComboboxOption,
      {
        value: option.value,
        className: comboSelectOptionClasses,
        children: ({ selected: isSelected }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          option.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex shrink-0 items-center", children: option.icon }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "span",
            {
              className: cn(
                "flex-1 truncate",
                isSelected && "font-medium"
              ),
              children: option.label
            }
          ),
          isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, { className: "h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" })
        ] })
      },
      String(option.value)
    )) })
  ] });
  if (isMultiple) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react2.Combobox,
      {
        value: props.value,
        onChange: (val) => {
          props.onChange(val);
          setQuery("");
        },
        multiple: true,
        immediate: true,
        disabled: disabled || loading,
        children: innerContent
      }
    );
  }
  const singleValue = props.value;
  const singleOnChange = props.onChange;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react2.Combobox,
    {
      value: singleValue,
      onChange: (val) => {
        singleOnChange(val ?? "");
        setQuery("");
      },
      immediate: true,
      disabled: disabled || loading,
      children: innerContent
    }
  );
}
ComboSelectSimple.displayName = "ComboSelect";
var ComboSelectContext = (0, import_react.createContext)({
  query: "",
  setQuery: () => {
  },
  loading: false
});
function useComboSelectContext() {
  return (0, import_react.useContext)(ComboSelectContext);
}
function ComboSelectRoot({
  value,
  onChange,
  multiple = false,
  disabled = false,
  loading = false,
  placeholderIcon,
  children,
  className
}) {
  const [query, setQuery] = (0, import_react.useState)("");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComboSelectContext.Provider, { value: { query, setQuery, loading, placeholderIcon }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react2.Combobox,
    {
      value,
      onChange: (val) => {
        onChange(val ?? "");
        setQuery("");
      },
      multiple,
      immediate: true,
      disabled: disabled || loading,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("relative min-w-0", className), children })
    }
  ) });
}
ComboSelectRoot.displayName = "ComboSelect.Root";
function ComboSelectInput({ placeholder = "Select...", className }) {
  const { setQuery, loading, placeholderIcon } = useComboSelectContext();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3", children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderIcon, { className: "h-3.5 w-3.5 animate-spin text-[var(--color-primary)]" }) : placeholderIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex items-center text-[var(--color-text-muted)]", children: placeholderIcon }) : null }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react2.ComboboxInput,
      {
        className: cn(
          comboSelectInputClasses,
          placeholderIcon || loading ? "pl-8" : "pl-3",
          "pr-8",
          loading && "opacity-70",
          className
        ),
        placeholder,
        onChange: (e) => setQuery(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Escape") e.currentTarget.blur();
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.ComboboxButton, { className: "absolute inset-y-0 right-0 flex items-center pr-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDownIcon, { className: "h-3.5 w-3.5 text-[var(--color-text-muted)]" }) })
  ] });
}
ComboSelectInput.displayName = "ComboSelect.Input";
function ComboSelectOptionsWrapper({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.ComboboxOptions, { transition: true, className: cn(comboSelectPopoverClasses, className), children });
}
ComboSelectOptionsWrapper.displayName = "ComboSelect.Options";
function ComboSelectOptionItem({
  value,
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.ComboboxOption, { value, className: cn(comboSelectOptionClasses, className), children });
}
ComboSelectOptionItem.displayName = "ComboSelect.Option";
var ComboSelect = Object.assign(ComboSelectSimple, {
  Root: ComboSelectRoot,
  Input: ComboSelectInput,
  Options: ComboSelectOptionsWrapper,
  Option: ComboSelectOptionItem
});

// src/composite/Dropdown/index.tsx
var import_react3 = require("@headlessui/react");
var import_react4 = require("react");

// src/composite/Dropdown/Dropdown.variants.ts
var dropdownMenuClasses = [
  "z-[var(--z-dropdown,1000)]",
  "[--anchor-gap:8px] w-56 origin-top-right",
  "rounded-lg bg-[var(--color-popover)] text-[var(--color-popover-foreground)] shadow-lg ring-1 ring-[var(--color-border)]",
  "focus:outline-none",
  "transition duration-200",
  "data-[closed]:scale-95 data-[closed]:opacity-0"
].join(" ");
var dropdownItemBaseClasses = [
  "group flex w-full items-center px-4 py-2 text-sm",
  "transition-colors duration-150"
].join(" ");
var dropdownItemFocusClasses = "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]";
var dropdownItemDisabledClasses = "cursor-not-allowed opacity-50";
var dropdownItemNormalClasses = "text-[var(--color-popover-foreground)]";
var dropdownItemDestructiveClasses = "text-[var(--color-error)]";

// src/composite/Dropdown/index.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var DropdownBase = (0, import_react4.forwardRef)(
  ({ trigger, children, align = "right", anchor: anchorProp, className }, ref) => {
    const resolvedAnchor = anchorProp ?? (align === "right" ? "bottom end" : "bottom start");
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react3.Menu, { as: "div", className: cn("relative inline-block text-left", className), ref, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react3.MenuButton, { as: "div", children: trigger }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react3.MenuItems, { transition: true, anchor: resolvedAnchor, className: dropdownMenuClasses, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "py-1", children }) })
    ] });
  }
);
DropdownBase.displayName = "Dropdown";
var DropdownItem = (0, import_react4.forwardRef)(
  ({ children, onClick, disabled = false, destructive = false, className }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react3.MenuItem, { disabled, children: ({ focus }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        ref,
        onClick,
        className: cn(
          dropdownItemBaseClasses,
          focus && !disabled && dropdownItemFocusClasses,
          disabled ? dropdownItemDisabledClasses : "cursor-pointer",
          !disabled && !destructive && dropdownItemNormalClasses,
          !disabled && destructive && dropdownItemDestructiveClasses,
          className
        ),
        children
      }
    ) });
  }
);
DropdownItem.displayName = "Dropdown.Item";
function DropdownDivider() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "my-1 h-px bg-[var(--color-border)]", role: "separator" });
}
DropdownDivider.displayName = "Dropdown.Divider";
var Dropdown = Object.assign(DropdownBase, {
  Item: DropdownItem,
  Divider: DropdownDivider
});

// src/composite/IconSelect/index.tsx
var import_react5 = require("@headlessui/react");

// src/composite/IconSelect/IconSelect.variants.ts
var iconSelectButtonClasses = [
  "flex h-10 items-center gap-2 rounded-lg border px-3 py-2",
  "bg-[var(--color-background)] text-sm",
  "transition-colors duration-200",
  "border-[var(--color-input)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/50 focus-visible:ring-offset-2",
  "focus-visible:border-[var(--color-ring)]"
].join(" ");
var iconSelectPopoverClasses = [
  "absolute left-0 top-full z-[var(--z-dropdown,1000)] mt-1 w-full origin-top",
  "rounded-lg bg-[var(--color-popover)] shadow-lg ring-1 ring-[var(--color-border)]",
  "focus:outline-none",
  "py-1",
  "transition duration-200",
  "data-[closed]:scale-95 data-[closed]:opacity-0"
].join(" ");
var iconSelectOptionClasses = [
  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
  "transition-colors duration-150",
  "text-[var(--color-popover-foreground)]",
  "data-[focus]:bg-[var(--color-accent)] data-[focus]:text-[var(--color-accent-foreground)]"
].join(" ");

// src/composite/IconSelect/index.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function ChevronDownIcon2({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "m6 9 6 6 6-6" })
    }
  );
}
function CheckIcon2({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M20 6 9 17l-5-5" })
    }
  );
}
function IconSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  fullWidth = false,
  className
}) {
  const selected = options.find((o) => o.value === value);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react5.Listbox, { value, onChange, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: cn("relative", fullWidth && "w-full", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      import_react5.ListboxButton,
      {
        className: cn(iconSelectButtonClasses, fullWidth ? "w-full" : "w-auto"),
        children: [
          selected ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            selected.icon && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "flex shrink-0 items-center", children: selected.icon }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "flex-1 truncate text-left text-[var(--color-foreground)]", children: selected.label })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "flex-1 truncate text-left text-[var(--color-text-muted)]", children: placeholder }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ChevronDownIcon2, { className: "h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react5.ListboxOptions, { transition: true, className: iconSelectPopoverClasses, children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_react5.ListboxOption,
      {
        value: option.value,
        className: iconSelectOptionClasses,
        children: ({ selected: isSelected }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          option.icon && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "flex shrink-0 items-center", children: option.icon }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "span",
            {
              className: cn(
                "flex-1 truncate",
                isSelected && "font-medium"
              ),
              children: option.label
            }
          ),
          isSelected && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CheckIcon2, { className: "h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" })
        ] })
      },
      String(option.value)
    )) })
  ] }) });
}

// src/composite/MultiIconSelect/index.tsx
var import_react6 = require("@headlessui/react");

// src/composite/MultiIconSelect/MultiIconSelect.variants.ts
var multiIconSelectButtonClasses = [
  "flex h-10 items-center gap-2 rounded-lg border px-3 py-2",
  "bg-[var(--color-background)] text-sm",
  "transition-colors duration-200",
  "border-[var(--color-input)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/50 focus-visible:ring-offset-2",
  "focus-visible:border-[var(--color-ring)]"
].join(" ");
var multiIconSelectPopoverClasses = [
  "z-[var(--z-dropdown,1000)]",
  "w-[var(--button-width)] origin-top",
  "rounded-lg bg-[var(--color-popover)] shadow-lg ring-1 ring-[var(--color-border)]",
  "focus:outline-none",
  "py-1",
  "transition duration-200",
  "data-[closed]:scale-95 data-[closed]:opacity-0"
].join(" ");
var multiIconSelectOptionClasses = [
  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
  "transition-colors duration-150",
  "text-[var(--color-popover-foreground)]",
  "data-[focus]:bg-[var(--color-accent)] data-[focus]:text-[var(--color-accent-foreground)]"
].join(" ");
var multiIconSelectPresetClasses = [
  "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm",
  "transition-colors duration-150",
  "text-[var(--color-popover-foreground)]",
  "hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
].join(" ");

// src/composite/MultiIconSelect/index.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function ChevronDownIcon3({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m6 9 6 6 6-6" })
    }
  );
}
function CheckIcon3({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M20 6 9 17l-5-5" })
    }
  );
}
function MultiIconSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  placeholderIcon,
  presets,
  fullWidth = false,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react6.Listbox, { value, onChange, multiple: true, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: cn("relative", fullWidth && "w-full", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      import_react6.ListboxButton,
      {
        className: cn(multiIconSelectButtonClasses, fullWidth ? "w-full" : "w-auto"),
        children: [
          placeholderIcon && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "flex shrink-0 items-center text-[var(--color-text-muted)]", children: placeholderIcon }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "span",
            {
              className: cn(
                "flex-1 truncate text-left",
                value.length === 0 ? "text-[var(--color-text-muted)]" : "text-[var(--color-foreground)]"
              ),
              children: value.length === 0 ? placeholder : `${placeholder} (${value.length})`
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ChevronDownIcon3, { className: "h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      import_react6.ListboxOptions,
      {
        transition: true,
        anchor: "bottom start",
        className: multiIconSelectPopoverClasses,
        children: [
          presets?.map((preset) => {
            const presetSet = new Set(preset.values.map(String));
            const valueSet = new Set(value.map(String));
            const isActive = presetSet.size > 0 && presetSet.size === valueSet.size && [...presetSet].every((v) => valueSet.has(v));
            return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                type: "button",
                onMouseDown: (e) => {
                  e.preventDefault();
                  onChange(isActive ? [] : [...preset.values]);
                },
                className: multiIconSelectPresetClasses,
                children: [
                  preset.icon && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "flex shrink-0 items-center", children: preset.icon }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                    "span",
                    {
                      className: cn(
                        "flex-1 truncate text-left",
                        isActive && "font-medium"
                      ),
                      children: preset.label
                    }
                  ),
                  isActive && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CheckIcon3, { className: "h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" })
                ]
              },
              `preset-${preset.label}`
            );
          }),
          presets && presets.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "my-1 border-t border-[var(--color-border)]" }),
          options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            import_react6.ListboxOption,
            {
              value: option.value,
              className: multiIconSelectOptionClasses,
              children: ({ selected: isSelected }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
                option.icon && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "flex shrink-0 items-center", children: option.icon }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  "span",
                  {
                    className: cn(
                      "flex-1 truncate",
                      isSelected && "font-medium"
                    ),
                    children: option.label
                  }
                ),
                isSelected && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(CheckIcon3, { className: "h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" })
              ] })
            },
            String(option.value)
          ))
        ]
      }
    )
  ] }) });
}

// src/composite/Tabs/index.tsx
var import_react7 = require("react");

// src/composite/Tabs/Tabs.variants.ts
var tabsListClasses = ["flex border-b border-[var(--color-border)]"].join(" ");
var tabButtonBaseClasses = [
  "relative px-4 py-2.5 text-sm font-medium transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50"
].join(" ");
var tabButtonActiveClasses = "text-[var(--color-primary)]";
var tabButtonInactiveClasses = "text-[var(--color-text-muted)]";
var tabButtonHoverClasses = "hover:text-[var(--color-foreground)]";
var tabButtonDisabledClasses = "opacity-50 cursor-not-allowed";
var tabIndicatorClasses = "absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]";

// src/composite/Tabs/index.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function TabsSimple({ tabs, activeTab, onChange, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: cn(tabsListClasses, className), role: "tablist", children: tabs.map((tab) => {
    const isActive = tab.id === activeTab;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": isActive,
        "aria-disabled": tab.disabled,
        tabIndex: isActive ? 0 : -1,
        disabled: tab.disabled,
        onClick: () => {
          if (!tab.disabled) onChange(tab.id);
        },
        onKeyDown: (e) => {
          const enabledTabs = tabs.filter((t) => !t.disabled);
          const currentIndex = enabledTabs.findIndex((t) => t.id === tab.id);
          let nextIndex = -1;
          if (e.key === "ArrowRight") {
            nextIndex = (currentIndex + 1) % enabledTabs.length;
          } else if (e.key === "ArrowLeft") {
            nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
          }
          if (nextIndex >= 0 && enabledTabs[nextIndex]) {
            e.preventDefault();
            onChange(enabledTabs[nextIndex].id);
            const tabList = e.currentTarget.parentElement;
            const buttons = tabList?.querySelectorAll(
              '[role="tab"]:not([disabled])'
            );
            buttons?.[nextIndex]?.focus();
          }
        },
        className: cn(
          tabButtonBaseClasses,
          isActive ? tabButtonActiveClasses : tabButtonInactiveClasses,
          !tab.disabled && !isActive && tabButtonHoverClasses,
          tab.disabled && tabButtonDisabledClasses
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "flex items-center gap-2", children: [
            tab.label,
            tab.badge
          ] }),
          isActive && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: tabIndicatorClasses })
        ]
      },
      tab.id
    );
  }) });
}
TabsSimple.displayName = "Tabs";
var TabsContext = (0, import_react7.createContext)({
  activeTab: "",
  onChange: () => {
  }
});
function useTabsContext() {
  return (0, import_react7.useContext)(TabsContext);
}
function TabsRoot({ activeTab, onChange, children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TabsContext.Provider, { value: { activeTab, onChange }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className, children }) });
}
TabsRoot.displayName = "Tabs.Root";
function TabsList({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: cn(tabsListClasses, className), role: "tablist", children });
}
TabsList.displayName = "Tabs.List";
function TabsTab({ id, disabled = false, children, className }) {
  const { activeTab, onChange } = useTabsContext();
  const isActive = id === activeTab;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": isActive,
      "aria-disabled": disabled,
      tabIndex: isActive ? 0 : -1,
      disabled,
      onClick: () => {
        if (!disabled) onChange(id);
      },
      className: cn(
        tabButtonBaseClasses,
        isActive ? tabButtonActiveClasses : tabButtonInactiveClasses,
        !disabled && !isActive && tabButtonHoverClasses,
        disabled && tabButtonDisabledClasses,
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "flex items-center gap-2", children }),
        isActive && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: tabIndicatorClasses })
      ]
    }
  );
}
TabsTab.displayName = "Tabs.Tab";
function TabsPanels({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className, children });
}
TabsPanels.displayName = "Tabs.Panels";
function TabsPanel({ id, children, className }) {
  const { activeTab } = useTabsContext();
  if (id !== activeTab) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { role: "tabpanel", "aria-labelledby": id, className, children });
}
TabsPanel.displayName = "Tabs.Panel";
var Tabs = Object.assign(TabsSimple, {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panels: TabsPanels,
  Panel: TabsPanel
});

// src/composite/Pagination/index.tsx
var import_react8 = require("react");

// src/composite/Pagination/Pagination.variants.ts
var paginationNavClasses = "flex items-center justify-center gap-1";
var paginationButtonBaseClasses = [
  "flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  "h-8 min-w-8 px-2",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50"
].join(" ");
var paginationButtonDefaultClasses = [
  "border border-[var(--color-border)]",
  "hover:bg-[var(--color-accent)]"
].join(" ");
var paginationButtonActiveClasses = "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]";
var paginationButtonDisabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";
var paginationEllipsisClasses = "px-1 text-sm text-[var(--color-text-muted)]";

// src/composite/Pagination/index.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function ChevronLeftIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m15 18-6-6 6-6" })
    }
  );
}
function ChevronRightIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "m9 18 6-6-6-6" })
    }
  );
}
function getPageNumbers(current, total, max) {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  const sideCount = Math.floor((max - 3) / 2);
  pages.push(1);
  const leftBound = Math.max(2, current - sideCount);
  const rightBound = Math.min(total - 1, current + sideCount);
  if (leftBound > 2) pages.push("ellipsis");
  for (let i = leftBound; i <= rightBound; i++) pages.push(i);
  if (rightBound < total - 1) pages.push("ellipsis");
  if (total > 1) pages.push(total);
  return pages;
}
function Pagination({
  page,
  totalPages,
  onChange,
  maxButtons = 7,
  className
}) {
  const pages = (0, import_react8.useMemo)(
    () => getPageNumbers(page, totalPages, maxButtons),
    [page, totalPages, maxButtons]
  );
  if (totalPages <= 1) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("nav", { "aria-label": "Pagination", className: cn(paginationNavClasses, className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "button",
      {
        type: "button",
        onClick: () => onChange(page - 1),
        disabled: page <= 1,
        "aria-label": "Previous page",
        className: cn(
          paginationButtonBaseClasses,
          paginationButtonDefaultClasses,
          paginationButtonDisabledClasses
        ),
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ChevronLeftIcon, { className: "h-4 w-4" })
      }
    ),
    pages.map(
      (p, i) => p === "ellipsis" ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: paginationEllipsisClasses, children: "..." }, `ellipsis-${i}`) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          type: "button",
          onClick: () => onChange(p),
          "aria-label": `Page ${p}`,
          "aria-current": p === page ? "page" : void 0,
          className: cn(
            paginationButtonBaseClasses,
            p === page ? paginationButtonActiveClasses : paginationButtonDefaultClasses
          ),
          children: p
        },
        p
      )
    ),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "button",
      {
        type: "button",
        onClick: () => onChange(page + 1),
        disabled: page >= totalPages,
        "aria-label": "Next page",
        className: cn(
          paginationButtonBaseClasses,
          paginationButtonDefaultClasses,
          paginationButtonDisabledClasses
        ),
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ChevronRightIcon, { className: "h-4 w-4" })
      }
    )
  ] });
}

// src/composite/DateRangePicker/DateRangePicker.variants.ts
var dateRangePickerWrapperClasses = "flex items-center gap-2";
var dateRangePickerInputClasses = [
  "h-9 rounded-lg border px-3 text-sm",
  "bg-[var(--color-background)]",
  "border-[var(--color-input)]",
  "text-[var(--color-foreground)]",
  "transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50",
  "focus-visible:border-[var(--color-primary)]"
].join(" ");
var dateRangePickerSeparatorClasses = "text-sm text-[var(--color-text-muted)]";
var dateRangePickerIconClasses = "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]";

// src/composite/DateRangePicker/index.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function CalendarIcon({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "svg",
    {
      className,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M8 2v4" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M16 2v4" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { d: "M3 10h18" })
      ]
    }
  );
}
function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: cn(dateRangePickerWrapperClasses, className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CalendarIcon, { className: dateRangePickerIconClasses }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          type: "date",
          value: from,
          onChange: (e) => onFromChange(e.target.value),
          max: to || void 0,
          className: cn(dateRangePickerInputClasses, "pl-8 w-[150px]"),
          "aria-label": "From date"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: dateRangePickerSeparatorClasses, children: "to" }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CalendarIcon, { className: dateRangePickerIconClasses }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          type: "date",
          value: to,
          onChange: (e) => onToChange(e.target.value),
          min: from || void 0,
          className: cn(dateRangePickerInputClasses, "pl-8 w-[150px]"),
          "aria-label": "To date"
        }
      )
    ] })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ComboSelect,
  DateRangePicker,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  IconSelect,
  MultiIconSelect,
  Pagination,
  Tabs
});
//# sourceMappingURL=index.cjs.map