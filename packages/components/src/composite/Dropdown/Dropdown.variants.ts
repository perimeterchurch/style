/**
 * Dropdown variant classes
 */

export const dropdownMenuClasses = [
    'z-[var(--z-dropdown,1000)]',
    '[--anchor-gap:8px] w-56 origin-top-right',
    'rounded-lg bg-[var(--color-popover)] text-[var(--color-popover-foreground)] shadow-lg ring-1 ring-[var(--color-border)]',
    'focus:outline-none',
    'transition duration-200',
    'data-[closed]:scale-95 data-[closed]:opacity-0',
].join(' ');

export const dropdownItemBaseClasses = [
    'group flex w-full items-center px-4 py-2 text-sm',
    'transition-colors duration-150',
].join(' ');

export const dropdownItemFocusClasses =
    'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]';

export const dropdownItemDisabledClasses = 'cursor-not-allowed opacity-50';

export const dropdownItemNormalClasses = 'text-[var(--color-popover-foreground)]';

export const dropdownItemDestructiveClasses = 'text-[var(--color-error)]';
