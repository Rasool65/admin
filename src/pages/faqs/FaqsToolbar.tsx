import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { IToolbar } from 'pages/widget-type';
import { useHistory } from 'react-router-dom';
import { FAQS_ADD_URL } from 'config/constantUrl';

const FaqsToolbar: React.FC<IToolbar> = () => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className={'d-flex row-reverse-flex'}>
      <Button
        className={'d-flex align-items-center'}
        onClick={() => {
          history.push(FAQS_ADD_URL);
        }}
        type='primary'
        icon={<PlusOutlined />}
      >
        {t('newFaq')}
      </Button>
    </div>
  );
};

export default FaqsToolbar;
