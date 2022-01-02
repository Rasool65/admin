import React from 'react';

export interface IEllipsisDropdown {
  trigger?: 'click' | 'hover' | 'contextMenu';
  placement?:
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight'
    | undefined;
  menu?: any;
}
