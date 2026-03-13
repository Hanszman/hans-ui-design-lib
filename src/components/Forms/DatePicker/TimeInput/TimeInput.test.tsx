import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansTimeInput } from './TimeInput';

describe('HansTimeInput', () => {
  it('Should accept valid minute and second values', () => {
    const onChange = vi.fn();
    const { rerender } = render(<HansTimeInput pickerType="time" onChange={onChange} />);

    const input = screen.getByPlaceholderText('HH:MM');
    fireEvent.change(input, { target: { value: '0945' } });
    expect(input).toHaveValue('09:45');
    expect(onChange).toHaveBeenCalledWith('09:45');

    rerender(
      <HansTimeInput pickerType="time" timePrecision="second" onChange={onChange} />,
    );
    const secondInput = screen.getByPlaceholderText('HH:MM:SS');
    fireEvent.change(secondInput, { target: { value: '094530' } });
    expect(secondInput).toHaveValue('09:45:30');
  });

  it('Should clear invalid times', () => {
    const onChange = vi.fn();
    render(<HansTimeInput pickerType="time" timePrecision="second" onChange={onChange} />);

    const input = screen.getByPlaceholderText('HH:MM:SS');
    fireEvent.change(input, { target: { value: '250000' } });

    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('Should support controlled values and custom placeholder', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <HansTimeInput
        pickerType="time"
        value="08:15"
        placeholder="Custom time"
        onChange={onChange}
      />,
    );

    expect(screen.getByPlaceholderText('Custom time')).toHaveValue('08:15');

    rerender(
      <HansTimeInput
        pickerType="time"
        value="10:20"
        placeholder="Custom time"
        onChange={onChange}
      />,
    );

    expect(screen.getByPlaceholderText('Custom time')).toHaveValue('10:20');
  });
});
