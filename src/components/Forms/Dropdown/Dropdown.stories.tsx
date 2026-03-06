import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HansDropdown } from './Dropdown';
import DocsPage from './Dropdown.mdx';
import { HansTabs } from '../../Tabs/Tabs';
import logoBlue from '../../../assets/img/logo/vh_logo_blue.png';
import logoPurple from '../../../assets/img/logo/vh_logo_purple.png';
import logoRed from '../../../assets/img/logo/vh_logo_red.png';

const options = [
  {
    id: 'issue',
    label: 'New issue',
    value: 'issue',
    iconName: 'IoMdRadioButtonOn',
  },
  {
    id: 'repo',
    label: 'New repository',
    value: 'repo',
    iconName: 'IoMdDesktop',
  },
  {
    id: 'org',
    label: 'New organization',
    value: 'org',
    iconName: 'IoMdBusiness',
  },
];

const optionsWithImages = [
  {
    id: 'victor',
    label: 'Victor Hanszman',
    value: 'victor',
    imageSrc: logoBlue,
    imageAlt: 'Victor avatar',
  },
  {
    id: 'hans-ui',
    label: 'Hans UI',
    value: 'hans-ui',
    imageSrc: logoPurple,
    imageAlt: 'Hans UI avatar',
  },
  {
    id: 'red-team',
    label: 'Red Team',
    value: 'red-team',
    imageSrc: logoRed,
    imageAlt: 'Red team avatar',
  },
];

const nestedOptions = [
  {
    id: 'projects',
    label: 'Projects',
    value: 'projects',
    iconName: 'IoMdFolderOpen',
    children: [
      { id: 'new-project', label: 'New project', value: 'new-project' },
      {
        id: 'templates',
        label: 'Templates',
        value: 'templates',
        children: [
          {
            id: 'template-web',
            label: 'Web app',
            value: 'template-web',
            children: [
              { id: 'template-web-react', label: 'React starter', value: 'template-web-react' },
              { id: 'template-web-vue', label: 'Vue starter', value: 'template-web-vue' },
            ],
          },
          { id: 'template-api', label: 'API service', value: 'template-api' },
        ],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    value: 'settings',
    iconName: 'IoMdSettings',
  },
];

const meta: Meta<typeof HansDropdown> = {
  title: 'Components/Forms/Dropdown',
  component: HansDropdown,
  args: {
    triggerLabel: 'Dropdown',
    triggerColor: 'base',
    triggerVariant: 'outline',
    triggerShape: 'square',
    triggerSize: 'medium',
    options,
    loading: false,
  },
  parameters: {
    docs: { page: DocsPage },
  },
};

export default meta;
type Story = StoryObj<typeof HansDropdown>;

export const Primary: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansDropdown triggerLabel="Dropdown 1" options={options} />
      <HansDropdown
        triggerLabel="Dropdown 2"
        triggerColor="primary"
        triggerVariant="default"
        options={options}
      />
      <HansDropdown
        triggerLabel="Dropdown 3"
        triggerColor="secondary"
        triggerVariant="strong"
        triggerShape="rounded"
        options={options}
      />
    </div>
  ),
};

export const WithOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansDropdown
        triggerLabel="Add new"
        triggerColor="primary"
        triggerVariant="outline"
        options={options}
      />
      <HansDropdown
        triggerLabel="Actions"
        triggerColor="secondary"
        triggerVariant="default"
        options={options}
      />
      <HansDropdown
        triggerLabel="Quick create"
        triggerColor="success"
        triggerVariant="strong"
        options={options}
      />
    </div>
  ),
};

export const WithIconsAndImages: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansDropdown
        triggerLabel="Icons 1"
        triggerColor="base"
        triggerVariant="outline"
        options={options}
      />
      <HansDropdown
        triggerLabel="Images 2"
        triggerColor="primary"
        triggerVariant="default"
        options={optionsWithImages}
      />
      <HansDropdown
        triggerLabel="Mixed 3"
        triggerColor="secondary"
        triggerVariant="strong"
        options={[
          { id: 'icon-item', label: 'Icon item', value: 'icon-item', iconName: 'IoMdDesktop' },
          optionsWithImages[0],
          optionsWithImages[1],
        ]}
      />
    </div>
  ),
};

