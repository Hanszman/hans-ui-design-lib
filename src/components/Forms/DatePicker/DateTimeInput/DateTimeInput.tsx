import React from 'react';
import { HansInput } from '../../Input/Input';
import { HansPopup } from '../../../Popup/Popup';
import { HansIcon } from '../../../Icon/Icon';
import type { HansDateTimeInputProps } from './DateTimeInput.types';
import { HansDatePickerCalendar } from '../DatePickerCalendar/DatePickerCalendar';
import {
  addMonths,
  buildCalendarDays,
  createDatePickerBlurHandler,
  createDatePickerChangeHandler,
  createDatePickerDisplayInputHandler,
  createDatePickerOpenHandler,
  createDatePickerTimeInputHandler,
  createSyncDatePickerPopupOffsets,
  formatDatePickerValue,
  getDatePickerFieldStyle,
  getDatePickerMonthLabel,
  getDatePickerPlaceholder,
  getDatePickerSelectionFromValue,
  getInitialDatePickerDisplayValue,
  getInitialDatePickerViewDate,
  getWeekdayLabels,
  mergeDateAndTime,
  syncDatePickerState,
} from '../helpers/DatePicker.helper';

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
    pickerType = 'date',
    value,
    defaultValue = '',
    calendarColor = 'primary',
    calendarVariant = 'default',
    popupBackgroundColor = 'var(--white)',
    clearLabel = 'Clear',
    todayLabel = 'Today',
    applyLabel = 'Apply',
    timePrecision = 'minute',
    weekStartsOnSunday = true,
    allowInputTyping = false,
    onChange,
    onOpenChange,
    ...rest
  } = props;
  const resolvedPickerType = pickerType === 'datetime' ? 'datetime' : 'date';

  const isControlled = typeof value !== 'undefined';
  const initialValue = isControlled ? ((value as string) ?? '') : defaultValue;
  const [internalValue, setInternalValue] = React.useState(initialValue);
  const [displayValue, setDisplayValue] = React.useState(() =>
    getInitialDatePickerDisplayValue(
      resolvedPickerType,
      initialValue,
      timePrecision,
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
  const datePickerRef = React.useRef<HTMLDivElement>(null);

  const selectedValue = isControlled ? (value as string) : internalValue;

  React.useEffect(() => {
    syncDatePickerState({
      pickerType: resolvedPickerType,
      value: selectedValue,
      timePrecision,
      setDraftDate,
      setViewDate,
      setTimeInputValue,
      setDisplayValue,
    });
  }, [resolvedPickerType, selectedValue, timePrecision]);

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
  const handleTimeInputChange = React.useMemo(
    () =>
      createDatePickerTimeInputHandler({
        timePrecision,
        setTimeInputValue,
      }),
    [timePrecision],
  );
  const handleDisplayInputChange = React.useMemo(
    () => createDatePickerDisplayInputHandler({ setDisplayValue }),
    [],
  );

  const handleBlur = React.useMemo(
    () =>
      createDatePickerBlurHandler({
        pickerType: resolvedPickerType,
        allowInputTyping,
        timePrecision,
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

  const handleInputMouseDown = (
    event: React.MouseEvent<HTMLInputElement>,
  ): void => {
    if (allowInputTyping) return;
    event.preventDefault();
    handleOpenChange(!isOpen);
  };

  const handleSelectDay = (day: (typeof calendarDays)[number]): void => {
    setDraftDate(day.date);
    setViewDate(day.date);

    if (resolvedPickerType === 'date') {
      const nextValue = day.isoValue;
      applyValue(nextValue);
      setDisplayValue(
        getInitialDatePickerDisplayValue(
          resolvedPickerType,
          nextValue,
          timePrecision,
        ),
      );
      handleOpenChange(false);
    }
  };

  const handleClear = (): void => {
    setDraftDate(null);
    setTimeInputValue('');
    setDisplayValue('');
    applyValue('');
    handleOpenChange(false);
  };

  const handleToday = (): void => {
    const today = new Date();
    setDraftDate(today);
    setViewDate(today);

    if (resolvedPickerType === 'date') {
      const nextValue = formatDatePickerValue({
        pickerType: resolvedPickerType,
        date: today,
        timePrecision,
      });
      applyValue(nextValue);
      setDisplayValue(
        getInitialDatePickerDisplayValue(
          resolvedPickerType,
          nextValue,
          timePrecision,
        ),
      );
      handleOpenChange(false);
      return;
    }

    setTimeInputValue(
      today.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: timePrecision === 'second' ? '2-digit' : undefined,
        hour12: false,
      }),
    );
  };

  const handleApply = (): void => {
    if (!draftDate) return;
    const mergedDate = mergeDateAndTime(draftDate, timeInputValue, timePrecision);
    if (!mergedDate) {
      setTimeInputValue('');
      applyValue('');
      return;
    }

    const nextValue = formatDatePickerValue({
      pickerType: resolvedPickerType,
      date: mergedDate,
      timePrecision,
    });
    applyValue(nextValue);
    setDisplayValue(
      getInitialDatePickerDisplayValue(
        resolvedPickerType,
        nextValue,
        timePrecision,
      ),
    );
    handleOpenChange(false);
  };

  const allowApply = resolvedPickerType === 'date' || Boolean(
    draftDate && mergeDateAndTime(draftDate, timeInputValue, timePrecision),
  );

  return (
    <div className="hans-date-picker hans-date-picker-date-time-input" ref={datePickerRef}>
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
              placeholder ??
              getDatePickerPlaceholder(resolvedPickerType, timePrecision)
            }
            customClasses={`hans-date-picker-input ${customClasses}`}
            disabled={disabled}
            value={displayValue}
            readOnly={!allowInputTyping}
            onChange={allowInputTyping ? handleDisplayInputChange : undefined}
            onBlur={handleBlur}
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
                <HansIcon name="MdDateRange" iconSize="small" />
              </button>
            }
            {...rest}
          />
        )}
      >
        <div className="hans-date-picker-panel">
          <HansDatePickerCalendar
            days={calendarDays}
            weekdayLabels={getWeekdayLabels(weekStartsOnSunday)}
            monthLabel={getDatePickerMonthLabel(viewDate)}
            calendarColor={calendarColor}
            calendarVariant={calendarVariant}
            inputColor={inputColor}
            timePrecision={timePrecision}
            pickerType={resolvedPickerType}
            timeInputValue={timeInputValue}
            clearLabel={clearLabel}
            todayLabel={todayLabel}
            applyLabel={applyLabel}
            allowApply={allowApply}
            onPreviousMonth={() => setViewDate(addMonths(viewDate, -1))}
            onNextMonth={() => setViewDate(addMonths(viewDate, 1))}
            onSelectDay={handleSelectDay}
            onTimeInputChange={handleTimeInputChange}
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
