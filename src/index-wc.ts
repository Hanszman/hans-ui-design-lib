import './styles/index.css';
import { registerHansThemeApi } from './theme/theme';
import { registerReactAsWebComponent } from './utils/reactToWebComponent';
import { HansButton } from './components/Forms/Button/Button';
import {
  type HansButtonProps,
  HansButtonPropsList,
} from './components/Forms/Button/Button.types';
import { HansInput } from './components/Forms/Input/Input';
import {
  type HansInputProps,
  HansInputPropsList,
} from './components/Forms/Input/Input.types';
import { HansDropdown } from './components/Forms/Dropdown/Dropdown';
import {
  type HansDropdownProps,
  HansDropdownPropsList,
} from './components/Forms/Dropdown/Dropdown.types';
import { HansSelectOption } from './components/Forms/SelectOption/SelectOption';
import {
  type HansSelectOptionProps,
  HansSelectOptionPropsList,
} from './components/Forms/SelectOption/SelectOption.types';
import { HansToggle } from './components/Forms/Toggle/Toggle';
import {
  type HansToggleProps,
  HansTogglePropsList,
} from './components/Forms/Toggle/Toggle.types';
import { HansDatePicker } from './components/Forms/DatePicker/DatePicker';
import {
  type HansDatePickerProps,
  HansDatePickerPropsList,
} from './components/Forms/DatePicker/DatePicker.types';
import { HansAvatar } from './components/Avatar/Avatar';
import {
  type HansAvatarProps,
  HansAvatarPropsList,
} from './components/Avatar/Avatar.types';
import { HansCard } from './components/Card/Card';
import {
  type HansCardProps,
  HansCardPropsList,
} from './components/Card/Card.types';
import { HansCarousel } from './components/Carousel/Carousel';
import {
  type HansCarouselProps,
  HansCarouselPropsList,
} from './components/Carousel/Carousel.types';
import { HansTag } from './components/Tag/Tag';
import {
  type HansTagProps,
  HansTagPropsList,
} from './components/Tag/Tag.types';
import { HansChart } from './components/Chart/Chart';
import {
  type HansChartProps,
  HansChartPropsList,
} from './components/Chart/Chart.types';
import { HansAccordion } from './components/Accordion/Accordion';
import {
  type HansAccordionProps,
  HansAccordionPropsList,
} from './components/Accordion/Accordion.types';
import { HansIcon } from './components/Icon/Icon';
import {
  type HansIconProps,
  HansIconPropsList,
} from './components/Icon/Icon.types';
import { HansLoading } from './components/Loading/Loading';
import {
  type HansLoadingProps,
  HansLoadingPropsList,
} from './components/Loading/Loading.types';
import { HansKanban } from './components/Kanban/Kanban';
import {
  type HansKanbanProps,
  HansKanbanPropsList,
} from './components/Kanban/Kanban.types';
import { HansKanbanColumn } from './components/Kanban/KanbanColumn/KanbanColumn';
import {
  type HansKanbanColumnProps,
  HansKanbanColumnPropsList,
} from './components/Kanban/KanbanColumn/KanbanColumn.types';
import { HansKanbanItem } from './components/Kanban/KanbanItem/KanbanItem';
import {
  type HansKanbanItemProps,
  HansKanbanItemPropsList,
} from './components/Kanban/KanbanItem/KanbanItem.types';
import { HansPopup } from './components/Popup/Popup';
import {
  type HansPopupProps,
  HansPopupPropsList,
} from './components/Popup/Popup.types';
import { HansToast } from './components/Toast/Toast';
import {
  type HansToastProps,
  HansToastPropsList,
} from './components/Toast/Toast.types';
import { HansModal } from './components/Modal/Modal';
import {
  type HansModalProps,
  HansModalPropsList,
} from './components/Modal/Modal.types';
import { HansTable } from './components/Table/Table';
import {
  type HansTableProps,
  HansTablePropsList,
} from './components/Table/Table.types';
import { HansTabs } from './components/Tabs/Tabs';
import {
  type HansTabsProps,
  HansTabsPropsList,
} from './components/Tabs/Tabs.types';

