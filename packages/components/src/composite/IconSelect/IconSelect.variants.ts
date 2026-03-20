/**
 * IconSelect variant classes
 */

export const iconSelectButtonClasses = [
    'flex h-10 items-center gap-2 rounded-lg border px-3 py-2',
    'bg-[var(--color-background)] text-sm',
    'transition-colors duration-200',
    'border-[var(--color-input)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/50 focus-visible:ring-offset-2',
    'focus-visible:border-[var(--color-ring)]',
].join(' ');

export const iconSelectPopoverClasses = [
    'absolute left-0 top-full z-[var(--z-dropdown,1000)] mt-1 w-full origin-top',
    'rounded-lg bg-[var(--color-popover)] shadow-lg ring-1 ring-[var(--color-border)]',
    'focus:outline-none',
    'py-1',
    'transition duration-200',
    'data-[closed]:scale-95 data-[closed]:opacity-0',
].join(' ');

export const iconSelectOptionClasses = [
    'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
    'transition-colors duration-150',
    'text-[var(--color-popover-foreground)]',
    'data-[focus]:bg-[var(--color-accent)] data-[focus]:text-[var(--color-accent-foreground)]',
].join(' ');
