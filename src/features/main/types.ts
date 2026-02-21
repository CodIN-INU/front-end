import type { ComponentType, SVGProps } from 'react';

export type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type MainMenuItem = {
  label: string;
  href: string;
  icon: SvgIcon;
};

