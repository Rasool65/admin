import styled from 'styled-components';

import { Menu } from 'antd';

export const MenuWidget = styled(Menu)`
  & li {
    & div.ant-menu-submenu-title {
      & span:nth-child(2) {
        font-size: 16px;
      }
    }

    & ul.ant-menu-sub {
      & li {
        font-size: 16px;
      }
    }
    & span:first-child {
      position: relative;
      top: 4px;
    }
    & span:last-child {
      font-size: 16px;
    }
  }
`;
