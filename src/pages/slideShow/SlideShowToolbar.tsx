import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { IToolbar } from 'pages/widget-type';
import { SLIDE_SHOW_ADD } from 'config/constantUrl';

const SlideShowToolbar: React.FC<IToolbar> = () => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className={'d-flex row-reverse-flex'}>
      <Button
        className={'d-flex align-items-center'}
        onClick={() => {
          history.push(SLIDE_SHOW_ADD);
        }}
        type='primary'
        icon={<PlusOutlined />}
      >
        {t('newSlide')}
      </Button>
    </div>
  );
};

export default SlideShowToolbar;
