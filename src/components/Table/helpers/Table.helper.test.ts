import {
  applyTableFilters,
  formatTableCellValue,
  getDropdownFilterOptions,
  getFilterPlaceholder,
  getNextSortState,
  getTableStyleVars,
  getTextAlignClass,
  sortTableRows,
} from './Table.helper';
import type { HansTableColumn, HansTableRow } from '../Table.types';

describe('Table.helper', () => {
  const rows: HansTableRow[] = [
    { name: 'Carlos', age: 32, active: true, role: 'admin' },
    { name: 'Ana', age: 28, active: false, role: 'editor' },
    { name: 'Bruno', age: 40, active: true, role: 'viewer' },
  ];

  const columns: HansTableColumn[] = [
    { key: 'name', header: 'Name', sortable: true, filter: { type: 'input' } },
    { key: 'role', header: 'Role', filter: { type: 'dropdown', options: [] } },
  ];

  it('Should toggle sort state between asc and desc', () => {
    const first = getNextSortState(null, 'name');
    expect(first).toEqual({ columnKey: 'name', direction: 'asc' });
    const second = getNextSortState(first, 'name');
    expect(second).toEqual({ columnKey: 'name', direction: 'desc' });
  });

  it('Should return asc when changing sorted column', () => {
    const next = getNextSortState(
      { columnKey: 'age', direction: 'desc' },
      'name',
    );
    expect(next).toEqual({ columnKey: 'name', direction: 'asc' });
  });

  it('Should return asc when current direction is desc for same column', () => {
    const next = getNextSortState(
      { columnKey: 'name', direction: 'desc' },
      'name',
    );
    expect(next).toEqual({ columnKey: 'name', direction: 'asc' });
  });

  it('Should format supported values', () => {
    expect(formatTableCellValue(undefined)).toBe('-');
    expect(formatTableCellValue(['a', 2])).toBe('a, 2');
    expect(formatTableCellValue({ key: 'value' })).toBe('{"key":"value"}');
  });

  it('Should sort rows by provided column and direction', () => {
    const asc = sortTableRows(rows, { columnKey: 'age', direction: 'asc' });
    const desc = sortTableRows(rows, { columnKey: 'age', direction: 'desc' });
    expect(asc[0].name).toBe('Ana');
    expect(desc[0].name).toBe('Bruno');
  });

  it('Should sort boolean fields and keep equality order when values match', () => {
    const booleanRows: HansTableRow[] = [
      { name: 'A', active: true },
      { name: 'B', active: false },
      { name: 'C', active: true },
    ];
    const sorted = sortTableRows(booleanRows, {
      columnKey: 'active',
      direction: 'asc',
    });
    expect(sorted[0].name).toBe('B');
    expect(sorted[1].name).toBe('A');
    expect(sorted[2].name).toBe('C');
  });

  it('Should sort rows when compared value is an object', () => {
    const objectRows: HansTableRow[] = [
      { name: 'Row 1', meta: { label: 'zeta' } },
      { name: 'Row 2', meta: { label: 'alpha' } },
    ];
    const sorted = sortTableRows(objectRows, {
      columnKey: 'meta',
      direction: 'asc',
    });
    expect(sorted[0].name).toBe('Row 2');
  });

  it('Should return rows unchanged when no sort state exists', () => {
    expect(sortTableRows(rows, null)).toEqual(rows);
  });

  it('Should apply filters only on filterable columns', () => {
    const filtered = applyTableFilters(rows, columns, {
      name: 'an',
      role: 'edi',
      unknown: 'ignored',
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Ana');
  });

  it('Should return all rows when no filter has value', () => {
    const filtered = applyTableFilters(rows, columns, { name: '' });
    expect(filtered).toEqual(rows);
  });

  it('Should build filter placeholders', () => {
    expect(getFilterPlaceholder({ key: 'a', header: 'Name' })).toBe('');
    expect(
      getFilterPlaceholder({
        key: 'name',
        header: 'Name',
        filter: { type: 'input' },
      }),
    ).toBe('Filter Name');
    expect(
      getFilterPlaceholder({
        key: 'status',
        header: 'Status',
        filter: { type: 'dropdown', options: [], placeholder: 'Pick status' },
      }),
    ).toBe('Pick status');
  });

  it('Should include clear option for dropdown filter options', () => {
    const optionColumn: HansTableColumn = {
      key: 'status',
      header: 'Status',
      filter: {
        type: 'dropdown',
        options: [{ id: 'active', label: 'Active', value: 'Active' }],
      },
    };

    expect(getDropdownFilterOptions(optionColumn, 'Clear')).toEqual([
      {
        label: 'Clear',
        value: '',
      },
      { id: 'active', label: 'Active', value: 'Active' },
    ]);
  });

  it('Should return empty list when dropdown options are requested for non-dropdown column', () => {
    expect(
      getDropdownFilterOptions(
        { key: 'name', header: 'Name', filter: { type: 'input' } },
        'Clear',
      ),
    ).toEqual([]);
  });

  it('Should map text align classes', () => {
    expect(getTextAlignClass('left')).toBe('hans-table-align-left');
    expect(getTextAlignClass('center')).toBe('hans-table-align-center');
    expect(getTextAlignClass('right')).toBe('hans-table-align-right');
    expect(getTextAlignClass(undefined)).toBe('hans-table-align-left');
  });

  it('Should create style variables from tokens and overrides', () => {
    const styles = getTableStyleVars({
      headerColor: 'primary',
      rowColor: 'secondary',
      borderColor: 'danger',
    });
    expect(styles).toMatchObject({
      '--hans-table-header-bg': 'var(--primary-strong-color)',
      '--hans-table-header-text': 'var(--primary-neutral-color)',
      '--hans-table-row-bg': 'var(--secondary-neutral-color)',
      '--hans-table-row-text': 'var(--secondary-strong-color)',
      '--hans-table-border': 'var(--danger-default-color)',
    });
  });
});
