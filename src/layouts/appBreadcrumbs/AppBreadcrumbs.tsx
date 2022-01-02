import React from 'react';
import { Breadcrumb } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { IBreadCrumbs } from '../widget-type';
import '../style.scss';

const AppBreadCrumb: React.FC<IBreadCrumbs> = ({
  pageTitle,
  hasSubMenu = false,
  subTitle,
  menuTitle,
  onHome,
  onMenu,
  onSubMenu,
}) => {
  const history = useHistory();

  const { t } = useTranslation();

  return (
    <div className={'breadcrumbs__wrapper'}>
      <h3>{pageTitle}</h3>
      <Breadcrumb className={'breadcrumbs'}>
        {/* <Breadcrumb.Item onClick={() => history.push(DASHBOARD_URL)}>{t('counter')}</Breadcrumb.Item> */}
        <Breadcrumb.Item onClick={onMenu}>{menuTitle}</Breadcrumb.Item>
        {hasSubMenu && (
          <Breadcrumb.Item onClick={onSubMenu}>{subTitle}</Breadcrumb.Item>
        )}
      </Breadcrumb>
    </div>
  );
};

export default AppBreadCrumb;
