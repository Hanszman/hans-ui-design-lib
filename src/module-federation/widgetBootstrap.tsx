import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { Button } from '../components/Forms/Button/Button';
import type { ButtonProps } from '../components/Forms/Button/Button.types';
import '../styles/index.css';

export type WidgetProps = Record<string, unknown>;
export type MountReturn = { unmount: () => void };

const roots = new Map<HTMLElement, Root>();

export function mount(el: HTMLElement, props?: ButtonProps): MountReturn {
  if (!el) throw new Error('mount needs a DOM element');

  const root = createRoot(el);
  root.render(<Button {...(props ?? {})} />);
  roots.set(el, root);

  return {
    unmount: () => {
      const r = roots.get(el);
      if (r) {
        r.unmount();
        roots.delete(el);
      }
    },
  };
}

export default { mount };
