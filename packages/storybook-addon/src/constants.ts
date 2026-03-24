export const ADDON_ID = 'perimeterchurch/style-addon';
export const TOKEN_EDITOR_PANEL_ID = `${ADDON_ID}/token-editor`;
export const THEME_EDITOR_PANEL_ID = `${ADDON_ID}/theme-editor`;
export const VARIANT_CREATOR_PANEL_ID = `${ADDON_ID}/variant-creator`;

// Channel events
export const EVENTS = {
    TOKEN_CHANGED: `${ADDON_ID}/token-changed`,
    TOKENS_RESET: `${ADDON_ID}/tokens-reset`,
    THEME_CHANGED: `${ADDON_ID}/theme-changed`,
} as const;
