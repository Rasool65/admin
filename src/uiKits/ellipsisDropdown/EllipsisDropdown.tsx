import React from 'react';
import { Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { IEllipsisDropdown } from './widget-type';

const EllipsisDropdown: React.FC<IEllipsisDropdown> = ({
  menu,
  placement,
  trigger = 'click',
}) => {
  return (
    <Dropdown overlay={menu} placement={placement} trigger={[trigger]}>
      <div className='ellipsis-dropdown'>
        <EllipsisOutlined />
      </div>
    </Dropdown>
  );
};

export default EllipsisDropdown;
