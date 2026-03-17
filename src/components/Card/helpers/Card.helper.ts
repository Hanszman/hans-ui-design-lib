import type { Variant } from '../../../types/Common.types';
import type {
  HansCardClassNameArgs,
  HansCardLayout,
  HansCardStyleArgs,
  HansCardStyleVars,
} from './Card.helper.types';

export const resolveHansCardLayout = (
  cardLayout: HansCardLayout | undefined,
  imageSrc: string,
): HansCardLayout => {
  if (cardLayout) return cardLayout;
  return imageSrc ? 'image' : 'profile';
};

export const getHansCardClassName = ({
  cardLayout,
  cardSize,
  customClasses,
}: HansCardClassNameArgs) =>
  `
    hans-card
    hans-card-${cardLayout}
    hans-card-${cardSize}
    ${customClasses}
  `;

export const getHansCardStyleVars = ({
  cardColor,
  cardVariant,
  imageSrc,
}: HansCardStyleArgs): HansCardStyleVars => {
  const tokenPrefix = `--${cardColor}`;
  const isBase = cardColor === 'base';

  const variantMap: Record<
    Variant,
    {
      bg: string;
      border: string;
      text: string;
      muted: string;
    }
  > = {
    strong: {
      bg: `var(${tokenPrefix}-strong-color)`,
      border: `var(${tokenPrefix}-strong-color)`,
      text: 'var(--white)',
      muted: 'color-mix(in srgb, var(--white) 76%, transparent)',
    },
    default: {
      bg: `var(${tokenPrefix}-default-color)`,
      border: `var(${tokenPrefix}-default-color)`,
      text: isBase ? 'var(--text-color)' : 'var(--white)',
      muted: isBase
        ? 'color-mix(in srgb, var(--text-color) 72%, transparent)'
        : 'color-mix(in srgb, var(--white) 76%, transparent)',
    },
    neutral: {
      bg: `var(${tokenPrefix}-neutral-color)`,
      border: `var(${tokenPrefix}-neutral-color)`,
      text: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-strong-color)`,
      muted: isBase
        ? 'color-mix(in srgb, var(--text-color) 68%, transparent)'
        : `color-mix(in srgb, var(${tokenPrefix}-strong-color) 72%, transparent)`,
    },
    outline: {
      bg: 'var(--white)',
      border: `var(${tokenPrefix}-default-color)`,
      text: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-strong-color)`,
      muted: isBase
        ? 'color-mix(in srgb, var(--text-color) 68%, transparent)'
        : `color-mix(in srgb, var(${tokenPrefix}-strong-color) 72%, transparent)`,
    },
    transparent: {
      bg: 'transparent',
      border: 'transparent',
      text: isBase ? 'var(--text-color)' : `var(${tokenPrefix}-strong-color)`,
      muted: isBase
        ? 'color-mix(in srgb, var(--text-color) 68%, transparent)'
        : `color-mix(in srgb, var(${tokenPrefix}-strong-color) 72%, transparent)`,
    },
  };

  const resolvedVariant = variantMap[cardVariant];

  return {
    '--hans-card-bg': resolvedVariant.bg,
    '--hans-card-border': resolvedVariant.border,
    '--hans-card-text': resolvedVariant.text,
    '--hans-card-muted': resolvedVariant.muted,
    '--hans-card-image': imageSrc ? `url("${imageSrc}")` : 'none',
  };
};
