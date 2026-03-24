import { addons } from 'storybook/preview-api';
import { EVENTS } from './constants.ts';

/** Applied style overrides, tracked so we can remove them on reset. */
const appliedOverrides = new Set<string>();

function setupTokenPreview() {
    const channel = addons.getChannel();

    channel.on(EVENTS.TOKEN_CHANGED, ({ name, value }: { name: string; value: string }) => {
        document.documentElement.style.setProperty(name, value);
        appliedOverrides.add(name);
    });

    channel.on(EVENTS.TOKENS_RESET, () => {
        for (const name of appliedOverrides) {
            document.documentElement.style.removeProperty(name);
        }
        appliedOverrides.clear();
    });

    channel.on(EVENTS.THEME_CHANGED, ({ theme }: { theme: string }) => {
        const root = document.querySelector('.storybook-root');
        if (root) {
            if (theme === 'light' || !theme) {
                root.removeAttribute('data-theme');
            } else {
                root.setAttribute('data-theme', theme);
            }
        }
    });
}

setupTokenPreview();
