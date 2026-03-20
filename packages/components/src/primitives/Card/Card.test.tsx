import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './index';

describe('Card', () => {
    it('renders with default props', () => {
        render(<Card data-testid="card">Content</Card>);
        expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('renders compound subcomponents', () => {
        render(
            <Card>
                <Card.Header data-testid="header">Header</Card.Header>
                <Card.Body data-testid="body">Body</Card.Body>
                <Card.Footer data-testid="footer">Footer</Card.Footer>
            </Card>,
        );
        expect(screen.getByTestId('header')).toHaveTextContent('Header');
        expect(screen.getByTestId('body')).toHaveTextContent('Body');
        expect(screen.getByTestId('footer')).toHaveTextContent('Footer');
    });

    it('applies hover effect when hoverable', () => {
        render(
            <Card hoverable data-testid="card">
                Hoverable
            </Card>,
        );
        expect(screen.getByTestId('card').className).toContain('hover:shadow-md');
    });

    it('merges custom className', () => {
        render(
            <Card className="custom-class" data-testid="card">
                Content
            </Card>,
        );
        expect(screen.getByTestId('card').className).toContain('custom-class');
    });
});
