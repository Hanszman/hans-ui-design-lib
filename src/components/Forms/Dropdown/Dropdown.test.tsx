import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { HansDropdown } from './Dropdown';
import type { DropdownOption } from './Dropdown.types';

const options: DropdownOption[] = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c', disabled: true },
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

    expect(handleChange).toHaveBeenCalledWith('a');
    expect(input).toHaveValue('Alpha');
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

    expect(handleChange).toHaveBeenLastCalledWith(['a', 'b']);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
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
});
