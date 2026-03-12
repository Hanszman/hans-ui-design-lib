import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { Color, Size, Variant } from '../../types/Common.types';
import { HansButton } from '../Forms/Button/Button';
import { HansToast } from './Toast';
import DocsPage from './Toast.mdx';

const positions = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
] as const;

const meta: Meta<typeof HansToast> = {
  title: 'Components/Toast',
  component: HansToast,
  args: {
    title: 'Changes saved',
    message: 'Everything was stored successfully.',
    toastColor: 'success',
    toastVariant: 'neutral',
    toastSize: 'medium',
    position: 'top-right',
    duration: 4000,
    dismissible: true,
  },
  argTypes: {
    toastColor: {
      control: 'select',
      options: ['base', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'],
    },
    toastVariant: {
      control: 'select',
      options: ['strong', 'default', 'neutral', 'outline', 'transparent'],
    },
    toastSize: { control: 'select', options: ['small', 'medium', 'large'] },
    position: { control: 'select', options: positions },
    dismissible: { control: 'boolean' },
    duration: { control: 'number' },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansToast>;

export const Primary: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex min-h-[320px] flex-col gap-4">
      {(['small', 'medium', 'large'] as Size[]).map((size, index) => (
        <HansToast
          key={size}
          title={`${size} toast`}
          message="Dimension tokens change spacing and card width."
          toastSize={size}
          duration={0}
          offset={24 + index * 88}
          position="top-left"
        />
      ))}
    </div>
  ),
};

export const VariantsAndColors: Story = {
  render: () => (
    <div className="grid min-h-[820px] grid-cols-1 gap-4 md:grid-cols-2">
      {(['strong', 'default', 'neutral', 'outline', 'transparent'] as Variant[]).map(
        (variant, variantIndex) => (
          <div key={variant} className="relative min-h-[360px] rounded-xl border border-[var(--gray-300)] p-4">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]">
              {variant}
            </p>
            {(['base', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'] as Color[]).map(
              (color, colorIndex) => (
                <HansToast
                  key={`${variant}-${color}`}
                  title={`${color} ${variant}`}
                  message="Semantic tone driven by design tokens."
                  toastColor={color}
                  toastVariant={variant}
                  position={variantIndex % 2 === 0 ? 'top-left' : 'top-right'}
                  duration={0}
                  offset={20 + colorIndex * 76}
                  dismissible={false}
                />
              ),
            )}
          </div>
        ),
      )}
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="grid min-h-[540px] grid-cols-1 gap-4 rounded-2xl border border-dashed border-[var(--gray-300)] p-4 md:grid-cols-2">
      {positions.map((position) => (
        <div key={position} className="relative min-h-[240px] rounded-xl bg-[var(--gray-100)] p-4">
          <span className="text-sm font-semibold capitalize">
            {position.replace('-', ' / ')}
          </span>
          <HansToast
            title={position}
            message="The stack direction follows the selected corner."
            position={position}
            duration={0}
          />
        </div>
      ))}
    </div>
  ),
};

const StackedToastDemo = () => {
  const [items, setItems] = React.useState([0, 1]);

  return (
    <div className="relative min-h-[520px] rounded-2xl border border-[var(--gray-300)] p-4">
      <div className="flex gap-3">
        <HansButton
          label="Add toast"
          buttonColor="primary"
          onClick={() => setItems((prev) => [...prev, prev.length])}
        />
        <HansButton
          label="Reset"
          buttonVariant="outline"
          onClick={() => setItems([0, 1])}
        />
      </div>

      {items.map((item) => (
        <HansToast
          key={item}
          title={`Toast ${item + 1}`}
          message="New notifications keep the same corner and stack vertically."
          position="bottom-right"
          duration={0}
          toastColor={item % 2 === 0 ? 'primary' : 'success'}
          toastVariant={item % 2 === 0 ? 'outline' : 'neutral'}
          onClose={() =>
            setItems((prev) => prev.filter((currentItem) => currentItem !== item))
          }
        />
      ))}
    </div>
  );
};

export const Stacked: Story = {
  render: () => <StackedToastDemo />,
};

const AutoDismissDemo = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative min-h-[300px] rounded-2xl border border-[var(--gray-300)] p-4">
      <HansButton
        label="Trigger toast"
        buttonColor="secondary"
        onClick={() => setVisible(true)}
      />

      {visible ? (
        <HansToast
          title="Scheduled sync"
          message="This example closes automatically after 2.5 seconds."
          duration={2500}
          toastColor="secondary"
          toastVariant="default"
          onVisibilityChange={setVisible}
        />
      ) : null}
    </div>
  );
};

export const AutoDismiss: Story = {
  render: () => <AutoDismissDemo />,
};
