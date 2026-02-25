import React from 'react';
import { type HansIconProps, DynamicIconImports } from './Icon.types';
import { HansLoading } from '../Loading/Loading';

export const HansIcon: React.FC<HansIconProps> = React.memo(
  (props: HansIconProps) => {
    const {
      name,
      iconSize = 'medium',
      loading = false,
      customClasses = '',
      ...rest
    } = props;
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

    if (loading || !IconComp) {
      return (
        <HansLoading
          loadingType="spinner"
          loadingSize={iconSize}
          customClasses={`hans-icon-loading ${customClasses}`}
          ariaLabel={name ? `Loading icon ${name}` : 'Loading icon'}
        />
      );
    }

    return (
      <IconComp
        className={`
          hans-icon
          hans-icon-${iconSize}
          ${customClasses}
        `}
        {...(rest as React.SVGProps<SVGSVGElement>)}
      />
    );
  },
);

HansIcon.displayName = 'HansIcon';
