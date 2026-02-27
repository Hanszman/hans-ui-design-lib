import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HansTableBody } from './TableBody';

describe('HansTableBody', () => {
  it('Should render empty state when no rows exist', () => {
    render(
      <table>
        <HansTableBody
          columns={[{ key: 'name', header: 'Name' }]}
          rows={[]}
          striped={false}
          emptyText="No data"
        />
      </table>,
    );

    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('Should render row values and striped class', () => {
    render(
      <table>
        <HansTableBody
          columns={[
            { key: 'name', header: 'Name' },
            {
              key: 'score',
              header: 'Score',
              render: (value) => <strong>{value as number}</strong>,
            },
          ]}
          rows={[{ name: 'Ana', score: 90 }]}
          striped
          emptyText="No data"
        />
      </table>,
    );

    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(document.querySelector('.hans-table-striped')).toBeInTheDocument();
  });
});
