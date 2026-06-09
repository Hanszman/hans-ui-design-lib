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
        mediaPosition="right"
        customClasses="custom-tag"
      />,
    );
    const tag = container.querySelector('.hans-tag');
    expect(tag).toHaveClass(
      'hans-tag-large',
      'hans-tag-primary',
      'hans-tag-media-right',
      'custom-tag',
    );
  });

  it('Should render image media with accessible alt text', () => {
    render(
      <HansTag
        label="Angular"
        imageSrc="/angular.svg"
        imageAlt="Angular logo"
      />,
    );

    const image = screen.getByRole('img', { name: 'Angular logo' });
    expect(image).toHaveClass('hans-tag-image');
    expect(image).toHaveAttribute('src', '/angular.svg');
  });

  it('Should render right-positioned image media without accessible label when alt is omitted', () => {
    const { container } = render(
      <HansTag label="Node" imageSrc="/node.png" mediaPosition="right" />,
    );

    const image = container.querySelector('.hans-tag-image');
    expect(image).toHaveAttribute('alt', '');
    expect(container.querySelector('.hans-tag')).toHaveClass(
      'hans-tag-media-right',
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
