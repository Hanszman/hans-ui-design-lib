import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { HansButton } from '../Forms/Button/Button';
import { HansInput } from '../Forms/Input/Input';
import { HansModal } from './Modal';
import DocsPage from './Modal.mdx';

const meta: Meta<typeof HansModal> = {
  title: 'Components/Modal',
  component: HansModal,
  parameters: {
    docs: { page: DocsPage },
  },
  args: {
    modalColor: 'base',
    modalVariant: 'neutral',
    modalSize: 'medium',
    placement: 'center',
    dismissible: true,
    showOverlay: true,
    closeOnBackdropClick: true,
    closeOnEscape: true,
    lockBodyScroll: true,
    showHeaderDivider: true,
    showFooterDivider: true,
    title: 'Modal title',
  },
};

export default meta;
type Story = StoryObj<typeof HansModal>;

const ModalLauncher = ({
  buttonLabel,
  modalProps,
  triggerColor,
  triggerVariant = 'default',
  children,
}: {
  buttonLabel: string;
  modalProps?: Partial<React.ComponentProps<typeof HansModal>>;
  triggerColor?: React.ComponentProps<typeof HansButton>['buttonColor'];
  triggerVariant?: React.ComponentProps<typeof HansButton>['buttonVariant'];
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const resolvedTriggerColor = triggerColor ?? modalProps?.modalColor ?? 'base';

  return (
    <div className="flex items-start">
      <HansButton
        label={buttonLabel}
        buttonColor={resolvedTriggerColor}
        buttonVariant={triggerVariant}
        onClick={() => setOpen(true)}
      />
      <HansModal isOpen={open} onOpenChange={setOpen} {...modalProps}>
        {children}
      </HansModal>
    </div>
  );
};

const LongContent = () => (
  <div className="flex min-w-[920px] flex-col gap-4">
    <p>
      This example shows a body that can overflow vertically and horizontally
      without clipping the custom children area.
    </p>
    <div className="grid min-w-[880px] grid-cols-3 gap-3">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={`info-card-${index + 1}`}
          className="rounded-xl border border-[var(--base-default-color)] p-4"
        >
          <strong className="block mb-2">Card {index + 1}</strong>
          <span>
            Cross-team notes, delivery dates and dependencies can live inside
            the modal body.
          </span>
        </div>
      ))}
    </div>
  </div>
);

const FormContent = () => (
  <div className="flex flex-col gap-4">
    <HansInput label="Name" placeholder="Type the full name" />
    <HansInput label="Email" placeholder="name@company.com" inputType="email" />
    <HansInput label="Role" placeholder="Product Designer" />
  </div>
);

const SummaryContent = () => (
  <div className="flex flex-col gap-3">
    <p className="m-0">
      The modal body accepts any custom structure, including descriptive text,
      grouped actions and embedded design-system components.
    </p>
    <div className="flex flex-wrap gap-3">
      <HansButton label="Primary action" buttonColor="primary" />
      <HansButton
        label="Secondary action"
        buttonColor="secondary"
        buttonVariant="outline"
      />
    </div>
  </div>
);

const getSemanticTextColor = (
  color: NonNullable<React.ComponentProps<typeof HansModal>['modalColor']>,
  variant: NonNullable<React.ComponentProps<typeof HansModal>['modalVariant']>,
) => {
  if (variant === 'strong' || variant === 'default') return 'var(--white)';
  if (color === 'base') return 'var(--text-color)';
  return `var(--${color}-strong-color)`;
};

