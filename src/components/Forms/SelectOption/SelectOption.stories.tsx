import type { Meta, StoryObj } from '@storybook/react';
import type { Color } from '../../../types/Common.types';
import { HansSelectOption } from './SelectOption';
import DocsPage from './SelectOption.mdx';
import type { SelectOptionOption } from './SelectOption.types';
import logoBlue from '../../../assets/img/logo/vh_logo_blue.png';
import logoPurple from '../../../assets/img/logo/vh_logo_purple.png';
import logoRed from '../../../assets/img/logo/vh_logo_red.png';

const options: SelectOptionOption[] = [
  { id: 'opt-1', label: 'Option 1', value: 'opt-1' },
  { id: 'opt-2', label: 'Option 2', value: 'opt-2' },
  { id: 'opt-3', label: 'Option 3', value: 'opt-3' },
  { id: 'opt-4', label: 'Option 4', value: 'opt-4', disabled: true },
];

const optionsWithImages: SelectOptionOption[] = [
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

const meta: Meta<typeof HansSelectOption> = {
  title: 'Components/Forms/SelectOption',
  component: HansSelectOption,
  args: {
    label: 'Select Option',
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
type Story = StoryObj<typeof HansSelectOption>;

export const Primary: Story = {
  args: {
    label: 'Select Option',
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
        <HansSelectOption
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
      <HansSelectOption
        label="Multi Select 1"
        selectionType="multi"
        enableAutocomplete
        options={options}
      />
      <HansSelectOption
        label="Multi Select 2"
        selectionType="multi"
        enableAutocomplete
        options={options}
        inputColor="primary"
        labelColor="primary"
      />
      <HansSelectOption
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
      <HansSelectOption
        label="With Avatars 1"
        options={optionsWithImages}
        enableAutocomplete
        selectionType="single"
      />
      <HansSelectOption
        label="With Avatars 2"
        options={optionsWithImages}
        enableAutocomplete
        selectionType="single"
        inputColor="primary"
        labelColor="primary"
      />
      <HansSelectOption
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
      <HansSelectOption
        label="Simple Dropdown 1"
        labelColor="base"
        selectionType="single"
        enableAutocomplete={false}
        options={options}
      />
      <HansSelectOption
        label="Simple Dropdown 2"
        selectionType="single"
        enableAutocomplete={false}
        options={options}
        inputColor="primary"
        labelColor="primary"
      />
      <HansSelectOption
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

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full pb-24">
      <HansSelectOption
        label="Loading options 1"
        isLoadingOptions
        loadingOptionsText="Searching options..."
        options={options}
      />
      <HansSelectOption
        label="Loading options 2"
        isLoadingOptions
        loadingOptionsText="Loading users..."
        options={optionsWithImages}
        inputColor="primary"
        labelColor="primary"
      />
      <HansSelectOption
        label="Loading options 3"
        isLoadingOptions
        loadingOptionsText="Fetching list..."
        options={options}
        enableAutocomplete={false}
        inputColor="secondary"
        labelColor="secondary"
      />
    </div>
  ),
};

