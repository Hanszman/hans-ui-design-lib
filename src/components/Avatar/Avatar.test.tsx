import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { HansAvatar } from './Avatar';

describe('HansAvatar', () => {
  it('Should render image when src exists', () => {
    render(<HansAvatar src="/photo.png" alt="User photo" />);
    const image = screen.getByAltText('User photo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('hans-avatar-img');
  });

  it('Should render fallback icon when src is empty', () => {
    const { container } = render(<HansAvatar src="" alt="Fallback" />);
    expect(screen.queryByAltText('Fallback')).not.toBeInTheDocument();
    expect(container.querySelector('.hans-avatar-fallback')).toBeInTheDocument();
  });

  it('Should render fallback icon on image error', () => {
    const { container } = render(<HansAvatar src="/broken.png" alt="Broken" />);
    const image = screen.getByAltText('Broken');
    fireEvent.error(image);
    expect(container.querySelector('.hans-avatar-fallback')).toBeInTheDocument();
  });

  it('Should apply size and custom classes', () => {
    const { container } = render(
      <HansAvatar
        src="/photo.png"
        alt="User"
        avatarSize="large"
        customClasses="custom-avatar"
      />,
    );
    const avatar = container.querySelector('.hans-avatar');
    expect(avatar).toHaveClass('hans-avatar-large');
    expect(avatar).toHaveClass('custom-avatar');
  });

  it('Should use default alt label', () => {
    const { container } = render(<HansAvatar src="" />);
    const avatar = container.querySelector('.hans-avatar');
    expect(avatar).toHaveAttribute('aria-label', 'Avatar');
  });

  it('Should reset image error state when src changes', () => {
    const { rerender } = render(<HansAvatar src="/broken.png" alt="A" />);
    const brokenImage = screen.getByAltText('A');
    fireEvent.error(brokenImage);
    expect(screen.queryByAltText('A')).not.toBeInTheDocument();

    rerender(<HansAvatar src="/new.png" alt="B" />);
    expect(screen.getByAltText('B')).toBeInTheDocument();
  });
});
