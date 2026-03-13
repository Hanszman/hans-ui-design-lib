import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HansDatePicker } from './DatePicker';

describe('HansDatePicker', () => {
  it('Should render the time input variant when picker type is time', () => {
    render(<HansDatePicker pickerType="time" />);

    expect(screen.getByPlaceholderText('HH:MM')).toBeInTheDocument();
  });

  it('Should render the popup variant when picker type is date', () => {
    render(<HansDatePicker pickerType="date" defaultValue="2026-03-13" />);

    expect(screen.getByDisplayValue('13/03/2026')).toBeInTheDocument();
  });
});
