import React, { useState, useEffect } from 'react';
import { Form, Avatar, Button, Input, Row, Col, message, Upload } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios, { CancelTokenSource } from 'axios';
import { useSelector } from 'react-redux';

import { PROFILE_API, UPLOAD_FILE } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import Flex from 'uiKits/Flex/Flex';
import { BASE_URL } from 'config/urls';

let source: CancelTokenSource;

const EditProfile = () => {
  source = axios.CancelToken.source();
  // tslint:disable

  const { t } = useTranslation();

  const [form] = Form.useForm();

  const { userProfile } = useSelector((state: any) => state.layoutReducer);

  const { getRequest, postRequest, updateRequest } = useHttpRequest();

  const [avater, setAavatar] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const [userValue, setUserValue] = useState<any>({});

  useEffect(() => {
    if (!!userProfile) {
      form.setFieldsValue(userProfile);

      setUserValue(userProfile);
    }

    return () => {
      source.cancel();
    };
  }, [userProfile]);

  const customRequest = ({ onSuccess, onError, file }) => {
    const formData = new FormData() as any;

    formData.append('Files', file);
    formData.append('type', 'image');

    postRequest(UPLOAD_FILE, formData)
      .then((resp) => {
        onSuccess('Ok');
        setAavatar(resp.data.url);
      })
      .catch((err) => {
        onError({ err });
      });
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(t('formatPic'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t('sizePic'));
    }
    return isJpgOrPng && isLt2M;
  };

  const onFinish = (values) => {
    const body = {
      ...values,
      id: userValue.id,
      phoneNumber: values.mobile,
    };

    delete body['mobile'];

    setLoading(true);

    updateRequest(PROFILE_API, body)
      .then((resp) => {
        setLoading(false);
        message.success(t('SuccessUpdateProfile'));
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* <Flex alignItems='center' mobileFlex={false} className='text-center text-md-left'>
                <Avatar
                    size={90}
                    src={avater ? `${BASE_URL}${avater}` : ''}
                    icon={<UserOutlined />}

                />

                <div className='d-flex align-center mr-md-3'>

                    <Upload
                        showUploadList={false}
                        customRequest={customRequest}
                        accept='image/png, image/jpeg'
                        beforeUpload={beforeUpload}
                    >
                        <Button type='primary'>{t('changePic')}</Button>
                    </Upload>


                    <Button className='mr-2' onClick={() => setAavatar('')}>{t('delete')}</Button>
                </div>
            </Flex> */}

      <div className='mt-4'>
        <Form
          name='basicInformation'
          layout='vertical'
          initialValues={{
            name: '',
            email: '',
            family: '',
            phoneNumber: '',
            nationalCode: '',
            postalCode: '',
          }}
          onFinish={onFinish}
          form={form}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={t('name')}
                    name='name'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertName'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={t('family')}
                    name='family'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertFamily'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={t('email')}
                    name='email'
                    rules={[
                      {
                        required: true,
                        type: 'email',
                        message: t('pleaseInsertEmail'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={t('phoneNumber')}
                    name='phoneNumber'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertPhoneNumber'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Button type='primary' htmlType='submit' loading={loading}>
                {t('add')}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default EditProfile;
