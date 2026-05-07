import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HansButton } from './Button';

describe('HansButton', () => {
  it('Should render with label', () => {
    render(<HansButton label="Primary" />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('Should apply size, color and variant classes correctly', () => {
    render(
      <HansButton
        buttonSize="large"
        buttonColor="danger"
        buttonVariant="outline"
        label="Click"
      />,
    );
    const button = screen.getByRole('button');

    expect(button).toHaveClass('hans-button');
    expect(button).toHaveClass('hans-button-large');
    expect(button).toHaveClass('hans-button-danger');
    expect(button).toHaveClass('hans-button-outline');
    expect(button).toHaveClass('hans-button-rounded');
  });

  it('Should render with all props combined', () => {
    render(
      <HansButton
        label="All Props"
        buttonSize="small"
        buttonColor="success"
        buttonVariant="strong"
        hoverButtonColor="base"
        hoverButtonVariant="transparent"
        buttonShape="square"
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
      'hans-button-hover-color-base',
      'hans-button-hover-variant-transparent',
      'hans-button-square',
      'custom-test',
    );
    expect(button).toBeDisabled();
  });

  it('Should resolve missing hover color from the base button color', () => {
    render(
      <HansButton
        label="Hover Variant Only"
        buttonColor="secondary"
        hoverButtonVariant="outline"
      />,
    );

    expect(screen.getByRole('button')).toHaveClass(
      'hans-button-hover-color-secondary',
      'hans-button-hover-variant-outline',
    );
  });

  it('Should resolve missing hover variant from the base button variant', () => {
    render(
      <HansButton
        label="Hover Color Only"
        buttonVariant="neutral"
        hoverButtonColor="info"
      />,
    );

    expect(screen.getByRole('button')).toHaveClass(
      'hans-button-hover-color-info',
      'hans-button-hover-variant-neutral',
    );
  });

  it('Should use default type="button" if not specified', () => {
    render(<HansButton label="Default Type" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('Should use provided button type', () => {
    render(<HansButton label="Submit" buttonType="submit" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('Should render with custom classes', () => {
    render(<HansButton label="Click" customClasses="extra-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('extra-class');
  });

  it('Should be disabled when prop is true', () => {
    render(<HansButton label="Disabled" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('hans-button-medium');
  });

  it('Should render with children instead of label', () => {
    render(
      <HansButton>
        <span>Custom Child</span>
      </HansButton>,
    );
    expect(screen.getByText('Custom Child')).toBeInTheDocument();
    expect(screen.queryByText('Primary')).not.toBeInTheDocument();
  });

  it('Should render HansLoading skeleton when loading is true', () => {
    render(<HansButton label="Load" loading />);
    const loading = screen.getByLabelText('Loading button');
    expect(loading).toBeInTheDocument();
    expect(loading).toHaveClass('hans-button-loading', 'hans-loading-skeleton');
    expect(screen.queryByText('Load')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
