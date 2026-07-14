import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HansPagination } from './Pagination';

vi.mock('../Forms/Button/Button', () => ({
  HansButton: ({
    label,
    disabled,
    buttonVariant,
    buttonColor,
    buttonSize,
    onClick,
    ...rest
  }: {
    label: string;
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
      {label}
    </button>
  ),
}));

describe('HansPagination', () => {
  it('Should render page controls only when multiple pages exist', () => {
    const { rerender } = render(<HansPagination currentPage={1} totalPages={3} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
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

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPageChange).toHaveBeenCalledTimes(2);
    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it('Should block navigation when the component is disabled and accept custom labels', () => {
    const onPageChange = vi.fn();

    render(
      <HansPagination
        currentPage={2}
        totalPages={4}
        disabled
        ariaLabel="Admin pagination"
        previousLabel="Back"
        nextLabel="Forward"
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
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Forward' })).toBeDisabled();
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
});
