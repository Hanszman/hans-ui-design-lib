import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    size: 'medium',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nome do ícone (ex: FaHome, MdAdd, BiStar)',
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Basic: Story = {
  args: { name: 'FaHome' },
};

export const MultipleIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      {['FaHome', 'FaUser', 'MdAdd', 'BiStar', 'AiFillHeart'].map((name) => (
        <div key={name} className="flex flex-col items-center">
          <Icon name={name} />
          <span className="text-xs mt-1">{name}</span>
        </div>
      ))}
    </div>
  ),
};
