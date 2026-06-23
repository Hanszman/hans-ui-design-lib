import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../Icon/Icon', () => ({
  HansIcon: ({ name }: { name?: string }) => (
    <span data-testid={`mock-modal-icon-${name}`}>{name}</span>
  ),
}));

vi.mock('../Forms/Button/Button', () => ({
  HansButton: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  ),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('HansModal portal fallback', () => {
  it('Should render inline when portal is disabled and allow overlay to be hidden', async () => {
    const { HansModal } = await import('./Modal');

    render(
      <HansModal
        isOpen
        disablePortal
        showOverlay={false}
        title="Inline modal"
      >
        <div>Inline content</div>
      </HansModal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(document.querySelector('.hans-modal-overlay')).toBeNull();
    expect(screen.getByText('Inline content')).toBeInTheDocument();
  });

  it('Should render inline when portal target resolves to null', async () => {
    vi.resetModules();
    vi.doMock('./helpers/Modal.helper', async () => {
      const actual = await vi.importActual<typeof import('./helpers/Modal.helper')>(
        './helpers/Modal.helper',
      );

      return {
        ...actual,
        getModalPortalTarget: () => null,
      };
    });

    const { HansModal } = await import('./Modal');

    render(
      <HansModal isOpen title="Fallback modal">
        <div>Fallback content</div>
      </HansModal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Fallback content')).toBeInTheDocument();
    expect(document.querySelector('.hans-modal-overlay')).not.toBeNull();

    vi.doUnmock('./helpers/Modal.helper');
  });
});
