# Component Catalog

Complete reference for every component in the system.

## Primitives (`@perimeterchurch/style/components`)

Peer deps: `react@^19`

---

### Button

**File**: `packages/components/src/primitives/Button/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ButtonVariant` | `'primary'` | Visual style |
| `size` | `ButtonSize` | `'md'` | Size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `outline` | `boolean` | `false` | Border-only appearance |
| `fullWidth` | `boolean` | `false` | Expand to full width |
| `disabled` | `boolean` | `false` | Disable interaction |
| `isLoading` | `boolean` | `false` | Show spinner, disable |

**Variants**: `primary`, `secondary`, `success`, `warning`, `error`, `info`, `ghost`
**Sizes**: `xs`, `sm`, `md`, `lg`, `xl`
**Compound**: `Button.Root`, `Button.Icon`, `Button.Label`

---

### Card

**File**: `packages/components/src/primitives/Card/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `CardVariant` | `'default'` | Visual style |
| `hoverable` | `boolean` | `false` | Shadow + lift on hover |

**Variants**: `default`
**Compound**: `Card.Header`, `Card.Body`, `Card.Footer`

---

### Badge

**File**: `packages/components/src/primitives/Badge/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `BadgeVariant` | — | Visual style |
| `size` | `BadgeSize` | — | Size |

**Variants**: Record-keyed from `badgeVariants`
**Sizes**: Record-keyed from `badgeSizes`

---

### Input

**File**: `packages/components/src/primitives/Input/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `InputSize` | — | Size |

**Sizes**: Record-keyed from `inputSizes`
**Compound**: `Input.Root`, `Input.Addon`

---

### Label

**File**: `packages/components/src/primitives/Label/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `LabelVariant` | — | Visual style |

**Variants**: Record-keyed from `labelVariants`

---

### Select

**File**: `packages/components/src/primitives/Select/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `SelectSize` | — | Size |
| `options` | `SelectOption[]` | — | Available options |

**Sizes**: Record-keyed from `selectSizes`
**Compound**: `Select.Root`, `Select.Option`

---

### Textarea

**File**: `packages/components/src/primitives/Textarea/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `TextareaSize` | — | Size |

**Sizes**: Record-keyed from `textareaSizes`

---

### Checkbox

**File**: `packages/components/src/primitives/Checkbox/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `CheckboxSize` | — | Size |

**Sizes**: Record-keyed from `checkboxSizes`

---

### Switch

**File**: `packages/components/src/primitives/Switch/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `SwitchSize` | — | Size |

**Sizes**: Record-keyed from `switchSizes`

---

### Avatar

**File**: `packages/components/src/primitives/Avatar/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `AvatarSize` | — | Size |

**Sizes**: Record-keyed from `avatarSizes`

---

### Skeleton

**File**: `packages/components/src/primitives/Skeleton/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `SkeletonVariant` | — | Shape variant |

**Variants**: Record-keyed from `skeletonVariants`

---

### LoadingSpinner

**File**: `packages/components/src/primitives/LoadingSpinner/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `SpinnerSize` | — | Size |

**Sizes**: Record-keyed from `spinnerSizes`

---

### FilterChip

**File**: `packages/components/src/primitives/FilterChip/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ChipVariant` | — | Visual style |
| `size` | `ChipSize` | — | Size |

**Variants**: Record-keyed from `chipVariants`
**Sizes**: Record-keyed from `chipSizes`

---

### EmptyState

**File**: `packages/components/src/primitives/EmptyState/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `EmptyStateVariant` | — | Visual style |

**Variants**: Record-keyed from `emptyStateVariants`

---

### IndeterminateProgress

**File**: `packages/components/src/primitives/IndeterminateProgress/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ProgressVariant` | — | Color variant |

**Variants**: Record-keyed from `progressVariants`

---

### SearchInput

**File**: `packages/components/src/primitives/SearchInput/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `SearchInputVariant` | — | Visual style |

**Variants**: Record-keyed from `searchInputVariants`

---

## Composites (`@perimeterchurch/style/composite`)

Peer deps: `react@^19`, `@headlessui/react@^2`

---

### ComboSelect

**File**: `packages/components/src/composite/ComboSelect/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `ComboSelectOption[]` | — | Searchable options |
| `value` | `string` | — | Selected value |
| `onChange` | `(value: string) => void` | — | Change handler |

