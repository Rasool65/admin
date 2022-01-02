import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ADD_USER } from 'config/constantUrl';
import { IToolbar } from 'pages/widget-type';
import useQuery from 'hooks/useQuery';

import './style.scss';

const { Search } = Input;

const UserToolbar: React.FC<IToolbar> = ({ onSearch }) => {
  const history = useHistory();
  const location = useLocation();

  const { t } = useTranslation();
  const query = useQuery();

  const roles = [
    { roleId: 1, name: t('admin') },
    { roleId: 2, name: t('user') },
    { roleId: 3, name: t('supporter') },
    { roleId: 4, name: t('seo') },
  ];

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (query!.get('search')) {
      setValue(query.get('search') as string);
    }
  }, []);

  const handleSearch = (searchValue) => {
    history.replace(
      `${location.pathname}?search=${searchValue ? searchValue : ''}${
        location.search.split('&').length > 1
          ? `&${location.search.split('&').slice(1).join('&')}`
          : ''
      }`
    );
  };

  return (
    <>
      <div className={'toolbar__Wrapper'}>
        <div className={'d-flex row-reverse-flex'}>
          <Button
            className={'d-flex align-items-center btn_create'}
            onClick={() => {
              history.push(ADD_USER);
            }}
            type='primary'
            icon={<PlusOutlined />}
          >
            {t('newUser')}
          </Button>

          <Search
            placeholder={t('search')}
            onSearch={() => handleSearch(value)}
            onChange={(event) => setValue(event.target.value)}
            value={value}
            style={{ width: 200 }}
          />
        </div>
      </div>
    </>
  );
};

export default UserToolbar;