export const NestedOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansDropdown
        triggerLabel="Nested 1"
        triggerColor="base"
        triggerVariant="outline"
        options={nestedOptions}
      />
      <HansDropdown
        triggerLabel="Nested 2"
        triggerColor="primary"
        triggerVariant="default"
        options={nestedOptions}
      />
      <HansDropdown
        triggerLabel="Nested 3"
        triggerColor="secondary"
        triggerVariant="strong"
        options={nestedOptions}
      />
    </div>
  ),
};

export const CustomContent: Story = {
  render: () => {
    const tabs = [
      { id: 'local', title: 'Local', content: <p>Clone locally</p> },
      { id: 'cloud', title: 'Cloud', content: <p>Open in cloud workspace</p> },
    ];
    return (
      <div className="flex flex-col gap-4">
        <HansDropdown
          triggerLabel="Code"
          triggerColor="primary"
          triggerVariant="outline"
        >
          <div className="w-[320px] p-4">
            <HansTabs tabs={tabs} tabsColor="base" tabsVariant="outline" />
          </div>
        </HansDropdown>
        <HansDropdown
          triggerLabel="Manage"
          triggerColor="secondary"
          triggerVariant="default"
        >
          <div className="w-[320px] p-4 flex flex-col gap-2">
            <strong>Management panel</strong>
            <p className="text-sm text-[var(--gray-700)]">
              You can pass any custom content.
            </p>
          </div>
        </HansDropdown>
        <HansDropdown
          triggerLabel="Status"
          triggerColor="info"
          triggerVariant="strong"
        >
          <div className="w-[320px] p-4 flex flex-col gap-2">
            <strong>Status updates</strong>
            <span className="text-sm">Everything is operational.</span>
          </div>
        </HansDropdown>
      </div>
    );
  },
};

export const ControlledOpen: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ControlledOpenExample
        triggerLabel="Controlled 1"
        triggerColor="base"
        triggerVariant="outline"
      />
      <ControlledOpenExample
        triggerLabel="Controlled 2"
        triggerColor="primary"
        triggerVariant="default"
      />
      <ControlledOpenExample
        triggerLabel="Controlled 3"
        triggerColor="secondary"
        triggerVariant="strong"
      />
    </div>
  ),
};

const ControlledOpenExample = ({
  triggerLabel,
  triggerColor,
  triggerVariant,
}: {
  triggerLabel: string;
  triggerColor: 'base' | 'primary' | 'secondary';
  triggerVariant: 'outline' | 'default' | 'strong';
}) => {
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex flex-row gap-3">
      <HansDropdown
        triggerLabel={triggerLabel}
        triggerColor={triggerColor}
        triggerVariant={triggerVariant}
        options={options}
        onOpenChange={setOpened}
      />
      <span>Open: {opened ? 'true' : 'false'}</span>
    </div>
  );
};

export const OptionActions: Story = {
  render: () => <OptionActionsExample />,
};

const OptionActionsExample = () => {
  const [lastAction, setLastAction] = useState('none');

  const actionOptions = [
    {
      id: 'action-one',
      label: 'Action One',
      value: 'action-one',
      iconName: 'IoMdFlash',
      action: () => setLastAction('Action One'),
    },
    {
      id: 'action-two',
      label: 'Action Two',
      value: 'action-two',
      iconName: 'IoMdSettings',
      action: () => setLastAction('Action Two'),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <HansDropdown
        triggerLabel="Actions callback"
        triggerColor="primary"
        triggerVariant="default"
        options={actionOptions}
      />
      <span>Last action: {lastAction}</span>
    </div>
  );
};

export const NoContent: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansDropdown
        triggerLabel="No content 1"
        options={[]}
        noOptionsText="No entries"
      />
      <HansDropdown
        triggerLabel="No content 2"
        triggerColor="primary"
        triggerVariant="default"
        options={[]}
        noOptionsText="Nothing here"
      />
      <HansDropdown
        triggerLabel="No content 3"
        triggerColor="danger"
        triggerVariant="strong"
        options={[]}
        noOptionsText="No menu items"
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansDropdown
        triggerLabel="Loading menu 1"
        loading
        triggerColor="base"
        triggerVariant="outline"
      />
      <HansDropdown
        triggerLabel="Loading menu 2"
        loading
        triggerColor="primary"
        triggerVariant="default"
      />
      <HansDropdown
        triggerLabel="Loading menu 3"
        loading
        triggerColor="secondary"
        triggerVariant="strong"
      />
    </div>
  ),
};
