/**
 * MultiIconSelect variant classes
 */

export const multiIconSelectButtonClasses = [
    'flex h-10 items-center gap-2 rounded-lg border px-3 py-2',
    'bg-[var(--color-background)] text-sm',
    'transition-colors duration-200',
    'border-[var(--color-input)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/50 focus-visible:ring-offset-2',
    'focus-visible:border-[var(--color-ring)]',
].join(' ');

export const multiIconSelectPopoverClasses = [
    'z-[var(--z-dropdown,1000)]',
    'w-[var(--button-width)] origin-top',
    'rounded-lg bg-[var(--color-popover)] shadow-lg ring-1 ring-[var(--color-border)]',
    'focus:outline-none',
    'py-1',
    'transition duration-200',
    'data-[closed]:scale-95 data-[closed]:opacity-0',
].join(' ');

export const multiIconSelectOptionClasses = [
    'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
    'transition-colors duration-150',
    'text-[var(--color-popover-foreground)]',
    'data-[focus]:bg-[var(--color-accent)] data-[focus]:text-[var(--color-accent-foreground)]',
].join(' ');

export const multiIconSelectPresetClasses = [
    'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm',
    'transition-colors duration-150',
    'text-[var(--color-popover-foreground)]',
    'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
].join(' ');
