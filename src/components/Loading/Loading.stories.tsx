import type { Meta, StoryObj } from '@storybook/react';
import { HansLoading } from './Loading';
import DocsPage from './Loading.mdx';
import type { Color, Size } from '../../types/Common.types';

const meta: Meta<typeof HansLoading> = {
  title: 'Components/Loading',
  component: HansLoading,
  args: {
    loadingType: 'spinner',
    loadingSize: 'medium',
    loadingColor: 'base',
    ariaLabel: 'Loading',
  },
  argTypes: {
    loadingType: { control: 'select', options: ['spinner', 'skeleton'] },
    loadingSize: { control: 'select', options: ['small', 'medium', 'large'] },
    loadingColor: {
      control: 'select',
      options: ['base', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'],
    },
    rounded: { control: 'boolean' },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansLoading>;

export const Primary: Story = {};

export const SpinnerSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['small', 'medium', 'large'] as Size[]).map((size) => (
        <HansLoading key={size} loadingType="spinner" loadingSize={size} />
      ))}
    </div>
  ),
};

export const SpinnerColors: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      {(['base', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'] as Color[]).map(
        (color) => (
          <HansLoading
            key={color}
            loadingType="spinner"
            loadingColor={color}
            ariaLabel={`Loading ${color}`}
          />
        ),
      )}
    </div>
  ),
};

export const SkeletonVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-[420px]">
      <HansLoading loadingType="skeleton" skeletonWidth="100%" skeletonHeight={18} />
      <HansLoading loadingType="skeleton" skeletonWidth="70%" skeletonHeight={18} />
      <HansLoading loadingType="skeleton" skeletonWidth={80} skeletonHeight={80} />
      <HansLoading
        loadingType="skeleton"
        loadingColor="primary"
        skeletonWidth="100%"
        skeletonHeight={44}
        rounded={false}
      />
    </div>
  ),
};

export const FullAreaSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-[520px] h-[180px] border border-[var(--gray-300)] rounded-lg p-3">
      <HansLoading loadingType="skeleton" skeletonWidth="100%" skeletonHeight="100%" />
    </div>
  ),
};
