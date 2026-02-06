import type { Meta, StoryObj } from '@storybook/react';
import type {
  Size,
  Color,
} from '../../../types/Common.types';
import { HansInput } from './Input';
import { HansIcon } from '../../Icon/Icon';
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
    message: '',
    messageColor: 'success',
  },
  argTypes: {
    inputSize: { control: 'select', options: ['small', 'medium', 'large'] },
    inputColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
    },
    labelColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
    },
    messageColor: {
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
          <HansInput
            key={size}
            label={`${size}`}
            placeholder={`${size}`}
            inputSize={size as Size}
            message={`${size}`}
          ></HansInput>
        </div>
      ))}
    </div>
  ),
};

export const ColorsAndMessages: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {['primary', 'secondary', 'success', 'danger', 'warning', 'info'].map(
        (color) => (
          <HansInput
            key={color}
            label={`Color ${color}`}
            labelColor={color as Color}
            inputColor={color as Color}
            message={`Message ${color}`}
            messageColor={color as Color}
            placeholder="Type here"
          />
        ),
      )}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansInput
        label="Search"
        placeholder="Search..."
        leftIcon={<HansIcon name="FaSearch" iconSize="small" />}
      />
      <HansInput
        label="Email"
        placeholder="user@email.com"
        rightIcon={<HansIcon name="MdEmail" iconSize="small" />}
      />
      <HansInput
        label="Password"
        inputType="password"
        placeholder="********"
        leftIcon={<HansIcon name="FaLock" iconSize="small" />}
        rightIcon={<HansIcon name="MdVisibility" iconSize="small" />}
      />
    </div>
  ),
};

export const ValidationProps: Story = {
  args: {
    label: 'Username',
    placeholder: '3-12 characters',
    minLength: 3,
    maxLength: 12,
    message: 'Min 3, max 12 characters',
    messageColor: 'info',
  },
};
