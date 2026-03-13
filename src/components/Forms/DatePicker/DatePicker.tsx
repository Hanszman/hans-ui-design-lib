import React from 'react';
import { HansButton } from '../Button/Button';
import { HansInput } from '../Input/Input';
import { HansPopup } from '../../Popup/Popup';
import { HansIcon } from '../../Icon/Icon';
import type { HansDatePickerProps } from './DatePicker.types';
import { HansDatePickerCalendar } from './DatePickerCalendar/DatePickerCalendar';
import {
  addMonths,
  buildCalendarDays,
  createDatePickerChangeHandler,
  createDatePickerOpenHandler,
  createDatePickerTimeInputHandler,
  createSyncDatePickerPopupOffsets,
  formatDatePickerDisplay,
  formatDatePickerTimeValue,
  formatDatePickerValue,
  getDatePickerFieldStyle,
  getDatePickerMonthLabel,
  getDatePickerPlaceholder,
  getDatePickerSelectionFromValue,
  getInitialDatePickerViewDate,
  getWeekdayLabels,
  mergeDateAndTime,
  normalizeMaskedTimeValue,
} from './helpers/DatePicker.helper';

export const HansDatePicker = React.memo((props: HansDatePickerProps) => {
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
    pickerType = 'date',
    value,
    defaultValue = '',
    calendarColor = 'primary',
    calendarVariant = 'default',
    popupBackgroundColor = 'var(--white)',
    noDateText = '',
    clearLabel = 'Clear',
    todayLabel = 'Today',
    applyLabel = 'Apply',
    timePrecision = 'minute',
    weekStartsOnSunday = true,
    onChange,
    onOpenChange,
    ...rest
  } = props;

  const isControlled = typeof value !== 'undefined';
  const controlledValue = value as string | undefined;
  const initialValue = isControlled
    ? (controlledValue as string)
    : defaultValue;
  const [internalValue, setInternalValue] = React.useState(initialValue);
  const [isOpen, setIsOpen] = React.useState(false);
  const [popupOffsets, setPopupOffsets] = React.useState({ up: 0, down: 0 });
  const [draftDate, setDraftDate] = React.useState<Date | null>(() =>
    getDatePickerSelectionFromValue(pickerType, initialValue, timePrecision),
  );
  const [viewDate, setViewDate] = React.useState(() =>
    getInitialDatePickerViewDate(pickerType, initialValue, timePrecision),
  );
  const [timeInputValue, setTimeInputValue] = React.useState(() => {
    const parsedValue = getDatePickerSelectionFromValue(
      pickerType,
      initialValue,
      timePrecision,
    );
    if (!parsedValue) return '';

    return formatDatePickerTimeValue(
      {
        hours: parsedValue.getHours(),
        minutes: parsedValue.getMinutes(),
        seconds: parsedValue.getSeconds(),
      },
      timePrecision,
    );
  });
  const datePickerRef = React.useRef<HTMLDivElement>(null);

  const selectedValue = isControlled
    ? (controlledValue as string)
    : internalValue;

  React.useEffect(() => {
    if (!isControlled) return;

    const nextDate = getDatePickerSelectionFromValue(
      pickerType,
      controlledValue,
      timePrecision,
    );

    setInternalValue(controlledValue as string);
    setDraftDate(nextDate);
    setViewDate(nextDate ?? new Date());
    setTimeInputValue(
      nextDate
        ? formatDatePickerTimeValue(
            {
              hours: nextDate.getHours(),
              minutes: nextDate.getMinutes(),
              seconds: nextDate.getSeconds(),
            },
            timePrecision,
          )
        : '',
    );
  }, [controlledValue, isControlled, pickerType, timePrecision]);

  React.useEffect(() => {
    createSyncDatePickerPopupOffsets({ datePickerRef, setPopupOffsets })();
  }, [inputSize, label, labelColor, message, messageColor]);

  const handleValueChange = React.useMemo(
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
  const handleTimeInputChange = React.useMemo(
    () =>
      createDatePickerTimeInputHandler({
        timePrecision,
        setTimeInputValue,
      }),
    [timePrecision],
  );

  const displayValue = formatDatePickerDisplay({
    pickerType,
    value: selectedValue,
    timePrecision,
    noDateText,
  });
  const weekdayLabels = React.useMemo(
    () => getWeekdayLabels(weekStartsOnSunday),
    [weekStartsOnSunday],
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

  const handleClear = (): void => {
    setDraftDate(null);
    setTimeInputValue('');
    handleValueChange('');
    handleOpenChange(false);
  };

  const handleSelectToday = (): void => {
    const today = new Date();
    setViewDate(today);
    setDraftDate(today);

    if (pickerType === 'date') {
      handleValueChange(
        formatDatePickerValue({
          pickerType,
          date: today,
          timePrecision,
        }),
      );
      handleOpenChange(false);
      return;
    }

    setTimeInputValue(
      formatDatePickerTimeValue(
        {
          hours: today.getHours(),
          minutes: today.getMinutes(),
          seconds: today.getSeconds(),
        },
        timePrecision,
      ),
    );
  };

  const handleSelectDay = (day: (typeof calendarDays)[number]): void => {
    setDraftDate(day.date);
    setViewDate(day.date);

    if (pickerType === 'date') {
      handleValueChange(day.isoValue);
      handleOpenChange(false);
    }
  };

  const handleApplyDateTime = (): void => {
    if (!draftDate) return;
    const mergedDate = mergeDateAndTime(
      draftDate,
      timeInputValue,
      timePrecision,
    );
    if (!mergedDate) return;

    handleValueChange(
      formatDatePickerValue({
        pickerType,
        date: mergedDate,
        timePrecision,
      }),
    );
    handleOpenChange(false);
  };

  const handleInputMouseDown = (
    event: React.MouseEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();
    handleOpenChange(!isOpen);
  };

  const handleTimeOnlyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    handleTimeInputChange(event);

    const normalizedValue = normalizeMaskedTimeValue(
      event.target.value,
      timePrecision,
    );
    const expectedLength = timePrecision === 'second' ? 8 : 5;

    if (normalizedValue.length === 0) {
      handleValueChange('');
      return;
    }

    if (
      normalizedValue.length === expectedLength &&
      mergeDateAndTime(new Date(2000, 0, 1), normalizedValue, timePrecision)
    ) {
      handleValueChange(normalizedValue);
    }
  };

  const triggerIconName =
    pickerType === 'time' ? 'MdAccessTime' : 'MdDateRange';

  if (pickerType === 'time') {
    return (
      <div className="hans-date-picker" ref={datePickerRef}>
        <HansInput
          label={label}
          labelColor={labelColor}
          message={message}
          messageColor={messageColor}
          inputId={inputId}
          inputColor={inputColor}
          inputSize={inputSize}
          placeholder={
            placeholder ?? getDatePickerPlaceholder(pickerType, timePrecision)
          }
          customClasses={`hans-date-picker-input ${customClasses}`}
          disabled={disabled}
          value={timeInputValue}
          onChange={handleTimeOnlyChange}
          rightIcon={<HansIcon name={triggerIconName} iconSize="small" />}
          {...rest}
        />
      </div>
    );
  }

  return (
    <div className="hans-date-picker" ref={datePickerRef}>
      <HansPopup
        isOpen={isOpen}
        disabled={disabled}
        onOpenChange={handleOpenChange}
        popupBackgroundColor={popupBackgroundColor}
        customClasses="hans-date-picker-field"
        popupClassName="hans-date-picker-popup"
        panelClassName="hans-date-picker-popup-content"
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
              placeholder ?? getDatePickerPlaceholder(pickerType, timePrecision)
            }
            customClasses={`hans-date-picker-input ${customClasses}`}
            disabled={disabled}
            value={displayValue}
            readOnly
            onMouseDown={handleInputMouseDown}
            rightIcon={
              <button
                type="button"
                className="hans-date-picker-trigger-icon"
                aria-label="Toggle date picker"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleOpenChange(!isOpen);
                }}
              >
                <HansIcon name={triggerIconName} iconSize="small" />
              </button>
            }
            {...rest}
          />
        )}
      >
        <div className="hans-date-picker-panel">
          <HansDatePickerCalendar
            days={calendarDays}
            weekdayLabels={weekdayLabels}
            monthLabel={getDatePickerMonthLabel(viewDate)}
            calendarColor={calendarColor}
            calendarVariant={calendarVariant}
            onPreviousMonth={() =>
              setViewDate((currentDate) => addMonths(currentDate, -1))
            }
            onNextMonth={() =>
              setViewDate((currentDate) => addMonths(currentDate, 1))
            }
            onSelectDay={handleSelectDay}
          />

          {pickerType === 'datetime' ? (
            <div className="hans-date-picker-time-panel">
              <HansInput
                inputId={`${inputId}-time`}
                label="Time"
                inputColor={inputColor}
                inputSize="small"
                placeholder={getDatePickerPlaceholder('time', timePrecision)}
                value={timeInputValue}
                onChange={handleTimeInputChange}
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
              onClick={handleClear}
            />
            <HansButton
              label={todayLabel}
              buttonSize="small"
              buttonColor={calendarColor}
              buttonVariant="neutral"
              onClick={handleSelectToday}
            />
            {pickerType === 'datetime' ? (
              <HansButton
                label={applyLabel}
                buttonSize="small"
                buttonColor={calendarColor}
                buttonVariant={calendarVariant}
                onClick={handleApplyDateTime}
              />
            ) : null}
          </div>
        </div>
      </HansPopup>
    </div>
  );
});

HansDatePicker.displayName = 'HansDatePicker';
