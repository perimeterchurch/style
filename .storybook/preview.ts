import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import React from 'react';
import '../packages/tokens/src/base.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        withThemeByDataAttribute({
            themes: {
                light: '',
                dark: 'dark',
            },
            defaultTheme: 'light',
            attributeName: 'data-theme',
            parentSelector: '.storybook-root',
        }),
        (Story) =>
            React.createElement(
                'div',
                { className: 'storybook-root', style: { padding: '1rem' } },
                React.createElement(Story),
            ),
    ],
};

export default preview;
