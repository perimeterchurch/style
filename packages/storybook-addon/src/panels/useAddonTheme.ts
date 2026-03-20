import { useTheme, convert, themes } from 'storybook/theming';
import type { StorybookTheme } from 'storybook/theming';

/**
 * Safely access the current Storybook theme.
 *
 * Falls back to the converted light theme when no ThemeProvider is present
 * (e.g. in unit tests rendered outside Storybook's manager).
 */
export function useAddonTheme(): StorybookTheme {
    try {
        const theme = useTheme() as StorybookTheme;
        // useTheme returns {} when no provider exists — detect that case
        if (theme && 'appBorderColor' in theme) return theme;
        return convert(themes.light);
    } catch {
        return convert(themes.light);
    }
}
