import './styles/index.css';
import { HansButton } from './components/Forms/Button/Button';
import { HansButtonPropsList } from './components/Forms/Button/Button.types';
import type { HansButtonProps } from './components/Forms/Button/Button.types';
import { HansIcon } from './components/Icon/Icon';
import { HansIconPropsList } from './components/Icon/Icon.types';
import type { HansIconProps } from './components/Icon/Icon.types';
import { registerReactAsWebComponent } from './utils/reactToWebComponent';

registerReactAsWebComponent<HansButtonProps>(
  'hans-button',
  HansButton,
  HansButtonPropsList,
);
registerReactAsWebComponent<HansIconProps>(
  'hans-icon',
  HansIcon,
  HansIconPropsList,
);
