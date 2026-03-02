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

  it('Should render side labels and track/thumb content', () => {
    render(
      <HansToggle
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

  it('Should render segmented mode and change internal value', () => {
    render(
      <HansToggle
        toggleMode="segmented"
        label="Mode"
        options={[
          { label: 'Assistive', value: 'assistive' },
          { label: 'Expert', value: 'expert' },
        ]}
        defaultValue="assistive"
      />,
    );

    const assistive = screen.getByRole('tab', { name: 'Assistive' });
    const expert = screen.getByRole('tab', { name: 'Expert' });

    expect(assistive).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(expert);
    expect(expert).toHaveAttribute('aria-selected', 'true');
  });

  it('Should support controlled segmented mode and callback', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <HansToggle
        toggleMode="segmented"
        value="on"
        onValueChange={onValueChange}
        options={[
          { label: 'On', value: 'on' },
          { label: 'Off', value: 'off' },
        ]}
      />,
    );

    const off = screen.getByRole('tab', { name: 'Off' });
    fireEvent.click(off);
    expect(onValueChange).toHaveBeenCalledWith('off');
    expect(off).toHaveAttribute('aria-selected', 'false');

    rerender(
      <HansToggle
        toggleMode="segmented"
        value="off"
        onValueChange={onValueChange}
        options={[
          { label: 'On', value: 'on' },
          { label: 'Off', value: 'off' },
        ]}
      />,
    );
    expect(off).toHaveAttribute('aria-selected', 'true');
  });

  it('Should block segmented click when component or option is disabled', () => {
    const onValueChange = vi.fn();
    render(
      <HansToggle
        toggleMode="segmented"
        onValueChange={onValueChange}
        options={[
          { label: 'One', value: 'one', disabled: true },
          { label: 'Two', value: 'two' },
        ]}
        disabled
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'One' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('Should render segmented option icon node', () => {
    render(
      <HansToggle
        toggleMode="segmented"
        options={[
          { label: 'With icon', value: 'icon', icon: <span>i</span> },
          { label: 'Plain', value: 'plain' },
        ]}
      />,
    );

    expect(screen.getByText('i')).toBeInTheDocument();
  });

  it('Should handle numeric content and apply dynamic width limit', () => {
    render(
      <HansToggle
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
});
