// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
        },
        settings: {
            react: { version: 'detect' },
        },
    },
    {
        files: [
            '**/*.test.{ts,tsx}',
            '**/*.stories.{ts,tsx}',
            '**/test-setup.ts',
            '**/test-types.d.ts',
        ],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    prettier,
    {
        ignores: ['dist/', 'node_modules/', 'storybook-static/', '.turbo/'],
    },
    storybook.configs['flat/recommended'],
);
