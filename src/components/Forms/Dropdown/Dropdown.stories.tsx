import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HansDropdown } from './Dropdown';
import DocsPage from './Dropdown.mdx';
import { HansTabs } from '../../Tabs/Tabs';

const options = [
  { id: 'issue', label: 'New issue', value: 'issue', iconName: 'IoMdRadioButtonOn' },
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
  args: {
    triggerLabel: 'Add new',
    triggerColor: 'primary',
    options,
  },
};

export const CustomContent: Story = {
  render: () => {
    const tabs = [
      { id: 'local', title: 'Local', content: <p>Clone locally</p> },
      { id: 'cloud', title: 'Cloud', content: <p>Open in cloud workspace</p> },
    ];
    return (
      <HansDropdown triggerLabel="Code" triggerColor="success">
        <div className="w-[320px]">
          <HansTabs tabs={tabs} tabsColor="base" tabsVariant="outline" />
        </div>
      </HansDropdown>
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

export const Loading: Story = {
  args: {
    triggerLabel: 'Loading menu',
    loading: true,
  },
};
