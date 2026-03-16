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
  vi.resetModules();
  vi.clearAllMocks();
});

describe('HansModal portal fallback', () => {
  it('Should render without portal target and allow overlay to be hidden', async () => {
    vi.doMock('./helpers/Modal.helper', async (importOriginal) => {
      const actual =
        await importOriginal<typeof import('./helpers/Modal.helper')>();

      return {
        ...actual,
        getModalPortalTarget: () => null,
      };
    });

    const { HansModal } = await import('./Modal');

    render(
      <HansModal isOpen showOverlay={false} title="Inline modal">
        <div>Inline content</div>
      </HansModal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(document.querySelector('.hans-modal-overlay')).toBeNull();
    expect(screen.getByText('Inline content')).toBeInTheDocument();
  });
});
