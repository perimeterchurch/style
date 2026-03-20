import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { createStyleAddonMiddleware } from './server/middleware.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Storybook manager entries — registers the addon panels in the manager UI. */
export function managerEntries(entry: string[] = []) {
    return [...entry, join(__dirname, 'manager.ts')];
}

/** Preview annotations — loads the token live-preview channel listeners. */
export function previewAnnotations(entry: string[] = []) {
    return [...entry, join(__dirname, 'preview.ts')];
}

/** Vite config transform — injects the style addon API middleware. */
export function viteFinal(config: { plugins?: Plugin[] }, options: { configDir: string }) {
    config.plugins = config.plugins ?? [];

    // Resolve the monorepo root from the .storybook config directory
    const rootDir = dirname(options.configDir);

    config.plugins.push(createStyleAddonMiddleware(rootDir));
    return config;
}
