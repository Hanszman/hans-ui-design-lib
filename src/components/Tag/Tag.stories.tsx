import type { Meta, StoryObj } from '@storybook/react';
import type { Color, Size } from '../../types/Common.types';
import { HansTag } from './Tag';
import DocsPage from './Tag.mdx';

const meta: Meta<typeof HansTag> = {
  title: 'Components/Tag',
  component: HansTag,
  args: {
    label: 'Tag',
    tagSize: 'small',
    tagColor: 'base',
    actionIcon: 'MdClose',
  },
  argTypes: {
    tagSize: { control: 'select', options: ['small', 'medium', 'large'] },
    tagColor: {
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
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansTag>;

export const Primary: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {['small', 'medium', 'large'].map((size) => (
        <HansTag key={size} label={size} tagSize={size as Size} />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-2 flex-wrap">
      {[
        'base',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
      ].map((color) => (
        <HansTag key={color} label={color} tagColor={color as Color} />
      ))}
    </div>
  ),
};

export const Removable: Story = {
  args: {
    label: 'Removable',
    actionIcon: 'IoIosCloseCircle',
    onAction: () => alert('Action!'),
  },
};
