import * as React from 'react';
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, THEME_EDITOR_PANEL_ID, VARIANT_CREATOR_PANEL_ID } from './constants.ts';
import { ThemeEditor } from './panels/ThemeEditor/index.ts';
import { VariantCreator } from './panels/VariantCreator/index.ts';
import { ThemeSwitcher } from './toolbar/ThemeSwitcher.tsx';

addons.register(ADDON_ID, (api) => {
    const channel = api.getChannel();

    addons.add(`${ADDON_ID}/theme-switcher`, {
        type: types.TOOL,
        title: 'Theme',
        render: () => React.createElement(ThemeSwitcher),
    });

    addons.add(THEME_EDITOR_PANEL_ID, {
        type: types.PANEL,
        title: 'Theme Editor',
        render: ({ active }) => {
            if (!active) return null;
            return React.createElement(ThemeEditor, { channel });
        },
    });
});
