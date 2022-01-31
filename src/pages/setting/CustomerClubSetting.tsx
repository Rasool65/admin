import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import '@ckeditor/ckeditor5-build-classic/build/translations/fa.js';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Form, message, Row } from 'antd';
import useHttpRequest from 'hooks/useHttpRequest';
import { PRIVACY_SETTING } from 'config/constantApi';

function CustomerClubSetting() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [customerClub, setCustomerClub] = useState('');
  const { updateRequest, getRequest } = useHttpRequest();
  const editorConfiguration = {
    language: 'fa',
  };

  const handleSubmit = () => {
    form.validateFields().then(() => {
      const body = {
        privacy: customerClub,
      };
      updateRequest(PRIVACY_SETTING, body).then(() => {
        message.success(t('customerClubSettingSuccessUpdate'));
      });
    });
  };

  useEffect(() => {
    getRequest(PRIVACY_SETTING)
      .then((resp) => {
        setCustomerClub(resp.data.privacy);
      })
      .catch(() => {
        return;
      });
  }, []);

  return (
    <>
      <Form form={form} layout='vertical' className='w-100'>
        <Card className='card__header' bordered={false}>
          <div className={'card__header__wrapper'}>
            <div className={'card__header__btn__container'}>
              <Button
                type='primary'
                htmlType='submit'
                onClick={handleSubmit}
                className={'btn_addEdit'}
              >
                {t('Update')}
              </Button>
            </div>
            <h2> {t('customerClubSetting')}</h2>
          </div>
        </Card>
        <Card bordered={false}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item
                name='privacies'
                label={t('customerClub')}
                rules={[
                  {
                    required: true,
                    message: t('pleaseInsertCustomerClubSetting'),
                  },
                ]}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={customerClub ? customerClub : ''}
                  config={editorConfiguration}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setCustomerClub(data);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
}

export default CustomerClubSetting;
