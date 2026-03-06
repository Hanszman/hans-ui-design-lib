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
});
