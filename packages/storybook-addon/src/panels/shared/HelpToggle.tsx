import * as React from 'react';
import { Button } from 'storybook/internal/components';
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
        <Button
            onClick={handleClick}
            title="Show hints and help text"
            ariaLabel="Show hints and help text"
            variant="ghost"
            size="small"
        >
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>?</span>
        </Button>
    );
}
