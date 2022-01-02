import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Spin,
  Row,
  Col,
  Upload,
} from 'antd';
import { MdArrowBack } from 'react-icons/md';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IUserModel } from './widget-type';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';

import { ImageHelper } from 'utils/imageConvertion';
import CustomIcon from 'uiKits/customIcon/Main';
import UploadIcon from 'assets/img/UploadIcon';
import { USERS_PASS } from 'config/constantUrl';
import { USERS_CRUD } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import useUploadFileApi from 'hooks/useUploadFileApi';
import useQuery from 'hooks/useQuery';
import { BASE_URL } from 'config/urls';
import { MdDelete } from 'react-icons/md';
import { UtilsHelper } from 'utils/UtilsHelper';

const { Option } = Select;
const { Dragger } = Upload;

const UsetAddEdit = () => {
  // tslint:disable

  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const { postRequest, updateRequest, getRequest } = useHttpRequest();
  const { t } = useTranslation();

  const [loadingById, setLoadingById] = useState<boolean>(false);
  const { uploadFile, uploadValue } = useUploadFileApi();
  const query = useQuery();

  const [uploadedImg, setImage] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [userByIdValue, setUserByIdValue] = useState<IUserModel>({});
  const [loading, setLoading] = useState<boolean>(false);

  const roles = [
    { roleId: 1, name: t('admin') },
    { roleId: 2, name: t('user') },
    { roleId: 3, name: t('supporter') },
    { roleId: 4, name: t('seo') },
  ];

  useEffect(() => {
    if (!!id) {
      setLoadingById(true);

      getRequest(`${USERS_CRUD}/${id}`)
        .then((resp) => {
          form.setFieldsValue({
            name: resp.data.name,
            family: resp.data.family,
            email: resp.data.email,
            phoneNumber: UtilsHelper.fixFarsiForSearch(resp.data.phoneNumber),
            avatar: resp.data.avatar,
            roleId:
              resp.data.roleName === 'Admin'
                ? 1
                : resp.data.roleName === 'User'
                ? 2
                : resp.data.roleName === 'Supporter'
                ? 3
                : 4,
          });

          setLoadingById(false);
          setUserByIdValue(resp.data);
        })
        .catch(() => {
          setLoadingById(false);
        });
    }
  }, [id]);

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

  const imageUploadProps: {
    name: string;
    multiple: boolean;
    listType: any;
    showUploadList: boolean;
    accept: string;
    customRequest: any;
  } = {
    name: 'file',
    multiple: false,
    accept: 'image/png, image/jpeg',
    listType: 'text',
    showUploadList: false,
    customRequest: ({ onSuccess, onError, file }) => {
      const formData = new FormData() as any;

      formData.append('Files', file);
      formData.append('type', 'image');

      uploadFile(formData);
    },
  };

  const handleUploadChange = async (info) => {
    setUploadLoading(true);
    if (!!info.file) {
      const result = await ImageHelper.getBase64(info.file.originFileObj);

      if (!!result) {
        setImage(result as string);
        setUploadLoading(false);
      }
    }
  };

  const handleDeleteImage = () => {
    setUserByIdValue({});
    setImage('');
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const body = {
          name: values.name,
          family: values.family,
          email: values.email,
          phoneNumber: UtilsHelper.fixFarsiForSearch(values.phoneNumber),
          roleId: values.roleId,
          password: values.password
            ? UtilsHelper.fixFarsiForSearch(values.password)
            : '',
        };
        if (uploadedImg) {
          body['avatar'] = uploadValue.url;
        } else {
          body['avatar'] = userByIdValue?.avatar ? userByIdValue?.avatar : '';
        }

        if (!id) {
          setLoading(true);

          postRequest(USERS_CRUD, body)
            .then(() => {
              setLoading(false);

              history.push(USERS_PASS);

              message.success(t('userSuccessAdd'));
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          body['id'] = id;

          setLoading(true);

          updateRequest(USERS_CRUD, body)
            .then(() => {
              setLoading(false);

              history.push(USERS_PASS);

              message.success(t('userSuccessEdit'));
            })
            .catch(() => {
              setLoading(false);
            });
        }
      })
      .catch((info) => {
        return;
      });
  };

  return (
    <>
      <Form className={'w-100'} form={form} layout='vertical'>
        <Card
          bodyStyle={{ padding: '24px' }}
          className={'card__header'}
          bordered={false}
        >
          <div className={'card__header__wrapper'}>
            <div className={'card__header__btn__container'}>
              <Button
                type='primary'
                htmlType='submit'
                style={{ width: '95px', minWidth: '95px' }}
                onClick={
                  loading
                    ? () => {
                        return;
                      }
                    : handleSubmit
                }
                loading={loading}
                className={'btn_addEdit'}
              >
                {!id ? t('add') : t('edit')}
              </Button>

              <Button
                icon={<MdArrowBack />}
                type={'primary'}
                ghost={true}
                className={'btn__back'}
                onClick={() => history.push(`${USERS_PASS}${location.search}`)}
              />
            </div>

            <h2>{!id ? t('addNewUser') : t('editUser')}</h2>
          </div>
        </Card>

        <Spin spinning={loadingById}>
          <Card
            bodyStyle={{ padding: '24px', paddingBottom: '45px' }}
            bordered={false}
          >
            <Row gutter={24}>
              <Col xs={24} sm={24} md={5}>
                <Form.Item
                  label={t('uploadPic')}
                  name='avatar'
                  // rules={[
                  //     {
                  //         required: !userByIdValue?.avatar,
                  //         message: t('uploadPicNecessary')
                  //     },
                  // ]}
                >
                  <Dragger
                    style={{ width: '100%' }}
                    {...imageUploadProps}
                    beforeUpload={beforeUpload}
                    onChange={handleUploadChange}
                  >
                    {uploadedImg || userByIdValue?.avatar ? (
                      <img
                        src={
                          uploadedImg
                            ? uploadedImg
                            : `${BASE_URL}${userByIdValue.avatar}`
                        }
                        alt='avatar'
                        className='img-fluid'
                      />
                    ) : (
                      <div>
                        {uploadLoading ? (
                          <div>
                            <LoadingOutlined className='font-size-xxl text-primary' />
                            <div className='mt-3'>{t('uploading')}</div>
                          </div>
                        ) : (
                          <div>
                            <CustomIcon
                              className='display-3'
                              svg={UploadIcon}
                            />
                            <p>{t('selectPic')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Dragger>
                  {uploadedImg || userByIdValue?.avatar ? (
                    <div className='deleteImage'>
                      <MdDelete onClick={handleDeleteImage} />
                    </div>
                  ) : (
                    ''
                  )}
                </Form.Item>
              </Col>

              <Row gutter={24} style={{ paddingTop: '24px', width: '100%' }}>
                <Col xs={24} sm={24} md={24}>
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
                    <Input autoComplete={'off'} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
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
                    <Input autoComplete={'off'} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('email')}
                    name='email'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertEmail'),
                        type: 'email',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
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
                    <Input autoComplete={'off'} />
                  </Form.Item>
                </Col>

                {!id ? (
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item
                      label={t('password')}
                      name='password'
                      rules={[
                        {
                          required: !id,
                          message: t('pleaseInsertPassword'),
                        },
                      ]}
                    >
                      <Input.Password
                        autoComplete={'new-password'}
                        disabled={id}
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  ''
                )}

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    name={'roleId'}
                    label={t('role')}
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInserRole'),
                      },
                    ]}
                  >
                    <Select placeholder={t('roleName')} loading={false}>
                      {roles.map((_elm: { roleId: number; name: string }) => (
                        <Option key={_elm.roleId} value={_elm.roleId}>
                          {_elm.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Row>
          </Card>
        </Spin>
      </Form>
    </>
  );
};

export default UsetAddEdit;
