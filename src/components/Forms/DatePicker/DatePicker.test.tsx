import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansDatePicker } from './DatePicker';

describe('HansDatePicker', () => {
  it('Should render date picker input and open the popup', () => {
    render(
      <HansDatePicker
        pickerType="date"
        label="Date"
        value="2026-03-13"
        onChange={() => {}}
      />,
    );

    const input = screen.getByDisplayValue('13/03/2026');
    expect(input).toBeInTheDocument();

    fireEvent.mouseDown(input);

    expect(screen.getByText('March 2026')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText('February 2026')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText('Toggle date picker'));
    expect(screen.queryByText('March 2026')).not.toBeInTheDocument();
  });

  it('Should open datetime popup, update time and apply selection', () => {
    const onChange = vi.fn();
    render(
      <HansDatePicker
        pickerType="datetime"
        defaultValue="2026-03-13T10:15"
        onChange={onChange}
      />,
    );

    fireEvent.mouseDown(screen.getByDisplayValue('13/03/2026 10:15'));
    const timeInput = screen.getByDisplayValue('10:15');
    fireEvent.change(timeInput, { target: { value: '1130' } });
    fireEvent.click(screen.getByText('Apply'));

    expect(onChange).toHaveBeenCalledWith('2026-03-13T11:30');
  });

  it('Should clear and set today from popup actions', () => {
    const onChange = vi.fn();
    render(
      <HansDatePicker
        pickerType="date"
        defaultValue="2026-03-13"
        onChange={onChange}
      />,
    );

    fireEvent.mouseDown(screen.getByDisplayValue('13/03/2026'));
    fireEvent.click(screen.getByText('Clear'));
    expect(onChange).toHaveBeenCalledWith('');

    fireEvent.mouseDown(screen.getByPlaceholderText('DD/MM/YYYY'));
    fireEvent.click(screen.getByText('Today'));
    expect(onChange).toHaveBeenCalled();
  });

  it('Should select a calendar day and handle datetime today action', () => {
    const onChange = vi.fn();
    render(
      <HansDatePicker
        pickerType="date"
        defaultValue="2026-03-13"
        onChange={onChange}
      />,
    );

    fireEvent.mouseDown(screen.getByDisplayValue('13/03/2026'));
    fireEvent.click(screen.getByRole('button', { name: '14' }));
    expect(onChange).toHaveBeenCalledWith('2026-03-14');

    cleanup();

    const onDateTimeChange = vi.fn();
    render(
      <HansDatePicker
        pickerType="datetime"
        defaultValue="2026-03-13T10:15"
        onChange={onDateTimeChange}
      />,
    );

    fireEvent.mouseDown(screen.getByDisplayValue('13/03/2026 10:15'));
    fireEvent.click(screen.getByText('Today'));
    fireEvent.click(screen.getByText('Apply'));
    expect(onDateTimeChange).toHaveBeenCalled();
  });

  it('Should support time mode with masked input and clearing', () => {
    const onChange = vi.fn();
    render(
      <HansDatePicker
        pickerType="time"
        timePrecision="second"
        onChange={onChange}
      />,
    );

    const input = screen.getByPlaceholderText('HH:MM:SS');
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input).toHaveValue('12:34:56');
    expect(onChange).toHaveBeenCalledWith('12:34:56');

    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('Should not open popup when disabled', () => {
    const onOpenChange = vi.fn();
    render(
      <HansDatePicker
        pickerType="date"
        value="2026-03-13"
        disabled
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.mouseDown(screen.getByDisplayValue('13/03/2026'));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText('March 2026')).not.toBeInTheDocument();
  });

  it('Should sync controlled empty values', () => {
    const { rerender } = render(
      <HansDatePicker
        pickerType="datetime"
        value="2026-03-13T10:15"
        onChange={() => {}}
      />,
    );

    rerender(
      <HansDatePicker pickerType="datetime" value="" onChange={() => {}} />,
    );

    expect(screen.getByPlaceholderText('DD/MM/YYYY HH:MM')).toHaveValue('');
  });

  it('Should ignore datetime apply when there is no valid draft/time', () => {
    const onChange = vi.fn();
    render(<HansDatePicker pickerType="datetime" onChange={onChange} />);

    fireEvent.mouseDown(screen.getByPlaceholderText('DD/MM/YYYY HH:MM'));
    fireEvent.click(screen.getByText('Apply'));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('button', { name: '1' })[0]);
    const timeInput = screen.getByLabelText('Time');
    fireEvent.change(timeInput, { target: { value: '9999' } });
    fireEvent.click(screen.getByText('Apply'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should support minute precision in time mode', () => {
    const onChange = vi.fn();
    render(<HansDatePicker pickerType="time" onChange={onChange} />);

    const input = screen.getByPlaceholderText('HH:MM');
    fireEvent.change(input, { target: { value: '0945' } });

    expect(input).toHaveValue('09:45');
    expect(onChange).toHaveBeenCalledWith('09:45');
  });
});