export const Playground: Story = {
  render: (args) => (
    <ModalLauncher
      buttonLabel="Open playground"
      triggerColor="primary"
      modalProps={{
        ...args,
        title: args.title ?? 'Modal title',
        confirmLabel: 'Save',
        cancelLabel: 'Cancel',
      }}
    >
      <SummaryContent />
    </ModalLauncher>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Small modal"
        triggerColor="base"
        modalProps={{
          title: 'Small modal',
          modalSize: 'small',
          confirmLabel: 'Ok',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Medium modal"
        triggerColor="primary"
        modalProps={{
          title: 'Medium modal',
          modalSize: 'medium',
          confirmLabel: 'Ok',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Large modal"
        triggerColor="base"
        modalProps={{
          title: 'Large modal',
          modalSize: 'large',
          confirmLabel: 'Ok',
        }}
      >
        <LongContent />
      </ModalLauncher>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Centered"
        triggerColor="base"
        modalProps={{
          title: 'Centered modal',
          placement: 'center',
          confirmLabel: 'Continue',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Left side"
        triggerColor="primary"
        modalProps={{
          title: 'Left side modal',
          placement: 'left',
          modalSize: 'medium',
          confirmLabel: 'Apply',
          cancelLabel: 'Cancel',
        }}
      >
        <FormContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Right side"
        triggerColor="primary"
        modalProps={{
          title: 'Right side modal',
          placement: 'right',
          modalSize: 'large',
          confirmLabel: 'Publish',
          cancelLabel: 'Back',
        }}
      >
        <LongContent />
      </ModalLauncher>
    </div>
  ),
};

export const ColorsAndVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Base neutral"
        modalProps={{
          title: (
            <span style={{ color: getSemanticTextColor('base', 'neutral') }}>
              Base neutral
            </span>
          ),
          modalColor: 'base',
          modalVariant: 'neutral',
          confirmLabel: 'Done',
          dismissButtonColor: 'base',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Primary outline"
        triggerVariant="outline"
        modalProps={{
          title: (
            <span style={{ color: getSemanticTextColor('primary', 'outline') }}>
              Primary outline
            </span>
          ),
          modalColor: 'primary',
          modalVariant: 'outline',
          confirmLabel: 'Continue',
          dismissButtonColor: 'primary',
        }}
      >
        <FormContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Secondary strong"
        modalProps={{
          title: (
            <span
              style={{ color: getSemanticTextColor('secondary', 'strong') }}
            >
              Secondary strong
            </span>
          ),
          modalColor: 'secondary',
          modalVariant: 'strong',
          confirmLabel: 'Confirm',
          dismissButtonColor: 'primary',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Success transparent"
        triggerVariant="outline"
        modalProps={{
          title: (
            <span
              style={{ color: getSemanticTextColor('success', 'transparent') }}
            >
              Success transparent
            </span>
          ),
          modalColor: 'success',
          modalVariant: 'transparent',
          confirmLabel: 'Approve',
          dismissButtonColor: 'success',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
    </div>
  ),
};

export const ActionButtonColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Primary confirm"
        triggerColor="primary"
        modalProps={{
          title: 'Primary confirm',
          confirmLabel: 'Save',
          cancelLabel: 'Cancel',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Success actions"
        triggerColor="success"
        modalProps={{
          title: 'Success actions',
          modalColor: 'base',
          confirmLabel: 'Approve',
          cancelLabel: 'Back',
          confirmButtonColor: 'success',
          cancelButtonColor: 'info',
          dismissButtonColor: 'success',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Danger actions"
        triggerColor="danger"
        modalProps={{
          title: 'Danger actions',
          modalColor: 'base',
          confirmLabel: 'Delete',
          cancelLabel: 'Keep',
          confirmButtonColor: 'danger',
          cancelButtonColor: 'warning',
          dismissButtonColor: 'danger',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Secondary actions"
        triggerColor="secondary"
        modalProps={{
          title: 'Secondary actions',
          modalColor: 'base',
          confirmLabel: 'Apply',
          cancelLabel: 'Reset',
          confirmButtonColor: 'secondary',
          cancelButtonColor: 'primary',
          dismissButtonColor: 'secondary',
        }}
      >
        <SummaryContent />
      </ModalLauncher>
    </div>
  ),
};

export const SectionOptions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ModalLauncher
        buttonLabel="Only body"
        triggerColor="primary"
        modalProps={{
          title: '',
          dismissible: false,
          showHeaderDivider: false,
          showFooterDivider: false,
        }}
      >
        <SummaryContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Header and body"
        triggerColor="base"
        modalProps={{
          title: 'Header and body',
          dismissible: true,
          showHeaderDivider: true,
        }}
      >
        <FormContent />
      </ModalLauncher>
      <ModalLauncher
        buttonLabel="Body and custom footer"
        triggerColor="base"
        modalProps={{
          title: 'Custom footer',
          footer: (
            <div className="flex items-center gap-2">
              <span>Custom footer content</span>
            </div>
          ),
          showFooterDivider: false,
        }}
      >
        <SummaryContent />
      </ModalLauncher>
    </div>
  ),
};

export const ScrollScenarios: Story = {
  render: () => (
    <div className="flex gap-4">
      <ModalLauncher
        buttonLabel="Scrollable content"
        triggerColor="primary"
        modalProps={{
          title: 'Scroll test',
          modalSize: 'large',
          maxBodyHeight: '320px',
          confirmLabel: 'Done',
        }}
      >
        <LongContent />
      </ModalLauncher>
    </div>
  ),
};
