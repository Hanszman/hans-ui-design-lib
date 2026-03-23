import type React from 'react';
import type { Color, Variant } from '../../../types/Common.types';
import type { HansAccordionItem } from '../Accordion.types';

export type NormalizedAccordionItem = HansAccordionItem & {
  resolvedId: string;
};

export type CreateHandleAccordionToggleParams = {
  itemId: string;
  disabled: boolean;
  allowMultipleOpen: boolean;
  resolvedOpenItemIds: string[];
  openItemIds: string[] | undefined;
  setInternalOpenItemIds: React.Dispatch<React.SetStateAction<string[]>>;
  onOpenItemIdsChange?: (openItemIds: string[]) => void;
};

export type CreateSyncAccordionOpenItemIdsParams = {
  openItemIds: string[] | undefined;
  normalizedItems: NormalizedAccordionItem[];
  allowMultipleOpen: boolean;
  setInternalOpenItemIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export type AccordionSurfaceStyleArgs = {
  color: Color;
  variant: Variant;
  surface: 'title' | 'description';
};
