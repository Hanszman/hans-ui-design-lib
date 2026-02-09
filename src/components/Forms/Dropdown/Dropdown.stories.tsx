import type { Meta, StoryObj } from '@storybook/react';
import type { Color } from '../../../types/Common.types';
import { HansDropdown } from './Dropdown';
import DocsPage from './Dropdown.mdx';
import type { DropdownOption } from './Dropdown.types';

const options: DropdownOption[] = [
  { label: 'Option 1', value: 'opt-1' },
  { label: 'Option 2', value: 'opt-2' },
  { label: 'Option 3', value: 'opt-3' },
  { label: 'Option 4', value: 'opt-4', disabled: true },
];

const meta: Meta<typeof HansDropdown> = {
  title: 'Components/Forms/Dropdown',
  component: HansDropdown,
  args: {
    label: 'Dropdown',
    placeholder: 'Select an option',
    inputColor: 'base',
    inputSize: 'medium',
    options,
    selectionType: 'single',
    enableAutocomplete: true,
    disabled: false,
  },
  argTypes: {
    inputSize: { control: 'select', options: ['small', 'medium', 'large'] },
    inputColor: {
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
    labelColor: {
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
    messageColor: {
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
    selectionType: { control: 'select', options: ['single', 'multi'] },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansDropdown>;

export const Primary: Story = {
  args: {
    label: 'Dropdown',
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      {['base', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'].map(
        (color) => (
          <HansDropdown
            key={color}
            label={`Color ${color}`}
            inputColor={color as Color}
            labelColor={color as Color}
            options={options}
          />
        ),
      )}
    </div>
  ),
};

export const MultiSelect: Story = {
  args: {
    label: 'Multi Select',
    selectionType: 'multi',
    enableAutocomplete: true,
    options,
  },
};

export const WithoutAutocomplete: Story = {
  args: {
    label: 'Simple Dropdown',
    selectionType: 'single',
    enableAutocomplete: false,
    options,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
    options,
    message: 'Dropdown disabled',
    messageColor: 'warning',
  },
};
