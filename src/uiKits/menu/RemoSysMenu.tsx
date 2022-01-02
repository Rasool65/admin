import React from 'react';

import { MenuWidget } from './style';

const RemoSysMenu: React.FC<any> = ({ children, ...other }) => {
  return <MenuWidget {...other}>{children}</MenuWidget>;
};
export default RemoSysMenu;
