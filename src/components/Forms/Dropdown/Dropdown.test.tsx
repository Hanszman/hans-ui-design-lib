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

  it('Should render option image when imageSrc is provided', () => {
    render(
      <HansDropdown
        triggerLabel="Menu"
        options={[
          {
            id: 'with-image',
            label: 'With image',
            value: 'x',
            imageSrc: '/avatar.png',
            imageAlt: 'Avatar',
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByAltText('Avatar')).toBeInTheDocument();
  });

  it('Should fallback image alt to option label', () => {
    render(
      <HansDropdown
        triggerLabel="Menu"
        options={[
          {
            id: 'with-image-no-alt',
            label: 'With image no alt',
            value: 'x',
            imageSrc: '/avatar.png',
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByAltText('With image no alt')).toBeInTheDocument();
  });

  it('Should open nested submenu on hover and only select leaf item', () => {
    const onSelect = vi.fn();
    render(
      <HansDropdown
        triggerLabel="Menu"
        onSelect={onSelect}
        options={[
          {
            id: 'parent',
            label: 'Parent',
            value: 'parent',
            children: [{ id: 'child', label: 'Child', value: 'child' }],
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    fireEvent.mouseLeave(screen.getByRole('menu'));
    fireEvent.mouseEnter(screen.getByText('Parent'));
    expect(screen.getByText('Child')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Parent'));
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Child'));
    expect(onSelect).toHaveBeenCalledWith({
      id: 'child',
      label: 'Child',
      value: 'child',
    });
  });

  it('Should use square button shape by default', () => {
    render(<HansDropdown triggerLabel="Menu" options={options} />);
    expect(screen.getByRole('button', { name: /menu/i })).toHaveClass(
      'hans-button-square',
    );
  });
});
