import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansDatePickerCalendar } from './DatePickerCalendar';

const days = Array.from({ length: 42 }, (_, index) => ({
  date: new Date(2026, 2, index + 1),
  isoValue: `2026-03-${String(index + 1).padStart(2, '0')}`,
  isCurrentMonth: index < 31,
  isSelected: index === 5,
  isToday: index === 7,
}));

describe('HansDatePickerCalendar', () => {
  it('Should render month navigation, weekdays and selectable days', () => {
    const onPreviousMonth = vi.fn();
    const onNextMonth = vi.fn();
    const onSelectDay = vi.fn();

    render(
      <HansDatePickerCalendar
        days={days}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        monthLabel="March 2026"
        calendarColor="primary"
        calendarVariant="default"
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
        onSelectDay={onSelectDay}
      />,
    );

    fireEvent.click(screen.getByLabelText('Previous month'));
    fireEvent.click(screen.getByLabelText('Next month'));
    fireEvent.click(screen.getByRole('button', { name: '6', pressed: true }));

    expect(screen.getByText('March 2026')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(onPreviousMonth).toHaveBeenCalled();
    expect(onNextMonth).toHaveBeenCalled();
    expect(onSelectDay).toHaveBeenCalledWith(days[5]);
  });
});
