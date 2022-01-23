import React from 'react';

export type IResponse<T> = {
  items?: T[];
  meta?: {
    currentPage?: number;
    resultsPerPage?: number;
    totalPages?: number;
    totalResults?: number;
  };
};
export type IResponseOrder<T> = {
  items?: T[];
  // meta?: {
  //   name?: string;
  //   number?: number;
  //   code?: number;
  //   totalResults?: number;
  // };
};
export interface ITable<T> {
  response?: IResponse<T> | any;
  onDelete?: (id?: number) => (event: React.MouseEvent) => void;
  onActive?: (value: boolean, id: string) => void;
  loading?: boolean;
  onPaginationChange?: (current: number, pageSize: number) => void;
  isMain?: boolean;
  getCustomers?: () => void;
}

export interface IToolbar {
  onSearch?: (value: string) => void;
  onNew?: (event: React.MouseEvent) => void;
}

export type UsersListModel = {
  id?: number;
  name?: string;
  family?: string;
  fullName?: string;
  roleName?: string;
  email?: string;
  avatar?: string;
  phoneNumber?: string;
  registerDate?: string;
  isPhoneConfirmed?: boolean;
  isEmailConfirmed?: boolean;
};

export interface ProductCategoryListModel {
  children?: ProductCategoryListModel[];
  description?: string;
  id?: number;
  image?: string;
  isActive?: boolean;
  name?: string;
  parentId?: number;
  productCount?: number;
  slug?: string;
}

export interface ICategoryList {
  data?: ProductCategoryListModel[];
  onRefreshApi?: () => void;
}

export enum ColorMode {
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  LIGHT_GREEN = 'LIGHT_GREEN',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  GRAY = 'GRAY',
  RED = 'RED',
  BLUE = 'BLUE',
  PINK = 'PINK',
}
