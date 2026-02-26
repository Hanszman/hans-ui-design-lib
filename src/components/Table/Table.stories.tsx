import type { Meta, StoryObj } from '@storybook/react';
import { HansTable } from './Table';
import type { HansTableColumn, HansTableRow } from './Table.types';
import DocsPage from './Table.mdx';

const rows: HansTableRow[] = [
  { id: 'usr-1', name: 'Carlos Mendes', role: 'Admin', team: 'Platform', score: 92 },
  { id: 'usr-2', name: 'Ana Souza', role: 'Editor', team: 'Design', score: 84 },
  { id: 'usr-3', name: 'Bruno Lima', role: 'Viewer', team: 'Platform', score: 76 },
  { id: 'usr-4', name: 'Marina Costa', role: 'Editor', team: 'Marketing', score: 88 },
];

const columns: HansTableColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'team', header: 'Team' },
  { key: 'score', header: 'Score', align: 'right' },
];

const meta: Meta<typeof HansTable> = {
  title: 'Components/Table',
  component: HansTable,
  args: {
    columns,
    rows,
    headerColor: 'base',
    rowColor: 'base',
    emptyText: 'No records found',
  },
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HansTable>;

export const Primary: Story = {};

export const Sortable: Story = {
  args: {
    columns: [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'team', header: 'Team', sortable: true },
      { key: 'score', header: 'Score', sortable: true, align: 'right' },
    ],
  },
};

export const Filterable: Story = {
  args: {
    columns: [
      {
        key: 'name',
        header: 'Name',
        sortable: true,
        filter: { type: 'input', placeholder: 'Search by name' },
      },
      {
        key: 'role',
        header: 'Role',
        filter: {
          type: 'dropdown',
          placeholder: 'Select role',
          options: [
            { id: 'admin', label: 'Admin', value: 'Admin' },
            { id: 'editor', label: 'Editor', value: 'Editor' },
            { id: 'viewer', label: 'Viewer', value: 'Viewer' },
          ],
          enableAutocomplete: false,
        },
      },
      { key: 'team', header: 'Team', filter: { type: 'input' } },
      { key: 'score', header: 'Score', sortable: true, align: 'right' },
    ],
  },
};

export const CustomColors: Story = {
  args: {
    headerBackgroundColor: 'rgb(23, 32, 56)',
    headerTextColor: '#ffffff',
    rowBackgroundColor: '#ffffff',
    rowTextColor: 'rgb(22, 28, 45)',
    borderColor: 'rgb(205, 214, 233)',
    dividerColor: 'rgb(230, 236, 247)',
    rowHoverColor: 'rgb(246, 248, 255)',
    striped: true,
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    emptyText: 'No users available for this query',
  },
};

