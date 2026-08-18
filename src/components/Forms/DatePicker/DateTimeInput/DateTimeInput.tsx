import React from 'react';
import { HansInput } from '../../Input/Input';
import { HansPopup } from '../../../Popup/Popup';
import { HansIcon } from '../../../Icon/Icon';
import type { HansDateTimeInputProps } from './DateTimeInput.types';
import { HansDateTimeCalendar } from './DateTimeCalendar/DateTimeCalendar';
import {
  createDatePickerChangeHandler,
  createDatePickerOpenHandler,
  createSyncDatePickerPopupOffsets,
  getDatePickerFieldStyle,
  getDatePickerPlaceholder,
  getDatePickerSelectionFromValue,
  getInitialDatePickerDisplayValue,
  getInitialDatePickerViewDate,
  resolveDateTimePickerType,
} from '../helpers/DatePicker.helper';
import {
  buildCalendarDays,
  createMonthNavigationHandler,
  getDatePickerLocaleText,
  getWeekdayLabels,
} from './DateTimeCalendar/helpers/DateTimeCalendar.helper';
import {
  createBackToCalendarHandler,
  createDatePickerApplyHandler,
  createDatePickerBlurHandler,
  createDatePickerClearHandler,
  createDatePickerDisplayInputHandler,
  createDatePickerInputMouseDownHandler,
  createDatePickerSelectDayHandler,
  createDatePickerTodayHandler,
  createDatePickerToggleIconMouseDownHandler,
  createMonthYearPageNavigationHandler,
  createOpenMonthPickerHandler,
  createOpenYearPickerHandler,
  createSelectMonthYearHandler,
  getDatePickerAllowApply,
  syncDatePickerState,
} from './helpers/DateTimeInput.helper';
import type { HansDateTimeCalendarView } from './DateTimeCalendar/DateTimeCalendar.types';

