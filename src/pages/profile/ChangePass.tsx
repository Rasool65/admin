import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Input, Row, Col, message } from 'antd';

import { CHAGNE_PASSWORD_API } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';

const ChangePass = () => {
  const { postRequest } = useHttpRequest();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const rules = {
    currentPassword: [
      {
        required: true,
        message: t('pleaseInsertCurrentPass'),
      },
    ],
    password: [
      {
        required: true,
        message: t('pleaseInsertPassword'),
      },
    ],
    newPassword: [
      {
        required: true,
        message: t('pleaseInsertRePassword'),
      },
      ({ getFieldValue }) => ({
        validator(rule, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(t('dontMatchPassword'));
        },
      }),
    ],
  };

  const onFinish = (values) => {
    setLoading(true);

    postRequest(CHAGNE_PASSWORD_API, {
      currentPassword: values.currentPassword,
      newPassword: values.password,
    })
      .then((resp) => {
        setLoading(false);
        message.success(t('successChangePass'));
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <Form
        name='basicInformation'
        layout='vertical'
        initialValues={{
          name: '',
          email: '',
          family: '',
          phoneNumber: '',
        }}
        onFinish={onFinish}
        form={form}
      >
        <Row>
          <Col xs={24} sm={24} md={24} lg={16}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={t('currentPassword')}
                name='currentPassword'
                rules={rules.password}
              >
                <Input type={'password'} autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={t('password')}
                name='password'
                rules={rules.password}
              >
                <Input type={'password'} autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={t('newPassword')}
                name='newPassword'
                rules={rules.newPassword}
              >
                <Input type={'password'} autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Button type='primary' htmlType='submit' loading={loading}>
              {t('add')}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ChangePass;
