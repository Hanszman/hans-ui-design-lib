import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansAccordion } from './Accordion';
import type { HansAccordionItem } from './Accordion.types';

const items: HansAccordionItem[] = [
  {
    id: 'faq-1',
    title: 'What is Hans UI?',
    description: 'Hans UI is a reusable React component library.',
  },
  {
    id: 'faq-2',
    title: 'Can I use it with Angular?',
    description: 'Yes, the library can also be exposed through web components.',
  },
  {
    id: 'faq-3',
    title: 'Is this item disabled?',
    description: 'This content should not be displayed.',
    disabled: true,
  },
];

describe('HansAccordion', () => {
  it('Should render empty state when there are no items', () => {
    render(<HansAccordion items={[]} emptyText="Nothing to show" />);

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('Should render loading skeleton items', () => {
    const { container } = render(
      <HansAccordion
        items={items}
        loading
        skeletonItemsCount={2}
        loadingAriaLabel="Loading faq"
      />,
    );

    expect(container.querySelectorAll('.hans-accordion-skeleton-item')).toHaveLength(
      2,
    );
    expect(screen.getByLabelText('Loading faq title 1')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Loading faq description extra 2'),
    ).toBeInTheDocument();
  });

  it('Should toggle an accordion item in uncontrolled mode', () => {
    render(<HansAccordion items={items} />);

    const firstTrigger = screen.getByText('What is Hans UI?')
      .closest('button') as HTMLButtonElement;
    fireEvent.click(firstTrigger);

    expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText('Hans UI is a reusable React component library.'),
    ).toBeInTheDocument();

    fireEvent.click(firstTrigger);

    expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByText('Hans UI is a reusable React component library.'),
    ).not.toBeInTheDocument();
  });

  it('Should respect default open item ids', () => {
    render(<HansAccordion items={items} defaultOpenItemIds={['faq-2']} />);

    expect(
      screen.getByText(
        'Yes, the library can also be exposed through web components.',
      ),
    ).toBeInTheDocument();
  });

  it('Should keep only one item open when allowMultipleOpen is false', () => {
    render(<HansAccordion items={items} allowMultipleOpen={false} />);

    fireEvent.click(
      screen.getByText('What is Hans UI?').closest('button') as HTMLButtonElement,
    );
    fireEvent.click(
      screen.getByText('Can I use it with Angular?')
        .closest('button') as HTMLButtonElement,
    );

    expect(
      screen.queryByText('Hans UI is a reusable React component library.'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Yes, the library can also be exposed through web components.',
      ),
    ).toBeInTheDocument();
  });

  it('Should work in controlled mode and emit open item changes', () => {
    const onOpenItemIdsChange = vi.fn();
    const { rerender } = render(
      <HansAccordion
        items={items}
        openItemIds={['faq-1']}
        onOpenItemIdsChange={onOpenItemIdsChange}
      />,
    );

    fireEvent.click(
      screen.getByText('Can I use it with Angular?')
        .closest('button') as HTMLButtonElement,
    );

    expect(onOpenItemIdsChange).toHaveBeenCalledWith(['faq-1', 'faq-2']);
    expect(
      screen.queryByText(
        'Yes, the library can also be exposed through web components.',
      ),
    ).not.toBeInTheDocument();

    rerender(
      <HansAccordion
        items={items}
        openItemIds={['faq-1', 'faq-2']}
        onOpenItemIdsChange={onOpenItemIdsChange}
      />,
    );

    expect(
      screen.getByText(
        'Yes, the library can also be exposed through web components.',
      ),
    ).toBeInTheDocument();
  });

  it('Should not toggle disabled items', () => {
    const onOpenItemIdsChange = vi.fn();
    render(<HansAccordion items={items} onOpenItemIdsChange={onOpenItemIdsChange} />);

    const disabledTrigger = screen.getByText('Is this item disabled?')
      .closest('button') as HTMLButtonElement;
    fireEvent.click(disabledTrigger);

    expect(disabledTrigger).toBeDisabled();
    expect(
      screen.queryByText('This content should not be displayed.'),
    ).not.toBeInTheDocument();
    expect(onOpenItemIdsChange).not.toHaveBeenCalled();
  });

  it('Should forward custom attributes to the wrapper', () => {
    const { container } = render(
      <HansAccordion
        items={items}
        data-testid="accordion-wrapper"
        customClasses="custom-accordion"
      />,
    );

    expect(screen.getByTestId('accordion-wrapper')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom-accordion');
  });

  it('Should apply title and description color variants', () => {
    render(
      <HansAccordion
        items={items}
        defaultOpenItemIds={['faq-1']}
        titleColor="primary"
        titleVariant="default"
        descriptionColor="secondary"
        descriptionVariant="neutral"
      />,
    );

    const trigger = screen.getByText('What is Hans UI?')
      .closest('button') as HTMLButtonElement;
    const panel = screen.getByRole('region');

    expect(
      trigger.style.getPropertyValue('--hans-accordion-title-bg'),
    ).toBe('var(--primary-default-color)');
    expect(
      panel.style.getPropertyValue('--hans-accordion-description-bg'),
    ).toBe('var(--secondary-neutral-color)');
  });
});
