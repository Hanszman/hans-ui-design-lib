import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansMessage } from './Message';

describe('HansMessage', () => {
  it('Should render neutral content with optional title and icon', () => {
    const { container } = render(
      <HansMessage
        title="Information"
        message="Saved locally"
        iconName="IoIosInformationCircle"
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Information');
    expect(screen.getByRole('status')).toHaveTextContent('Saved locally');
    expect(container.querySelector('.hans-message-icon')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('Should dismiss uncontrolled messages and emit close events', () => {
    const onClose = vi.fn();
    const onVisibilityChange = vi.fn();
    render(
      <HansMessage
        message="Dismiss me"
        dismissible
        closeButtonLabel="Close banner"
        onClose={onClose}
        onVisibilityChange={onVisibilityChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close banner' }));

    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledOnce();
    expect(onVisibilityChange).toHaveBeenCalledWith(false);
  });

  it('Should keep controlled messages visible until the consumer updates the prop', () => {
    const onVisibilityChange = vi.fn();
    render(
      <HansMessage
        message="Controlled"
        isVisible
        dismissible
        onVisibilityChange={onVisibilityChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss message' }));

    expect(screen.getByText('Controlled')).toBeInTheDocument();
    expect(onVisibilityChange).toHaveBeenCalledWith(false);
  });

  it('Should support hidden and danger accessibility states', () => {
    const { unmount } = render(
      <HansMessage message="Hidden" defaultVisible={false} />,
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();

    unmount();
    render(<HansMessage message="Failure" messageColor="danger" />);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('Should allow title-only messages', () => {
    const { container } = render(<HansMessage title="Title only" />);

    expect(screen.getByText('Title only')).toBeInTheDocument();
    expect(
      container.querySelector('.hans-message-copy'),
    ).not.toBeInTheDocument();
  });
});
