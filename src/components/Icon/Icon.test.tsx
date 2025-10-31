import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { HansIcon } from './Icon';
import { type IconLibrary, DynamicIconImports } from './Icon.types';

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

describe('HansIcon', () => {
  it('Should render icon dynamically by name (FaHome)', async () => {
    render(<HansIcon name="FaHome" data-testid="icon-home" />);
    const icon = await screen.findByTestId('icon-home');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('hans-icon');
  });

  it('Should render loading placeholder if no name is passed', () => {
    const { container } = render(<HansIcon />);
    const loading = container.querySelector('.hans-icon-loading');
    expect(loading).toBeInTheDocument();
  });

  it('Should not crash if icon prefix is invalid (no loader)', async () => {
    render(<HansIcon name="XxUnknown" />);
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelector('.hans-icon-loading')).toBeInTheDocument();
  });

  it('Should handle loader present but icon name missing in lib', async () => {
    render(<HansIcon name="FaDoesNotExist" />);
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelector('.hans-icon-loading')).toBeInTheDocument();
  });

  it('Should handle error when loader import fails', async () => {
    const errorLoader: () => Promise<IconLibrary> = vi
      .fn()
      .mockRejectedValue(new Error('fail'));
    const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalFa = DynamicIconImports.Fa;
    DynamicIconImports.Fa = errorLoader;

    render(<HansIcon name="FaErrorIcon" />);
    await new Promise((r) => setTimeout(r, 0));

    expect(spyWarn).toHaveBeenCalledWith(
      expect.stringContaining('[HansUI] Error loading icon FaErrorIcon:'),
      expect.any(Error),
    );
    expect(document.querySelector('.hans-icon-loading')).toBeInTheDocument();
    DynamicIconImports.Fa = originalFa;
    spyWarn.mockRestore();
  });

  it('Should ignore late resolution from previous effect after name changes (cleanup path)', async () => {
    const originalFa = DynamicIconImports.Fa;
    const first = deferred<IconLibrary>();
    const second: Promise<IconLibrary> = Promise.resolve({
      FaBeer: (props: React.SVGProps<SVGSVGElement>) => (
        <svg data-testid="icon-beer" {...props} />
      ),
    });
    const mockLoader: () => Promise<IconLibrary> = vi
      .fn<() => Promise<IconLibrary>>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second);
    DynamicIconImports.Fa = mockLoader;
    const { rerender } = render(<HansIcon name="FaHome" />);

    rerender(<HansIcon name="FaBeer" />);
    await act(async () => {
      first.resolve({
        FaHome: (p: React.SVGProps<SVGSVGElement>) => (
          <svg data-testid="icon-home" {...p} />
        ),
      });
      await Promise.resolve();
    });

    expect(await screen.findByTestId('icon-beer')).toBeInTheDocument();
    DynamicIconImports.Fa = originalFa;
  });
});
