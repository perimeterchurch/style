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
  multiple: {
    type: "boolean",
    default: false,
  },
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
  if (props.multiple) {
    return (
      <MultiPlayground
        placeholder={props.placeholder}
        disabled={props.disabled}
      />
    );
  }
  return (
    <SinglePlayground
      placeholder={props.placeholder}
      disabled={props.disabled}
    />
  );
}

function SinglePlayground({
  placeholder,
  disabled,
}: {
  placeholder: string;
  disabled: boolean;
}) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <MultiCombobox
      options={fruits}
      value={value}
      onValueChange={setValue}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

function MultiPlayground({
  placeholder,
  disabled,
}: {
  placeholder: string;
  disabled: boolean;
}) {
  const [values, setValues] = useState<string[]>([]);
  return (
    <MultiCombobox
      options={fruits}
      value={values}
      onValueChange={setValues}
      placeholder={placeholder}
      disabled={disabled}
      multiple
    />
  );
}

export const examples = [
  {
    name: "Single Select",
    render: () => <SingleSelectExample />,
  },
  {
    name: "Multiple Select with Chips",
    render: () => <MultiSelectExample />,
  },
  {
    name: "With Disabled Options",
    render: () => <DisabledOptionsExample />,
  },
  {
    name: "Disabled Combobox",
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
  const [values, setValues] = useState<string[]>(["apple", "cherry"]);
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

function DisabledOptionsExample() {
  const [value, setValue] = useState<string | null>(null);
  const statuses: MultiComboboxOption[] = [
    { value: "available", label: "Available" },
    { value: "busy", label: "Busy", disabled: true },
    { value: "away", label: "Away" },
    { value: "offline", label: "Offline", disabled: true },
  ];
  return (
    <MultiCombobox
      options={statuses}
      value={value}
      onValueChange={setValue}
      placeholder="Set status..."
    />
  );
}
