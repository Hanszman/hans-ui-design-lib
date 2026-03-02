import './styles/index.css';
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
import { HansToggle } from './components/Forms/Toggle/Toggle';
import {
  type HansToggleProps,
  HansTogglePropsList,
} from './components/Forms/Toggle/Toggle.types';
import { HansAvatar } from './components/Avatar/Avatar';
import {
  type HansAvatarProps,
  HansAvatarPropsList,
} from './components/Avatar/Avatar.types';
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
import { HansTable } from './components/Table/Table';
import {
  type HansTableProps,
  HansTablePropsList,
} from './components/Table/Table.types';

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
);
registerReactAsWebComponent<HansToggleProps>(
  'hans-toggle',
  HansToggle,
  HansTogglePropsList,
);
registerReactAsWebComponent<HansAvatarProps>(
  'hans-avatar',
  HansAvatar,
  HansAvatarPropsList,
);
registerReactAsWebComponent<HansTagProps>(
  'hans-tag',
  HansTag,
  HansTagPropsList,
);
registerReactAsWebComponent<HansChartProps>(
  'hans-chart',
  HansChart,
  HansChartPropsList,
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
registerReactAsWebComponent<HansTableProps>(
  'hans-table',
  HansTable,
  HansTablePropsList,
);
