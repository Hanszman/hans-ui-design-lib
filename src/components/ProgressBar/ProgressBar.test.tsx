import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HansProgressBar } from './ProgressBar';

describe('HansProgressBar', () => {
  it('renders label, custom value and accessible progress semantics', () => {
    render(
      <HansProgressBar
        value={66}
        label="Knowledge level"
        valueLabel="Intermediate"
        progressColor="warning"
      />,
    );

    expect(screen.getByText('Knowledge level')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '66');
    expect(progress).toHaveAttribute('aria-valuetext', 'Intermediate');
  });

  it('renders percentage and supports hiding all copy', () => {
    const { rerender } = render(<HansProgressBar value={25} />);
    expect(screen.getByText('25%')).toBeInTheDocument();

    rerender(
      <HansProgressBar value={25} showValue={false} aria-label="Progress" />,
    );
    expect(screen.queryByText('25%')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Progress');
  });

  it('keeps the label while hiding the visible value', () => {
    render(<HansProgressBar value={10} label="Usage" showValue={false} />);
    expect(screen.getByText('Usage')).toBeInTheDocument();
    expect(screen.queryByText('10%')).not.toBeInTheDocument();
  });

  it('renders an accessible loading skeleton without determinate semantics', () => {
    const { container } = render(
      <HansProgressBar value={66} label="Knowledge level" loading />,
    );

    expect(screen.getByRole('status')).toHaveAccessibleName(
      'Loading Knowledge level',
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(
      container.querySelector('.hans-progress-bar-loading'),
    ).toBeInTheDocument();
  });

  it('renders the generic loading label when no label is provided', () => {
    render(<HansProgressBar loading progressSize="small" />);

    expect(screen.getByRole('status')).toHaveAccessibleName('Loading progress');
  });

  it('renders the large loading skeleton', () => {
    render(<HansProgressBar loading progressSize="large" label="Experience" />);

    expect(screen.getByRole('status')).toHaveAccessibleName(
      'Loading Experience',
    );
  });
});
