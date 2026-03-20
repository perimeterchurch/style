import '@testing-library/jest-dom/vitest';

// Polyfill ResizeObserver for jsdom (required by @headlessui/react)
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    } as unknown as typeof globalThis.ResizeObserver;
}
