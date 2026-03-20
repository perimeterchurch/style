/**
 * Pagination variant classes
 */

export const paginationNavClasses = 'flex items-center justify-center gap-1';

export const paginationButtonBaseClasses = [
    'flex items-center justify-center rounded-md text-sm font-medium transition-colors',
    'h-8 min-w-8 px-2',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50',
].join(' ');

export const paginationButtonDefaultClasses = [
    'border border-[var(--color-border)]',
    'hover:bg-[var(--color-accent)]',
].join(' ');

export const paginationButtonActiveClasses =
    'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]';

export const paginationButtonDisabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

export const paginationEllipsisClasses = 'px-1 text-sm text-[var(--color-text-muted)]';
