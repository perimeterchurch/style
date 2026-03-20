/**
 * Tabs variant classes
 */

export const tabsListClasses = [
    'flex border-b border-[var(--color-border)]',
].join(' ');

export const tabButtonBaseClasses = [
    'relative px-4 py-2.5 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50',
].join(' ');

export const tabButtonActiveClasses = 'text-[var(--color-primary)]';

export const tabButtonInactiveClasses = 'text-[var(--color-text-muted)]';

export const tabButtonHoverClasses = 'hover:text-[var(--color-foreground)]';

export const tabButtonDisabledClasses = 'opacity-50 cursor-not-allowed';

export const tabIndicatorClasses =
    'absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]';
