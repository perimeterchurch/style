import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IndeterminateProgress } from './index';

describe('IndeterminateProgress', () => {
    it('renders when visible is true', () => {
        render(<IndeterminateProgress visible />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('applies base indeterminate-progress class', () => {
        render(<IndeterminateProgress visible />);
        expect(screen.getByRole('progressbar')).toHaveClass('indeterminate-progress');
    });

    it('does not render when visible is false', () => {
        render(<IndeterminateProgress visible={false} />);
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('has correct aria-label', () => {
        render(<IndeterminateProgress visible />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading');
    });

    it('merges custom className', () => {
        render(<IndeterminateProgress visible className="custom-progress" />);
        expect(screen.getByRole('progressbar').className).toContain('custom-progress');
    });

    it('contains animated bar element', () => {
        render(<IndeterminateProgress visible />);
        const bar = screen.getByRole('progressbar').firstElementChild;
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveClass('indeterminate-progress-bar');
    });
});
