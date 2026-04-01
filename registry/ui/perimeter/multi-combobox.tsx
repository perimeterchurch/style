"use client";

import * as React from "react";
import { useCombobox, useMultipleSelection } from "downshift";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MultiComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiComboboxBaseProps {
  /** Available options */
  options: MultiComboboxOption[];
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** Disable the entire combobox */
  disabled?: boolean;
  /** Additional class names for the root container */
  className?: string;
}

interface MultiComboboxSingleProps extends MultiComboboxBaseProps {
  multiple?: false;
  /** Currently selected value (single mode) */
  value: string | null;
  /** Called when selection changes (single mode) */
  onValueChange: (value: string | null) => void;
}

interface MultiComboboxMultipleProps extends MultiComboboxBaseProps {
  multiple: true;
  /** Currently selected values (multiple mode) */
  value: string[];
  /** Called when selection changes (multiple mode) */
  onValueChange: (value: string[]) => void;
}

export type MultiComboboxProps =
  | MultiComboboxSingleProps
  | MultiComboboxMultipleProps;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function MultiCombobox(props: MultiComboboxProps) {
  const {
    options,
    placeholder = "Select...",
    disabled = false,
    className,
  } = props;
  const isMultiple = props.multiple === true;

  const [inputValue, setInputValue] = React.useState("");

  // Filter options by search input
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;
    const lower = inputValue.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(lower));
  }, [options, inputValue]);

  // --- Multiple mode helpers ---

  const selectedValues: string[] = isMultiple
    ? props.value
    : props.value != null
      ? [props.value]
      : [];

  const isSelected = React.useCallback(
    (value: string) => selectedValues.includes(value),
    [selectedValues],
  );

  const toggleItem = React.useCallback(
    (option: MultiComboboxOption) => {
      if (isMultiple) {
        const current = props.value;
        const next = current.includes(option.value)
          ? current.filter((v) => v !== option.value)
          : [...current, option.value];
        (props as MultiComboboxMultipleProps).onValueChange(next);
      } else {
        const current = (props as MultiComboboxSingleProps).value;
        (props as MultiComboboxSingleProps).onValueChange(
          current === option.value ? null : option.value,
        );
      }
    },
    [isMultiple, props],
  );

  // --- Downshift multiple selection hook (chips) ---

  const selectedItems = React.useMemo(
    () => options.filter((o) => selectedValues.includes(o.value)),
    [options, selectedValues],
  );

  const { getDropdownProps } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      if (
        type ===
          useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace ||
        type ===
          useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete ||
        type ===
          useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace ||
        type ===
          useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem
      ) {
        if (isMultiple && newSelectedItems) {
          (props as MultiComboboxMultipleProps).onValueChange(
            newSelectedItems.map((i) => i.value),
          );
        }
      }
    },
  });

  // --- Downshift combobox hook ---

  const {
    isOpen,
    highlightedIndex,
    getInputProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useCombobox({
    items: filteredOptions,
    inputValue,
    itemToString: (item) => item?.label ?? "",
    selectedItem: null, // We manage selection ourselves
    stateReducer(_state, actionAndChanges) {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            // In multiple mode, keep menu open and input value after selection
            isOpen: isMultiple ? true : false,
            inputValue: isMultiple ? inputValue : "",
          };
        default:
          return changes;
      }
    },
    onSelectedItemChange({ selectedItem: newItem }) {
      if (newItem) {
        toggleItem(newItem);
        if (!isMultiple) {
          setInputValue("");
        }
      }
    },
    onInputValueChange({ inputValue: newValue }) {
      setInputValue(newValue ?? "");
    },
  });

  // --- Display label ---

  const displayLabel = React.useMemo(() => {
    if (selectedItems.length === 0) return "";
    if (!isMultiple) return selectedItems[0]?.label ?? "";
    return "";
  }, [selectedItems, isMultiple]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>();

  // Measure trigger width when dropdown opens
  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      setTriggerWidth(containerRef.current.offsetWidth);
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      data-slot="multi-combobox"
      className={cn("relative", className)}
    >
      {/* Trigger / Input */}
      <div
        className={cn(
          "flex w-fit items-center gap-1 rounded-lg border border-input bg-transparent text-sm transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          "hover:border-ring/50 hover:bg-muted/30",
          disabled && "pointer-events-none opacity-50",
          isOpen && "border-ring ring-3 ring-ring/50",
        )}
      >
        {/* Chips for multi mode */}
        {isMultiple && selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-1 py-1 pl-2">
            {selectedItems.map((item) => (
              <span
                key={item.value}
                className="flex items-center gap-0.5 rounded-sm bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
              >
                {item.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item);
                  }}
                  className="ml-0.5 rounded-sm opacity-50 hover:opacity-100"
                  aria-label={`Remove ${item.label}`}
                >
                  <XIcon className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          {...getInputProps(
            getDropdownProps({
              disabled,
              placeholder:
                isMultiple && selectedItems.length > 0
                  ? undefined
                  : displayLabel || placeholder,
            }),
          )}
          className={cn(
            "h-8 min-w-[80px] flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground",
            isMultiple && selectedItems.length > 0 && "pl-1",
          )}
        />

        <button
          {...getToggleButtonProps({ disabled })}
          type="button"
          aria-label="toggle menu"
          className="flex items-center px-2"
        >
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Dropdown */}
      <ul
        {...getMenuProps()}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full min-w-[var(--trigger-width)] overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
          !isOpen && "hidden",
        )}
        style={
          {
            "--trigger-width": triggerWidth ? `${triggerWidth}px` : "auto",
          } as React.CSSProperties
        }
      >
        {isOpen &&
          (filteredOptions.length === 0 ? (
            <li className="flex w-full justify-center py-2 text-center text-sm text-muted-foreground">
              No matches
            </li>
          ) : (
            filteredOptions.map((option, index) => {
              const selected = isSelected(option.value);
              return (
                <li
                  key={option.value}
                  {...getItemProps({
                    item: option,
                    index,
                    disabled: option.disabled,
                  })}
                  data-highlighted={highlightedIndex === index || undefined}
                  data-selected={selected || undefined}
                  className={cn(
                    "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none transition-colors duration-150",
                    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                    "data-disabled:pointer-events-none data-disabled:opacity-50",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                  )}
                >
                  {option.label}
                  {selected && (
                    <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                      <CheckIcon className="size-4" />
                    </span>
                  )}
                </li>
              );
            })
          ))}
      </ul>
    </div>
  );
}

export { MultiCombobox };
