import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansMonthYearPicker } from './MonthYearPicker';

describe('HansMonthYearPicker', () => {
  it('Should render the month grid, mark the selected/current month and select a month', () => {
    const onSelect = vi.fn();
    const onPreviousPage = vi.fn();
    const onNextPage = vi.fn();
    const onBack = vi.fn();

    render(
      <HansMonthYearPicker
        mode="month"
        viewDate={new Date(2026, 2, 13)}
        pageAnchor={2026}
        calendarColor="primary"
        calendarVariant="default"
        backLabel="Back to calendar"
        previousPageLabel="Previous year"
        nextPageLabel="Next year"
        onSelect={onSelect}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onBack={onBack}
      />,
    );

    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'March' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'June' }));
    expect(onSelect).toHaveBeenCalledWith(5);

    fireEvent.click(screen.getByLabelText('Back to calendar'));
    expect(onBack).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Previous year'));
    expect(onPreviousPage).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Next year'));
    expect(onNextPage).toHaveBeenCalled();
  });

  it('Should render the year grid window, mark the selected year and select a year', () => {
    const onSelect = vi.fn();

    render(
      <HansMonthYearPicker
        mode="year"
        viewDate={new Date(2026, 2, 13)}
        pageAnchor={2016}
        calendarColor="secondary"
        calendarVariant="outline"
        backLabel="Back to calendar"
        previousPageLabel="Previous years"
        nextPageLabel="Next years"
        onSelect={onSelect}
        onPreviousPage={vi.fn()}
        onNextPage={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByText('2016 - 2027')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2026' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: '2020' }));
    expect(onSelect).toHaveBeenCalledWith(2020);
  });
});
