export const ADDON_ID = 'perimeterchurch/style-addon';
export const TOKEN_EDITOR_PANEL_ID = `${ADDON_ID}/token-editor`;
/** @deprecated Panel UI removed — kept for middleware path resolution */
export const VARIANT_CREATOR_PANEL_ID = `${ADDON_ID}/variant-creator`;

// Channel events
export const EVENTS = {
    TOKEN_CHANGED: `${ADDON_ID}/token-changed`,
    TOKENS_RESET: `${ADDON_ID}/tokens-reset`,
} as const;
