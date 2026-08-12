import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansDropdownItemList } from './DropdownItemList';

describe('HansDropdownItemList', () => {
  it('Should render empty state when there are no items', () => {
    render(
      <HansDropdownItemList
        items={[]}
        noOptionsText="No options"
        hoveredPath={null}
        submenuDirections={{}}
        submenuAnchors={{}}
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
      <HansDropdownItemList
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
        submenuAnchors={{}}
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

  it('Should default an already-shown submenu to the right direction when none was recorded yet', () => {
    render(
      <HansDropdownItemList
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
        submenuDirections={{}}
        submenuAnchors={{}}
        onItemEnter={vi.fn()}
        onListLeave={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText('Leaf')).toBeInTheDocument();
  });
});
