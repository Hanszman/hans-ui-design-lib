import type { Meta, StoryObj } from '@storybook/react';
import type { Color, Size } from '../../../types/Common.types';
import { HansToggle } from './Toggle';
import DocsPage from './Toggle.mdx';

const meta: Meta<typeof HansToggle> = {
  title: 'Components/Forms/Toggle',
  component: HansToggle,
  args: {
    label: 'Enable feature',
    checked: true,
    toggleColor: 'primary',
    toggleSize: 'medium',
    disabled: false,
  },
  argTypes: {
    toggleColor: {
      control: 'select',
      options: [
        'base',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
      ],
    },
    toggleSize: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansToggle>;

export const Primary: Story = {};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        'base',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
      ].map((color) => (
        <HansToggle
          key={color}
          label={`Color ${color}`}
          checked
          toggleColor={color as Color}
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {['small', 'medium', 'large'].map((size) => (
        <HansToggle
          key={size}
          label={size}
          checked
          toggleSize={size as Size}
        />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansToggle label="On" checked toggleColor="success" />
      <HansToggle label="Off" checked={false} />
      <HansToggle label="On disabled" checked disabled />
      <HansToggle label="Off disabled" checked={false} disabled />
    </div>
  ),
};

export const Uncontrolled: Story = {
  args: {
    label: 'Uncontrolled toggle',
    defaultChecked: false,
    checked: undefined,
  },
};
