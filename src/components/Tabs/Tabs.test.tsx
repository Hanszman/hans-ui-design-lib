import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansTabs } from './Tabs';

const tabs = [
  { id: 'one', title: 'One', content: <p>Content one</p> },
  { id: 'two', title: 'Two', content: <p>Content two</p> },
  { id: 'three', title: 'Three', content: <p>Content three</p> },
];

describe('HansTabs', () => {
  it('Should render tabs and initial content', () => {
    render(<HansTabs tabs={tabs} defaultActiveTabId="two" />);
    expect(screen.getByRole('tab', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByText('Content two')).toBeInTheDocument();
  });

  it('Should change active tab on click in uncontrolled mode', () => {
    const onTabChange = vi.fn();
    render(<HansTabs tabs={tabs} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Content two')).toBeInTheDocument();
    expect(onTabChange).toHaveBeenCalledWith('two');
  });

  it('Should keep controlled active tab until prop changes', () => {
    const onTabChange = vi.fn();
    const { rerender } = render(
      <HansTabs tabs={tabs} activeTabId="one" onTabChange={onTabChange} />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Content one')).toBeInTheDocument();
    expect(onTabChange).toHaveBeenCalledWith('two');

    rerender(
      <HansTabs tabs={tabs} activeTabId="two" onTabChange={onTabChange} />,
    );
    expect(screen.getByText('Content two')).toBeInTheDocument();
  });

  it('Should not change tab when disabled', () => {
    render(
      <HansTabs tabs={[tabs[0], { ...tabs[1], disabled: true }, tabs[2]]} />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Content one')).toBeInTheDocument();
  });

  it('Should close tab when showCloseButton is enabled', () => {
    const onTabClose = vi.fn();
    const onTabsChange = vi.fn();
    const onTabChange = vi.fn();

    render(
      <HansTabs
        tabs={tabs}
        showCloseButton
        onTabClose={onTabClose}
        onTabsChange={onTabsChange}
        onTabChange={onTabChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Close One'));
    expect(screen.queryByRole('tab', { name: 'One' })).not.toBeInTheDocument();
    expect(onTabClose).toHaveBeenCalledWith('one');
    expect(onTabsChange).toHaveBeenCalled();
    expect(onTabChange).toHaveBeenCalledWith('two');
    expect(screen.getByText('Content two')).toBeInTheDocument();
  });

  it('Should close only tabs marked as closable', () => {
    render(<HansTabs tabs={[{ ...tabs[0], closable: true }, tabs[1]]} />);

    expect(screen.getByLabelText('Close One')).toBeInTheDocument();
    expect(screen.queryByLabelText('Close Two')).not.toBeInTheDocument();
  });

  it('Should render empty text when tabs are removed', () => {
    render(
      <HansTabs
        tabs={[{ ...tabs[0], closable: true }]}
        showCloseButton
        emptyText="Empty tabs"
      />,
    );

    fireEvent.click(screen.getByLabelText('Close One'));
    expect(screen.getByText('Empty tabs')).toBeInTheDocument();
  });

  it('Should render loading state for headers and content', () => {
    render(<HansTabs tabs={tabs} loading />);
    expect(screen.getAllByLabelText('Loading tab header')).toHaveLength(3);
    expect(screen.getByLabelText('Loading tab content')).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'One' })).not.toBeInTheDocument();
  });

  it('Should close tab using keyboard on close action', () => {
    const onTabClose = vi.fn();
    render(<HansTabs tabs={tabs} showCloseButton onTabClose={onTabClose} />);

    const closeButton = screen.getByLabelText('Close One');
    fireEvent.keyDown(closeButton, { key: 'Enter' });

    expect(onTabClose).toHaveBeenCalledWith('one');
    expect(screen.queryByRole('tab', { name: 'One' })).not.toBeInTheDocument();
  });

  it('Should close tab using space key on close action', () => {
    const onTabClose = vi.fn();
    render(<HansTabs tabs={tabs} showCloseButton onTabClose={onTabClose} />);

    const closeButton = screen.getByLabelText('Close One');
    fireEvent.keyDown(closeButton, { key: ' ' });

    expect(onTabClose).toHaveBeenCalledWith('one');
  });
});
