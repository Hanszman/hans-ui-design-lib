import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
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
});
