/**
 * ComboSelect variant classes
 */

export const comboSelectInputClasses = [
    'h-10 w-full rounded-lg border text-sm',
    'bg-[var(--color-background)]',
    'transition-colors duration-200',
    'border-[var(--color-input)]',
    'text-[var(--color-foreground)]',
    'placeholder:text-[var(--color-text-muted)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/50 focus:ring-offset-2',
    'focus:border-[var(--color-ring)]',
].join(' ');

export const comboSelectOptionClasses = [
    'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm',
    'transition-colors duration-150',
    'text-[var(--color-popover-foreground)]',
    'data-[focus]:bg-[var(--color-accent)] data-[focus]:text-[var(--color-accent-foreground)]',
].join(' ');

export const comboSelectPopoverClasses = [
    'absolute left-0 top-full z-[var(--z-dropdown,1000)] mt-1 w-full origin-top',
    'max-h-60 overflow-y-auto',
    'rounded-lg bg-[var(--color-popover)] shadow-lg ring-1 ring-[var(--color-border)]',
    'focus:outline-none',
    'py-1',
    'transition duration-200',
    'data-[closed]:scale-95 data-[closed]:opacity-0',
].join(' ');
