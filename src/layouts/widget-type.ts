import React, { ComponentType } from 'react';

export interface IContent {
  children: any;
  isCollapsed: boolean;
}

export interface IBreadCrumbs {
  pageTitle?: string;
  hasSubMenu?: boolean;
  subTitle?: string;
  menuTitle?: string;
  onHome?: (event: React.MouseEvent) => void;
  onMenu?: (event: React.MouseEvent) => void;
  onSubMenu?: (event: React.MouseEvent) => void;
}

export interface IMenus {
  key: string;
  icon: ComponentType<any> | string;
  title: string;
  show: boolean;
  children: IMenus[];
}
