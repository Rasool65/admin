import React, { useState, useEffect } from 'react';
import {
  Card,
  Spin,
  Button,
  Form,
  Input,
  message,
  Row,
  Col,
  Select,
  Upload,
} from 'antd';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdArrowBack } from 'react-icons/md';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { ImageHelper } from 'utils/imageConvertion';
import { COMPANY_URL } from 'config/constantUrl';
import { COMPANY_API, UPLOAD_FILE } from 'config/constantApi';
import { MdDelete } from 'react-icons/md';
import useHttpRequest from 'hooks/useHttpRequest';
import useUploadFileApi from 'hooks/useUploadFileApi';
import useQuery from 'hooks/useQuery';
import { ICompanyModel } from './widget-type';
import { BASE_URL } from 'config/urls';
import CustomIcon from 'uiKits/customIcon/Main';
import UploadIcon from 'assets/img/UploadIcon';

import './style.scss';

const { Dragger } = Upload;

const CompanyAddEdit = () => {
  // tslint:disable
  const history = useHistory();
  const { t } = useTranslation();

  const { getRequest, postRequest, updateRequest } = useHttpRequest();
  const { id } = useParams();
  const [form] = Form.useForm();
  const location = useLocation();
  const [loadingById, setLoadingById] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);

  const [uploadedImg, setImage] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!!id) {
      setLoadingById(true);

      getRequest(`${COMPANY_API}/${id}`)
        .then((resp) => {
          form.setFieldsValue({
            name: resp.data.name,
            description: resp.data.description,
            logo: resp.data.logo,
            slug: resp.data.slug,
            brandLink: resp.data.brandLink,
          });

          setImage(resp.data.logo);

          setLoadingById(false);
        })
        .catch((err) => {
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

      setLoadingPage(true);

      postRequest(UPLOAD_FILE, formData)
        .then((resp) => {
          setImage(resp.data.url);
          setLoadingPage(false);
        })
        .catch((err) => {
          setLoadingPage(false);
          return err;
        });
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
    setImage('');
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const body = {
          name: values.name,
          description: values.description,
          slug: values.slug,
          logo: uploadedImg ? uploadedImg : null,
          brandLink: values.brandLink,
        };

        if (!id) {
          setLoading(true);

          postRequest(COMPANY_API, body)
            .then(() => {
              setLoading(false);

              history.push(COMPANY_URL);

              message.success(t('companySuccessAdd'));
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          body['id'] = id;

          setLoading(true);

          updateRequest(COMPANY_API, body)
            .then(() => {
              setLoading(false);

              history.push(COMPANY_URL);

              message.success(t('companySuccessEdit'));
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
      <Form
        className={'w-100'}
        form={form}
        layout='vertical'
        onValuesChange={(changedFields, allFields) => {}}
      >
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
                onClick={() => history.push(`${COMPANY_URL}${location.search}`)}
              />
            </div>

            <h2>{!id ? t('addNewCompany') : t('editCompany')}</h2>
          </div>
        </Card>

        <Spin spinning={loadingById || loadingPage}>
          <Card bodyStyle={{ padding: '24px' }} bordered={false}>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={5}>
                <Form.Item
                  label={t('uploadPic')}
                  name='logo'
                  // rules={[
                  //     {
                  //         required: !slideByIdValue?.logo,
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
                    {uploadedImg ? (
                      <img
                        src={`${BASE_URL}${uploadedImg}`}
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
                  {uploadedImg ? (
                    <div className='deleteImage'>
                      <MdDelete onClick={handleDeleteImage} />
                    </div>
                  ) : (
                    ''
                  )}
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={19}>
                <Row gutter={24}>
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
                      <Input autoComplete={'off'} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={t('slug')}
                      name='slug'
                      rules={[
                        {
                          required: true,
                          message: t('pleaseInsertSlug'),
                        },
                      ]}
                    >
                      <Input autoComplete={'off'} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={t('brandLink')}
                      name='brandLink'
                      rules={[
                        {
                          type: 'url',
                          message: t('invalidBrandLink'),
                        },
                      ]}
                    >
                      <Input autoComplete={'off'} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={t('description')}
                      name='description'
                      rules={[
                        {
                          required: true,
                          message: t('pleaseInsertDescription'),
                        },
                      ]}
                    >
                      <Input.TextArea autoComplete={'off'} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Form>
    </>
  );
};

export default CompanyAddEdit;
