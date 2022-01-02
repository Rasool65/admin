import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu, Divider } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios, { CancelTokenSource } from 'axios';

import { Switch } from 'antd';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  CheckOutlined,
  EditOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import {
  HeaderLogo,
  RemoSysHeader,
  HeaderRight,
  HeaderContent,
  HeaderLeft,
  Items,
  LanguageWrapper,
  LanguageItems,
} from './style';
import { loginPageAction, siderMode } from 'redux/layout/actions';
import { PROFILE_API, _UUID } from 'config/constantApi';
import {
  LOGIN,
  PRODILE_CHANGE_PASS_URL,
  PRODILE_EDIT_URL,
} from 'config/constantUrl';
import useHttpRequest from 'hooks/useHttpRequest';
import { BASE_URL } from 'config/urls';
import Logo from 'assets/img/Image 1.png';

let source: CancelTokenSource;

const Header = () => {
  source = axios.CancelToken.source();

  const dispatch = useDispatch();
  const history = useHistory();
  const { t, i18n, ready } = useTranslation();
  // const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  const { getRequest } = useHttpRequest();
  const { loginPage, userProfile, darkMode } = useSelector(
    (state: any) => state.layoutReducer
  );

  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [collapsedValue, setCollapseddValue] = useState<boolean>(false);
  const [darkValue, setDarkValue] = useState<boolean>(false);
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  useEffect(() => {
    if (i18n?.language) {
      i18n.language === 'fa' ? setSelectedValue(1) : setSelectedValue(3);
    }
  }, [i18n]);

  const handleLanguage =
    (langSelected: number) => (event: React.MouseEvent) => {
      setSelectedValue(langSelected);
    };

  const handleCollapsedSider = (event: React.MouseEvent) => {
    setCollapseddValue(!collapsedValue);
    dispatch(siderMode(!collapsedValue));
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const closeMenu = () => {
    setVisibleMenu(false);
  };
  const handleVisibleChange = (flag) => {
    setVisibleMenu(flag);
  };
  //    const handleDarkMode = (event: React.MouseEvent) => {
  //     setDarkValue(darkValue);
  //     dispatch(darkMode(!darkValue));
  //   };
  const menuProfile = (
    <Menu theme={'light'}>
      {/* <AvatarStatus
                pic={pic}
                title={'محسن کرمانی فر'}
                caption={'Frontend Developer'}
                onClick={() => history.push(PRODILE_URL)}
            /> */}

      <Items>
        <EditOutlined />
        <p
          className={'item__name'}
          onClick={() => {
            history.push(PRODILE_EDIT_URL);
            closeMenu();
          }}
        >
          {t('editProfile')}
        </p>
      </Items>

      <Divider style={{ margin: '0px 0px 8px 0px' }} />

      <Items>
        <KeyOutlined />
        <p
          className={'item__name'}
          onClick={() => {
            history.push(PRODILE_CHANGE_PASS_URL);
            closeMenu();
          }}
        >
          {t('changePass')}{' '}
        </p>
      </Items>

      <Divider style={{ margin: '0px 0px 8px 0px' }} />

      <Items>
        <LogoutOutlined />
        <p
          className={'item__name'}
          onClick={() => {
            history.push(LOGIN);
            dispatch(loginPageAction(true));
            closeMenu();
          }}
        >
          {t('exit')}
        </p>
      </Items>
    </Menu>
  );

  const menuLanguage = (
    <Menu theme={'light'}>
      <LanguageWrapper>
        <LanguageItems
          onClick={handleLanguage(1)}
          isSelected={selectedValue === 1}
        >
          <div
            onClick={() => {
              changeLanguage('fa');
            }}
          >
            <CheckOutlined />
            <span>Persian</span>
          </div>
        </LanguageItems>

        <LanguageItems
          onClick={handleLanguage(3)}
          isSelected={selectedValue === 3}
        >
          <div
            onClick={() => {
              changeLanguage('ar');
            }}
          >
            <CheckOutlined />
            <span>Arabic</span>
          </div>
        </LanguageItems>
      </LanguageWrapper>
    </Menu>
  );

  return (
    <RemoSysHeader customstyle={{ display: !loginPage ? 'flex' : 'none' }}>
      <HeaderLogo>
        <img src={Logo} alt='kale' />
      </HeaderLogo>
      <HeaderContent>
        <HeaderRight>
          {collapsedValue ? (
            <MenuFoldOutlined
              style={{ fontSize: '22px' }}
              onClick={handleCollapsedSider}
            />
          ) : (
            <MenuUnfoldOutlined
              style={{ fontSize: '22px' }}
              onClick={handleCollapsedSider}
            />
          )}
        </HeaderRight>

        <HeaderLeft>
          <Dropdown
            overlay={menuProfile}
            trigger={['click']}
            placement='bottomLeft'
            onVisibleChange={handleVisibleChange}
            visible={visibleMenu}
          >
            <Avatar
              src={
                !!userProfile && userProfile.avatar
                  ? `${BASE_URL}${userProfile.avatar}`
                  : ''
              }
              className={'header__avatar'}
            />
          </Dropdown>
        </HeaderLeft>
      </HeaderContent>
    </RemoSysHeader>
  );
};

export default Header;
