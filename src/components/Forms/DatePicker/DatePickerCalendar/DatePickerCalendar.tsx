import React from 'react';
import { HansIcon } from '../../../Icon/Icon';
import type { HansDatePickerCalendarProps } from './DatePickerCalendar.types';

export const HansDatePickerCalendar = React.memo(
  (props: HansDatePickerCalendarProps) => {
    const {
      days,
      weekdayLabels,
      monthLabel,
      calendarColor,
      calendarVariant,
      onPreviousMonth,
      onNextMonth,
      onSelectDay,
    } = props;

    return (
      <div className="hans-date-picker-calendar">
        <div className="hans-date-picker-calendar-header">
          <button
            type="button"
            className="hans-date-picker-calendar-nav"
            aria-label="Previous month"
            onClick={onPreviousMonth}
          >
            <HansIcon name="IoIosArrowBack" iconSize="small" />
          </button>
          <strong className="hans-date-picker-calendar-title">
            {monthLabel}
          </strong>
          <button
            type="button"
            className="hans-date-picker-calendar-nav"
            aria-label="Next month"
            onClick={onNextMonth}
          >
            <HansIcon name="IoIosArrowForward" iconSize="small" />
          </button>
        </div>

        <div className="hans-date-picker-calendar-grid hans-date-picker-calendar-weekdays">
          {weekdayLabels.map((weekday) => (
            <span key={weekday} className="hans-date-picker-calendar-weekday">
              {weekday}
            </span>
          ))}
        </div>

        <div className="hans-date-picker-calendar-grid">
          {days.map((day) => (
            <button
              key={day.isoValue}
              type="button"
              className={`
                hans-date-picker-day
                hans-date-picker-day-${calendarColor}
                hans-date-picker-day-${calendarVariant}
                ${day.isCurrentMonth ? '' : 'hans-date-picker-day-outside'}
                ${day.isSelected ? 'hans-date-picker-day-selected' : ''}
                ${day.isToday ? 'hans-date-picker-day-today' : ''}
              `}
              aria-pressed={day.isSelected}
              onClick={() => onSelectDay(day)}
            >
              {day.date.getDate()}
            </button>
          ))}
        </div>
      </div>
    );
  },
);

HansDatePickerCalendar.displayName = 'HansDatePickerCalendar';
