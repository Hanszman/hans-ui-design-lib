import type { Meta, StoryObj } from '@storybook/react';
import { HansIcon } from '../Icon/Icon';
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
    firstLabel: 'First',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    lastLabel: 'Last',
    pageLabel: 'Page',
    maxVisiblePages: 5,
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

export const IconControls: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <HansPagination
        currentPage={4}
        totalPages={5}
        firstContent="MdKeyboardDoubleArrowLeft"
        previousContent="MdKeyboardArrowLeft"
        nextContent="MdKeyboardArrowRight"
        lastContent="MdKeyboardDoubleArrowRight"
      />

      <HansPagination
        currentPage={5}
        totalPages={5}
        firstContent={<HansIcon name="MdFirstPage" iconSize="small" />}
        previousContent={<HansIcon name="MdChevronLeft" iconSize="small" />}
        nextContent={<HansIcon name="MdChevronRight" iconSize="small" />}
        lastContent={<HansIcon name="MdLastPage" iconSize="small" />}
        paginationColor="secondary"
        activePageVariant="strong"
      />

      <HansPagination
        currentPage={3}
        totalPages={5}
        firstContent={<span className="font-semibold">First</span>}
        previousContent={
          <span className="inline-flex items-center gap-1">
            <HansIcon name="MdArrowBack" iconSize="small" />
            <span>Prev</span>
          </span>
        }
        nextContent={
          <span className="inline-flex items-center gap-1">
            <span>Next</span>
            <HansIcon name="MdArrowForward" iconSize="small" />
          </span>
        }
        lastContent={<span className="font-semibold">Last</span>}
      />
    </div>
  ),
};

export const LongRanges: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <HansPagination currentPage={4} totalPages={13} maxVisiblePages={7} />

      <HansPagination
        currentPage={11}
        totalPages={24}
        maxVisiblePages={5}
        paginationColor="secondary"
        activePageVariant="strong"
      />
    </div>
  ),
};
