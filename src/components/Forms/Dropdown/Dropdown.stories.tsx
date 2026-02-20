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
    label: 'Victor Hanszman',
    value: 'victor',
    imageSrc: logoBlue,
    imageAlt: 'Victor Hanszman avatar',
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
    message: '',
    messageColor: 'base',
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
      {[
        'base',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
      ].map((color) => (
        <HansDropdown
          key={color}
          label={`Color ${color}`}
          inputColor={color as Color}
          labelColor={color as Color}
          options={options}
        />
      ))}
    </div>
  ),
};

export const MultiSelect: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full pb-24">
      <HansDropdown
        label="Multi Select 1"
        selectionType="multi"
        enableAutocomplete
        options={options}
      />
      <HansDropdown
        label="Multi Select 2"
        selectionType="multi"
        enableAutocomplete
        options={options}
        inputColor="primary"
        labelColor="primary"
      />
      <HansDropdown
        label="Multi Select 3"
        selectionType="multi"
        enableAutocomplete
        options={options}
        inputColor="secondary"
        labelColor="secondary"
      />
    </div>
  ),
};

export const WithImages: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full pb-24">
      <HansDropdown
        label="With Avatars 1"
        options={optionsWithImages}
        enableAutocomplete
        selectionType="single"
      />
      <HansDropdown
        label="With Avatars 2"
        options={optionsWithImages}
        enableAutocomplete
        selectionType="single"
        inputColor="primary"
        labelColor="primary"
      />
      <HansDropdown
        label="With Avatars 3"
        options={optionsWithImages}
        enableAutocomplete
        selectionType="single"
        inputColor="secondary"
        labelColor="secondary"
      />
    </div>
  ),
};

export const WithoutAutocomplete: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full pb-24">
      <HansDropdown
        label="Simple Dropdown 1"
        labelColor="base"
        selectionType="single"
        enableAutocomplete={false}
        options={options}
      />
      <HansDropdown
        label="Simple Dropdown 2"
        selectionType="single"
        enableAutocomplete={false}
        options={options}
        inputColor="primary"
        labelColor="primary"
      />
      <HansDropdown
        label="Simple Dropdown 3"
        selectionType="single"
        enableAutocomplete={false}
        options={options}
        inputColor="secondary"
        labelColor="secondary"
      />
    </div>
  ),
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
