import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { FaHome } from 'react-icons/fa';

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
    iconPosition: 'Left',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'transparent'],
    },
    size: { control: 'select', options: ['small', 'medium'] },
    status: {
      control: 'select',
      options: ['default', 'danger', 'warning', 'success', 'info'],
    },
    iconPosition: { control: 'select', options: ['Left', 'Right'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    label: 'Com ícone',
    icon: <FaHome />,
  },
};

export const IconRight: Story = {
  args: {
    label: 'Icon Right',
    icon: <FaHome />,
    iconPosition: 'Right',
  },
};

export const IconOnly: Story = {
  args: {
    icon: <FaHome />,
  },
};

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
