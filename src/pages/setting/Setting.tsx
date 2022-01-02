import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import SettingList from './SettingList';

import './style.scss';

const Setting = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <AppBreadCrumbs pageTitle={''} menuTitle={t('siteSetting')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <SettingList />
      </Card>
    </>
  );
};

export default Setting;
