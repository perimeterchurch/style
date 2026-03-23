import * as React from 'react';
import { IconButton } from 'storybook/internal/components';
import { resetDismissedHints } from './HintText.tsx';

export interface HelpToggleProps {
    onReset: () => void;
}

export function HelpToggle({ onReset }: HelpToggleProps) {
    function handleClick() {
        resetDismissedHints();
        onReset();
    }

    return (
        <IconButton
            onClick={handleClick}
            title="Show hints and help text"
            aria-label="Show hints"
        >
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>?</span>
        </IconButton>
    );
}
