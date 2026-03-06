import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansSelectOptionOptionList } from './SelectOptionOptionList';

describe('HansSelectOptionOptionList', () => {
  it('Should render empty state when there are no options', () => {
    render(
      <HansSelectOptionOptionList
        options={[]}
        selectedValues={[]}
        isMulti={false}
        openDirection="down"
        dropdownHoverColor="var(--gray-100)"
        noOptionsText="No options"
        isLoadingOptions={false}
        loadingOptionsText="Loading..."
        onSelectOption={vi.fn()}
      />,
    );

    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  it('Should render loading state when loading is true', () => {
    render(
      <HansSelectOptionOptionList
        options={[{ id: '1', value: '1', label: 'One' }]}
        selectedValues={[]}
        isMulti={false}
        openDirection="down"
        dropdownHoverColor="var(--gray-100)"
        noOptionsText="No options"
        isLoadingOptions
        loadingOptionsText="Loading options..."
        onSelectOption={vi.fn()}
      />,
    );

    expect(screen.getByText('Loading options...')).toBeInTheDocument();
    expect(screen.queryByText('One')).not.toBeInTheDocument();
  });

  it('Should render options and select item on click', () => {
    const onSelectOption = vi.fn();
    render(
      <HansSelectOptionOptionList
        options={[
          { id: '1', value: '1', label: 'One' },
          { id: '2', value: '2', label: 'Two', disabled: true },
        ]}
        selectedValues={['1']}
        isMulti
        openDirection="up"
        dropdownHoverColor="var(--gray-100)"
        noOptionsText="No options"
        isLoadingOptions={false}
        loadingOptionsText="Loading..."
        onSelectOption={onSelectOption}
      />,
    );

    const one = screen.getByText('One').closest('li') as HTMLElement;
    expect(one).toHaveClass('hans-select-option-option-selected');
    fireEvent.click(one);
    fireEvent.click(screen.getByText('Two'));

    expect(onSelectOption).toHaveBeenCalledTimes(2);
  });
});
