import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { HansTag } from '../Tag/Tag';
import { HansCard } from './Card';
import DocsPage from './Card.mdx';

const meta: Meta<typeof HansCard> = {
  title: 'Components/Card',
  component: HansCard,
  parameters: {
    docs: { page: DocsPage },
  },
  args: {
    title: 'Project kickoff',
    description: 'Team alignment and first delivery milestones.',
    cardSize: 'medium',
    cardColor: 'base',
    cardVariant: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof HansCard>;

export const Playground: Story = {
  render: (args) => <HansCard {...args} />,
};

export const ProfileCards: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <HansCard
        title="Product review"
        description="Avatar + text template for kanban cards or activity panels."
        avatarSrc="https://i.pravatar.cc/120?img=12"
      />
      <HansCard
        title="Fallback avatar"
        description="If no avatar image is provided, HansAvatar handles the fallback icon."
      >
        <HansTag label="Owner" tagColor="primary" />
      </HansCard>
    </div>
  ),
};

export const ImageCards: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <HansCard
        cardLayout="image"
        title="Visual campaign"
        description="A full-cover card with text layered above the image."
        imageSrc="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Notebook with colorful planning notes"
        cardSize="large"
      />
      <HansCard
        cardLayout="image"
        title="Minimal cover"
        imageSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Developer workspace"
        cardColor="secondary"
        cardVariant="strong"
      />
    </div>
  ),
};

export const ColorsAndSizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <HansCard
          title="Small base"
          description="Compact neutral card."
          cardSize="small"
          cardColor="base"
          cardVariant="neutral"
        />
        <HansCard
          title="Medium primary"
          description="Default semantic card."
          cardSize="medium"
          cardColor="primary"
          cardVariant="default"
        />
        <HansCard
          title="Large success"
          description="Outline card for success states."
          cardSize="large"
          cardColor="success"
          cardVariant="outline"
        />
      </div>
    </div>
  ),
};
