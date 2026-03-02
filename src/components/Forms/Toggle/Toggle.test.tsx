import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansToggle } from './Toggle';

describe('HansToggle', () => {
  it('Should render label and default switch state', () => {
    render(<HansToggle label="Toggle" checked={false} />);
    const toggle = screen.getByRole('switch');
    expect(screen.getByText('Toggle')).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('Should toggle uncontrolled state and call onChange', () => {
    const onChange = vi.fn();
    render(
      <HansToggle
        defaultChecked={false}
        onChange={onChange}
      />,
    );
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('Should keep controlled state until prop changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <HansToggle checked={false} onChange={onChange} />,
    );
    const toggle = screen.getByRole('switch');

    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    rerender(<HansToggle checked onChange={onChange} />);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('Should not toggle when disabled', () => {
    const onChange = vi.fn();
    render(<HansToggle checked={false} disabled onChange={onChange} />);
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should fallback base color to primary when checked', () => {
    render(<HansToggle checked toggleColor="base" />);
    expect(screen.getByRole('switch')).toHaveClass('hans-toggle-on-primary');
  });

  it('Should apply disabled on/off color classes and size', () => {
    const { rerender } = render(
      <HansToggle checked={false} disabled toggleSize="large" />,
    );
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('hans-toggle-off-disabled', 'hans-toggle-large');

    rerender(<HansToggle checked disabled toggleSize="small" />);
    expect(toggle).toHaveClass('hans-toggle-on-disabled', 'hans-toggle-small');
  });
});
