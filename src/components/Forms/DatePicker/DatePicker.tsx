import React from 'react';
import type { HansDatePickerProps } from './DatePicker.types';
import { HansTimeInput } from './TimeInput/TimeInput';
import { HansDateTimeInput } from './DateTimeInput/DateTimeInput';

export const HansDatePicker = React.memo((props: HansDatePickerProps) => {
  const { pickerType = 'date' } = props;

  if (pickerType === 'time') {
    return <HansTimeInput {...props} />;
  }

  return <HansDateTimeInput {...props} />;
});

HansDatePicker.displayName = 'HansDatePicker';
