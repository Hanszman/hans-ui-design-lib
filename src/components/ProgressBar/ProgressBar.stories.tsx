import type { Meta, StoryObj } from '@storybook/react-vite';
import { HansProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: HansProgressBar,
  args: {
    value: 66,
    label: 'Knowledge level',
    valueLabel: 'Intermediate',
    progressColor: 'warning',
  },
} satisfies Meta<typeof HansProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = {
  args: { value: 100, valueLabel: 'Advanced', progressColor: 'success' },
};

export const Studying: Story = {
  args: { value: 25, valueLabel: 'Studying', progressColor: 'danger' },
};

export const PreviouslyUsed: Story = {
  args: { value: 50, valueLabel: 'Previously used', progressColor: 'warning' },
};

export const Occasional: Story = {
  args: { value: 75, valueLabel: 'Occasional', progressColor: 'warning' },
};
