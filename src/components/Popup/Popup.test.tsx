import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansPopup } from './Popup';

describe('HansPopup', () => {
  it('Should toggle open state using trigger handlers', () => {
    const onOpenChange = vi.fn();
    render(
      <HansPopup
        isOpen={false}
        onOpenChange={onOpenChange}
        renderTrigger={({ toggle }) => (
          <button type="button" onClick={toggle}>
            Toggle
          </button>
        )}
      >
        <div>Content</div>
      </HansPopup>,
    );

    fireEvent.click(screen.getByText('Toggle'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('Should render content when open and close on outside click', () => {
    const onOpenChange = vi.fn();
    render(
      <HansPopup
        isOpen
        onOpenChange={onOpenChange}
        renderTrigger={() => <button type="button">Trigger</button>}
      >
        <div>Popup content</div>
      </HansPopup>,
    );

    expect(screen.getByText('Popup content')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('Should not open when disabled', () => {
    const onOpenChange = vi.fn();
    render(
      <HansPopup
        isOpen={false}
        disabled
        onOpenChange={onOpenChange}
        renderTrigger={({ open }) => (
          <button type="button" onClick={open}>
            Open
          </button>
        )}
      >
        <div>Popup content</div>
      </HansPopup>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('Should render default no-content message when children are empty', () => {
    render(
      <HansPopup
        isOpen
        renderTrigger={() => <button type="button">Trigger</button>}
      >
        {null}
      </HansPopup>,
    );

    expect(screen.getByText('No content')).toBeInTheDocument();
    expect(
      document.body.querySelector('.hans-popup-panel')?.getAttribute('style'),
    ).toContain('--hans-popup-bg: var(--background-color, var(--white))');
  });

  it('Should expose the computed horizontal popup position on the panel', () => {
    const onHorizontalPositionChange = vi.fn();
    render(
      <HansPopup
        isOpen
        onHorizontalPositionChange={onHorizontalPositionChange}
        renderTrigger={() => <button type="button">Trigger</button>}
      >
        <div>Popup content</div>
      </HansPopup>,
    );

    const panel = document.body.querySelector('.hans-popup-panel');

    expect(panel?.getAttribute('data-horizontal-position')).toBe('start');
    expect(onHorizontalPositionChange).not.toHaveBeenCalled();
  });

  it('Should keep portal popups interactive and allow opting out of the portal', () => {
    const onOpenChange = vi.fn();
    render(
      <HansPopup
        isOpen
        onOpenChange={onOpenChange}
        renderTrigger={() => <button type="button">Trigger</button>}
      >
        <button type="button">Portal action</button>
      </HansPopup>,
    );

    fireEvent.mouseDown(screen.getByText('Portal action'));
    expect(onOpenChange).not.toHaveBeenCalled();

    const { container: inlineContainer } = render(
      <HansPopup
        isOpen
        portal={false}
        renderTrigger={() => <button type="button">Inline trigger</button>}
      >
        <div>Inline content</div>
      </HansPopup>,
    );

    expect(inlineContainer.querySelector('.hans-popup-panel')).toBeInTheDocument();
  });
});
