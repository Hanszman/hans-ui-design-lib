import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansDropdown } from './Dropdown';

const options = [
  { id: 'one', label: 'One', value: 'one' },
  { id: 'two', label: 'Two', value: 'two' },
  { id: 'three', label: 'Three', value: 'three', disabled: true },
];

describe('HansDropdown', () => {
  it('Should open popup and select option', () => {
    const onSelect = vi.fn();
    render(
      <HansDropdown
        triggerLabel="Menu"
        options={options}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    fireEvent.click(screen.getByText('One'));

    expect(onSelect).toHaveBeenCalledWith(options[0]);
  });

  it('Should not select disabled option', () => {
    const onSelect = vi.fn();
    render(
      <HansDropdown
        triggerLabel="Menu"
        options={options}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    fireEvent.click(screen.getByText('Three'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('Should render custom children content', () => {
    render(
      <HansDropdown triggerLabel="Menu">
        <div>Custom block</div>
      </HansDropdown>,
    );

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByText('Custom block')).toBeInTheDocument();
  });

  it('Should render loading content', () => {
    render(<HansDropdown triggerLabel="Menu" loading />);
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(
      screen.getByLabelText('Loading dropdown content'),
    ).toBeInTheDocument();
  });

  it('Should call onOpenChange when opening and closing', () => {
    const onOpenChange = vi.fn();
    render(
      <HansDropdown
        triggerLabel="Menu"
        options={options}
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    fireEvent.mouseDown(document.body);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('Should render empty text when options are missing', () => {
    render(
      <HansDropdown triggerLabel="Menu" options={[]} noOptionsText="Nothing" />,
    );
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByText('Nothing')).toBeInTheDocument();
  });

  it('Should render option icon when iconName is provided', () => {
    render(
      <HansDropdown
        triggerLabel="Menu"
        options={[
          {
            id: 'with-icon',
            label: 'With icon',
            value: 'x',
            iconName: 'IoIosCloseCircle',
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByText('With icon')).toBeInTheDocument();
  });
});
