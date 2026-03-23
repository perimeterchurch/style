import * as React from 'react';
import { useState, useCallback } from 'react';
import { IconButton } from 'storybook/internal/components';
import { useAddonTheme } from '../useAddonTheme';

const STORAGE_KEY = 'style-addon-hints-dismissed';

function getDismissedHints(): Set<string> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
    } catch {
        return new Set();
    }
}

function dismissHint(hintId: string): void {
    const dismissed = getDismissedHints();
    dismissed.add(hintId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed]));
}

export function resetDismissedHints(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export interface HintTextProps {
    hintId: string;
    children: React.ReactNode;
    forceShow?: boolean;
}

export function HintText({ hintId, children, forceShow }: HintTextProps) {
    const theme = useAddonTheme();

    const [visible, setVisible] = useState(() => {
        if (forceShow) return true;
        return !getDismissedHints().has(hintId);
    });

    React.useEffect(() => {
        if (forceShow) setVisible(true);
    }, [forceShow]);

    const handleDismiss = useCallback(() => {
        dismissHint(hintId);
        setVisible(false);
    }, [hintId]);

    if (!visible) return null;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                color: theme.color.mediumdark,
                backgroundColor: theme.background.app,
            }}
        >
            <span>{children}</span>
            <IconButton
                onClick={handleDismiss}
                aria-label={`Dismiss hint: ${hintId}`}
            >
                <span style={{ fontSize: 14, lineHeight: 1 }}>x</span>
            </IconButton>
        </div>
    );
}