export const HansDateTimeInput = React.memo((props: HansDateTimeInputProps) => {
  const {
    label = '',
    labelColor = 'base',
    placeholder,
    inputId = 'hans-date-picker',
    inputColor = 'base',
    inputSize = 'medium',
    message = '',
    messageColor = 'base',
    customClasses = '',
    disabled = false,
    required = false,
    pickerType = 'date',
    value,
    defaultValue = '',
    calendarColor = 'primary',
    calendarVariant = 'default',
    popupBackgroundColor = 'var(--background-color, var(--white))',
    panelBackgroundColor = 'var(--background-color, var(--white))',
    clearLabel,
    todayLabel,
    applyLabel,
    timePrecision = 'minute',
    dateFormat = 'DD/MM/YYYY',
    locale = 'en-us',
    weekStartsOnSunday = true,
    allowInputTyping = false,
    onChange,
    onOpenChange,
    ...rest
  } = props;
  const resolvedPickerType = resolveDateTimePickerType(pickerType);
  const localeText = React.useMemo(() => getDatePickerLocaleText(locale), [locale]);

  const isControlled = typeof value !== 'undefined';
  const initialValue = isControlled ? ((value as string) ?? '') : defaultValue;
  const [internalValue, setInternalValue] = React.useState(initialValue);
  const [displayValue, setDisplayValue] = React.useState(() =>
    getInitialDatePickerDisplayValue(
      resolvedPickerType,
      initialValue,
      timePrecision,
      dateFormat,
    ),
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [popupOffsets, setPopupOffsets] = React.useState({ up: 0, down: 0 });
  const [draftDate, setDraftDate] = React.useState<Date | null>(() =>
    getDatePickerSelectionFromValue(pickerType, initialValue, timePrecision),
  );
  const [viewDate, setViewDate] = React.useState(() =>
    getInitialDatePickerViewDate(pickerType, initialValue, timePrecision),
  );
  const [timeInputValue, setTimeInputValue] = React.useState('');
  const [calendarView, setCalendarView] =
    React.useState<HansDateTimeCalendarView>('days');
  const [pageAnchor, setPageAnchor] = React.useState(0);
  const datePickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) setCalendarView('days');
  }, [isOpen]);

  const selectedValue = isControlled ? (value as string) : internalValue;

  React.useEffect(() => {
    syncDatePickerState({
      pickerType: resolvedPickerType,
      value: selectedValue,
      timePrecision,
      dateFormat,
      setDraftDate,
      setViewDate,
      setTimeInputValue,
      setDisplayValue,
    });
  }, [dateFormat, resolvedPickerType, selectedValue, timePrecision]);

  React.useEffect(() => {
    createSyncDatePickerPopupOffsets({ datePickerRef, setPopupOffsets })();
  }, [inputSize, label, labelColor, message, messageColor]);

  const applyValue = React.useMemo(
    () =>
      createDatePickerChangeHandler({
        disabled,
        isControlled,
        setInternalValue,
        onChange,
      }),
    [disabled, isControlled, onChange],
  );
  const handleOpenChange = React.useMemo(
    () =>
      createDatePickerOpenHandler({
        disabled,
        setIsOpen,
        onOpenChange,
      }),
    [disabled, onOpenChange],
  );
  const handleDisplayInputChange = React.useMemo(
    () =>
      createDatePickerDisplayInputHandler({
        pickerType: resolvedPickerType,
        timePrecision,
        setDisplayValue,
      }),
    [resolvedPickerType, timePrecision],
  );

  const handleBlur = React.useMemo(
    () =>
      createDatePickerBlurHandler({
        pickerType: resolvedPickerType,
        allowInputTyping,
        timePrecision,
        dateFormat,
        displayValue,
        setDisplayValue,
        setDraftDate,
        setViewDate,
        setTimeInputValue,
        applyValue,
      }),
    [
      allowInputTyping,
      applyValue,
      displayValue,
      resolvedPickerType,
      timePrecision,
      dateFormat,
    ],
  );

  const calendarDays = React.useMemo(
    () =>
      buildCalendarDays({
        viewDate,
        selectedDate: draftDate,
        weekStartsOnSunday,
      }),
    [draftDate, viewDate, weekStartsOnSunday],
  );
  const popupFieldStyle = React.useMemo(
    () => getDatePickerFieldStyle(popupOffsets),
    [popupOffsets],
  );

  const handleInputMouseDown = React.useMemo(
    () =>
      createDatePickerInputMouseDownHandler({
        allowInputTyping,
        isOpen,
        handleOpenChange,
      }),
    [allowInputTyping, handleOpenChange, isOpen],
  );
  const handleSelectDay = React.useMemo(
    () =>
      createDatePickerSelectDayHandler({
        pickerType: resolvedPickerType,
        timePrecision,
        dateFormat,
        applyValue,
        setDisplayValue,
        setDraftDate,
        setViewDate,
        handleOpenChange,
      }),
    [applyValue, dateFormat, handleOpenChange, resolvedPickerType, timePrecision],
  );
  const handleClear = React.useMemo(
    () =>
      createDatePickerClearHandler({
        setDraftDate,
        setTimeInputValue,
        setDisplayValue,
        applyValue,
        handleOpenChange,
      }),
    [applyValue, handleOpenChange],
  );
  const handleToday = React.useMemo(
    () =>
      createDatePickerTodayHandler({
        pickerType: resolvedPickerType,
        timePrecision,
        dateFormat,
        applyValue,
        setDisplayValue,
        setDraftDate,
        setViewDate,
        setTimeInputValue,
        handleOpenChange,
      }),
    [applyValue, dateFormat, handleOpenChange, resolvedPickerType, timePrecision],
  );
  const handleApply = React.useMemo(
    () =>
      createDatePickerApplyHandler({
        pickerType: 'datetime',
        draftDate,
        timeInputValue,
        timePrecision,
        dateFormat,
        setTimeInputValue,
        setDisplayValue,
        applyValue,
        handleOpenChange,
      }),
    [
      applyValue,
      dateFormat,
      draftDate,
      handleOpenChange,
      timeInputValue,
      timePrecision,
    ],
  );
  const allowApply = React.useMemo(
    () =>
      getDatePickerAllowApply(
        resolvedPickerType,
        draftDate,
        timeInputValue,
        timePrecision,
      ),
    [draftDate, resolvedPickerType, timeInputValue, timePrecision],
  );
  const handleToggleIconMouseDown = React.useMemo(
    () =>
      createDatePickerToggleIconMouseDownHandler({
        isOpen,
        handleOpenChange,
      }),
    [handleOpenChange, isOpen],
  );
  const handlePreviousMonth = React.useMemo(
    () =>
      createMonthNavigationHandler({
        viewDate,
        months: -1,
        setViewDate,
      }),
    [viewDate],
  );
  const handleNextMonth = React.useMemo(
    () =>
      createMonthNavigationHandler({
        viewDate,
        months: 1,
        setViewDate,
      }),
    [viewDate],
  );
  const handleOpenMonthPicker = React.useMemo(
    () =>
      createOpenMonthPickerHandler({
        viewDate,
        setPageAnchor,
        setCalendarView,
      }),
    [viewDate],
  );
  const handleOpenYearPicker = React.useMemo(
    () =>
      createOpenYearPickerHandler({
        viewDate,
        setPageAnchor,
        setCalendarView,
      }),
    [viewDate],
  );
  const handlePreviousMonthYearPage = React.useMemo(
    () =>
      createMonthYearPageNavigationHandler({
        calendarView,
        pageAnchor,
        direction: -1,
        setPageAnchor,
      }),
    [calendarView, pageAnchor],
  );
  const handleNextMonthYearPage = React.useMemo(
    () =>
      createMonthYearPageNavigationHandler({
        calendarView,
        pageAnchor,
        direction: 1,
        setPageAnchor,
      }),
    [calendarView, pageAnchor],
  );
  const handleSelectMonthYear = React.useMemo(
    () =>
      createSelectMonthYearHandler({
        calendarView,
        pageAnchor,
        viewDate,
        setViewDate,
        setCalendarView,
      }),
    [calendarView, pageAnchor, viewDate],
  );
  const handleBackToCalendar = React.useMemo(
    () => createBackToCalendarHandler({ setCalendarView }),
    [],
  );

  return (
    <div className="hans-date-picker hans-date-picker-date-time-input" ref={datePickerRef}>
      <HansPopup
        isOpen={isOpen}
        disabled={disabled}
        onOpenChange={handleOpenChange}
        popupBackgroundColor={popupBackgroundColor}
        customClasses="hans-date-picker-field"
        popupClassName={`hans-date-picker-popup hans-date-picker-popup-${resolvedPickerType}`}
        panelClassName="hans-date-picker-popup-content"
        portalMatchTriggerWidth={false}
        portalHorizontalPosition="end"
        style={popupFieldStyle}
        renderTrigger={() => (
          <HansInput
            label={label}
            labelColor={labelColor}
            message={message}
            messageColor={messageColor}
            inputId={inputId}
            inputColor={inputColor}
            inputSize={inputSize}
            placeholder={
              placeholder ??
              getDatePickerPlaceholder(
                resolvedPickerType,
                timePrecision,
                dateFormat,
              )
            }
            customClasses={`hans-date-picker-input ${customClasses}`}
            disabled={disabled}
            required={required}
            value={displayValue}
            readOnly={!allowInputTyping}
            onChange={allowInputTyping ? handleDisplayInputChange : undefined}
            onBlur={handleBlur}
            onMouseDown={handleInputMouseDown}
            rightIcon={
              <button
                type="button"
                className="hans-date-picker-trigger-icon"
                aria-label={localeText.toggle}
                onMouseDown={handleToggleIconMouseDown}
              >
                <HansIcon name="MdDateRange" iconSize="small" />
              </button>
            }
            {...rest}
          />
        )}
      >
        <div
          className="hans-date-picker-panel"
          style={
            {
              '--hans-date-picker-panel-background-color': panelBackgroundColor,
            } as React.CSSProperties
          }
        >
          <HansDateTimeCalendar
            calendarView={calendarView}
            days={calendarDays}
            weekdayLabels={getWeekdayLabels(weekStartsOnSunday, locale)}
            viewDate={viewDate}
            pageAnchor={pageAnchor}
            locale={locale}
            calendarColor={calendarColor}
            calendarVariant={calendarVariant}
            inputColor={inputColor}
            timePrecision={timePrecision}
            pickerType={resolvedPickerType}
            timeInputValue={timeInputValue}
            clearLabel={clearLabel ?? localeText.clear}
            todayLabel={todayLabel ?? localeText.today}
            applyLabel={applyLabel ?? localeText.apply}
            timeLabel={localeText.time}
            previousMonthLabel={localeText.previousMonth}
            nextMonthLabel={localeText.nextMonth}
            monthPickerLabel={localeText.monthPicker}
            yearPickerLabel={localeText.yearPicker}
            backToCalendarLabel={localeText.backToCalendar}
            previousYearLabel={localeText.previousYear}
            nextYearLabel={localeText.nextYear}
            previousYearsLabel={localeText.previousYears}
            nextYearsLabel={localeText.nextYears}
            allowApply={allowApply}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onSelectDay={handleSelectDay}
            onOpenMonthPicker={handleOpenMonthPicker}
            onOpenYearPicker={handleOpenYearPicker}
            onSelectMonthYear={handleSelectMonthYear}
            onPreviousMonthYearPage={handlePreviousMonthYearPage}
            onNextMonthYearPage={handleNextMonthYearPage}
            onBackToCalendar={handleBackToCalendar}
            onTimeInputChange={setTimeInputValue}
            onClear={handleClear}
            onToday={handleToday}
            onApply={handleApply}
          />
        </div>
      </HansPopup>
    </div>
  );
});

HansDateTimeInput.displayName = 'HansDateTimeInput';
