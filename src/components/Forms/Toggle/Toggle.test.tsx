import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HansToggle } from './Toggle';

describe('HansToggle', () => {
  it('Should render switch mode by default', () => {
    render(<HansToggle label="Toggle" checked={false} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('Should render segmented mode when requested', () => {
    render(
      <HansToggle
        toggleMode="segmented"
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
      />,
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
