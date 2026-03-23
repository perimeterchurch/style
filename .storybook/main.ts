import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
    stories: [
        '../packages/components/src/**/*.stories.@(ts|tsx)',
        '../packages/motion/src/**/*.stories.@(ts|tsx)',
        '../packages/icons/src/**/*.stories.@(ts|tsx)',
    ],
    addons: [
        '@storybook/addon-themes',
        getAbsolutePath('../packages/storybook-addon/src/preset.ts'),
    ],
    framework: {
        name: getAbsolutePath('@storybook/react-vite'),
        options: {},
    },
    viteFinal(config) {
        config.plugins = config.plugins ?? [];
        config.plugins.push(tailwindcss());
        return config;
    },
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
