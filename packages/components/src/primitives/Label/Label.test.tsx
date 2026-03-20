import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './index';

describe('Label', () => {
    it('renders with default props', () => {
        render(<Label>Email</Label>);
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders required indicator', () => {
        render(<Label required>Email</Label>);
        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByText('(required)')).toBeInTheDocument();
    });

    it('hides asterisk from screen readers', () => {
        render(<Label required>Email</Label>);
        const asterisk = screen.getByText('*');
        expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });

    it('applies disabled styles', () => {
        render(
            <Label disabled data-testid="label">
                Disabled
            </Label>,
        );
        expect(screen.getByTestId('label').className).toContain('opacity-70');
    });

    it('associates with input via htmlFor', () => {
        render(<Label htmlFor="email-input">Email</Label>);
        expect(screen.getByText('Email')).toHaveAttribute('for', 'email-input');
    });

    it('merges custom className', () => {
        render(
            <Label className="custom" data-testid="label">
                Label
            </Label>,
        );
        expect(screen.getByTestId('label').className).toContain('custom');
    });
});
