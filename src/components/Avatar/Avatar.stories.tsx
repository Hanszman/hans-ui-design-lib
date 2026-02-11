import type { Meta, StoryObj } from '@storybook/react';
import type { Size } from '../../types/Common.types';
import { HansAvatar } from './Avatar';
import DocsPage from './Avatar.mdx';
import logoBlue from '../../assets/img/logo/vh_logo_blue.png';

const meta: Meta<typeof HansAvatar> = {
  title: 'Components/Avatar',
  component: HansAvatar,
  args: {
    src: logoBlue,
    alt: 'User avatar',
    avatarSize: 'medium',
    fallbackIconName: 'FaUserCircle',
  },
  argTypes: {
    avatarSize: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansAvatar>;

export const Primary: Story = {};

export const Fallback: Story = {
  args: {
    src: '',
    alt: 'Fallback avatar',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {['small', 'medium', 'large'].map((size) => (
        <HansAvatar
          key={size}
          src={logoBlue}
          alt={size}
          avatarSize={size as Size}
        />
      ))}
    </div>
  ),
};
