import type { Meta, StoryObj } from '@storybook/react';
import type { Color, Size, Variant } from '../../types/Common.types';
import { HansTabs } from './Tabs';
import DocsPage from './Tabs.mdx';

const tabsBase = [
  {
    id: 'overview',
    title: 'Overview',
    content: <p>Overview content</p>,
  },
  {
    id: 'details',
    title: 'Details',
    content: <p>Details content</p>,
  },
  {
    id: 'settings',
    title: 'Settings',
    content: <p>Settings content</p>,
  },
];

const meta: Meta<typeof HansTabs> = {
  title: 'Components/Tabs',
  component: HansTabs,
  args: {
    tabs: tabsBase,
    tabsColor: 'base',
    tabsVariant: 'outline',
    tabsSize: 'medium',
    showCloseButton: false,
    loading: false,
  },
  argTypes: {
    tabsColor: {
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
    tabsSize: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    tabsVariant: {
      control: 'select',
      options: ['strong', 'default', 'neutral', 'outline', 'transparent'],
    },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansTabs>;

export const Primary: Story = {
  args: {
    tabs: tabsBase,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {['small', 'medium', 'large'].map((size) => (
        <HansTabs
          key={size}
          tabsSize={size as Size}
          tabs={tabsBase}
          inputId={`tabs-size-${size}`}
        />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        'base',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
      ].map((color) => (
        <HansTabs
          key={color}
          tabsColor={color as Color}
          tabs={tabsBase}
          inputId={`tabs-color-${color}`}
        />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {['strong', 'default', 'neutral', 'outline', 'transparent'].map(
        (variant) => (
          <HansTabs
            key={variant}
            tabsColor="primary"
            tabsVariant={variant as Variant}
            tabs={tabsBase}
            inputId={`tabs-variant-${variant}`}
          />
        ),
      )}
    </div>
  ),
};

export const PerTabAppearance: Story = {
  args: {
    tabsColor: 'base',
    tabsVariant: 'outline',
    tabs: [
      {
        id: 'overview',
        title: 'Overview',
        content: <p>Overview content</p>,
        tabColor: 'primary',
        tabVariant: 'default',
      },
      {
        id: 'details',
        title: 'Details',
        content: <p>Details content</p>,
        tabColor: 'success',
        tabVariant: 'neutral',
      },
      {
        id: 'settings',
        title: 'Settings',
        content: <p>Settings content</p>,
        tabColor: 'danger',
        tabVariant: 'outline',
      },
    ],
  },
};

export const ClosableTabs: Story = {
  args: {
    tabs: tabsBase,
    showCloseButton: true,
  },
};

export const PerTabClosable: Story = {
  args: {
    tabs: [
      {
        id: 'overview',
        title: 'Overview',
        content: <p>Overview content</p>,
        closable: true,
      },
      {
        id: 'details',
        title: 'Details',
        content: <p>Details content</p>,
      },
      {
        id: 'settings',
        title: 'Settings',
        content: <p>Settings content</p>,
        closable: true,
      },
    ],
  },
};

export const DisabledTab: Story = {
  args: {
    tabs: [
      {
        id: 'overview',
        title: 'Overview',
        content: <p>Overview content</p>,
      },
      {
        id: 'details',
        title: 'Details (disabled)',
        content: <p>Details content</p>,
        disabled: true,
      },
      {
        id: 'settings',
        title: 'Settings',
        content: <p>Settings content</p>,
      },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    tabs: [],
    emptyText: 'No tabs configured',
  },
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HansTabs tabs={tabsBase} loading inputId="tabs-loading-switch" />
      <HansTabs
        tabs={tabsBase}
        loading
        tabsSize="large"
        inputId="tabs-loading-large"
      />
    </div>
  ),
};
