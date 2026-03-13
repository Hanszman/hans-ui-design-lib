import React from 'react';
import { HansButton } from '../../Button/Button';
import { HansIcon } from '../../../Icon/Icon';
import { HansInput } from '../../Input/Input';
import type { HansDatePickerCalendarProps } from './DatePickerCalendar.types';

export const HansDatePickerCalendar = React.memo(
  (props: HansDatePickerCalendarProps) => {
    const {
      days,
      weekdayLabels,
      monthLabel,
      calendarColor,
      calendarVariant,
      inputColor,
      timePrecision,
      pickerType,
      timeInputValue,
      clearLabel,
      todayLabel,
      applyLabel,
      allowApply,
      onPreviousMonth,
      onNextMonth,
      onSelectDay,
      onTimeInputChange,
      onClear,
      onToday,
      onApply,
    } = props;

    return (
      <div className="hans-date-picker-calendar">
        <div className="hans-date-picker-calendar-header">
          <HansButton
            buttonColor={calendarColor}
            buttonVariant="outline"
            buttonSize="small"
            buttonShape="rounded"
            customClasses="hans-date-picker-calendar-nav"
            aria-label="Previous month"
            onClick={onPreviousMonth}
          >
            <HansIcon name="IoIosArrowBack" iconSize="small" />
          </HansButton>
          <strong className="hans-date-picker-calendar-title">{monthLabel}</strong>
          <HansButton
            buttonColor={calendarColor}
            buttonVariant="outline"
            buttonSize="small"
            buttonShape="rounded"
            customClasses="hans-date-picker-calendar-nav"
            aria-label="Next month"
            onClick={onNextMonth}
          >
            <HansIcon name="IoIosArrowForward" iconSize="small" />
          </HansButton>
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
            <HansButton
              key={day.isoValue}
              buttonColor={calendarColor}
              buttonVariant={
                day.isSelected ? calendarVariant : day.isCurrentMonth ? 'transparent' : 'outline'
              }
              buttonSize="small"
              buttonShape="rounded"
              customClasses={`
                hans-date-picker-day
                ${day.isCurrentMonth ? '' : 'hans-date-picker-day-outside'}
                ${day.isSelected ? 'hans-date-picker-day-selected' : ''}
                ${day.isToday ? 'hans-date-picker-day-today' : ''}
              `}
              aria-pressed={day.isSelected}
              onClick={() => onSelectDay(day)}
            >
              {day.date.getDate()}
            </HansButton>
          ))}
        </div>

        {pickerType === 'datetime' ? (
          <div className="hans-date-picker-time-panel">
            <HansInput
              inputId="hans-date-picker-calendar-time"
              label="Time"
              inputColor={inputColor}
              inputSize="small"
              placeholder={timePrecision === 'second' ? 'HH:MM:SS' : 'HH:MM'}
              value={timeInputValue}
              onChange={onTimeInputChange}
              rightIcon={<HansIcon name="MdAccessTime" iconSize="small" />}
            />
          </div>
        ) : null}

        <div className="hans-date-picker-actions">
          <HansButton
            label={clearLabel}
            buttonSize="small"
            buttonColor="base"
            buttonVariant="transparent"
            onClick={onClear}
          />
          <HansButton
            label={todayLabel}
            buttonSize="small"
            buttonColor={calendarColor}
            buttonVariant="neutral"
            onClick={onToday}
          />
          {pickerType === 'datetime' ? (
            <HansButton
              label={applyLabel}
              buttonSize="small"
              buttonColor={calendarColor}
              buttonVariant={calendarVariant}
              disabled={!allowApply}
              onClick={onApply}
            />
          ) : null}
        </div>
      </div>
    );
  },
);

HansDatePickerCalendar.displayName = 'HansDatePickerCalendar';
