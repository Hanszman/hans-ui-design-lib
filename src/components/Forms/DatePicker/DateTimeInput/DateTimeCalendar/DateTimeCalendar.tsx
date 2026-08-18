import React from 'react';
import { HansButton } from '../../../Button/Button';
import { HansIcon } from '../../../../Icon/Icon';
import { HansTimeInput } from '../../TimeInput/TimeInput';
import type { HansDateTimeCalendarProps } from './DateTimeCalendar.types';
import { HansMonthYearPicker } from './MonthYearPicker/MonthYearPicker';
import { getDatePickerMonthName } from './helpers/DateTimeCalendar.helper';

export const HansDateTimeCalendar = React.memo(
  (props: HansDateTimeCalendarProps) => {
    const {
      calendarView,
      days,
      weekdayLabels,
      viewDate,
      pageAnchor,
      locale,
      calendarColor,
      calendarVariant,
      inputColor,
      timePrecision,
      pickerType,
      timeInputValue,
      clearLabel,
      todayLabel,
      applyLabel,
      timeLabel = 'Time',
      previousMonthLabel = 'Previous month',
      nextMonthLabel = 'Next month',
      monthPickerLabel = 'Open month picker',
      yearPickerLabel = 'Open year picker',
      backToCalendarLabel = 'Back to calendar',
      previousYearLabel = 'Previous year',
      nextYearLabel = 'Next year',
      previousYearsLabel = 'Previous years',
      nextYearsLabel = 'Next years',
      allowApply,
      onPreviousMonth,
      onNextMonth,
      onSelectDay,
      onOpenMonthPicker,
      onOpenYearPicker,
      onSelectMonthYear,
      onPreviousMonthYearPage,
      onNextMonthYearPage,
      onBackToCalendar,
      onTimeInputChange,
      onClear,
      onToday,
      onApply,
    } = props;

    const isDayView = calendarView === 'days';
    const monthName = getDatePickerMonthName(viewDate, locale);
    const year = viewDate.getFullYear();

    return (
      <div className="hans-date-picker-calendar">
        {isDayView ? (
          <>
            <div className="hans-date-picker-calendar-header">
              <HansButton
                buttonColor={calendarColor}
                buttonVariant="outline"
                buttonSize="small"
                buttonShape="circle"
                customClasses="hans-date-picker-calendar-nav"
                aria-label={previousMonthLabel}
                onClick={onPreviousMonth}
              >
                <HansIcon name="IoIosArrowBack" iconSize="small" />
              </HansButton>
              <div className="hans-date-picker-calendar-title">
                <button
                  type="button"
                  className="hans-date-picker-calendar-title-button"
                  aria-label={monthPickerLabel}
                  onClick={onOpenMonthPicker}
                >
                  {monthName}
                </button>
                <button
                  type="button"
                  className="hans-date-picker-calendar-title-button"
                  aria-label={yearPickerLabel}
                  onClick={onOpenYearPicker}
                >
                  {year}
                </button>
              </div>
              <HansButton
                buttonColor={calendarColor}
                buttonVariant="outline"
                buttonSize="small"
                buttonShape="circle"
                customClasses="hans-date-picker-calendar-nav"
                aria-label={nextMonthLabel}
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
                <button
                  key={day.isoValue}
                  type="button"
                  className={`
                    hans-date-picker-day
                    hans-date-picker-day-color-${calendarColor}
                    hans-date-picker-day-variant-${calendarVariant}
                    ${day.isCurrentMonth ? '' : 'hans-date-picker-day-outside'}
                    ${day.isSelected ? 'hans-date-picker-day-selected' : ''}
                    ${day.isToday ? 'hans-date-picker-day-today' : ''}
                  `.trim()}
                  aria-pressed={day.isSelected}
                  onClick={() => onSelectDay(day)}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>
          </>
        ) : (
          <HansMonthYearPicker
            mode={calendarView === 'months' ? 'month' : 'year'}
            viewDate={viewDate}
            pageAnchor={pageAnchor}
            locale={locale}
            calendarColor={calendarColor}
            calendarVariant={calendarVariant}
            backLabel={backToCalendarLabel}
            previousPageLabel={
              calendarView === 'months' ? previousYearLabel : previousYearsLabel
            }
            nextPageLabel={
              calendarView === 'months' ? nextYearLabel : nextYearsLabel
            }
            onSelect={onSelectMonthYear}
            onPreviousPage={onPreviousMonthYearPage}
            onNextPage={onNextMonthYearPage}
            onBack={onBackToCalendar}
          />
        )}

        {pickerType === 'datetime' && isDayView ? (
          <div className="hans-date-picker-time-panel">
            <HansTimeInput
              inputId="hans-date-picker-calendar-time"
              pickerType="time"
              label={timeLabel}
              inputColor={inputColor}
              inputSize="small"
              timePrecision={timePrecision}
              value={timeInputValue}
              onChange={onTimeInputChange}
              onMaskedValueChange={onTimeInputChange}
              customClasses="hans-date-picker-calendar-time-input"
            />
          </div>
        ) : null}

        {isDayView ? (
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
        ) : null}
      </div>
    );
  },
);

HansDateTimeCalendar.displayName = 'HansDateTimeCalendar';
