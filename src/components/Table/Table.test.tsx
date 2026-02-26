import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { HansTable } from './Table';
import type { HansTableColumn, HansTableRow } from './Table.types';

const rows: HansTableRow[] = [
  { name: 'Carlos', age: 32, status: 'Active', team: 'Platform' },
  { name: 'Ana', age: 28, status: 'Inactive', team: 'Design' },
  { name: 'Bruno', age: 40, status: 'Active', team: 'Platform' },
];

const columns: HansTableColumn[] = [
  { key: 'name', header: 'Name', sortable: true, filter: { type: 'input' } },
  { key: 'age', header: 'Age', sortable: true, align: 'right' },
  {
    key: 'status',
    header: 'Status',
    filter: {
      type: 'dropdown',
      options: [
        { id: 'active', label: 'Active', value: 'Active' },
        { id: 'inactive', label: 'Inactive', value: 'Inactive' },
      ],
      enableAutocomplete: false,
    },
  },
];

describe('HansTable', () => {
  it('Should render columns and rows', () => {
    render(<HansTable columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('Should apply column width style when informed', () => {
    const widthColumns: HansTableColumn[] = [
      { key: 'name', header: 'Name', width: '240px' },
    ];
    render(<HansTable columns={widthColumns} rows={rows} />);
    expect(screen.getByRole('columnheader')).toHaveStyle('width: 240px');
  });

  it('Should show empty state when no rows are available', () => {
    render(
      <HansTable columns={columns} rows={[]} emptyText="Nothing to show" />,
    );
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('Should sort when sortable header action is clicked', () => {
    const onSortChange = vi.fn();
    render(
      <HansTable columns={columns} rows={rows} onSortChange={onSortChange} />,
    );

    const sortButtons = screen.getAllByLabelText(/Sort by Name|Sort by Age/);
    fireEvent.click(sortButtons[0]);
    fireEvent.click(sortButtons[0]);

    expect(onSortChange).toHaveBeenCalledWith({
      columnKey: 'name',
      direction: 'asc',
    });
    expect(onSortChange).toHaveBeenLastCalledWith({
      columnKey: 'name',
      direction: 'desc',
    });
  });

  it('Should filter rows using input filter', () => {
    const onFiltersChange = vi.fn();
    render(
      <HansTable
        columns={columns}
        rows={rows}
        onFiltersChange={onFiltersChange}
      />,
    );

    const input = screen.getByPlaceholderText('Filter Name');
    fireEvent.change(input, { target: { value: 'Ana' } });

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ana' }),
    );
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.queryByText('Carlos')).not.toBeInTheDocument();
  });

  it('Should filter rows using dropdown filter', async () => {
    render(<HansTable columns={columns} rows={rows} />);

    const statusInput = screen.getByPlaceholderText('Select Status');
    fireEvent.mouseDown(statusInput);
    const listbox = await screen.findByRole('listbox');
    fireEvent.click(within(listbox).getByText('Inactive'));

    expect(screen.getByDisplayValue('Inactive')).toBeInTheDocument();
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('Should clear dropdown filter using clear option', async () => {
    render(
      <HansTable
        columns={columns}
        rows={rows}
        defaultDropdownFilterClearLabel="Reset"
      />,
    );

    const statusInput = screen.getByPlaceholderText('Select Status');
    fireEvent.mouseDown(statusInput);
    let listbox = await screen.findByRole('listbox');
    fireEvent.click(within(listbox).getByText('Inactive'));
    expect(screen.queryByText('Carlos')).not.toBeInTheDocument();

    fireEvent.mouseDown(statusInput);
    listbox = await screen.findByRole('listbox');
    fireEvent.click(within(listbox).getByText('Reset'));

    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(statusInput).toHaveValue('');
  });

  it('Should render custom cell value with render function', () => {
    const customColumns: HansTableColumn[] = [
      {
        key: 'name',
        header: 'Name',
        render: (value) => <span>{`User: ${value as string}`}</span>,
      },
    ];
    render(<HansTable columns={customColumns} rows={rows} />);
    expect(screen.getByText('User: Carlos')).toBeInTheDocument();
  });

  it('Should fallback autocomplete=true on dropdown filter config', async () => {
    const autocompleteColumns: HansTableColumn[] = [
      {
        key: 'status',
        header: 'Status',
        filter: {
          type: 'dropdown',
          options: [
            { id: 'active', label: 'Active', value: 'Active' },
            { id: 'inactive', label: 'Inactive', value: 'Inactive' },
          ],
        },
      },
    ];

    render(<HansTable columns={autocompleteColumns} rows={rows} />);
    const statusInput = screen.getByPlaceholderText('Select Status');
    fireEvent.change(statusInput, { target: { value: 'In' } });
    const listbox = await screen.findByRole('listbox');
    fireEvent.click(within(listbox).getByText('Inactive'));

    expect(screen.getByDisplayValue('Inactive')).toBeInTheDocument();
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('Should apply custom styles and striped mode', () => {
    const { container } = render(
      <HansTable
        columns={columns}
        rows={rows}
        headerBackgroundColor="rgb(10, 20, 30)"
        striped
      />,
    );

    const wrapper = container.querySelector('.hans-table-wrapper');
    const stripedBody = container.querySelector('.hans-table-striped');

    expect(wrapper).toHaveStyle('--hans-table-header-bg: rgb(10, 20, 30)');
    expect(stripedBody).toBeInTheDocument();
  });

  it('Should apply column divider class when enabled', () => {
    const { container } = render(
      <HansTable columns={columns} rows={rows} showColumnDividers />,
    );

    expect(container.querySelector('.hans-table-with-column-dividers')).toBeInTheDocument();
  });

  it('Should accept initial sort and filter changes from props', () => {
    const { rerender } = render(
      <HansTable
        columns={columns}
        rows={rows}
        initialFilters={{ name: 'Br' }}
        initialSort={{ columnKey: 'age', direction: 'desc' }}
      />,
    );

    expect(screen.getByText('Bruno')).toBeInTheDocument();
    expect(screen.queryByText('Ana')).not.toBeInTheDocument();

    rerender(
      <HansTable
        columns={columns}
        rows={rows}
        initialFilters={{ name: 'Ca' }}
        initialSort={{ columnKey: 'age', direction: 'asc' }}
      />,
    );

    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.queryByText('Bruno')).not.toBeInTheDocument();
  });
});
