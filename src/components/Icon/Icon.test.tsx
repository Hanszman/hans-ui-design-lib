import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { Icon } from './Icon';

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

describe('Icon', () => {
  it('Should render icon dynamically by name (FaHome)', async () => {
    render(<Icon name="FaHome" data-testid="icon-home" />);
    const icon = await screen.findByTestId('icon-home');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('hans-icon');
  });

  it('Should render loading placeholder if no name is passed', () => {
    const { container } = render(<Icon />);
    const loading = container.querySelector('.hans-icon-loading');
    expect(loading).toBeInTheDocument();
  });

  it('Should not crash if icon prefix is invalid (no loader)', async () => {
    render(<Icon name="XxUnknown" />);
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelector('.hans-icon-loading')).toBeInTheDocument();
  });

  it('Should handle loader present but icon name missing in lib', async () => {
    render(<Icon name="FaDoesNotExist" />);
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelector('.hans-icon-loading')).toBeInTheDocument();
  });

  it('Should handle error when loader import fails', async () => {
    const errorLoader = vi.fn().mockRejectedValue(new Error('fail'));
    const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const iconModule = await import('./Icon');
    iconModule.dynamicIconImports.Fa = errorLoader;

    render(<iconModule.Icon name="FaErrorIcon" />);
    await new Promise((r) => setTimeout(r, 0));

    expect(spyWarn).toHaveBeenCalledWith(
      expect.stringContaining('[HansUI] Error loading icon FaErrorIcon:'),
      expect.any(Error),
    );
    expect(document.querySelector('.hans-icon-loading')).toBeInTheDocument();
    spyWarn.mockRestore();
  });

  it('Should ignore late resolution from previous effect after name changes (cleanup path)', async () => {
    const iconModule = await import('./Icon');
    const originalFa = iconModule.dynamicIconImports.Fa;
    const first = deferred<any>();
    const second = Promise.resolve({
      FaBeer: (props: any) => <svg data-testid="icon-beer" {...props} />,
    });
    const mockLoader = vi
      .fn<() => Promise<any>>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second);
    iconModule.dynamicIconImports.Fa = mockLoader;
    const { rerender } = render(<iconModule.Icon name="FaHome" />);

    rerender(<iconModule.Icon name="FaBeer" />);
    await act(async () => {
      first.resolve({
        FaHome: (p: any) => <svg data-testid="icon-home" {...p} />,
      });
      await Promise.resolve();
    });

    expect(await screen.findByTestId('icon-beer')).toBeInTheDocument();
    iconModule.dynamicIconImports.Fa = originalFa;
  });
});
