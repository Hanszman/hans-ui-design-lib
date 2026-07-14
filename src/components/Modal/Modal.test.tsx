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
    disabled,
    loading,
  }: {
    label: string;
    onClick?: () => void;
    buttonVariant?: string;
    buttonColor?: string;
    disabled?: boolean;
    loading?: boolean;
  }) => (
    <button
      type="button"
      data-variant={buttonVariant}
      data-color={buttonColor}
      data-loading={loading ? 'true' : 'false'}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  ),
}));

vi.mock('../Loading/Loading', () => ({
  HansLoading: ({
    ariaLabel,
    loadingColor,
    loadingSize,
    loadingType,
  }: {
    ariaLabel?: string;
    loadingColor?: string;
    loadingSize?: string;
    loadingType?: string;
  }) => (
    <span
      data-testid="mock-modal-loading"
      aria-label={ariaLabel}
      data-color={loadingColor}
      data-size={loadingSize}
      data-type={loadingType}
    />
  ),
}));

vi.mock('../Pagination/Pagination', () => ({
  HansPagination: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
  }) => (
    <button
      type="button"
      data-testid="mock-modal-pagination"
      data-current-page={currentPage}
      data-total-pages={totalPages}
      onClick={() => onPageChange?.(currentPage + 1)}
    >
      pagination
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

  it('Should keep confirm flow open when closeOnConfirm is disabled', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithAct(
      <HansModal
        isOpen
        title="Persistent confirm"
        confirmLabel="Save"
        cancelLabel="Close"
        closeOnConfirm={false}
        onConfirm={onConfirm}
        onClose={onClose}
      >
        <div>Body</div>
      </HansModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalledWith('confirm');
    expect(screen.getByText('Persistent confirm')).toBeInTheDocument();
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

  it('Should render side modal custom footer and pagination support', () => {
    const onPageChange = vi.fn();

    renderWithAct(
      <HansModal
        isOpen
        title="Side panel"
        placement="right"
        modalSize="large"
        modalColor="primary"
        modalVariant="outline"
        footer={<span>Custom footer content</span>}
        paginationCurrentPage={2}
        paginationTotalPages={4}
        onPageChange={onPageChange}
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
    expect(screen.getByTestId('mock-modal-pagination')).toHaveAttribute(
      'data-current-page',
      '2',
    );
    fireEvent.click(screen.getByTestId('mock-modal-pagination'));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(document.body.style.overflow).toBe('');
  });

  it('Should render footer pagination without custom footer content', () => {
    const onPageChange = vi.fn();

    renderWithAct(
      <HansModal
        isOpen
        title="Pagination only"
        paginationCurrentPage={1}
        paginationTotalPages={3}
        onPageChange={onPageChange}
        dismissible={false}
      >
        <div>Body</div>
      </HansModal>,
    );

    expect(screen.getByTestId('mock-modal-pagination')).toHaveAttribute(
      'data-total-pages',
      '3',
    );
    expect(screen.queryByText('Custom footer content')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('mock-modal-pagination'));

    expect(onPageChange).toHaveBeenCalledWith(2);
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

  it('Should render centered loading state with minimum body area and hide children', () => {
    renderWithAct(
      <HansModal isOpen title="Loading modal" modalSize="small" loading>
        <div>Hidden content</div>
      </HansModal>,
    );

    expect(screen.getByText('Loading modal')).toBeInTheDocument();
    expect(screen.getByTestId('mock-modal-loading')).toHaveAttribute(
      'aria-label',
      'Modal loading',
    );
    expect(screen.getByTestId('mock-modal-loading')).toHaveAttribute(
      'data-type',
      'spinner',
    );
    expect(screen.getByTestId('mock-modal-loading')).toHaveAttribute(
      'data-size',
      'medium',
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-modal-loading').parentElement).toHaveClass(
      'hans-modal-body-content',
      'hans-modal-body-loading',
    );
  });

  it('Should expose confirm loading and disabled footer actions', () => {
    renderWithAct(
      <HansModal
        isOpen
        title="Saving"
        confirmLabel="Save"
        cancelLabel="Close"
        confirmDisabled
        cancelDisabled
        confirmLoading
      >
        <div>Body</div>
      </HansModal>,
    );

    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'data-loading',
      'true',
    );
  });

  it('Should render body slot when requested for web component projection', () => {
    renderWithAct(<HansModal isOpen title="Projected content" renderBody />);

    expect(screen.getByText('Projected content')).toBeInTheDocument();
    expect(document.body.querySelector('slot')).toBeInTheDocument();
  });

  it('Should project web component light DOM content into the portal body', () => {
    const host = document.createElement('hans-modal-test-host');
    const projectedContent = document.createElement('section');
    const shadow = host.attachShadow({ mode: 'open' });

    projectedContent.textContent = 'Projected Angular body';
    host.appendChild(projectedContent);
    document.body.appendChild(host);

    const { unmount } = renderWithAct(
      <HansModal isOpen title="Framework modal" renderBody container={shadow} />,
    );

    expect(screen.getByText('Projected Angular body')).toBeInTheDocument();
    expect(host).not.toContainElement(projectedContent);

    act(() => {
      unmount();
    });

    expect(host).toContainElement(projectedContent);
    document.body.removeChild(host);
  });

  it('Should ignore projection containers without a web component host', () => {
    renderWithAct(
      <HansModal
        isOpen
        title="Container without host"
        renderBody
        container={document.createElement('div')}
      />,
    );

    expect(screen.getByText('Container without host')).toBeInTheDocument();
    expect(
      document.body.querySelector('.hans-modal-projected-content'),
    ).toBeInTheDocument();
  });

  it('Should ignore projection containers with a non-element host', () => {
    const container = {
      host: document.createTextNode('not an element'),
    } as unknown as ShadowRoot;

    renderWithAct(
      <HansModal
        isOpen
        title="Non element host"
        renderBody
        container={container}
      />,
    );

    expect(screen.getByText('Non element host')).toBeInTheDocument();
    expect(
      document.body.querySelector('.hans-modal-projected-content'),
    ).toBeInTheDocument();
  });

  it('Should keep modal in place when portal is disabled', () => {
    const { container } = renderWithAct(
      <HansModal isOpen title="Inline modal" disablePortal>
        <span>Inline body</span>
      </HansModal>,
    );

    expect(container.querySelector('.hans-modal-portal')).toBeInTheDocument();
    expect(screen.getByText('Inline body')).toBeInTheDocument();
  });

  it('Should prefer explicit children over slot when render body is enabled', () => {
    renderWithAct(
      <HansModal isOpen title="Children content" renderBody>
        <strong>Explicit body</strong>
      </HansModal>,
    );

    expect(screen.getByText('Explicit body')).toBeInTheDocument();
    expect(document.body.querySelector('slot')).not.toBeInTheDocument();
  });
});
