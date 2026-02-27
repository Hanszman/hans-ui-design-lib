import type { Meta, StoryObj } from '@storybook/react';
import { HansTable } from './Table';
import type { HansTableColumn, HansTableRow } from './Table.types';
import DocsPage from './Table.mdx';

const rows: HansTableRow[] = [
  {
    id: 'usr-1',
    name: 'Carlos Mendes',
    role: 'Admin',
    team: 'Platform',
    score: 92,
  },
  { id: 'usr-2', name: 'Ana Souza', role: 'Editor', team: 'Design', score: 84 },
  {
    id: 'usr-3',
    name: 'Bruno Lima',
    role: 'Viewer',
    team: 'Platform',
    score: 76,
  },
  {
    id: 'usr-4',
    name: 'Marina Costa',
    role: 'Editor',
    team: 'Marketing',
    score: 88,
  },
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
          clearLabel: 'Clear role',
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
    headerColor: 'secondary',
    rowColor: 'base',
    headerTextColor: 'base',
    rowTextColor: 'base',
    borderColor: 'secondary',
    dividerColor: 'base',
    rowHoverColor: 'info',
    striped: true,
  },
};

export const ColumnDividers: Story = {
  args: {
    showColumnDividers: true,
  },
};

export const ColorThemes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <HansTable columns={columns} rows={rows} />
      <HansTable
        columns={columns}
        rows={rows}
        headerColor="primary"
        rowColor="base"
        headerTextColor="base"
      />
      <HansTable
        columns={columns}
        rows={rows}
        headerColor="danger"
        rowColor="warning"
        headerTextColor="base"
        rowTextColor="warning"
        borderColor="danger"
        dividerColor="warning"
        rowHoverColor="danger"
        striped
      />
    </div>
  ),
};

export const Alignments: Story = {
  args: {
    columns: [
      { key: 'name', header: 'Name', align: 'left', sortable: true },
      { key: 'role', header: 'Role', align: 'center', sortable: true },
      { key: 'team', header: 'Team', align: 'center' },
      { key: 'score', header: 'Score', align: 'right', sortable: true },
    ],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    loadingType: 'skeleton',
  },
};

export const VerticalScroll: Story = {
  args: {
    rows: Array.from({ length: 24 }, (_, index) => ({
      id: `user-${index + 1}`,
      name: `User ${index + 1}`,
      role: index % 2 === 0 ? 'Editor' : 'Viewer',
      team: index % 3 === 0 ? 'Platform' : 'Design',
      score: 60 + (index % 40),
    })),
    maxHeight: '360px',
  },
};

export const HorizontalScroll: Story = {
  args: {
    columns: [
      { key: 'name', header: 'Name', width: '220px' },
      { key: 'role', header: 'Role', width: '180px' },
      { key: 'team', header: 'Team', width: '180px' },
      { key: 'score', header: 'Score', width: '140px', align: 'right' },
      { key: 'country', header: 'Country', width: '180px' },
      { key: 'city', header: 'City', width: '200px' },
      { key: 'department', header: 'Department', width: '220px' },
      { key: 'status', header: 'Status', width: '180px' },
    ],
    rows: rows.map((row) => ({
      ...row,
      country: 'Brazil',
      city: 'Sao Paulo',
      department: 'Engineering',
      status: 'Active',
    })),
    minWidth: '1500px',
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    emptyText: 'No users available for this query',
  },
};
