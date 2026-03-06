import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansDropdownOptionList } from './DropdownOptionList';

describe('HansDropdownOptionList', () => {
  it('Should render empty state when there are no items', () => {
    render(
      <HansDropdownOptionList
        items={[]}
        noOptionsText="No options"
        hoveredPath={null}
        submenuDirections={{}}
        onItemEnter={vi.fn()}
        onListLeave={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  it('Should render nested submenu and trigger selection for leaf', () => {
    const onItemEnter = vi.fn();
    const onListLeave = vi.fn();
    const onSelect = vi.fn();
    render(
      <HansDropdownOptionList
        items={[
          {
            id: 'parent',
            label: 'Parent',
            value: 'parent',
            children: [{ id: 'leaf', label: 'Leaf', value: 'leaf' }],
          },
        ]}
        noOptionsText="No options"
        hoveredPath="0"
        submenuDirections={{ '0': 'right' }}
        onItemEnter={onItemEnter}
        onListLeave={onListLeave}
        onSelect={onSelect}
      />,
    );

    const parent = screen.getByText('Parent').closest('li') as HTMLElement;
    fireEvent.mouseEnter(parent);
    fireEvent.mouseLeave(screen.getAllByRole('menu')[0]);
    fireEvent.click(screen.getByText('Leaf'));

    expect(onItemEnter).toHaveBeenCalled();
    expect(onListLeave).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith({
      id: 'leaf',
      label: 'Leaf',
      value: 'leaf',
    });
  });
});
