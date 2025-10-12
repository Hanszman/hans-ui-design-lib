import React from 'react';
import type IconProps from './Icon.types';

export const dynamicIconImports: Record<string, () => Promise<any>> = {
  Fa: () => import('react-icons/fa'),
  Md: () => import('react-icons/md'),
  Bi: () => import('react-icons/bi'),
  Ai: () => import('react-icons/ai'),
  Bs: () => import('react-icons/bs'),
  Io: () => import('react-icons/io'),
  Ri: () => import('react-icons/ri'),
  Hi: () => import('react-icons/hi'),
  Pi: () => import('react-icons/pi'),
  Tb: () => import('react-icons/tb'),
  Lu: () => import('react-icons/lu'),
};

export const Icon: React.FC<IconProps> = React.memo((props: IconProps) => {
  const { name, size = 'medium', customClasses = '', ...rest } = props;
  const [IconComp, setIconComp] = React.useState<React.ComponentType | null>(
    null,
  );

  React.useEffect(() => {
    let mounted = true;
    if (!name) return;
    const prefix = name.slice(0, 2);
    const loader = dynamicIconImports[prefix];
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
