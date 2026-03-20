# Component Patterns

## Simple API Pattern

The simple API is a single component with all configuration via props. This is the default way to use every component.

```tsx
<Button variant="primary" size="md" outline disabled>
    Submit
</Button>
```

Implementation pattern:

```tsx
const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
    ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
        const variantDef = myVariants[variant];
        const sizeDef = mySizes[size];

        return (
            <div
                ref={ref}
                className={cn(
                    'base-classes',
                    resolveVariant(variantDef),
                    sizeDef.padding,
                    sizeDef.fontSize,
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        );
    },
);

MyComponent.displayName = 'MyComponent';
```

Key rules:

- Always `forwardRef`
- Default variant and size in destructuring
- `cn()` for class merging (last arg is `className` for consumer overrides)
- `resolveVariant()` for variant classes
- Set `displayName`

## Compound API Pattern

The compound API provides sub-components for full layout control. It uses React Context to share state.

### Context Setup

```tsx
interface MyContextValue {
    variant: MyVariant;
    size: MySize;
}

const MyContext = createContext<MyContextValue>({
    variant: 'primary',
    size: 'md',
});
```

### Root Component

The Root provides context to children:

```tsx
function MyRoot({ variant = 'primary', size = 'md', children, ...props }: MyRootProps) {
    return (
        <MyContext.Provider value={{ variant, size }}>
            <div className={cn('root-classes')} {...props}>
                {children}
            </div>
        </MyContext.Provider>
    );
}

MyRoot.displayName = 'My.Root';
```

### Sub-Components

Sub-components consume context:

```tsx
function MyLabel({ children, className }: { children: ReactNode; className?: string }) {
    const { size } = useContext(MyContext);
    return <span className={cn(mySizes[size].fontSize, className)}>{children}</span>;
}

MyLabel.displayName = 'My.Label';
```

### Object.assign Assembly

Combine simple and compound into a single export:

```tsx
export const My = Object.assign(SimpleComponent, {
    Root: MyRoot,
    Label: MyLabel,
    Icon: MyIcon,
});
```

### Usage

```tsx
// Simple
<My variant="primary">Label text</My>

// Compound
<My.Root variant="primary">
    <My.Icon><SearchIcon /></My.Icon>
    <My.Label>Label text</My.Label>
</My.Root>
```

## When to Use Compound API

Add a compound API when:

- The component has multiple visual sections (Card: Header, Body, Footer)
- Users need to insert icons or badges in specific positions (Button: Icon, Label)
- The component has multiple interactive regions (Tabs: List, Tab, Panels, Panel)
- An input has addons or decorations (Input: Root, Addon)

Do NOT add a compound API when:

- The component is a simple leaf element (Badge, Label, Skeleton)
- There is no meaningful sub-structure to expose

## Existing Components with Compound API

| Component | Sub-Parts                                |
| --------- | ---------------------------------------- |
| `Button`  | `Root`, `Icon`, `Label`                  |
| `Card`    | `Header`, `Body`, `Footer`               |
| `Input`   | `Root`, `Addon`                          |
| `Select`  | `Root`, `Option`                         |
| `Tabs`    | `Root`, `List`, `Tab`, `Panels`, `Panel` |

## Token-Driven Styling

Always reference semantic tokens via CSS custom properties:

```
bg-[var(--color-primary)]       // Good — respects themes
text-[var(--color-foreground)]  // Good — respects themes
bg-indigo-500                   // Bad — hardcoded, ignores themes
```

Exception: The `secondary` and `ghost` variants use Tailwind's `stone-*` scale directly because they need fine-grained shade control that semantic tokens don't provide. They include explicit `dark:` variants for dark mode support.

## Accessibility Checklist

- Set appropriate ARIA roles (`role="alert"`, `role="tab"`, etc.)
- Use `aria-label` prop for icon-only buttons
- Use `aria-disabled` alongside `disabled` attribute
- Use `aria-busy` for loading states
- Use `aria-selected` for selectable items (tabs)
- Keyboard navigation for interactive components (arrow keys for tabs)
- Focus management via `focus-visible:` classes (not `focus:`)
