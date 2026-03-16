import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HansCard } from './Card';

vi.mock('../Avatar/Avatar', () => ({
  HansAvatar: ({
    src,
    alt,
    avatarSize,
    loading,
  }: {
    src?: string;
    alt?: string;
    avatarSize?: string;
    loading?: boolean;
  }) => (
    <span
      data-testid="mock-card-avatar"
      data-src={src}
      data-alt={alt}
      data-size={avatarSize}
      data-loading={String(loading)}
    />
  ),
}));

describe('HansCard', () => {
  it('Should render profile card with avatar title description and extra content', () => {
    render(
      <HansCard
        title="Design sync"
        description="Weekly alignment with the product team"
        avatarSrc="https://image.test/avatar.png"
      >
        <span>Extra details</span>
      </HansCard>,
    );

    expect(screen.getByText('Design sync')).toBeInTheDocument();
    expect(
      screen.getByText('Weekly alignment with the product team'),
    ).toBeInTheDocument();
    expect(screen.getByText('Extra details')).toBeInTheDocument();
    expect(screen.getByTestId('mock-card-avatar')).toHaveAttribute(
      'data-src',
      'https://image.test/avatar.png',
    );
  });

  it('Should render image card with title and description on top of image surface', () => {
    render(
      <HansCard
        cardLayout="image"
        title="Campaign launch"
        description="Full width cover artwork"
        imageSrc="https://image.test/banner.png"
        imageAlt="Campaign launch image"
      />,
    );

    expect(screen.getByLabelText('Campaign launch image')).toBeInTheDocument();
    expect(screen.getByText('Campaign launch')).toBeInTheDocument();
    expect(screen.getByText('Full width cover artwork')).toBeInTheDocument();
  });

  it('Should infer image layout automatically from the image source', () => {
    render(
      <HansCard
        title="Auto image"
        imageSrc="https://image.test/auto.png"
        imageAlt="Auto image label"
      />,
    );

    expect(screen.getByLabelText('Auto image label')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-card-avatar')).not.toBeInTheDocument();
  });

  it('Should use fallback avatar alt and support profile cards without description', () => {
    render(<HansCard title="" />);

    expect(screen.getByTestId('mock-card-avatar')).toHaveAttribute(
      'data-alt',
      'Card avatar',
    );
    expect(screen.queryByText('Extra details')).not.toBeInTheDocument();
  });

  it('Should support image cards with custom children and default image label', () => {
    render(
      <HansCard cardLayout="image" title="Hero card">
        <span>Overlay tag</span>
      </HansCard>,
    );

    expect(screen.getByLabelText('Card image')).toBeInTheDocument();
    expect(screen.getByText('Overlay tag')).toBeInTheDocument();
  });

  it('Should render image cards without title or description', () => {
    render(<HansCard cardLayout="image" />);

    expect(screen.getByLabelText('Card image')).toBeInTheDocument();
    expect(screen.queryByRole('strong')).not.toBeInTheDocument();
  });
});
