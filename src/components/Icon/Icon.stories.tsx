import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { FaHome, FaUser, FaCheck } from 'react-icons/fa';

const icons = { FaHome, FaUser, FaCheck };
//https://react-icons.github.io/react-icons/

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const ReactIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon icon={FaHome} />
      <Icon icon={FaUser} />
      <Icon icon={FaCheck} />
    </div>
  ),
};

export const AllReactIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      {Object.entries(icons).map(([_, IconComp]) => (
        <div className="flex flex-col items-center">
          <IconComp />
        </div>
      ))}
    </div>
  ),
};
