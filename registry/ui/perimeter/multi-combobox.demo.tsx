"use client";

import { useState } from "react";
import { MultiCombobox, type MultiComboboxOption } from "./multi-combobox";

const fruits: MultiComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
  { value: "strawberry", label: "Strawberry" },
];

export default function MultiComboboxDemo() {
  const [singleValue, setSingleValue] = useState<string | null>(null);
  const [multipleValues, setMultipleValues] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium">Single select</p>
        <MultiCombobox
          options={fruits}
          value={singleValue}
          onValueChange={setSingleValue}
          placeholder="Pick a fruit..."
        />
        <p className="text-xs text-muted-foreground">
          Selected: {singleValue ?? "none"}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Multiple select</p>
        <MultiCombobox
          options={fruits}
          value={multipleValues}
          onValueChange={setMultipleValues}
          placeholder="Pick fruits..."
          multiple
        />
        <p className="text-xs text-muted-foreground">
          Selected:{" "}
          {multipleValues.length > 0 ? multipleValues.join(", ") : "none"}
        </p>
      </div>
    </div>
  );
}

export const controls = {};

export const meta = {
  name: "MultiCombobox",
  description:
    "Searchable dropdown with single or multiple selection. Uses Downshift for shadow DOM compatibility.",
  category: "inputs",
  install: "pnpm dlx shadcn@latest add @perimeter/multi-combobox",
};
