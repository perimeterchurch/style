"use client";

import { useState } from "react";
import { MultiCombobox, type MultiComboboxOption } from "./multi-combobox";
import type { ControlsConfig, PlaygroundProps } from "@/lib/demo-types";

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

export const meta = {
  name: "MultiCombobox",
  description:
    "Searchable dropdown with single or multiple selection. Shadow DOM safe.",
  category: "inputs",
  install: "pnpm dlx shadcn@latest add @perimeter/multi-combobox",
};

export const controls = {
  placeholder: {
    type: "string",
    default: "Select a fruit...",
  },
  disabled: {
    type: "boolean",
    default: false,
  },
} satisfies ControlsConfig;

export function Playground(props: PlaygroundProps<typeof controls>) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <MultiCombobox
      options={fruits}
      value={value}
      onValueChange={setValue}
      placeholder={props.placeholder}
      disabled={props.disabled}
    />
  );
}

export const examples = [
  {
    name: "Single Select",
    render: () => <SingleSelectExample />,
  },
  {
    name: "Multiple Select",
    render: () => <MultiSelectExample />,
  },
  {
    name: "Disabled",
    render: () => (
      <MultiCombobox
        options={fruits}
        value={null}
        onValueChange={() => {}}
        placeholder="Disabled..."
        disabled
      />
    ),
  },
];

function SingleSelectExample() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <MultiCombobox
        options={fruits}
        value={value}
        onValueChange={setValue}
        placeholder="Pick a fruit..."
      />
      <p className="text-xs text-muted-foreground">
        Selected: {value ?? "none"}
      </p>
    </div>
  );
}

function MultiSelectExample() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <div className="space-y-2">
      <MultiCombobox
        options={fruits}
        value={values}
        onValueChange={setValues}
        placeholder="Pick fruits..."
        multiple
      />
      <p className="text-xs text-muted-foreground">
        Selected: {values.length > 0 ? values.join(", ") : "none"}
      </p>
    </div>
  );
}
