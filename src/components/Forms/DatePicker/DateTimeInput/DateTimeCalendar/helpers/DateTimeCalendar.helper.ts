import type {
  BuildCalendarDaysParams,
  CreateMonthNavigationHandlerParams,
} from './DateTimeCalendar.helper.types';
import {
  cloneDate,
  formatDatePickerValue,
  isSameDay,
} from '../../../helpers/DatePicker.helper';
import type { HansDatePickerLocale } from '../../../DatePicker.types';

const DATE_PICKER_INTL_LOCALES: Record<HansDatePickerLocale, string> = {
  'en-us': 'en-US',
  'pt-br': 'pt-BR',
  'es-es': 'es-ES',
};

const DATE_PICKER_LOCALE_TEXTS = {
  'en-us': {
    clear: 'Clear',
    today: 'Today',
    apply: 'Apply',
    time: 'Time',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    toggle: 'Toggle date picker',
    monthPicker: 'Open month picker',
    yearPicker: 'Open year picker',
    backToCalendar: 'Back to calendar',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    previousYears: 'Previous years',
    nextYears: 'Next years',
  },
  'pt-br': {
    clear: 'Limpar',
    today: 'Hoje',
    apply: 'Aplicar',
    time: 'Hora',
    previousMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
    toggle: 'Alternar seletor de data',
    monthPicker: 'Abrir seletor de mês',
    yearPicker: 'Abrir seletor de ano',
    backToCalendar: 'Voltar ao calendário',
    previousYear: 'Ano anterior',
    nextYear: 'Próximo ano',
    previousYears: 'Anos anteriores',
    nextYears: 'Próximos anos',
  },
  'es-es': {
    clear: 'Limpiar',
    today: 'Hoy',
    apply: 'Aplicar',
    time: 'Hora',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    toggle: 'Alternar selector de fecha',
    monthPicker: 'Abrir selector de mes',
    yearPicker: 'Abrir selector de año',
    backToCalendar: 'Volver al calendario',
    previousYear: 'Año anterior',
    nextYear: 'Año siguiente',
    previousYears: 'Años anteriores',
    nextYears: 'Años siguientes',
  },
} as const;

export const getDatePickerLocaleText = (
  locale: HansDatePickerLocale = 'en-us',
) => DATE_PICKER_LOCALE_TEXTS[locale];

export const getDatePickerIntlLocale = (
  locale: HansDatePickerLocale = 'en-us',
): string => DATE_PICKER_INTL_LOCALES[locale];

export const getDatePickerMonthName = (
  value: Date,
  locale: HansDatePickerLocale = 'en-us',
): string =>
  value.toLocaleDateString(DATE_PICKER_INTL_LOCALES[locale], {
    month: 'long',
  });

export const getWeekdayLabels = (
  weekStartsOnSunday: boolean,
  locale: HansDatePickerLocale = 'en-us',
): string[] => {
  const formatter = new Intl.DateTimeFormat(DATE_PICKER_INTL_LOCALES[locale], {
    weekday: 'short',
  });
  const sunday = new Date(2026, 0, 4);
  const labels = Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(2026, 0, sunday.getDate() + index)),
  );

  return weekStartsOnSunday ? labels : [...labels.slice(1), labels[0]];
};

export const getDatePickerMonthLabel = (
  value: Date,
  locale: HansDatePickerLocale = 'en-us',
): string =>
  value.toLocaleDateString(DATE_PICKER_INTL_LOCALES[locale], {
    month: 'long',
    year: 'numeric',
  });

export const addMonths = (value: Date, months: number): Date => {
  const nextDate = cloneDate(value);
  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
};

export const getStartOfCalendarGrid = (
  viewDate: Date,
  weekStartsOnSunday: boolean,
): Date => {
  const startDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const weekday = startDate.getDay();
  const shift = weekStartsOnSunday ? weekday : (weekday + 6) % 7;
  startDate.setDate(startDate.getDate() - shift);
  return startDate;
};

export const buildCalendarDays = ({
  viewDate,
  selectedDate,
  weekStartsOnSunday,
  today = new Date(),
}: BuildCalendarDaysParams) =>
  Array.from({ length: 42 }, (_, index) => {
    const nextDate = getStartOfCalendarGrid(viewDate, weekStartsOnSunday);
    nextDate.setDate(nextDate.getDate() + index);

    return {
      date: nextDate,
      isoValue: formatDatePickerValue({
        pickerType: 'date',
        date: nextDate,
        timePrecision: 'minute',
      }),
      isCurrentMonth: nextDate.getMonth() === viewDate.getMonth(),
      isSelected: isSameDay(nextDate, selectedDate),
      isToday: isSameDay(nextDate, today),
    };
  });

export const createMonthNavigationHandler =
  ({ viewDate, months, setViewDate }: CreateMonthNavigationHandlerParams) =>
  (): void => {
    setViewDate(addMonths(viewDate, months));
  };
