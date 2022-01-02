import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Row, Col, Form, Input, Button } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import * as uuid from 'uuid';
import { useTranslation } from 'react-i18next';

import { LOGIN_POST, TOKEN_NAME, _UUID } from 'config/constantApi';
import { FORGET_PASS, CUSTOMERS_LIST, DASHBOARD } from 'config/constantUrl';
import { loginPageAction } from 'redux/layout/actions';
import useHttpRequest from 'hooks/useHttpRequest';
import Logo from 'assets/img/Image 1.png';

import './style.scss';

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { postRequest } = useHttpRequest();
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem(_UUID);
    dispatch(loginPageAction(true));
  }, []);

  const handleFinish = async (values) => {
    setLoading(true);
    postRequest(LOGIN_POST, values)
      .then((resp) => {
        localStorage.setItem(TOKEN_NAME, resp.data.token);
        localStorage.setItem(_UUID, uuid.v4());

        history.push(resp.data.roleName === 'Admin' ? DASHBOARD : DASHBOARD);

        dispatch(loginPageAction(false));

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className='login__wrapper'>
        <div className='container d-flex flex-column justify-content-center h-100'>
          <Row justify='center'>
            <Col xs={20} sm={20} md={20} lg={7}>
              <Card className={'card__boxshadow'} bordered={false}>
                <div className='my-4'>
                  <div className='text-center'>
                    <img
                      src={Logo}
                      alt='taranomBaran'
                      style={{ marginBottom: '24px' }}
                    />
                  </div>
                  <Row justify='center'>
                    <Col xs={24} sm={24} md={20} lg={20}>
                      <Form
                        layout='vertical'
                        name='login-form'
                        onFinish={handleFinish}
                      >
                        <Form.Item
                          name='username'
                          label={t('username')}
                          rules={[
                            {
                              required: true,
                              message: t('pleaseInsertUserName'),
                            },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined className='text-primary' />}
                            autoComplete={'off'}
                            autoFocus={true}
                          />
                        </Form.Item>
                        <Form.Item
                          name='password'
                          label={t('password')}
                          rules={[
                            {
                              required: true,
                              message: t('pleaseInsertPassword'),
                            },
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined className='text-primary' />}
                            autoComplete={'off'}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            className={'btn__center'}
                            type='primary'
                            htmlType='submit'
                            block={true}
                            loading={loading}
                          >
                            {t('entry')}
                          </Button>

                          <p
                            className={'forget__pass text-primary'}
                            onClick={() => history.push(FORGET_PASS)}
                          >
                            {t('forgetPass')}
                          </p>
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
    </>
  );
};

export default Login;
