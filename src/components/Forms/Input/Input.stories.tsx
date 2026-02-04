import type { Meta, StoryObj } from '@storybook/react';
import type {
  Size,
  // Color
} from '../../../types/Common.types';
import { HansInput } from './Input';
import DocsPage from './Input.mdx';

const meta: Meta<typeof HansInput> = {
  title: 'Components/Forms/Input',
  component: HansInput,
  args: {
    label: 'Label',
    placeholder: '',
    inputColor: 'primary',
    inputSize: 'medium',
    disabled: false,
  },
  argTypes: {
    inputSize: { control: 'select', options: ['small', 'medium', 'large'] },
    inputColor: {
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
type Story = StoryObj<typeof HansInput>;

export const Primary: Story = {
  args: {
    label: 'Input',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {['small', 'medium', 'large'].map((size) => (
        <div key={size}>
          <p className="font-bold mb-2">{size}</p>
          <HansInput
            key={size}
            label={`${size}`}
            inputSize={size as Size}
          ></HansInput>
        </div>
      ))}
    </div>
  ),
};
