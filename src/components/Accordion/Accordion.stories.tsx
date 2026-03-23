import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HansAccordion } from './Accordion';
import DocsPage from './Accordion.mdx';
import type { HansAccordionItem } from './Accordion.types';

const singleItem: HansAccordionItem[] = [
  {
    id: 'single-item',
    title: 'What is Hans UI?',
    description:
      'Hans UI is a React component library that can also be exposed for other applications through Module Federation and CDN builds.',
  },
];

const multipleItems: HansAccordionItem[] = [
  {
    id: 'faq-1',
    title: 'How do I install the library?',
    description:
      'Install the package, import the component you need, and include the global stylesheet once in your application entry point.',
  },
  {
    id: 'faq-2',
    title: 'Can I use it outside React?',
    description:
      'Yes. The project also exposes web components so the same UI can be consumed by Angular and other JavaScript applications.',
  },
  {
    id: 'faq-3',
    title: 'Does it support loading states?',
    description:
      'Yes. While your content is loading you can enable the accordion skeleton and render placeholder rows with HansLoading.',
  },
];

const meta: Meta<typeof HansAccordion> = {
  title: 'Components/Accordion',
  component: HansAccordion,
  args: {
    items: multipleItems,
    allowMultipleOpen: true,
    titleColor: 'base',
    titleVariant: 'transparent',
    descriptionColor: 'base',
    descriptionVariant: 'transparent',
    loading: false,
    loadingColor: 'base',
    loadingAriaLabel: 'Loading accordion',
    skeletonItemsCount: 3,
    emptyText: 'No accordion items available',
  },
  argTypes: {
    items: { control: 'object' },
    openItemIds: { control: 'object' },
    defaultOpenItemIds: { control: 'object' },
    allowMultipleOpen: { control: 'boolean' },
    loading: { control: 'boolean' },
    titleColor: {
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
    titleVariant: {
      control: 'select',
      options: ['strong', 'default', 'neutral', 'outline', 'transparent'],
    },
    descriptionColor: {
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
    descriptionVariant: {
      control: 'select',
      options: ['strong', 'default', 'neutral', 'outline', 'transparent'],
    },
    loadingColor: {
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
    skeletonItemsCount: { control: 'number' },
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansAccordion>;

export const Primary: Story = {
  args: {
    items: multipleItems,
  },
};

export const SingleItem: Story = {
  args: {
    items: singleItem,
    defaultOpenItemIds: ['single-item'],
  },
};

export const MultipleItems: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <HansAccordion items={multipleItems} defaultOpenItemIds={['faq-1']} />
      <HansAccordion
        items={multipleItems}
        allowMultipleOpen={false}
        defaultOpenItemIds={['faq-2']}
      />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <HansAccordion
        items={multipleItems}
        defaultOpenItemIds={['faq-1']}
        titleColor="primary"
        titleVariant="default"
        descriptionColor="primary"
        descriptionVariant="neutral"
      />
      <HansAccordion
        items={multipleItems}
        defaultOpenItemIds={['faq-2']}
        titleColor="secondary"
        titleVariant="outline"
        descriptionColor="secondary"
        descriptionVariant="transparent"
      />
      <HansAccordion
        items={multipleItems}
        defaultOpenItemIds={['faq-3']}
        titleColor="success"
        titleVariant="strong"
        descriptionColor="base"
        descriptionVariant="outline"
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledAccordionExample />,
};

const ControlledAccordionExample = () => {
  const [openItemIds, setOpenItemIds] = useState<string[]>(['faq-1']);

  return (
    <div className="flex w-full flex-col gap-3">
      <HansAccordion
        items={multipleItems}
        openItemIds={openItemIds}
        onOpenItemIdsChange={setOpenItemIds}
      />
      <span className="text-sm text-[var(--gray-700)]">
        Open items: {openItemIds.join(', ') || 'none'}
      </span>
    </div>
  );
};

export const Empty: Story = {
  args: {
    items: [],
    emptyText: 'There is no content to display in this accordion yet.',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    skeletonItemsCount: 4,
  },
};
