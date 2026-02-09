import type { Meta, StoryObj } from '@storybook/react';
import type { Color } from '../../../types/Common.types';
import { HansDropdown } from './Dropdown';
import DocsPage from './Dropdown.mdx';
import type { DropdownOption } from './Dropdown.types';
import logoBlue from '../../../assets/img/logo/vh_logo_blue.png';
import logoPurple from '../../../assets/img/logo/vh_logo_purple.png';
import logoRed from '../../../assets/img/logo/vh_logo_red.png';

const options: DropdownOption[] = [
  { id: 'opt-1', label: 'Option 1', value: 'opt-1' },
  { id: 'opt-2', label: 'Option 2', value: 'opt-2' },
  { id: 'opt-3', label: 'Option 3', value: 'opt-3' },
  { id: 'opt-4', label: 'Option 4', value: 'opt-4', disabled: true },
];

const optionsWithImages: DropdownOption[] = [
  {
    id: 'img-1',
    label: 'Victor Hans',
    value: 'victor',
    imageSrc: logoBlue,
    imageAlt: 'Victor Hans avatar',
  },
  {
    id: 'img-2',
    label: 'Hans UI',
    value: 'hans-ui',
    imageSrc: logoPurple,
    imageAlt: 'Hans UI avatar',
  },
  {
    id: 'img-3',
    label: 'Red Team',
    value: 'red-team',
    imageSrc: logoRed,
    imageAlt: 'Red Team avatar',
  },
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

export const WithImages: Story = {
  args: {
    label: 'With Avatars',
    options: optionsWithImages,
    enableAutocomplete: true,
    selectionType: 'single',
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
