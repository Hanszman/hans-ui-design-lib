import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { HansKanban } from './Kanban';
import type {
  HansKanbanColumnData,
  HansKanbanItemData,
} from './Kanban.types';
import DocsPage from './Kanban.mdx';

const columns: HansKanbanColumnData[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    description: 'Ideas and requests waiting for refinement.',
    columnColor: 'base',
    columnVariant: 'outline',
  },
  {
    id: 'in-progress',
    title: 'In progress',
    description: 'Execution in motion this sprint.',
    columnColor: 'primary',
    columnVariant: 'neutral',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Feedback, QA and stakeholder validation.',
    columnColor: 'secondary',
    columnVariant: 'outline',
  },
  {
    id: 'done',
    title: 'Done',
    description: 'Recently shipped work.',
    columnColor: 'success',
    columnVariant: 'transparent',
  },
];

const items: HansKanbanItemData[] = [
  {
    id: 'task-1',
    columnId: 'backlog',
    title: 'Plan dashboard widgets',
    description: 'Define metrics hierarchy for the new home screen.',
    avatarSrc: 'https://i.pravatar.cc/120?img=9',
  },
  {
    id: 'task-2',
    columnId: 'backlog',
    title: 'Produce campaign key art',
    description: 'Prepare visual cover card assets.',
    cardLayout: 'image',
    imageSrc:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Design table with notebooks and pens',
    cardColor: 'primary',
    cardVariant: 'strong',
  },
  {
    id: 'task-3',
    columnId: 'in-progress',
    title: 'Implement modal loading state',
    description: 'Finish API and visual polishing.',
    avatarSrc: 'https://i.pravatar.cc/120?img=15',
    cardColor: 'primary',
    cardVariant: 'outline',
  },
  {
    id: 'task-4',
    columnId: 'review',
    title: 'Review kanban interactions',
    description: 'Validate empty columns and drag ordering.',
    avatarSrc: 'https://i.pravatar.cc/120?img=22',
    cardColor: 'secondary',
    cardVariant: 'neutral',
  },
  {
    id: 'task-5',
    columnId: 'done',
    title: 'Publish token documentation',
    description: 'Mdx and stories updated for consumers.',
    avatarSrc: 'https://i.pravatar.cc/120?img=31',
    cardColor: 'success',
    cardVariant: 'outline',
  },
];

const meta: Meta<typeof HansKanban> = {
  title: 'Components/Kanban',
  component: HansKanban,
  parameters: {
    docs: { page: DocsPage },
  },
  args: {
    columns,
    items,
    boardLabel: 'Product workflow board',
    emptyColumnText: 'Drag a card into this column',
    showColumnCounts: true,
    dragAndDrop: true,
  },
};

export default meta;
type Story = StoryObj<typeof HansKanban>;

const ControlledKanban = (args: React.ComponentProps<typeof HansKanban>) => {
  const [boardItems, setBoardItems] = React.useState(args.items ?? []);

  React.useEffect(() => {
    setBoardItems(args.items ?? []);
  }, [args.items]);

  return <HansKanban {...args} items={boardItems} onItemsChange={setBoardItems} />;
};

export const Playground: Story = {
  render: (args) => <ControlledKanban {...args} />,
};

export const ImageAndProfileCards: Story = {
  render: () => <ControlledKanban columns={columns} items={items} />,
};

export const ColumnStyles: Story = {
  render: () => (
    <ControlledKanban
      columns={columns}
      items={items}
      boardMinHeight="24rem"
      columnMinWidth="18rem"
    />
  ),
};

export const EmptyAndDenseStates: Story = {
  render: () => (
    <ControlledKanban
      columns={[
        ...columns,
        {
          id: 'blocked',
          title: 'Blocked',
          description: 'Waiting on dependencies.',
          columnColor: 'danger',
          columnVariant: 'outline',
        },
      ]}
      items={[
        ...items,
        {
          id: 'task-6',
          columnId: 'in-progress',
          title: 'Polish storybook docs',
          description: 'Add every state to mdx and stories.',
          avatarSrc: 'https://i.pravatar.cc/120?img=40',
        },
        {
          id: 'task-7',
          columnId: 'in-progress',
          title: 'Add helper coverage',
          description: 'Close branch and event paths.',
          avatarSrc: 'https://i.pravatar.cc/120?img=50',
          cardColor: 'warning',
          cardVariant: 'outline',
        },
      ]}
    />
  ),
};

export const LoadingBoard: Story = {
  render: () => (
    <HansKanban columns={columns} loading loadingColor="primary" boardMinHeight="24rem" />
  ),
};
