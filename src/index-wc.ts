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
import { HansIcon } from './components/Icon/Icon';
import {
  type HansIconProps,
  HansIconPropsList,
} from './components/Icon/Icon.types';

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
registerReactAsWebComponent<HansIconProps>(
  'hans-icon',
  HansIcon,
  HansIconPropsList,
);
