import React from 'react';

export interface IAvatarStatus {
  pic?: any;
  title?: string;
  caption?: string;
  type?: string;
  size?: number;
  customstyle?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<any>) => void;
}
