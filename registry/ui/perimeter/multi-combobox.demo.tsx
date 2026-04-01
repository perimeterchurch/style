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
  return (
    <MultiCombobox
      options={fruits}
      placeholder={props.placeholder}
      disabled={props.disabled}
      multiple={props.multiple as true | undefined}
    />
  );
}

const disabledStatuses: MultiComboboxOption[] = [
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy", disabled: true },
  { value: "away", label: "Away" },
  { value: "offline", label: "Offline", disabled: true },
];

export const examples = [
  {
    name: "Single Select",
    render: () => (
      <MultiCombobox options={fruits} placeholder="Pick a fruit..." />
    ),
  },
  {
    name: "Multiple Select with Chips",
    render: () => (
      <MultiCombobox
        options={fruits}
        defaultValue={["apple", "cherry"]}
        placeholder="Pick fruits..."
        multiple
      />
    ),
  },
  {
    name: "With Disabled Options",
    render: () => (
      <MultiCombobox options={disabledStatuses} placeholder="Set status..." />
    ),
  },
  {
    name: "Disabled Combobox",
    render: () => (
      <MultiCombobox options={fruits} placeholder="Disabled..." disabled />
    ),
  },
];
