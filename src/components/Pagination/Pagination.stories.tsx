import type { Meta, StoryObj } from '@storybook/react';
import { HansPagination } from './Pagination';
import DocsPage from './Pagination.mdx';

const meta: Meta<typeof HansPagination> = {
  title: 'Components/Pagination',
  component: HansPagination,
  parameters: {
    docs: { page: DocsPage },
  },
  args: {
    currentPage: 2,
    totalPages: 5,
    ariaLabel: 'Pagination',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    pageLabel: 'Page',
    paginationColor: 'primary',
    paginationSize: 'medium',
    activePageVariant: 'default',
    inactivePageVariant: 'outline',
  },
};

export default meta;
type Story = StoryObj<typeof HansPagination>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansPagination currentPage={2} totalPages={5} paginationSize="small" />
      <HansPagination currentPage={2} totalPages={5} paginationSize="medium" />
      <HansPagination currentPage={2} totalPages={5} paginationSize="large" />
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansPagination
        currentPage={2}
        totalPages={5}
        paginationColor="primary"
      />
      <HansPagination
        currentPage={3}
        totalPages={6}
        paginationColor="secondary"
        activePageVariant="strong"
        inactivePageVariant="transparent"
      />
      <HansPagination
        currentPage={1}
        totalPages={4}
        paginationColor="success"
        inactivePageVariant="outline"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => <HansPagination currentPage={3} totalPages={5} disabled />,
};
