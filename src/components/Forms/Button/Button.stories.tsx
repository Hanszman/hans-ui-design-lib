import type { Meta, StoryObj } from '@storybook/react';
import type { Size, Color, Variant } from '../../../models/Common.types';
import { Button } from './Button';
import { Icon } from '../../Icon/Icon';
import DocsPage from './Button.mdx';

const meta: Meta<typeof Button> = {
  title: 'Components/Forms/Button',
  component: Button,
  args: {
    label: 'Primary',
    size: 'medium',
    variant: 'default',
    color: 'primary',
    disabled: false,
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    variant: {
      control: 'select',
      options: ['strong', 'default', 'neutral', 'outline', 'transparent'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
    },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Click',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {['small', 'medium', 'large'].map((size) => (
        <div key={size}>
          <p className="font-bold mb-2">{size}</p>
          <Button key={size} label={`${size}`} size={size as Size} />
        </div>
      ))}
    </div>
  ),
};

export const VariantsAndColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {['strong', 'default', 'neutral', 'outline', 'transparent'].map(
        (variant) => (
          <div key={variant}>
            <p className="font-bold mb-2">{variant}</p>
            <div className="flex gap-2 flex-wrap">
              {[
                'primary',
                'secondary',
                'success',
                'danger',
                'warning',
                'info',
              ].map((color) => (
                <Button
                  key={color + variant}
                  label={`${color}`}
                  color={color as Color}
                  variant={variant as Variant}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <Button>
      <Icon name="FaHome" />
      <span>Child Text</span>
    </Button>
  ),
};
