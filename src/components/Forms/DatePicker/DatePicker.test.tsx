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

  it('Should display month before day when requested', () => {
    render(
      <HansDatePicker
        pickerType="date"
        dateFormat="MM/DD/YYYY"
        defaultValue="2026-03-13"
      />,
    );

    expect(screen.getByDisplayValue('03/13/2026')).toBeInTheDocument();
  });

  it('Should forward required to date and time input variants', () => {
    const { rerender } = render(
      <HansDatePicker label="Start date" pickerType="date" required />,
    );

    expect(screen.getByText('Start date').closest('label')).toHaveTextContent(
      'Start date *',
    );
    expect(screen.getByPlaceholderText('DD/MM/YYYY')).toBeRequired();

    rerender(<HansDatePicker label="Start time" pickerType="time" required />);

    expect(screen.getByText('Start time').closest('label')).toHaveTextContent(
      'Start time *',
    );
    expect(screen.getByPlaceholderText('HH:MM')).toBeRequired();
  });
});