registerHansThemeApi();

registerReactAsWebComponent<HansButtonProps>(
  'hans-button',
  HansButton,
  HansButtonPropsList,
);
registerReactAsWebComponent<HansInputProps>(
  'hans-input',
  HansInput,
  HansInputPropsList,
);
registerReactAsWebComponent<HansDropdownProps>(
  'hans-dropdown',
  HansDropdown,
  HansDropdownPropsList,
  ['onSelect', 'onOpenChange'],
);
registerReactAsWebComponent<HansSelectOptionProps>(
  'hans-select-option',
  HansSelectOption,
  HansSelectOptionPropsList,
  ['onSearch', 'onChange', 'onInputChange'],
);
registerReactAsWebComponent<HansToggleProps>(
  'hans-toggle',
  HansToggle,
  HansTogglePropsList,
  ['onChange', 'onValueChange'],
);
registerReactAsWebComponent<HansDatePickerProps>(
  'hans-date-picker',
  HansDatePicker,
  HansDatePickerPropsList,
  ['onChange', 'onOpenChange'],
);
registerReactAsWebComponent<HansAvatarProps>(
  'hans-avatar',
  HansAvatar,
  HansAvatarPropsList,
);
registerReactAsWebComponent<HansCardProps>(
  'hans-card',
  HansCard,
  HansCardPropsList,
);
registerReactAsWebComponent<HansCarouselProps>(
  'hans-carousel',
  HansCarousel,
  HansCarouselPropsList,
  ['onActiveItemChange'],
);
registerReactAsWebComponent<HansTagProps>(
  'hans-tag',
  HansTag,
  HansTagPropsList,
  ['onAction'],
);
registerReactAsWebComponent<HansChartProps>(
  'hans-chart',
  HansChart,
  HansChartPropsList,
  ['onPointClick'],
);
registerReactAsWebComponent<HansAccordionProps>(
  'hans-accordion',
  HansAccordion,
  HansAccordionPropsList,
  ['onOpenItemIdsChange'],
);
registerReactAsWebComponent<HansIconProps>(
  'hans-icon',
  HansIcon,
  HansIconPropsList,
);
registerReactAsWebComponent<HansLoadingProps>(
  'hans-loading',
  HansLoading,
  HansLoadingPropsList,
);
registerReactAsWebComponent<HansKanbanProps>(
  'hans-kanban',
  HansKanban,
  HansKanbanPropsList,
  ['onItemsChange', 'onMoveItem', 'onItemClick'],
);
registerReactAsWebComponent<HansKanbanColumnProps>(
  'hans-kanban-column',
  HansKanbanColumn,
  HansKanbanColumnPropsList,
);
registerReactAsWebComponent<HansKanbanItemProps>(
  'hans-kanban-item',
  HansKanbanItem,
  HansKanbanItemPropsList,
);
registerReactAsWebComponent<HansPopupProps>(
  'hans-popup',
  HansPopup,
  HansPopupPropsList,
  ['onOpenChange', 'onDirectionChange'],
);
registerReactAsWebComponent<HansToastProps>(
  'hans-toast',
  HansToast,
  HansToastPropsList,
  ['onClose', 'onVisibilityChange'],
);
registerReactAsWebComponent<HansModalProps>(
  'hans-modal',
  HansModal,
  HansModalPropsList,
  ['onOpenChange', 'onClose', 'onConfirm', 'onCancel'],
);
registerReactAsWebComponent<HansTableProps>(
  'hans-table',
  HansTable,
  HansTablePropsList,
  ['onSortChange', 'onFiltersChange'],
);
registerReactAsWebComponent<HansTabsProps>(
  'hans-tabs',
  HansTabs,
  HansTabsPropsList,
  ['onTabChange', 'onTabClose', 'onTabsChange'],
);
