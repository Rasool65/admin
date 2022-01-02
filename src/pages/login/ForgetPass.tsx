import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as uuid from 'uuid';

import { ForgetEnum } from './widget-type';
import { LOGIN } from 'config/constantUrl';
import { RESET_PASSWORD, _UUID, EMAIL_CONFIRM } from 'config/constantApi';
import { useForm } from 'antd/lib/form/Form';
import { loginPageAction } from 'redux/layout/actions';
import useHttpRequest from 'hooks/useHttpRequest';

import './style.scss';
import { UtilsHelper } from 'utils/UtilsHelper';

const ForgetPass = () => {
  const history = useHistory();
  const [form] = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const { postRequest } = useHttpRequest();
  const { t } = useTranslation();

  const [active, setActive] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [code, setCode] = useState<string>('');
  const [mobileValue, setMobile] = useState<string>('');
  const [emailValue, setEmail] = useState<string>('');

  const rules = {
    activeCode: [
      {
        required: true,
        message: t('pleaseInserCode'),
      },
    ],
    password: [
      {
        required: true,
        message: t('pleaseInserPassword'),
      },
    ],
    newPassword: [
      {
        required: true,
        message: t('pleaseInserRePassword'),
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

  const handleSubmitEmail = async (values) => {
    setEmail(values.email);

    setLoading(true);

    postRequest(EMAIL_CONFIRM, values)
      .then((resp) => {
        message.success({ content: resp.data.message, duration: 4 });

        setLoading(false);

        setActive(1);
      })
      .catch(() => {
        setLoading(false);
        setActive(0);
      });
  };

  useEffect(() => {
    dispatch(loginPageAction(true));
  }, []);

  useEffect(() => {
    if (location.search.length) {
      setActive(1);
      setCode(location.search.slice(12, 18));

      setEmail(location.search.split('&')[1].slice(6));

      form.setFieldsValue({
        activeCode: location.search.slice(12, 18),
      });
    }
  }, [location.search]);

  const handleConfirmCode = async (value) => {
    setActive(2);

    setCode(value.activeCode);
  };

  const handleSubmitForm = async (value) => {
    setLoading(true);

    const body = {
      activeCode: code,
      newPassword: UtilsHelper.fixFarsiForSearch(value.newPassword),
      email: emailValue,
    };

    postRequest(RESET_PASSWORD, body)
      .then((resp) => {
        message.success({ content: t('changeSuccessPass'), duration: 4 });
        history.push(LOGIN);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className={'login__wrapper'}>
      <div className='container d-flex flex-column justify-content-center h-100'>
        <Row justify='center'>
          <Col xs={20} sm={20} md={20} lg={7}>
            <Card>
              <div className='my-4'>
                <div className='text-center'>
                  <h1 className={'pb-4'}>کاله</h1>
                </div>
                <Row justify='center'>
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <Form
                      layout='vertical'
                      name='forget-form'
                      form={form}
                      noValidate={true}
                      onFinish={
                        ForgetEnum.STEP_1 === active
                          ? handleSubmitEmail
                          : ForgetEnum.STEP_2 === active
                          ? handleConfirmCode
                          : ForgetEnum.STEP_3 === active
                          ? handleSubmitForm
                          : () => {
                              return;
                            }
                      }
                    >
                      {ForgetEnum.STEP_1 === active &&
                        ForgetEnum.STEP_1 === active && (
                          <Form.Item
                            name='email'
                            label={t('email')}
                            rules={[
                              {
                                required: true,
                                message: t('pleaseInsertEmail'),
                                type: 'email',
                              },
                            ]}
                            hasFeedback={true}
                          >
                            <Input
                              suffix={<MailOutlined className='text-primary' />}
                              dir={'ltr'}
                              autoComplete={'off'}
                            />
                          </Form.Item>
                        )}

                      {ForgetEnum.STEP_2 === active && (
                        <Form.Item
                          name='activeCode'
                          label={t('activeCode')}
                          rules={rules.activeCode}
                          hasFeedback={true}
                        >
                          <Input
                            type='number'
                            dir={'ltr'}
                            autoComplete={'off'}
                          />
                        </Form.Item>
                      )}

                      {ForgetEnum.STEP_3 === active && (
                        <>
                          <Form.Item
                            name='password'
                            label={t('password')}
                            rules={rules.password}
                            hasFeedback={true}
                          >
                            <Input.Password dir={'ltr'} autoComplete={'off'} />
                          </Form.Item>

                          <Form.Item
                            name='newPassword'
                            label={t('newPassword')}
                            rules={rules.newPassword}
                            hasFeedback={true}
                          >
                            <Input.Password dir={'ltr'} autoComplete={'off'} />
                          </Form.Item>
                        </>
                      )}

                      <Form.Item className={'btnforget__form'}>
                        <Button
                          className={'btn__center'}
                          type='primary'
                          htmlType='submit'
                          block={false}
                          loading={loading}
                        >
                          {ForgetEnum.STEP_3 === active
                            ? t('submit')
                            : t('continues')}
                        </Button>

                        <span
                          className={'text-primary'}
                          onClick={
                            ForgetEnum.STEP_1 === active
                              ? () => {
                                  setActive(0);
                                  history.push(LOGIN);
                                }
                              : ForgetEnum.STEP_2 === active
                              ? () => setActive(0)
                              : ForgetEnum.STEP_3 === active
                              ? () => setActive(1)
                              : () => {
                                  return;
                                }
                          }
                        >
                          {ForgetEnum.STEP_1 === active
                            ? t('login')
                            : t('back')}
                        </span>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgetPass;
