export type GetPopupDirectionParams = {
  spaceBelow: number;
  spaceAbove: number;
  panelHeight: number;
};

export type CreatePopupOpenSetterParams = {
  disabled: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type HandlePopupOutsideClickParams = {
  container: HTMLDivElement | null;
  target: Node | null;
  close: () => void;
};

export type ResolvePopupDirectionParams = {
  container: HTMLDivElement | null;
  panel: HTMLDivElement | null;
  viewportHeight: number;
};
