import React from 'react';
import type { IconProps } from './Icon.types';
import { DynamicIconImports } from './Icon.types';

export const Icon: React.FC<IconProps> = React.memo((props: IconProps) => {
  const { name, size = 'medium', customClasses = '', ...rest } = props;
  const [IconComp, setIconComp] = React.useState<React.ComponentType<
    React.SVGProps<SVGSVGElement>
  > | null>(null);

  React.useEffect(() => {
    let mounted = true;
    if (!name) return;
    const prefix = name.slice(0, 2);
    const loader = DynamicIconImports[prefix];
    if (!loader) return;

    (async () => {
      try {
        const lib = await loader();
        if (!mounted) return;
        setIconComp(() => lib[name] || null);
      } catch (err) {
        console.warn(`[HansUI] Error loading icon ${name}:`, err);
        if (mounted) setIconComp(() => null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [name]);

  if (!IconComp) return <span className="hans-icon-loading" />;

  return (
    <IconComp
      className={`hans-icon hans-icon-${size} ${customClasses}`}
      {...(rest as React.SVGProps<SVGSVGElement>)}
    />
  );
});

Icon.displayName = 'Icon';
