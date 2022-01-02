import React from 'react';
import { EditOutlined, KeyOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import InnerAppLayout from 'layouts/innerAppLayout/InnderAppLayout';
import PrivateRoute from 'routes/PrivateRoutes';
import EditProfile from './EditProfile';
import {
  PRODILE_CHANGE_PASS_URL,
  PRODILE_EDIT_URL,
  PRODILE_URL,
} from 'config/constantUrl';
import ChangePass from './ChangePass';
import RemoSysMenu from 'uiKits/menu/RemoSysMenu';

const SettingOption = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const handleClickMenu = ({ item, key, keyPath, domEvent }) => {
    history.push(key);
  };

  return (
    <RemoSysMenu mode={'inline'} theme='light' onClick={handleClickMenu}>
      <Menu.Item key={PRODILE_EDIT_URL}>
        <EditOutlined />
        <span>{t('editProfile')}</span>
      </Menu.Item>

      <Menu.Item key={PRODILE_CHANGE_PASS_URL}>
        <KeyOutlined />
        <span>{t('changePass')}</span>
      </Menu.Item>
    </RemoSysMenu>
  );
};

const SettingContent = ({ match }) => {
  return (
    <Switch>
      <PrivateRoute
        exact={true}
        path={PRODILE_EDIT_URL}
        component={EditProfile}
      />
      <PrivateRoute path={PRODILE_CHANGE_PASS_URL} component={ChangePass} />
    </Switch>
  );
};

const Profile = (props) => {
  return (
    <InnerAppLayout
      sideContentWidth={320}
      sideContent={<SettingOption {...props} />}
      mainContent={<SettingContent {...props} />}
    />
  );
};

export default Profile;
