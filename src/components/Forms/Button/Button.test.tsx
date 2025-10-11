import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('Should render with label', () => {
    render(<Button label="Primary" />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('applies size, color and variant classes correctly', () => {
    render(
      <Button size="large" color="danger" variant="outline" label="Click" />,
    );
    const button = screen.getByRole('button');

    expect(button).toHaveClass('hans-button');
    expect(button).toHaveClass('hans-button-large');
    expect(button).toHaveClass('hans-button-danger');
    expect(button).toHaveClass('hans-button-outline');
  });

  it('Should render with all props combined', () => {
    render(
      <Button
        label="All Props"
        size="small"
        color="success"
        variant="strong"
        disabled
        customClasses="custom-test"
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'hans-button',
      'hans-button-small',
      'hans-button-success',
      'hans-button-strong',
      'custom-test',
    );
    expect(button).toBeDisabled();
  });

  it('uses default type="button" if not specified', () => {
    render(<Button label="Default Type" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('uses provided button type', () => {
    render(<Button label="Submit" buttonType="submit" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('Should render with custom classes', () => {
    render(<Button label="Click" customClasses="extra-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('extra-class');
  });

  it('is disabled when prop is true', () => {
    render(<Button label="Disabled" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('hans-button-medium');
  });

  it('Should render with children instead of label', () => {
    render(
      <Button>
        <span>Custom Child</span>
      </Button>,
    );
    expect(screen.getByText('Custom Child')).toBeInTheDocument();
    expect(screen.queryByText('Primary')).not.toBeInTheDocument();
  });
});
