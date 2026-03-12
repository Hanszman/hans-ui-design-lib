import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansToggleSwitch } from './ToggleSwitch';

describe('HansToggleSwitch', () => {
  it('Should render label and default switch state', () => {
    render(<HansToggleSwitch label="Toggle" checked={false} />);
    const toggle = screen.getByRole('switch');
    expect(screen.getByText('Toggle')).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('Should toggle uncontrolled state and call onChange', () => {
    const onChange = vi.fn();
    render(<HansToggleSwitch defaultChecked={false} onChange={onChange} />);
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('Should keep controlled state until prop changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <HansToggleSwitch checked={false} onChange={onChange} />,
    );
    const toggle = screen.getByRole('switch');

    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    rerender(<HansToggleSwitch checked onChange={onChange} />);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('Should not toggle when disabled', () => {
    const onChange = vi.fn();
    render(<HansToggleSwitch checked={false} disabled onChange={onChange} />);
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should fallback base color to primary when checked', () => {
    render(<HansToggleSwitch checked toggleColor="base" />);
    expect(screen.getByRole('switch')).toHaveClass('hans-toggle-on-primary');
  });

  it('Should apply disabled on/off color classes and size', () => {
    const { rerender } = render(
      <HansToggleSwitch checked={false} disabled toggleSize="large" />,
    );
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('hans-toggle-off-disabled', 'hans-toggle-large');

    rerender(<HansToggleSwitch checked disabled toggleSize="small" />);
    expect(toggle).toHaveClass('hans-toggle-on-disabled', 'hans-toggle-small');
  });

  it('Should render side labels and track/thumb content', () => {
    render(
      <HansToggleSwitch
        defaultChecked
        leftLabel="Off"
        rightLabel="On"
        onContent="ON"
        offContent="OFF"
        thumbContent="T"
      />,
    );

    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(screen.getByText('On')).toBeInTheDocument();
    expect(screen.getByText('ON')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('Should handle numeric content and apply dynamic width limit', () => {
    render(
      <HansToggleSwitch
        toggleSize="small"
        defaultChecked
        onContent={12345678901234}
        offContent={0}
      />,
    );

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('hans-toggle-has-track-content');
    expect(toggle).toHaveStyle({ width: '88px' });
  });

  it('Should render loading spinner for switch mode', () => {
    render(<HansToggleSwitch loading />);
    expect(screen.getByLabelText('Loading switch toggle')).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
