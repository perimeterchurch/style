import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './index';

const meta: Meta<typeof Pagination> = {
    title: 'Components/Composite/Pagination',
    component: Pagination,
    argTypes: {
        totalPages: { control: 'number' },
        maxButtons: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function PaginationDemo({ totalPages = 10, maxButtons = 7 }: { totalPages?: number; maxButtons?: number }) {
    const [page, setPage] = useState(1);
    return <Pagination page={page} totalPages={totalPages} onChange={setPage} maxButtons={maxButtons} />;
}

export const Default: Story = {
    render: () => <PaginationDemo />,
};

export const FewPages: Story = {
    render: () => <PaginationDemo totalPages={3} />,
};

export const ManyPages: Story = {
    render: () => <PaginationDemo totalPages={50} />,
};

export const CustomMaxButtons: Story = {
    render: () => <PaginationDemo totalPages={20} maxButtons={5} />,
};
