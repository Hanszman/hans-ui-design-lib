import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HansLoading } from './Loading';

describe('HansLoading', () => {
  it('Should render spinner by default', () => {
    const { container } = render(<HansLoading />);
    const spinner = container.querySelector('.hans-loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('hans-loading-medium');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('Should render skeleton with dimensions and no rounded when disabled', () => {
    const { container } = render(
      <HansLoading
        loadingType="skeleton"
        skeletonWidth={180}
        skeletonHeight="24px"
        rounded={false}
      />,
    );

    const skeleton = container.querySelector('.hans-loading-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).not.toHaveClass('hans-loading-rounded');
    expect(skeleton).toHaveStyle('--hans-loading-width: 180px');
    expect(skeleton).toHaveStyle('--hans-loading-height: 24px');
  });

  it('Should apply custom classes and color token variables', () => {
    const { container } = render(
      <HansLoading
        loadingColor="primary"
        loadingSize="small"
        customClasses="custom-loader"
      />,
    );

    const spinner = container.querySelector('.hans-loading-spinner');
    expect(spinner).toHaveClass('custom-loader');
    expect(spinner).toHaveStyle(
      '--hans-loading-spinner-top: var(--primary-default-color)',
    );
  });

  it('Should allow custom aria label', () => {
    render(<HansLoading ariaLabel="Fetching users" />);
    expect(screen.getByLabelText('Fetching users')).toBeInTheDocument();
  });
});
