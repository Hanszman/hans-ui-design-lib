import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansInputActionIcon } from './InputActionIcon';

describe('HansInputActionIcon', () => {
  it('Should render a passive icon when no action is provided', () => {
    render(
      <HansInputActionIcon
        icon="LuMail"
        side="left"
        inputColor="base"
        disabled={false}
      />,
    );

    expect(screen.getByLabelText('Loading icon LuMail')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('Should render a clickable action icon when an action is provided', () => {
    const onClick = vi.fn();

    render(
      <HansInputActionIcon
        icon="LuEye"
        side="right"
        inputColor="base"
        disabled={false}
        ariaLabel="Toggle password visibility"
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button', {
      name: 'Toggle password visibility',
    });

    fireEvent.click(button);

    expect(button).toHaveClass('hans-input-icon-action');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Should support custom icon nodes', () => {
    render(
      <HansInputActionIcon
        icon={<span data-testid="custom-left-icon">L</span>}
        side="left"
        inputColor="primary"
        disabled={false}
      />,
    );

    expect(screen.getByTestId('custom-left-icon')).toBeInTheDocument();
  });
});
