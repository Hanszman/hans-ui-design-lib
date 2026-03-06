import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HansDropdown } from './Dropdown';
import DocsPage from './Dropdown.mdx';
import { HansTabs } from '../../Tabs/Tabs';

const options = [
  {
    id: 'issue',
    label: 'New issue',
    value: 'issue',
    iconName: 'IoMdRadioButtonOn',
  },
  { id: 'repo', label: 'New repository', value: 'repo', iconName: 'IoMdDesktop' },
  { id: 'org', label: 'New organization', value: 'org', iconName: 'IoMdBusiness' },
];

const meta: Meta<typeof HansDropdown> = {
  title: 'Components/Forms/Dropdown',
  component: HansDropdown,
  args: {
    triggerLabel: 'Dropdown',
    triggerColor: 'base',
    triggerVariant: 'outline',
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

export const Primary: Story = {};

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
  render: () => <ControlledOpenExample />,
};

const ControlledOpenExample = () => {
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <HansDropdown
        triggerLabel="Controlled"
        options={options}
        onOpenChange={setOpened}
      />
      <span>Open: {opened ? 'true' : 'false'}</span>
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
