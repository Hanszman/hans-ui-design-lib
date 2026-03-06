import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { Color } from '../../../types/Common.types';
import { HansSelectOption } from './SelectOption';
import DocsPage from './SelectOption.mdx';
import type { SelectOptionItem } from './SelectOption.types';
import logoBlue from '../../../assets/img/logo/vh_logo_blue.png';
import logoPurple from '../../../assets/img/logo/vh_logo_purple.png';
import logoRed from '../../../assets/img/logo/vh_logo_red.png';

const options: SelectOptionItem[] = [
  { id: 'opt-1', label: 'Option 1', value: 'opt-1' },
  { id: 'opt-2', label: 'Option 2', value: 'opt-2' },
  { id: 'opt-3', label: 'Option 3', value: 'opt-3' },
  { id: 'opt-4', label: 'Option 4', value: 'opt-4', disabled: true },
];

const optionsWithImages: SelectOptionItem[] = [
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

const optionsWithIcons: SelectOptionItem[] = [
  { id: 'icon-1', label: 'Dashboard', value: 'dashboard', iconName: 'IoMdApps' },
  { id: 'icon-2', label: 'Repositories', value: 'repositories', iconName: 'IoMdDesktop' },
  { id: 'icon-3', label: 'Settings', value: 'settings', iconName: 'IoMdSettings' },
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

export const WithIconsAndImages: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full pb-24">
      <HansSelectOption
        label="With icons 1"
        options={optionsWithIcons}
        enableAutocomplete
      />
      <HansSelectOption
        label="With images 2"
        options={optionsWithImages}
        enableAutocomplete
        inputColor="primary"
        labelColor="primary"
      />
      <HansSelectOption
        label="Mixed 3"
        options={[optionsWithIcons[0], optionsWithImages[0], optionsWithImages[1]]}
        enableAutocomplete
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

export const WithMessage: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full pb-24">
      <HansSelectOption
        label="Message 1"
        options={options}
        message="Helper message for this select option"
        messageColor="base"
      />
      <HansSelectOption
        label="Message 2"
        options={options}
        inputColor="primary"
        labelColor="primary"
        message="Primary helper message"
        messageColor="primary"
      />
      <HansSelectOption
        label="Message 3"
        options={options}
        inputColor="secondary"
        labelColor="secondary"
        message="Secondary helper message"
        messageColor="secondary"
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

export const NoOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full pb-24">
      <HansSelectOption
        label="No options 1"
        options={[]}
        noOptionsText="No options available"
      />
      <HansSelectOption
        label="No options 2"
        options={[]}
        noOptionsText="No users found"
        inputColor="primary"
        labelColor="primary"
      />
      <HansSelectOption
        label="No options 3"
        options={[]}
        noOptionsText="Nothing to display"
        inputColor="secondary"
        labelColor="secondary"
        enableAutocomplete={false}
      />
    </div>
  ),
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

export const OptionActions: Story = {
  render: () => <OptionActionsExample />,
};

const OptionActionsExample = () => {
  const [lastAction, setLastAction] = useState('none');
  const optionsWithAction: SelectOptionItem[] = [
    {
      id: 'action-dashboard',
      label: 'Dashboard',
      value: 'dashboard',
      iconName: 'IoMdApps',
      action: () => setLastAction('Dashboard'),
    },
    {
      id: 'action-settings',
      label: 'Settings',
      value: 'settings',
      iconName: 'IoMdSettings',
      action: () => setLastAction('Settings'),
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full pb-24">
      <HansSelectOption label="Action callback" options={optionsWithAction} />
      <span>Last action: {lastAction}</span>
    </div>
  );
};
