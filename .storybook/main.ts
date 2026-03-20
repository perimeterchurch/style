import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
    stories: [
        '../packages/components/src/**/*.stories.@(ts|tsx)',
        '../packages/motion/src/**/*.stories.@(ts|tsx)',
        '../packages/icons/src/**/*.stories.@(ts|tsx)',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    viteFinal(config) {
        config.plugins = config.plugins ?? [];
        config.plugins.push(tailwindcss());
        return config;
    },
};

export default config;
