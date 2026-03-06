import type { PopupDirection } from '../Popup.types';
import type { GetPopupDirectionParams } from './Popup.helper.types';

export const getPopupDirection = ({
  spaceBelow,
  spaceAbove,
  panelHeight,
}: GetPopupDirectionParams): PopupDirection =>
  spaceBelow < panelHeight && spaceAbove > panelHeight ? 'up' : 'down';
