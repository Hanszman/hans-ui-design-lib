import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HansTag } from './Tag';

describe('HansTag', () => {
  it('Should render label', () => {
    render(<HansTag label="Tag label" />);
    expect(screen.getByText('Tag label')).toBeInTheDocument();
  });

  it('Should apply size and color classes', () => {
    const { container } = render(
      <HansTag
        label="Tag"
        tagSize="large"
        tagColor="primary"
        customClasses="custom-tag"
      />,
    );
    const tag = container.querySelector('.hans-tag');
    expect(tag).toHaveClass(
      'hans-tag-large',
      'hans-tag-primary',
      'custom-tag',
    );
  });

  it('Should render action button when icon and action are provided', () => {
    const onAction = vi.fn();
    render(<HansTag label="Tag" actionIcon="MdClose" onAction={onAction} />);
    const button = screen.getByRole('button', { name: 'Action Tag' });
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('Should not render action button when action is missing', () => {
    render(<HansTag label="Tag" actionIcon="MdClose" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('Should disable action button when disabled is true', () => {
    const onAction = vi.fn();
    render(
      <HansTag
        label="Tag"
        actionIcon="MdClose"
        onAction={onAction}
        disabled
      />,
    );
    const button = screen.getByRole('button', { name: 'Action Tag' });
    expect(button).toBeDisabled();
  });
});
