import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansTableHeader } from './TableHeader';
import type { HansTableHeaderProps } from './TableHeader.types';

const baseProps: HansTableHeaderProps = {
  columns: [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'team', header: 'Team' },
  ],
  sortState: null,
  onSort: vi.fn(),
};

describe('HansTableHeader', () => {
  it('Should render headers and sortable action only for sortable columns', () => {
    render(
      <table>
        <HansTableHeader {...baseProps} />
      </table>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by Name')).toBeInTheDocument();
    expect(screen.queryByLabelText('Sort by Team')).not.toBeInTheDocument();
  });

  it('Should call onSort when sort button is clicked', () => {
    const onSort = vi.fn();
    render(
      <table>
        <HansTableHeader {...baseProps} onSort={onSort} />
      </table>,
    );

    fireEvent.click(screen.getByLabelText('Sort by Name'));
    expect(onSort).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'name' }),
    );
  });

  it('Should render loading placeholders when header is loading', () => {
    render(
      <table>
        <HansTableHeader
          {...baseProps}
          isLoading
          loadingType="skeleton"
          loadingAriaLabel="Loading header"
        />
      </table>,
    );

    expect(screen.getAllByLabelText('Loading header')).toHaveLength(2);
    expect(screen.queryByLabelText('Sort by Name')).not.toBeInTheDocument();
  });
});
