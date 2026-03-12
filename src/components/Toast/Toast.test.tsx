import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HansToast } from './Toast';
import { resetToastStackRegistry } from './helpers/Toast.helper';

vi.mock('../Icon/Icon', () => ({
  HansIcon: ({ name }: { name?: string }) => (
    <span data-testid={`mock-toast-icon-${name}`}>{name}</span>
  ),
}));

class ResizeObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
}

const renderWithAct = (ui: React.ReactNode) => {
  let view: ReturnType<typeof render>;

  act(() => {
    view = render(ui);
  });

  return view!;
};

describe('HansToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetToastStackRegistry();
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    resetToastStackRegistry();
  });

  it('Should render title, message, icon and semantic classes', () => {
    renderWithAct(
      <HansToast
        title="Saved"
        message="Your changes are available."
        toastColor="success"
        toastVariant="default"
        toastSize="large"
        iconName="MdCheckCircle"
        customClasses="custom-toast"
      />,
    );

    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('hans-toast', 'hans-toast-large', 'custom-toast');
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are available.')).toBeInTheDocument();
    expect(screen.getByTestId('mock-toast-icon-MdCheckCircle')).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-toast-icon-IoIosCloseCircle'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Dismiss notification' }),
    ).toBeInTheDocument();
  });

  it('Should auto dismiss uncontrolled toast after duration', () => {
    const onClose = vi.fn();
    const onVisibilityChange = vi.fn();

    renderWithAct(
      <HansToast
        title="Auto close"
        message="This toast will close automatically."
        duration={1200}
        onClose={onClose}
        onVisibilityChange={onVisibilityChange}
      />,
    );

    expect(screen.getByText('Auto close')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.queryByText('Auto close')).not.toBeInTheDocument();
    expect(onVisibilityChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledWith('timeout');
  });

  it('Should dismiss toast on close button click when uncontrolled', () => {
    const onClose = vi.fn();

    renderWithAct(
      <HansToast
        title="Dismissible"
        message="Close me"
        duration={0}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));

    expect(screen.queryByText('Dismissible')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledWith('dismiss');
  });

  it('Should support controlled visibility without hiding until parent updates', () => {
    const onClose = vi.fn();
    const onVisibilityChange = vi.fn();

    renderWithAct(
      <HansToast
        isVisible
        dismissible={false}
        duration={0}
        toastColor="danger"
        onClose={onClose}
        onVisibilityChange={onVisibilityChange}
      />,
    );

    const toast = screen.getByRole('alert');
    expect(toast).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    expect(screen.queryByText('Your changes are available.')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(onVisibilityChange).not.toHaveBeenCalled();
  });

  it('Should stack toasts vertically for the same position', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function mockRect(this: HTMLElement) {
        const height = this.dataset.testid === 'first-toast' ? 80 : 64;
        return {
          width: 0,
          height,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      },
    );

    renderWithAct(
      <>
        <HansToast
          data-testid="first-toast"
          title="First"
          message="First message"
          duration={0}
          stackGap={12}
        />
        <HansToast
          data-testid="second-toast"
          title="Second"
          message="Second message"
          duration={0}
          stackGap={12}
        />
      </>,
    );

    expect(screen.getByTestId('second-toast')).toHaveStyle(
      'transform: translateY(92px)',
    );
  });

  it('Should support environments without ResizeObserver', () => {
    vi.unstubAllGlobals();
    const resizeObserverDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'ResizeObserver',
    );

    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      value: undefined,
    });

    const { unmount } = renderWithAct(
      <HansToast title="Legacy browser" message="Fallback path" duration={0} />,
    );

    expect(screen.getByText('Legacy browser')).toBeInTheDocument();

    act(() => {
      unmount();
    });

    if (resizeObserverDescriptor) {
      Object.defineProperty(globalThis, 'ResizeObserver', resizeObserverDescriptor);
    }
  });

  it('Should not render when visibility starts disabled', () => {
    renderWithAct(
      <HansToast
        defaultVisible={false}
        title="Hidden"
        message="This should not render"
      />,
    );

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
});
