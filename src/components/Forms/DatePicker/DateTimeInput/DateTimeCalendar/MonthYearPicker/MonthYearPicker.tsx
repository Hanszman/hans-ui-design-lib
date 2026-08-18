import React from 'react';
import { HansButton } from '../../../../Button/Button';
import { HansIcon } from '../../../../../Icon/Icon';
import type { HansMonthYearPickerProps } from './MonthYearPicker.types';
import {
  buildMonthOptions,
  buildYearOptions,
  getYearWindowLabel,
} from './helpers/MonthYearPicker.helper';

export const HansMonthYearPicker = React.memo(
  (props: HansMonthYearPickerProps) => {
    const {
      mode,
      viewDate,
      pageAnchor,
      locale,
      calendarColor,
      calendarVariant,
      backLabel,
      previousPageLabel,
      nextPageLabel,
      onSelect,
      onPreviousPage,
      onNextPage,
      onBack,
    } = props;

    const monthOptions = React.useMemo(
      () => buildMonthOptions({ pageYear: pageAnchor, viewDate, locale }),
      [locale, pageAnchor, viewDate],
    );
    const yearOptions = React.useMemo(
      () => buildYearOptions({ windowStart: pageAnchor, viewDate }),
      [pageAnchor, viewDate],
    );
    const pageLabel =
      mode === 'month' ? String(pageAnchor) : getYearWindowLabel(pageAnchor);

    return (
      <div className="hans-date-picker-month-year-picker">
        <div className="hans-date-picker-calendar-header">
          <HansButton
            buttonColor={calendarColor}
            buttonVariant="outline"
            buttonSize="small"
            buttonShape="circle"
            customClasses="hans-date-picker-calendar-nav"
            aria-label={backLabel}
            onClick={onBack}
          >
            <HansIcon name="IoIosArrowBack" iconSize="small" />
          </HansButton>
          <strong className="hans-date-picker-calendar-title">{pageLabel}</strong>
          <div className="hans-date-picker-month-year-nav">
            <HansButton
              buttonColor={calendarColor}
              buttonVariant="outline"
              buttonSize="small"
              buttonShape="circle"
              customClasses="hans-date-picker-calendar-nav"
              aria-label={previousPageLabel}
              onClick={onPreviousPage}
            >
              <HansIcon name="IoIosArrowBack" iconSize="small" />
            </HansButton>
            <HansButton
              buttonColor={calendarColor}
              buttonVariant="outline"
              buttonSize="small"
              buttonShape="circle"
              customClasses="hans-date-picker-calendar-nav"
              aria-label={nextPageLabel}
              onClick={onNextPage}
            >
              <HansIcon name="IoIosArrowForward" iconSize="small" />
            </HansButton>
          </div>
        </div>

        <div className="hans-date-picker-month-year-grid">
          {mode === 'month'
            ? monthOptions.map((month) => (
                <button
                  key={month.index}
                  type="button"
                  className={`
                    hans-date-picker-month-year-option
                    hans-date-picker-day-color-${calendarColor}
                    hans-date-picker-day-variant-${calendarVariant}
                    ${month.isSelected ? 'hans-date-picker-day-selected' : ''}
                    ${month.isCurrent ? 'hans-date-picker-day-today' : ''}
                  `.trim()}
                  aria-pressed={month.isSelected}
                  onClick={() => onSelect(month.index)}
                >
                  {month.label}
                </button>
              ))
            : yearOptions.map((year) => (
                <button
                  key={year.year}
                  type="button"
                  className={`
                    hans-date-picker-month-year-option
                    hans-date-picker-day-color-${calendarColor}
                    hans-date-picker-day-variant-${calendarVariant}
                    ${year.isSelected ? 'hans-date-picker-day-selected' : ''}
                    ${year.isCurrent ? 'hans-date-picker-day-today' : ''}
                  `.trim()}
                  aria-pressed={year.isSelected}
                  onClick={() => onSelect(year.year)}
                >
                  {year.year}
                </button>
              ))}
        </div>
      </div>
    );
  },
);

HansMonthYearPicker.displayName = 'HansMonthYearPicker';
