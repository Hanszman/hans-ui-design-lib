import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansPopupItemList } from './PopupItemList';

describe('HansPopupItemList', () => {
  it('Should render empty state when there are no items', () => {
    render(
      <HansPopupItemList
        items={[]}
        emptyText="No content"
        className="my-list"
      />,
    );

    expect(screen.getByText('No content')).toBeInTheDocument();
    expect(screen.getByRole('listbox')).toHaveClass('my-list');
  });

  it('Should render items, default icon/avatar and run callbacks', () => {
    const onItemClick = vi.fn();
    const onItemEnter = vi.fn();
    const onListMouseEnter = vi.fn();
    const onListMouseLeave = vi.fn();

    render(
      <HansPopupItemList
        role="menu"
        itemRole="menuitem"
        items={[
          {
            id: 'alpha',
            label: 'Alpha',
            value: 'a',
            iconName: 'IoMdCheckmark',
          },
          {
            id: 'beta',
            label: 'Beta',
            value: 'b',
            imageSrc: '/avatar.png',
          },
        ]}
        emptyText="No content"
        selectedItemIds={['alpha']}
        itemClassName={(state) => (state.isSelected ? 'selected' : 'plain')}
        onItemClick={onItemClick}
        onItemEnter={onItemEnter}
        onListMouseEnter={onListMouseEnter}
        onListMouseLeave={onListMouseLeave}
      />,
    );

    fireEvent.mouseEnter(screen.getByRole('menu'));
    const alpha = screen.getByText('Alpha').closest('li') as HTMLElement;
    const beta = screen.getByText('Beta').closest('li') as HTMLElement;
    fireEvent.mouseEnter(alpha);
    fireEvent.click(alpha);
    fireEvent.click(beta);
    fireEvent.mouseLeave(screen.getByRole('menu'));

    expect(alpha).toHaveClass('selected');
    expect(beta).toHaveClass('plain');
    expect(onListMouseEnter).toHaveBeenCalled();
    expect(onItemEnter).toHaveBeenCalled();
    expect(onItemClick).toHaveBeenCalledTimes(2);
    expect(onListMouseLeave).toHaveBeenCalled();
  });

  it('Should render custom trailing and nested children content', () => {
    render(
      <HansPopupItemList
        items={[{ label: 'One', value: '1', children: [] }]}
        emptyText="No content"
        itemClassName="fixed-class"
        renderLeading={() => <span>Lead</span>}
        renderTrailing={() => <span>Tail</span>}
        renderChildren={() => <div>Nested</div>}
      />,
    );

    expect(screen.getByText('One').closest('li')).toHaveClass('fixed-class');
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByText('Tail')).toBeInTheDocument();
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });
});
