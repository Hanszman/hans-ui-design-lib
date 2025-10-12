import React from 'react';
import type IconProps from './Icon.types';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as BiIcons from 'react-icons/bi';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as HiIcons from 'react-icons/hi';
import * as PiIcons from 'react-icons/pi';
import * as TbIcons from 'react-icons/tb';
import * as LuIcons from 'react-icons/lu';

const iconLibraries: Record<
  string,
  Record<string, React.ComponentType<any>>
> = {
  Fa: FaIcons,
  Md: MdIcons,
  Bi: BiIcons,
  Ai: AiIcons,
  Bs: BsIcons,
  Io: IoIcons,
  Ri: RiIcons,
  Hi: HiIcons,
  Pi: PiIcons,
  Tb: TbIcons,
  Lu: LuIcons,
};

export const Icon: React.FC<IconProps> = React.memo((props: IconProps) => {
  const {
    name,
    size = 'medium',
    color = 'primary',
    customClasses = '',
    ...rest
  } = props;

  if (!name) return null;

  const prefix = name.slice(0, 2);
  const lib = iconLibraries[prefix];
  const IconComp = lib?.[name];

  if (!IconComp) {
    console.warn(
      `[HansUI] Icon "${name}" not found or unsupported prefix "${prefix}".`,
    );
    return null;
  }

  return (
    <IconComp
      className={`hans-icon hans-icon-${size} hans-icon-${color} ${customClasses}`}
      {...(rest as React.SVGProps<SVGSVGElement>)}
    />
  );
});

Icon.displayName = 'Icon';
