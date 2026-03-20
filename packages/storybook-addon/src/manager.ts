import React from 'react';
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, TOKEN_EDITOR_PANEL_ID } from './constants';
import { TokenEditor } from './panels/TokenEditor';

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
});
