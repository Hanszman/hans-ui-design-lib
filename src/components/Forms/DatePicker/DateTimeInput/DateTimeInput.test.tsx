import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansDateTimeInput } from './DateTimeInput';

describe('HansDateTimeInput', () => {
  it('Should open popup, navigate month and select a date', () => {
    const onChange = vi.fn();
    render(
      <HansDateTimeInput
        pickerType="date"
        defaultValue="2026-03-13"
        onChange={onChange}
      />,
    );

    fireEvent.mouseDown(screen.getByDisplayValue('13/03/2026'));
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText('February 2026')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: '14' })[0]);
    expect(onChange).toHaveBeenCalled();
  });

  it('Should handle datetime apply and invalid apply paths', () => {
    const onChange = vi.fn();
    render(<HansDateTimeInput pickerType="datetime" onChange={onChange} />);

    fireEvent.mouseDown(screen.getByPlaceholderText('DD/MM/YYYY HH:MM'));
    fireEvent.click(screen.getByText('Apply'));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('button', { name: '1' })[0]);
    fireEvent.change(screen.getByLabelText('Time'), {
      target: { value: '9999' },
    });
    fireEvent.click(screen.getByText('Apply'));
    expect(onChange).not.toHaveBeenCalled();

    cleanup();

    render(
      <HansDateTimeInput
        pickerType="datetime"
        defaultValue="2026-03-13T10:15"
        onChange={onChange}
      />,
    );
    fireEvent.mouseDown(screen.getByDisplayValue('13/03/2026 10:15'));
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '1130' } });
    fireEvent.click(screen.getByText('Apply'));
    expect(onChange).toHaveBeenCalledWith('2026-03-13T11:30');
  });

  it('Should support manual typing and clear invalid dates', () => {
    const onChange = vi.fn();
    render(
      <HansDateTimeInput
        pickerType="date"
        allowInputTyping
        onChange={onChange}
      />,
    );

    const input = screen.getByPlaceholderText('DD/MM/YYYY');
    fireEvent.change(input, { target: { value: '31/02/2026' } });
    fireEvent.blur(input);
    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith('');

    fireEvent.change(input, { target: { value: '14/03/2026' } });
    fireEvent.blur(input);
    expect(input).toHaveValue('14/03/2026');
    expect(onChange).toHaveBeenCalledWith('2026-03-14');
  });
});
