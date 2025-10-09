import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    label: 'Primary',
    size: 'medium',
    variant: 'primary',
    status: 'default',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'transparent'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    status: {
      control: 'select',
      options: ['default', 'danger', 'warning', 'success', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Danger: Story = {
  args: {
    label: 'Danger',
    status: 'danger',
  },
};

export const Small: Story = {
  args: {
    label: 'Small Button',
    size: 'small',
  },
};
