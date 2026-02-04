import type { Meta, StoryObj } from '@storybook/react';
import type { Size } from '../../types/Common.types';
import { HansIcon } from './Icon';
import DocsPage from './Icon.mdx';

const meta: Meta<typeof HansIcon> = {
  title: 'Components/Icon',
  component: HansIcon,
  args: {
    iconSize: 'medium',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nome do ícone (ex: FaHome, MdAdd, BiStar)',
    },
    iconSize: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansIcon>;

export const Primary: Story = {
  args: { name: 'FaHome' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {['small', 'medium', 'large'].map((size) => (
        <div key={size}>
          <p className="font-bold mb-2">{size}</p>
          <HansIcon key={size} name="IoIosHappy" iconSize={size as Size} />
        </div>
      ))}
    </div>
  ),
};

export const MultipleIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      {['FaHome', 'FaUser', 'MdAdd', 'BiStar', 'AiFillHeart'].map((name) => (
        <div key={name} className="flex flex-col items-center">
          <HansIcon name={name} />
          <span className="text-xs mt-1">{name}</span>
        </div>
      ))}
    </div>
  ),
};
