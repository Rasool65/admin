import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import '@ckeditor/ckeditor5-build-classic/build/translations/fa.js';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Form, message, Row } from 'antd';
import useHttpRequest from 'hooks/useHttpRequest';
import { TERM_SETTING } from 'config/constantApi';

function TermsSetting() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [terms, setTerms] = useState('');
  const { updateRequest, getRequest } = useHttpRequest();
  const editorConfiguration = {
    language: 'fa',
  };

  const handleSubmit = () => {
    form.validateFields().then(() => {
      const body = {
        terms,
      };
      updateRequest(TERM_SETTING, body).then(() => {
        message.success(t('termSettingSuccessUpdate'));
      });
    });
  };

  useEffect(() => {
    getRequest(TERM_SETTING)
      .then((resp) => {
        setTerms(resp.data.terms);
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
            <h2> {t('termsSetting')}</h2>
          </div>
        </Card>
        <Card bordered={false}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item
                name='terms'
                label={t('terms')}
                rules={[
                  {
                    required: true,
                    message: t('pleaseInsertTerms'),
                  },
                ]}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={terms ? terms : ''}
                  config={editorConfiguration}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setTerms(data);
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

export default TermsSetting;
