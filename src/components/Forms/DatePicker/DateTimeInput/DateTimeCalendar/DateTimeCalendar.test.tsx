import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansDateTimeCalendar } from './DateTimeCalendar';

const days = Array.from({ length: 42 }, (_, index) => ({
  date: new Date(2026, 2, index + 1),
  isoValue: `2026-03-${String(index + 1).padStart(2, '0')}`,
  isCurrentMonth: index < 31,
  isSelected: index === 5,
  isToday: index === 7,
}));

describe('HansDateTimeCalendar', () => {
  it('Should render navigation, weekdays and selectable days', () => {
    const onPreviousMonth = vi.fn();
    const onNextMonth = vi.fn();
    const onSelectDay = vi.fn();

    render(
      <HansDateTimeCalendar
        calendarView="days"
        days={days}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        viewDate={new Date(2026, 2, 13)}
        pageAnchor={2026}
        calendarColor="primary"
        calendarVariant="default"
        inputColor="primary"
        timePrecision="minute"
        pickerType="datetime"
        timeInputValue="10:15"
        clearLabel="Clear"
        todayLabel="Today"
        applyLabel="Apply"
        allowApply
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
        onSelectDay={onSelectDay}
        onOpenMonthPicker={vi.fn()}
        onOpenYearPicker={vi.fn()}
        onSelectMonthYear={vi.fn()}
        onPreviousMonthYearPage={vi.fn()}
        onNextMonthYearPage={vi.fn()}
        onBackToCalendar={vi.fn()}
        onTimeInputChange={vi.fn()}
        onClear={vi.fn()}
        onToday={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByLabelText('Previous month'));
    fireEvent.click(screen.getByLabelText('Next month'));
    fireEvent.click(screen.getByRole('button', { name: '6', pressed: true }));

    expect(screen.getByText('March')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(onPreviousMonth).toHaveBeenCalled();
    expect(onNextMonth).toHaveBeenCalled();
    expect(onSelectDay).toHaveBeenCalledWith(days[5]);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('Should open the month and year picker from the header title', () => {
    const onOpenMonthPicker = vi.fn();
    const onOpenYearPicker = vi.fn();

    render(
      <HansDateTimeCalendar
        calendarView="days"
        days={days}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        viewDate={new Date(2026, 2, 13)}
        pageAnchor={2026}
        calendarColor="primary"
        calendarVariant="default"
        inputColor="primary"
        timePrecision="minute"
        pickerType="date"
        timeInputValue=""
        clearLabel="Clear"
        todayLabel="Today"
        applyLabel="Apply"
        allowApply={false}
        onPreviousMonth={vi.fn()}
        onNextMonth={vi.fn()}
        onSelectDay={vi.fn()}
        onOpenMonthPicker={onOpenMonthPicker}
        onOpenYearPicker={onOpenYearPicker}
        onSelectMonthYear={vi.fn()}
        onPreviousMonthYearPage={vi.fn()}
        onNextMonthYearPage={vi.fn()}
        onBackToCalendar={vi.fn()}
        onTimeInputChange={vi.fn()}
        onClear={vi.fn()}
        onToday={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByLabelText('Open month picker'));
    expect(onOpenMonthPicker).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Open year picker'));
    expect(onOpenYearPicker).toHaveBeenCalled();
  });

  it('Should render the month picker page and forward its actions', () => {
    const onSelectMonthYear = vi.fn();
    const onPreviousMonthYearPage = vi.fn();
    const onNextMonthYearPage = vi.fn();
    const onBackToCalendar = vi.fn();

    render(
      <HansDateTimeCalendar
        calendarView="months"
        days={days}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        viewDate={new Date(2026, 2, 13)}
        pageAnchor={2026}
        calendarColor="primary"
        calendarVariant="default"
        inputColor="primary"
        timePrecision="minute"
        pickerType="datetime"
        timeInputValue="10:15"
        clearLabel="Clear"
        todayLabel="Today"
        applyLabel="Apply"
        allowApply
        onPreviousMonth={vi.fn()}
        onNextMonth={vi.fn()}
        onSelectDay={vi.fn()}
        onOpenMonthPicker={vi.fn()}
        onOpenYearPicker={vi.fn()}
        onSelectMonthYear={onSelectMonthYear}
        onPreviousMonthYearPage={onPreviousMonthYearPage}
        onNextMonthYearPage={onNextMonthYearPage}
        onBackToCalendar={onBackToCalendar}
        onTimeInputChange={vi.fn()}
        onClear={vi.fn()}
        onToday={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    expect(screen.queryByText('Apply')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Time')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'June' }));
    expect(onSelectMonthYear).toHaveBeenCalledWith(5);

    fireEvent.click(screen.getByLabelText('Previous year'));
    expect(onPreviousMonthYearPage).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Next year'));
    expect(onNextMonthYearPage).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Back to calendar'));
    expect(onBackToCalendar).toHaveBeenCalled();
  });

  it('Should render the year picker page with its own page labels', () => {
    render(
      <HansDateTimeCalendar
        calendarView="years"
        days={days}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        viewDate={new Date(2026, 2, 13)}
        pageAnchor={2016}
        calendarColor="primary"
        calendarVariant="default"
        inputColor="primary"
        timePrecision="minute"
        pickerType="date"
        timeInputValue=""
        clearLabel="Clear"
        todayLabel="Today"
        applyLabel="Apply"
        allowApply={false}
        onPreviousMonth={vi.fn()}
        onNextMonth={vi.fn()}
        onSelectDay={vi.fn()}
        onOpenMonthPicker={vi.fn()}
        onOpenYearPicker={vi.fn()}
        onSelectMonthYear={vi.fn()}
        onPreviousMonthYearPage={vi.fn()}
        onNextMonthYearPage={vi.fn()}
        onBackToCalendar={vi.fn()}
        onTimeInputChange={vi.fn()}
        onClear={vi.fn()}
        onToday={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    expect(screen.getByText('2016 - 2027')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous years')).toBeInTheDocument();
    expect(screen.getByLabelText('Next years')).toBeInTheDocument();
  });

  it('Should render the shared time input and clear invalid datetime times', () => {
    const onTimeInputChange = vi.fn();
    render(
      <HansDateTimeCalendar
        calendarView="days"
        days={days}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        viewDate={new Date(2026, 2, 13)}
        pageAnchor={2026}
        calendarColor="primary"
        calendarVariant="default"
        inputColor="primary"
        timePrecision="second"
        pickerType="datetime"
        timeInputValue="10:15:20"
        clearLabel="Clear"
        todayLabel="Today"
        applyLabel="Apply"
        allowApply
        onPreviousMonth={vi.fn()}
        onNextMonth={vi.fn()}
        onSelectDay={vi.fn()}
        onOpenMonthPicker={vi.fn()}
        onOpenYearPicker={vi.fn()}
        onSelectMonthYear={vi.fn()}
        onPreviousMonthYearPage={vi.fn()}
        onNextMonthYearPage={vi.fn()}
        onBackToCalendar={vi.fn()}
        onTimeInputChange={onTimeInputChange}
        onClear={vi.fn()}
        onToday={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText('HH:MM:SS')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '256600' } });
    expect(onTimeInputChange).toHaveBeenCalledWith('');
  });

  it('Should hide time controls when picker type is date', () => {
    render(
      <HansDateTimeCalendar
        calendarView="days"
        days={days}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        viewDate={new Date(2026, 2, 13)}
        pageAnchor={2026}
        calendarColor="secondary"
        calendarVariant="outline"
        inputColor="primary"
        timePrecision="second"
        pickerType="date"
        timeInputValue=""
        clearLabel="Clear"
        todayLabel="Today"
        applyLabel="Apply"
        allowApply={false}
        onPreviousMonth={vi.fn()}
        onNextMonth={vi.fn()}
        onSelectDay={vi.fn()}
        onOpenMonthPicker={vi.fn()}
        onOpenYearPicker={vi.fn()}
        onSelectMonthYear={vi.fn()}
        onPreviousMonthYearPage={vi.fn()}
        onNextMonthYearPage={vi.fn()}
        onBackToCalendar={vi.fn()}
        onTimeInputChange={vi.fn()}
        onClear={vi.fn()}
        onToday={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText('Time')).not.toBeInTheDocument();
    expect(screen.queryByText('Apply')).not.toBeInTheDocument();
  });
});
