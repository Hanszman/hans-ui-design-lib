import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { HansDropdown } from './Dropdown';
import type { DropdownOption } from './Dropdown.types';

const options: DropdownOption[] = [
  { id: 'alpha', label: 'Alpha', value: 'a' },
  { id: 'beta', label: 'Beta', value: 'b' },
  { id: 'gamma', label: 'Gamma', value: 'c', disabled: true },
];

describe('HansDropdown', () => {
  it('Should render label and message with colors', () => {
    render(
      <HansDropdown
        label="Label"
        labelColor="primary"
        message="Helper"
        messageColor="info"
        options={options}
      />,
    );

    const label = screen.getByText('Label');
    const message = screen.getByText('Helper');

    expect(label).toHaveClass('hans-input-label', 'hans-input-label-primary');
    expect(message).toHaveClass(
      'hans-input-message',
      'hans-input-message-info',
    );
  });

  it('Should open list and select a single option', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <HansDropdown
        label="Dropdown"
        options={options}
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);

    const option = screen.getByText('Alpha');
    await user.click(option);

    expect(handleChange).toHaveBeenCalledWith('alpha');
    expect(input).toHaveValue('Alpha');
  });

  it('Should fallback to option value when id is missing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <HansDropdown
        label="No id"
        options={[{ label: 'NoId', value: 'no-id' }]}
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);
    await user.click(screen.getByText('NoId'));

    expect(handleChange).toHaveBeenCalledWith('no-id');
  });

  it('Should support multi select with chips', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <HansDropdown
        label="Multi"
        options={options}
        selectionType="multi"
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);
    await user.click(screen.getByText('Alpha'));
    await user.click(screen.getByText('Beta'));

    expect(handleChange).toHaveBeenLastCalledWith(['alpha', 'beta']);
    const alphaMatches = screen.getAllByText('Alpha');
    const alphaChip = alphaMatches.find((node) =>
      node.closest('.hans-dropdown-selected'),
    );
    expect(alphaChip).toBeDefined();
    const chipContainer = (alphaChip as HTMLElement).closest(
      '.hans-dropdown-selected',
    ) as HTMLElement;
    expect(within(chipContainer).getByText('Alpha')).toBeInTheDocument();
    expect(within(chipContainer).getByText('Beta')).toBeInTheDocument();
  });

  it('Should toggle multi select values when clicking the same option', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <HansDropdown
        label="Toggle"
        options={options}
        selectionType="multi"
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);
    const list = screen.getByRole('listbox');
    const option = within(list).getByText('Alpha');
    await user.click(option);
    await user.click(option);

    expect(handleChange).toHaveBeenLastCalledWith([]);
  });

  it('Should filter options when autocomplete is enabled', async () => {
    const user = userEvent.setup();

    render(
      <HansDropdown label="Search" options={options} enableAutocomplete />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.type(input, 'be');

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });

  it('Should not select disabled options', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <HansDropdown
        label="Dropdown"
        options={options}
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);
    await user.click(screen.getByText('Gamma'));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('Should render empty state text when no options match', async () => {
    const user = userEvent.setup();

    render(
      <HansDropdown
        label="Dropdown"
        options={options}
        noOptionsText="Nothing here"
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.type(input, 'zzz');

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('Should render option images when provided', async () => {
    const user = userEvent.setup();
    render(
      <HansDropdown
        label="With image"
        options={[
          {
            id: 'img-1',
            label: 'Avatar',
            value: 'avatar',
            imageSrc: '/fake.png',
            imageAlt: 'Avatar image',
          },
        ]}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);

    expect(screen.getByAltText('Avatar image')).toBeInTheDocument();
  });

  it('Should fallback image alt to label when not provided', async () => {
    const user = userEvent.setup();
    render(
      <HansDropdown
        label="With image"
        options={[
          {
            id: 'img-2',
            label: 'Avatar Label',
            value: 'avatar-label',
            imageSrc: '/fake.png',
          },
        ]}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);

    expect(screen.getByAltText('Avatar Label')).toBeInTheDocument();
  });

  it('Should use selected label when autocomplete is disabled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <HansDropdown
        label=""
        options={options}
        enableAutocomplete={false}
        defaultValue="alpha"
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);

    expect(input).toHaveValue('Alpha');
    expect(container.querySelector('.hans-input-icon-left')).toBeNull();
  });

  it('Should call onSearch and onInputChange when typing', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    const handleInput = vi.fn();

    render(
      <HansDropdown
        label="Search"
        options={options}
        onSearch={handleSearch}
        onInputChange={handleInput}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    await user.type(input, 'al');

    expect(handleSearch).toHaveBeenCalledWith('a');
    expect(handleInput).toHaveBeenCalled();
  });

  it('Should ignore input change when autocomplete is disabled', () => {
    const handleSearch = vi.fn();
    render(
      <HansDropdown
        label="No autocomplete"
        options={options}
        enableAutocomplete={false}
        onSearch={handleSearch}
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    fireEvent.change(input, { target: { value: 'alpha' } });

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('Should open dropdown when input changes and it was closed', () => {
    render(<HansDropdown label="Dropdown" options={options} />);

    const input = screen.getByPlaceholderText('Select an option');
    fireEvent.change(input, { target: { value: 'a' } });

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('Should open dropdown on focus when enabled', () => {
    render(<HansDropdown label="Dropdown" options={options} />);

    const input = screen.getByPlaceholderText('Select an option');
    fireEvent.focus(input);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('Should toggle dropdown when clicking input twice', async () => {
    const user = userEvent.setup();
    render(<HansDropdown label="Dropdown" options={options} />);

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Should ignore focus right after closing with toggle', async () => {
    const user = userEvent.setup();
    render(<HansDropdown label="Dropdown" options={options} />);

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.focus(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Should keep dropdown open when typing if already open', async () => {
    const user = userEvent.setup();
    render(<HansDropdown label="Dropdown" options={options} />);

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.type(input, 'a');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('Should open dropdown upwards when there is not enough space below', async () => {
    const user = userEvent.setup();
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        cb(0);
        return 0;
      });
    const cafSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {});
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('hans-dropdown')) {
          return {
            x: 0,
            y: 300,
            width: 300,
            height: 40,
            top: 300,
            right: 300,
            bottom: 340,
            left: 0,
            toJSON: () => {},
          } as DOMRect;
        }

        if (this.classList.contains('hans-dropdown-list')) {
          return {
            x: 0,
            y: 0,
            width: 300,
            height: 150,
            top: 0,
            right: 300,
            bottom: 150,
            left: 0,
            toJSON: () => {},
          } as DOMRect;
        }

        return {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          toJSON: () => {},
        } as DOMRect;
      });

    Object.defineProperty(window, 'innerHeight', {
      value: 360,
      writable: true,
    });

    render(<HansDropdown label="Dropdown" options={options} />);

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);

    const list = screen.getByRole('listbox');
    expect(list.getAttribute('data-direction')).toBe('up');

    rectSpy.mockRestore();
    rafSpy.mockRestore();
    cafSpy.mockRestore();
  });

  it('Should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(<HansDropdown label="Dropdown" options={options} />);

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Should handle click outside when event target is null', () => {
    render(<HansDropdown label="Dropdown" options={options} />);
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { value: null });
    document.dispatchEvent(event);
  });

  it('Should handle open measurement when list unmounts before RAF (Requested Animation Frame)', async () => {
    const user = userEvent.setup();
    const rafCallbackRef = { current: null as FrameRequestCallback | null };
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        rafCallbackRef.current = cb;
        return 0;
      });
    const cafSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {});

    render(<HansDropdown label="Dropdown" options={options} />);

    const input = screen.getByPlaceholderText('Select an option');
    await user.click(input);
    await user.click(document.body);

    if (typeof rafCallbackRef.current === 'function') {
      rafCallbackRef.current(0);
    }

    rafSpy.mockRestore();
    cafSpy.mockRestore();
  });

  it('Should render selected label from controlled value', () => {
    render(
      <HansDropdown
        label="Controlled"
        options={options}
        enableAutocomplete={false}
        value="beta"
      />,
    );

    const input = screen.getByPlaceholderText('Select an option');
    expect(input).toHaveValue('Beta');
  });

  it('Should not open dropdown when disabled', async () => {
    render(<HansDropdown label="Disabled" options={options} disabled />);

    const input = screen.getByPlaceholderText('Select an option');
    fireEvent.click(input);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Should not open dropdown on focus when disabled', () => {
    render(<HansDropdown label="Disabled" options={options} disabled />);
    const input = screen.getByPlaceholderText('Select an option');
    fireEvent.focus(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Should ignore open trigger on wrapper when disabled', () => {
    render(<HansDropdown label="Disabled" options={options} disabled />);
    const wrapper = document.querySelector('.hans-dropdown-field');
    expect(wrapper).toBeTruthy();
    fireEvent.mouseDown(wrapper as Element);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
