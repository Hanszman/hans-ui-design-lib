import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HansModal } from './Modal';

vi.mock('../Icon/Icon', () => ({
  HansIcon: ({ name }: { name?: string }) => (
    <span data-testid={`mock-modal-icon-${name}`}>{name}</span>
  ),
}));

vi.mock('../Forms/Button/Button', () => ({
  HansButton: ({
    label,
    onClick,
    buttonVariant,
    buttonColor,
  }: {
    label: string;
    onClick?: () => void;
    buttonVariant?: string;
    buttonColor?: string;
  }) => (
    <button
      type="button"
      data-variant={buttonVariant}
      data-color={buttonColor}
      onClick={onClick}
    >
      {label}
    </button>
  ),
}));

const renderWithAct = (ui: React.ReactNode) => {
  let view: ReturnType<typeof render>;

  act(() => {
    view = render(ui);
  });

  return view!;
};

describe('HansModal', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  it('Should render centered modal with header body footer and dismiss button', () => {
    renderWithAct(
      <HansModal
        isOpen
        title="Edit user"
        header="Review the information below."
        confirmLabel="Save"
        cancelLabel="Cancel"
      >
        <div>Modal content</div>
      </HansModal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(
      'hans-modal-dialog',
      'hans-modal-medium',
      'hans-modal-placement-center',
    );
    expect(screen.getByText('Edit user')).toBeInTheDocument();
    expect(screen.getByText('Review the information below.')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
    expect(
      screen.getByTestId('mock-modal-icon-IoIosCloseCircle'),
    ).toBeInTheDocument();
  });

  it('Should support uncontrolled dismiss confirm cancel and escape flows', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAct(
      <HansModal
        defaultOpen
        title="Action modal"
        confirmLabel="Confirm"
        cancelLabel="Back"
        onConfirm={onConfirm}
        onClose={onClose}
      >
        <div>Body</div>
      </HansModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('confirm');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    renderWithAct(
      <HansModal defaultOpen title="Escape modal" onClose={onClose}>
        <div>Body</div>
      </HansModal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith('escape');
    expect(screen.queryByText('Escape modal')).not.toBeInTheDocument();
  });

  it('Should close with dismiss button when dismissible', () => {
    const onClose = vi.fn();

    renderWithAct(
      <HansModal defaultOpen title="Dismiss modal" onClose={onClose}>
        <div>Body</div>
      </HansModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(onClose).toHaveBeenCalledWith('dismiss');
    expect(screen.queryByText('Dismiss modal')).not.toBeInTheDocument();
  });

  it('Should support controlled mode without hiding until parent changes state', () => {
    const onOpenChange = vi.fn();
    const onClose = vi.fn();

    renderWithAct(
      <HansModal
        isOpen
        title="Controlled"
        dismissible={false}
        closeOnBackdropClick={false}
        closeOnEscape={false}
        onOpenChange={onOpenChange}
        onClose={onClose}
      >
        <div>Persistent content</div>
      </HansModal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(screen.getByText('Persistent content'));

    expect(screen.getByText('Controlled')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close modal' })).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Should close on backdrop click and render inside custom portal target', () => {
    const portalTarget = document.createElement('div');
    document.body.appendChild(portalTarget);
    const onClose = vi.fn();

    renderWithAct(
      <HansModal
        defaultOpen
        title="Portal modal"
        portalTarget={portalTarget}
        onClose={onClose}
      >
        <div>Portal content</div>
      </HansModal>,
    );

    expect(portalTarget).toHaveTextContent('Portal modal');

    fireEvent.click(portalTarget.querySelector('.hans-modal-shell') as Element);

    expect(onClose).toHaveBeenCalledWith('backdrop');
    document.body.removeChild(portalTarget);
  });

  it('Should render side modal custom footer and keep body scroll unlocked when disabled', () => {
    renderWithAct(
      <HansModal
        isOpen
        title="Side panel"
        placement="right"
        modalSize="large"
        modalColor="primary"
        modalVariant="outline"
        footer={<span>Custom footer content</span>}
        dismissible={false}
        lockBodyScroll={false}
        showHeaderDivider={false}
        showFooterDivider={false}
      >
        <div style={{ minWidth: '1200px' }}>Wide content</div>
      </HansModal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('hans-modal-placement-right', 'hans-modal-large');
    expect(screen.getByText('Custom footer content')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('Should support header-only and footer-only optional section combinations', () => {
    const { rerender } = renderWithAct(
      <HansModal isOpen header="Header without title" dismissible={false}>
        {null}
      </HansModal>,
    );

    expect(screen.getByText('Header without title')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close modal' })).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();

    rerender(
      <HansModal
        isOpen
        title=""
        header={null}
        footer={<span>Footer only</span>}
        dismissible={false}
      >
        {null}
      </HansModal>,
    );

    expect(screen.getByText('Footer only')).toBeInTheDocument();
    expect(screen.queryByText('Header without title')).not.toBeInTheDocument();
  });

  it('Should not render when closed and should focus dialog when opened', () => {
    const { rerender } = renderWithAct(
      <HansModal isOpen={false} title="Hidden">
        <div>Body</div>
      </HansModal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <HansModal isOpen title="Visible">
        <div>Body</div>
      </HansModal>,
    );

    expect(screen.getByRole('dialog')).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });
});
