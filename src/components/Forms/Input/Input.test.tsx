import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HansInput } from './Input';

describe('HansInput', () => {
  it('Should render label and message with colors', () => {
    render(
      <HansInput
        label="Label"
        labelColor="secondary"
        message="Helper"
        messageColor="warning"
      />,
    );

    const label = screen.getByText('Label');
    const message = screen.getByText('Helper');

    expect(label).toHaveClass('hans-input-label', 'hans-input-label-secondary');
    expect(message).toHaveClass(
      'hans-input-message',
      'hans-input-message-warning',
    );
  });

  it('Should not render label or message when empty', () => {
    render(<HansInput />);
    expect(screen.queryByText('Label')).not.toBeInTheDocument();
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  it('Should apply size, color, and custom classes', () => {
    render(
      <HansInput
        inputSize="large"
        inputColor="danger"
        customClasses="custom-class"
        placeholder="Type"
      />,
    );

    const input = screen.getByPlaceholderText('Type');
    expect(input).toHaveClass(
      'hans-input',
      'hans-input-large',
      'hans-input-danger',
      'custom-class',
    );
  });

  it('Should render children content', () => {
    render(
      <HansInput>
        <span>Extra</span>
      </HansInput>,
    );

    expect(screen.getByText('Extra')).toBeInTheDocument();
  });

  it('Should render icons and adjust padding', () => {
    render(
      <HansInput
        placeholder="Search"
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      />,
    );

    const input = screen.getByPlaceholderText('Search');
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(input).toHaveClass('hans-input-has-left-icon');
    expect(input).toHaveClass('hans-input-has-right-icon');
  });

  it('Should render icon names with HansIcon for web component consumers', () => {
    render(
      <HansInput placeholder="Search" leftIcon="LuSearch" rightIcon="LuX" />,
    );

    const input = screen.getByPlaceholderText('Search');
    expect(screen.getByLabelText('Loading icon LuSearch')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading icon LuX')).toBeInTheDocument();
    expect(input).toHaveClass('hans-input-has-left-icon');
    expect(input).toHaveClass('hans-input-has-right-icon');
  });

  it('Should render the trailing icon as an accessible action when requested', () => {
    const onRightIconClick = vi.fn();

    render(
      <HansInput
        placeholder="Password"
        rightIcon="LuEye"
        rightIconAriaLabel="Show password"
        onRightIconClick={onRightIconClick}
      />,
    );

    const actionButton = screen.getByRole('button', {
      name: 'Show password',
    });

    fireEvent.click(actionButton);

    expect(actionButton).toHaveClass('hans-input-icon-action');
    expect(onRightIconClick).toHaveBeenCalledTimes(1);
  });

  it('Should render the leading icon as an accessible action when requested', () => {
    const onLeftIconClick = vi.fn();

    render(
      <HansInput
        placeholder="Search"
        leftIcon="LuSearch"
        leftIconAriaLabel="Search action"
        onLeftIconClick={onLeftIconClick}
      />,
    );

    const actionButton = screen.getByRole('button', {
      name: 'Search action',
    });

    fireEvent.click(actionButton);

    expect(actionButton).toHaveClass('hans-input-icon-action');
    expect(onLeftIconClick).toHaveBeenCalledTimes(1);
  });

  it('Should support a custom trailing action node', () => {
    const onRightIconClick = vi.fn();

    render(
      <HansInput
        placeholder="Password"
        rightIcon={<span data-testid="custom-action-icon">A</span>}
        rightIconAriaLabel="Toggle visibility"
        onRightIconClick={onRightIconClick}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Toggle visibility',
      }),
    );

    expect(screen.getByTestId('custom-action-icon')).toBeInTheDocument();
    expect(onRightIconClick).toHaveBeenCalledTimes(1);
  });

  it('Should expose a trailing icon action for web-component consumers with aria label only', () => {
    render(
      <HansInput
        placeholder="Password"
        rightIcon="LuEye"
        rightIconAriaLabel="Show password"
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Show password',
      }),
    ).toHaveClass('hans-input-icon-action');
  });

  it('Should keep decorative icons passive when no action contract is provided', () => {
    render(<HansInput placeholder="Search" leftIcon="LuSearch" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Loading icon LuSearch').tagName).toBe('SPAN');
  });

  it('Should support controlled and uncontrolled values', () => {
    const { rerender } = render(
      <HansInput placeholder="Controlled" value="abc" onChange={() => {}} />,
    );
    const controlledInput = screen.getByPlaceholderText('Controlled');
    expect(controlledInput).toHaveValue('abc');

    rerender(
      <HansInput placeholder="Controlled" value="" onChange={() => {}} />,
    );
    expect(controlledInput).toHaveValue('');

    cleanup();
    render(<HansInput placeholder="Uncontrolled" defaultValue="init" />);
    const uncontrolledInput = screen.getByPlaceholderText('Uncontrolled');
    expect(uncontrolledInput).toHaveValue('init');
  });

  it('Should normalize numeric and array values', () => {
    const { rerender } = render(
      <HansInput placeholder="Normalized" value={123} onChange={() => {}} />,
    );

    const input = screen.getByPlaceholderText('Normalized');
    expect(input).toHaveValue('123');

    rerender(
      <HansInput
        placeholder="Normalized"
        value={['Angular', 'React']}
        onChange={() => {}}
      />,
    );

    expect(input).toHaveValue('Angular, React');
  });

  it('Should emit normalized value changes', () => {
    const onValueChange = vi.fn();
    render(<HansInput placeholder="Search" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'portfolio' },
    });

    expect(onValueChange).toHaveBeenCalledWith('portfolio');
  });

  it('Should keep the rendered value in sync while typing', () => {
    render(<HansInput placeholder="Search" />);

    const input = screen.getByPlaceholderText('Search');

    fireEvent.input(input, {
      target: { value: 'angular' },
    });
    expect(input).toHaveValue('angular');

    fireEvent.input(input, {
      target: { value: '' },
    });
    expect(input).toHaveValue('');
  });

  it('Should pass validation props and disabled state', () => {
    render(
      <HansInput
        placeholder="Validated"
        minLength={2}
        maxLength={5}
        disabled
      />,
    );

    const input = screen.getByPlaceholderText('Validated');
    expect(input).toHaveAttribute('minLength', '2');
    expect(input).toHaveAttribute('maxLength', '5');
    expect(input).toBeDisabled();
  });

  it('Should disable the trailing icon action when the input is disabled', () => {
    render(
      <HansInput
        placeholder="Disabled action"
        rightIcon="LuEye"
        rightIconAriaLabel="Show password"
        onRightIconClick={() => {}}
        disabled
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Show password',
      }),
    ).toBeDisabled();
  });

  it('Should disable the leading icon action when the input is disabled', () => {
    render(
      <HansInput
        placeholder="Disabled action"
        leftIcon="LuSearch"
        leftIconAriaLabel="Search action"
        onLeftIconClick={() => {}}
        disabled
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'Search action',
      }),
    ).toBeDisabled();
  });
});
