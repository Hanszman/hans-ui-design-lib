import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansToggleSegmented } from './ToggleSegmented';

describe('HansToggleSegmented', () => {
  it('Should render segmented mode and change internal value', () => {
    render(
      <HansToggleSegmented
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
      <HansToggleSegmented
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
      <HansToggleSegmented
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
      <HansToggleSegmented
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
      <HansToggleSegmented
        options={[
          { label: 'With icon', value: 'icon', icon: <span>i</span> },
          { label: 'Plain', value: 'plain' },
        ]}
      />,
    );

    expect(screen.getByText('i')).toBeInTheDocument();
  });

  it('Should render loading skeleton for segmented mode', () => {
    render(
      <HansToggleSegmented
        loading
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
      />,
    );
    expect(
      screen.getByLabelText('Loading segmented toggle'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('Should render an empty tablist when no options or default value are provided', () => {
    render(<HansToggleSegmented />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });
});
