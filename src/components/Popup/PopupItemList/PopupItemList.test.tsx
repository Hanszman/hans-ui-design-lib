import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansPopupItemList } from './PopupItemList';

describe('HansPopupItemList', () => {
  it('Should render children when hasItems is true', () => {
    render(
      <HansPopupItemList hasItems emptyText="No content" role="menu">
        <li>Item A</li>
      </HansPopupItemList>,
    );

    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.queryByText('No content')).not.toBeInTheDocument();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('Should render empty state when hasItems is false', () => {
    render(
      <HansPopupItemList hasItems={false} emptyText="No content" />,
    );

    expect(screen.getByText('No content')).toBeInTheDocument();
  });

  it('Should render as div and call onMouseLeave', () => {
    const onMouseLeave = vi.fn();
    render(
      <HansPopupItemList
        as="div"
        role="menu"
        hasItems
        emptyText="No content"
        onMouseLeave={onMouseLeave}
      >
        <div>Content</div>
      </HansPopupItemList>,
    );

    fireEvent.mouseLeave(screen.getByRole('menu'));
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('Should render as fragment with custom empty element', () => {
    render(
      <ul>
        <HansPopupItemList
          as="none"
          hasItems={false}
          emptyText="No content"
          emptyAs="li"
        />
      </ul>,
    );

    expect(screen.getByRole('listitem')).toHaveTextContent('No content');
  });

  it('Should render empty div when emptyAs is div', () => {
    render(
      <HansPopupItemList
        as="div"
        hasItems={false}
        emptyText="No content"
        emptyAs="div"
      />,
    );

    expect(screen.getByText('No content').tagName).toBe('DIV');
  });
});
