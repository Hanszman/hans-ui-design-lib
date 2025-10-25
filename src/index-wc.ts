import './styles/index.css';
import { HansButton } from './components/Forms/Button/Button';
import { HansIcon } from './components/Icon/Icon';
import { registerHansComponent } from './utils/createHansWebComponent';

registerHansComponent('hans-button', HansButton);
registerHansComponent('hans-icon', HansIcon);
