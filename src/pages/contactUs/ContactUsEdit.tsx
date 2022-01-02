import React, { useState, useEffect } from 'react';
import { Card, Spin, Button, Form, Input, Row, Col } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdArrowBack } from 'react-icons/md';

import { CONTACTUS_URL } from 'config/constantUrl';
import { CONTACTUS_API } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';

const ContactUsEdit = () => {
  // tslint:disable
  const history = useHistory();
  const { t } = useTranslation();

  const { getRequest } = useHttpRequest();
  const { id } = useParams();
  const [form] = Form.useForm();

  const [loadingById, setLoadingById] = useState<boolean>(false);

  useEffect(() => {
    if (!!id) {
      setLoadingById(true);

      getRequest(`${CONTACTUS_API}/${id}`)
        .then((resp) => {
          form.setFieldsValue({
            name: resp.data.name,
            email: resp.data.email,
            message: resp.data.message,
            phoneNumber: resp.data.phoneNumber,
            subject: resp.data.subject,
          });

          setLoadingById(false);
        })
        .catch(() => {
          setLoadingById(false);
        });
    }
  }, [id]);

  return (
    <>
      <Form
        className={'w-100'}
        form={form}
        layout='vertical'
        onValuesChange={(changedFields, allFields) => {
          console.log(`changedFields`, changedFields);
        }}
      >
        <Card
          bodyStyle={{ padding: '24px' }}
          className={'card__header'}
          bordered={false}
        >
          <div className={'card__header__wrapper'}>
            <div className={'card__header__btn__container'}>
              <Button
                icon={<MdArrowBack />}
                type={'primary'}
                ghost={true}
                className={'btn__back'}
                onClick={() => history.push(CONTACTUS_URL)}
              />
            </div>

            <h2>{t('ContactUsManage')}</h2>
          </div>
        </Card>

        <Spin spinning={loadingById}>
          <Card bodyStyle={{ padding: '24px' }} bordered={false}>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label={t('name')}
                  name='name'
                  style={{ width: '100%' }}
                >
                  <Input autoComplete={'off'} disabled={true} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label={t('phoneNumber')}
                  name='phoneNumber'
                  style={{ width: '100%' }}
                >
                  <Input autoComplete={'off'} disabled={true} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label={t('email')}
                  name='email'
                  style={{ width: '100%' }}
                >
                  <Input autoComplete={'off'} disabled={true} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label={t('ContactUsSubject')}
                  name='subject'
                  style={{ width: '100%' }}
                >
                  <Input autoComplete={'off'} disabled={true} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label={t('message')} name='message'>
                  <Input.TextArea autoComplete={'off'} readOnly={true} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Form>
    </>
  );
};

export default ContactUsEdit;
