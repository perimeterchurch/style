/**
 * DateRangePicker variant classes
 */

export const dateRangePickerWrapperClasses = 'flex items-center gap-2';

export const dateRangePickerInputClasses = [
    'h-9 rounded-lg border px-3 text-sm',
    'bg-[var(--color-background)]',
    'border-[var(--color-input)]',
    'text-[var(--color-foreground)]',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50',
    'focus-visible:border-[var(--color-primary)]',
].join(' ');

export const dateRangePickerSeparatorClasses =
    'text-sm text-[var(--color-text-muted)]';

export const dateRangePickerIconClasses =
    'pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]';