Uses Headless UI `Combobox` internally.

---

### Dropdown

**File**: `packages/components/src/composite/Dropdown/`

| Export | Description |
| --- | --- |
| `Dropdown` | Menu trigger + popover |
| `DropdownItem` | Menu item |
| `DropdownDivider` | Visual separator |

Uses Headless UI `Menu` internally.

---

### IconSelect

**File**: `packages/components/src/composite/IconSelect/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `IconSelectOption[]` | — | Options with icons |

Uses Headless UI `Listbox` internally.

---

### MultiIconSelect

**File**: `packages/components/src/composite/MultiIconSelect/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `presets` | `MultiIconSelectPreset[]` | — | Preset options |

Multi-select variant of IconSelect.

---

### Tabs

**File**: `packages/components/src/composite/Tabs/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `Tab[]` | — | Tab definitions |
| `activeTab` | `string` | — | Active tab ID |
| `onChange` | `(tabId: string) => void` | — | Tab change handler |

**Compound**: `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panels`, `Tabs.Panel`

Keyboard navigation: ArrowLeft/ArrowRight cycles through enabled tabs.

---

### Pagination

**File**: `packages/components/src/composite/Pagination/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| Standard pagination props | — | — | Page navigation |

---

### DateRangePicker

**File**: `packages/components/src/composite/DateRangePicker/`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| Standard date range props | — | — | Date range selection |

---

## Motion (`@perimeterchurch/style/motion`)

Peer deps: `react@^19`, `framer-motion@^11`

### Components

| Component | Props Interface | Description |
| --- | --- | --- |
| `FadeIn` | `FadeInProps` | Fade in on mount |
| `SlideUp` | `SlideUpProps` | Slide up + fade in |
| `ScaleIn` | `ScaleInProps` | Scale in + fade |
| `AnimatedList` | `AnimatedListProps` | Staggered list animation |
| `AnimatedPanel` | `AnimatedPanelProps` | Slide-in panel |
| `CountUp` | `CountUpProps` | Animated number counter |
| `SkeletonTransition` | `SkeletonTransitionProps` | Skeleton-to-content transition |

### Config Presets

| Export | Type | Description |
| --- | --- | --- |
| `springs` | Object | `snappy`, `gentle`, `bouncy` spring configs |
| `durations` | Object | `fast` (0.15s), `base` (0.2s), `slow` (0.3s), `entrance` (0.4s) |
| `easings` | Object | `easeOut`, `easeInOut` cubic-bezier arrays |
| `staggers` | Object | `fast` (0.03s), `base` (0.05s), `slow` (0.08s) |
| `transitions` | Object | Combined presets: `fast`, `base`, `slow`, `entrance`, `snappy`, `gentle`, `bouncy` |
| `fadeVariants` | Variants | `hidden`/`visible`/`exit` for opacity |
| `slideUpVariants` | Variants | Opacity + y:6 slide |
| `slideDownVariants` | Variants | Opacity + y:-6 slide |
| `scaleInVariants` | Variants | Opacity + scale:0.97 |
| `slideRightVariants` | Variants | x:100% slide |
| `slideLeftVariants` | Variants | x:-100% slide |
| `pageSlideVariants` | Variants | Directional page slide (custom=1/-1) |
| `modalBackdropVariants` | Variants | Modal overlay fade |
| `modalPanelVariants` | Variants | Modal panel scale+slide |
| `staggerContainer` | Function | Creates stagger parent variant |
| `staggerItemVariants` | Variants | Stagger child item variant |

---

## Icons (`@perimeterchurch/style/icons`)

Peer deps: `react@^19`, `lucide-react@^0.400`

### Icon Component

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `IconName` | — | Registry key |
| `size` | `number` | `16` | Width/height in px |
| + all SVG props | — | — | Forwarded to SVG |

### Functions

| Function | Description |
| --- | --- |
| `getIcon(name)` | Look up icon component by name |
| `registerIcon(name, component)` | Register a custom SVG icon |
| `getIconNames()` | Get all registered icon names |
