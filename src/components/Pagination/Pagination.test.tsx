import '@testing-library/jest-dom';
import type React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HansPagination } from './Pagination';

vi.mock('../Forms/Button/Button', () => ({
  HansButton: ({
    label,
    children,
    disabled,
    buttonVariant,
    buttonColor,
    buttonSize,
    onClick,
    ...rest
  }: {
    label?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    buttonVariant?: string;
    buttonColor?: string;
    buttonSize?: string;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button
      type="button"
      data-color={buttonColor}
      data-size={buttonSize}
      data-variant={buttonVariant}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children ?? label}
    </button>
  ),
}));

vi.mock('../Icon/Icon', () => ({
  HansIcon: ({ name }: { name?: string }) => (
    <span data-testid={`mock-pagination-icon-${name}`}>{name}</span>
  ),
}));

describe('HansPagination', () => {
  it('Should render page controls only when multiple pages exist', () => {
    const { rerender } = render(<HansPagination currentPage={1} totalPages={3} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Last' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
      'data-variant',
      'default',
    );
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
      'data-variant',
      'outline',
    );

    rerender(<HansPagination currentPage={1} totalPages={1} />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('Should emit page changes only for valid targets', () => {
    const onPageChange = vi.fn();

    render(
      <HansPagination
        currentPage={2}
        totalPages={3}
        onPageChange={onPageChange}
        pageLabel="Page"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Last' }));

    expect(onPageChange).toHaveBeenCalledTimes(4);
    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(3, 3);
    expect(onPageChange).toHaveBeenNthCalledWith(4, 3);
  });

  it('Should block navigation when the component is disabled and accept custom labels', () => {
    const onPageChange = vi.fn();

    render(
      <HansPagination
        currentPage={2}
        totalPages={4}
        disabled
        ariaLabel="Admin pagination"
        firstLabel="Start"
        previousLabel="Back"
        nextLabel="Forward"
        lastLabel="End"
        pageLabel="Screen"
        paginationColor="secondary"
        paginationSize="large"
        activePageVariant="strong"
        inactivePageVariant="transparent"
        onPageChange={onPageChange}
      />,
    );

    const navigation = screen.getByRole('navigation', { name: 'Admin pagination' });
    expect(navigation).toHaveClass('hans-pagination');
    expect(screen.getByRole('button', { name: 'Start' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Forward' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'End' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Screen 2' })).toHaveAttribute(
      'data-variant',
      'strong',
    );
    expect(screen.getByRole('button', { name: 'Screen 1' })).toHaveAttribute(
      'data-variant',
      'transparent',
    );
    expect(screen.getByRole('button', { name: 'Screen 4' })).toHaveAttribute(
      'data-color',
      'secondary',
    );
    expect(screen.getByRole('button', { name: 'Screen 4' })).toHaveAttribute(
      'data-size',
      'large',
    );
    expect(screen.getByRole('button', { name: 'Screen 4' })).toHaveAttribute(
      'aria-label',
      'Screen 4',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Screen 4' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('Should support icon, text and node content props and collapse long ranges with ellipsis', () => {
    render(
      <HansPagination
        currentPage={6}
        totalPages={10}
        firstContent="MdKeyboardDoubleArrowLeft"
        previousContent={<strong>Prev</strong>}
        nextContent="Go"
        lastContent="MdKeyboardDoubleArrowRight"
      />,
    );

    expect(
      screen.getByTestId('mock-pagination-icon-MdKeyboardDoubleArrowLeft'),
    ).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-pagination-icon-MdKeyboardDoubleArrowRight'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
  });
});
