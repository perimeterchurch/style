import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from './index';
import { selectSizeClass } from './Select.variants';

const testOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
];

describe('Select', () => {
    it('renders with default props', () => {
        render(<Select options={testOptions} data-testid="select" />);
        expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(selectSizeClass)) {
            const { unmount } = render(
                <Select
                    size={size as keyof typeof selectSizeClass}
                    options={testOptions}
                    data-testid="select"
                />,
            );
            expect(screen.getByTestId('select')).toBeInTheDocument();
            unmount();
        }
    });

    it('renders options from options prop', () => {
        render(<Select options={testOptions} />);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('renders children when no options prop', () => {
        render(
            <Select>
                <option value="a">Alpha</option>
                <option value="b">Beta</option>
            </Select>,
        );
        expect(screen.getByText('Alpha')).toBeInTheDocument();
    });

    it('shows error state via aria-invalid', () => {
        render(<Select error options={testOptions} data-testid="select" />);
        expect(screen.getByTestId('select')).toHaveAttribute('aria-invalid', 'true');
    });

    it('disables the select', () => {
        render(<Select disabled options={testOptions} data-testid="select" />);
        expect(screen.getByTestId('select')).toBeDisabled();
    });
});

describe('Select Compound API', () => {
    it('renders Root and Field', () => {
        render(
            <Select.Root>
                <Select.Field options={testOptions} data-testid="field" />
            </Select.Root>,
        );
        expect(screen.getByTestId('field')).toBeInTheDocument();
    });

    it('Field inherits context error state', () => {
        render(
            <Select.Root error>
                <Select.Field options={testOptions} data-testid="field" />
            </Select.Root>,
        );
        expect(screen.getByTestId('field')).toHaveAttribute('aria-invalid', 'true');
    });

    it('Field inherits disabled from Root', () => {
        render(
            <Select.Root disabled>
                <Select.Field options={testOptions} data-testid="field" />
            </Select.Root>,
        );
        expect(screen.getByTestId('field')).toBeDisabled();
    });
});
