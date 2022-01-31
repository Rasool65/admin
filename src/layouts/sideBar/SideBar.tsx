import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
  TeamOutlined,
  BlockOutlined,
  SettingOutlined,
  QuestionOutlined,
  ContactsOutlined,
  ContainerOutlined,
  BoldOutlined,
  UserOutlined,
  BarcodeOutlined,
  FileDoneOutlined,
  DashboardOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { MenuContainer } from './style';
import {
  CONTACTUS_URL,
  SETTING_URL,
  SLIDE_SHOW,
  CUSTOMERS_LIST,
  FAQS_URL,
  SUBSCRIBER_LIST_URL,
  PRODUCT_CATEGORY_URL,
  PRODUCT_URL,
  COMPANY_URL,
  USERS_PASS,
  ORDER_URL,
  DASHBOARD,
  PRE_REGISTRATION_CUSTOMERS,
  MESSAGES,
  CONSULT_URL,
  PRIVACY_URL,
  TERM_URL,
  CUSTOMER_CLUB_URL,
  BANNER_URL,
  CREATE_ORDER_URL,
} from 'config/constantUrl';
import RemoSysMenu from '../../uiKits/menu/RemoSysMenu';
import '../style.scss';
import { IMenus } from 'layouts/widget-type';

const { SubMenu } = Menu;
const { Sider } = Layout;
const Sidebar = () => {
  const { openSider, loginPage, userProfile } = useSelector(
    (state: any) => state.layoutReducer
  );
  const [selectedMenu, setSelectedMenu] = useState<string>(DASHBOARD);

  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const [menus, setMenus] = useState<IMenus[]>([]);

  useEffect(() => {
    if (!!userProfile) {
      const menusInit: IMenus[] = [
        {
          key: DASHBOARD,
          icon: DashboardOutlined,
          title: 'داشبورد',
          show: userProfile.roleName === 'Admin',
          children: [],
        },
        {
          key: USERS_PASS,
          icon: UserOutlined,
          title: t('userManagement'),
          show: userProfile.roleName === 'Admin',
          children: [],
        },
        {
          key: '5',
          icon: TeamOutlined,
          title: t('customersList'),
          show: userProfile.roleName === 'Admin',
          children: [
            {
              key: CUSTOMERS_LIST,
              icon: '',
              title: t('customers'),
              show: userProfile.roleName === 'Admin',
              children: [],
            },
            {
              key: PRE_REGISTRATION_CUSTOMERS,
              icon: '',
              title: t('pre-registration-customer'),
              show: userProfile.roleName === 'Admin',
              children: [],
            },
          ],
        },

        {
          key: '10',
          icon: BarcodeOutlined,
          title: t('productManagment'),
          show: userProfile.roleName === 'Admin',
          children: [
            {
              key: PRODUCT_URL,
              icon: '',
              title: t('products'),
              show: userProfile.roleName === 'Admin',
              children: [],
            },
            {
              key: PRODUCT_CATEGORY_URL,
              icon: '',
              title: t('ProductCategory'),
              show: userProfile.roleName === 'Admin',
              children: [],
            },
          ],
        },
        {
          key: ORDER_URL,
          icon: FileDoneOutlined,
          title: t('orderManagment'),
          show: userProfile.roleName === 'Admin',
          children: [],
        },
        {
          key: CREATE_ORDER_URL,
          icon: FileDoneOutlined,
          title: t('createOrder'),
          show: userProfile.roleName === 'Admin',
          children: [],
        },
        {
          key: CONSULT_URL,
          icon: PhoneOutlined,
          title: t('consultant'),
          show:
            userProfile.roleName === 'Admin' ||
            userProfile.roleName === 'Supporter',
          children: [],
        },
        {
          key: MESSAGES,
          icon: MailOutlined,
          title: t('messageManagment'),
          show: userProfile.roleName === 'Admin',
          children: [],
        },
        {
          key: SLIDE_SHOW,
          icon: BlockOutlined,
          title: t('slideShow'),
          show:
            userProfile.roleName === 'Admin' ||
            userProfile.roleName === 'Supporter' ||
            userProfile.roleName === 'SeoContent',
          children: [],
        },
        {
          key: '1',
          icon: SettingOutlined,
          title: t('setting'),
          show: userProfile.roleName === 'Admin',
          children: [
            {
              key: BANNER_URL,
              icon: '',
              title: t('bannerSetting'),
              show: userProfile.roleName === 'Admin',
              children: [],
            },
            {
              key: SETTING_URL,
              icon: '',
              title: t('siteSetting'),
              show: userProfile.roleName === 'Admin',
              children: [],
            },
            {
              key: TERM_URL,
              icon: '',
              title: t('termsSetting'),
              show:
                userProfile.roleName === 'Admin' ||
                userProfile.roleName === 'Supporter',
              children: [],
            },
            {
              key: CUSTOMER_CLUB_URL,
              icon: '',
              title: t('customerClub'),
              show:
                userProfile.roleName === 'Admin' ||
                userProfile.roleName === 'Supporter',
              children: [],
            },
          ],
        },
        {
          key: SUBSCRIBER_LIST_URL,
          icon: ContainerOutlined,
          title: t('Newsletters'),
          show:
            userProfile.roleName === 'Admin' ||
            userProfile.roleName === 'Supporter',
          children: [],
        },
        {
          key: CONTACTUS_URL,
          icon: ContactsOutlined,
          title: t('contactUs'),
          show: userProfile.roleName === '123',
          children: [],
        },
        {
          key: COMPANY_URL,
          icon: BoldOutlined,
          title: t('company'),
          show: userProfile.roleName === 'Admin',
          children: [],
        },
        {
          key: FAQS_URL,
          icon: QuestionOutlined,
          title: t('Faqs'),
          show: userProfile.roleName === 'Admin',
          children: [],
        },
      ];

      setMenus(menusInit);
    }
  }, [userProfile]);

  useEffect(() => {
    setSelectedMenu(location.pathname);
  }, [location]);

  const handleClickMenu = ({ item, key, keyPath, domEvent }) => {
    history.push(key);
  };

  return (
    <Sider
      width={250}
      collapsed={openSider}
      className={'nav__sider'}
      style={{ display: !loginPage ? 'block' : 'none' }}
    >
      <MenuContainer>
        <RemoSysMenu
          mode={'inline'}
          theme='light'
          style={{ borderLeft: 0, height: window.innerHeight }}
          onClick={handleClickMenu}
          selectedKeys={[selectedMenu]}
        >
          {menus.length > 0 &&
            menus.map((_item: IMenus) => {
              if (_item.children.length > 0) {
                return (
                  <SubMenu
                    key={_item.key}
                    icon={<_item.icon className={'sidebar__icon'} />}
                    title={t(_item.title)}
                  >
                    {_item.children.map((_child: IMenus) => (
                      <Menu.Item
                        key={_child.key}
                        style={{ display: _child.show ? 'flex' : 'none' }}
                      >
                        {t(_child.title)}
                      </Menu.Item>
                    ))}
                  </SubMenu>
                );
              } else {
                return (
                  <Menu.Item
                    key={_item.key}
                    icon={<_item.icon className={'sidebar__icon'} />}
                    style={{ display: _item.show ? 'block' : 'none' }}
                  >
                    {t(_item.title)}
                  </Menu.Item>
                );
              }
            })}
        </RemoSysMenu>
      </MenuContainer>
    </Sider>
  );
};

export default Sidebar;
