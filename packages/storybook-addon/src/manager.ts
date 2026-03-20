import * as React from 'react';
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, TOKEN_EDITOR_PANEL_ID, VARIANT_CREATOR_PANEL_ID } from './constants.ts';
import { TokenEditor } from './panels/TokenEditor/index.ts';
import { VariantCreator } from './panels/VariantCreator/index.ts';

addons.register(ADDON_ID, (api) => {
    const channel = api.getChannel();

    addons.add(TOKEN_EDITOR_PANEL_ID, {
        type: types.PANEL,
        title: 'Token Editor',
        render: ({ active }) => {
            if (!active) return null;
            return React.createElement(TokenEditor, { channel });
        },
    });

    addons.add(VARIANT_CREATOR_PANEL_ID, {
        type: types.PANEL,
        title: 'Variant Creator',
        render: ({ active }) => React.createElement(VariantCreator, { active: active ?? false }),
    });
});
