import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spin,
  message,
  Upload,
  Input,
  Select,
} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { MdDelete } from 'react-icons/md';
import { PRODUCT_CATEGORY_URL } from 'config/constantUrl';
import { PRODUCT_CATEGORY_API, UPLOAD_FILE } from 'config/constantApi';
import { BASE_URL } from 'config/urls';
import useHttpRequest from 'hooks/useHttpRequest';
import CustomIcon from 'uiKits/customIcon/Main';
import UploadIcon from 'assets/img/UploadIcon';

import './style.scss';
import Text from 'antd/lib/typography/Text';

const { Dragger } = Upload;
const { Option } = Select;

const ProductCategoryEdit = () => {
  // tslint:disable

  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();
  const { postRequest, updateRequest, getRequest } = useHttpRequest();
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingById, setLoadingById] = useState<boolean>(false);

  const [uploadedImg, setImage] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [parentId, setParentId] = useState<number | undefined>(undefined);

  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    if (id) {
      setLoadingById(true);

      getRequest(`${PRODUCT_CATEGORY_API}/${id}`)
        .then((resp) => {
          form.setFieldsValue(resp.data);

          setImage(resp.data.image);

          if (resp.data.parentId) {
            setParentId(resp.data.parentId);
          }

          setLoadingById(false);
        })
        .catch((err) => {
          setLoadingById(false);
        });

      getRequest(`${PRODUCT_CATEGORY_API}?limit=100`)
        .then((resp) => {
          setCategories(resp.data.items);
        })
        .catch(() => {
          return;
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
      setLoadingById(true);
      postRequest(UPLOAD_FILE, formData)
        .then((resp) => {
          setImage(resp.data.url);
          onSuccess('OK');
          setLoadingById(false);
        })
        .catch((err) => {
          onError(err);
          setLoadingById(false);
        });
    },
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (id) {
          const body = {
            ...values,
            image: uploadedImg ? uploadedImg : null,
          };

          if (parentId) {
            body['parentId'] = parentId;
          }
          body['id'] = id;

          setLoading(true);

          updateRequest(PRODUCT_CATEGORY_API, body)
            .then(() => {
              setLoading(false);

              history.push(PRODUCT_CATEGORY_URL);

              message.success(t('editSuccessCategory'));
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

  const handleDeleteImage = () => {
    setImage('');
  };

  return (
    <>
      <Form
        className={'w-100'}
        form={form}
        layout='vertical'
        autoComplete='off'
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
                {t('edit')}
              </Button>

              <Button
                icon={<MdArrowBack />}
                type={'primary'}
                ghost={true}
                className={'btn__back'}
                onClick={() => history.push(PRODUCT_CATEGORY_URL)}
              />
            </div>

            <h2>{t('editCategory')}</h2>
          </div>
        </Card>

        <Spin spinning={loadingById}>
          <Card bodyStyle={{ padding: '24px', paddingBottom: '45px' }}>
            <Row>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Dragger
                  style={{ width: '100%' }}
                  {...imageUploadProps}
                  beforeUpload={beforeUpload}
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
                          <CustomIcon className='display-3' svg={UploadIcon} />
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
              </Col>
            </Row>

            <Row style={{ paddingTop: '24px' }}>
              <Col xs={24} sm={24} md={6} lg={24}>
                <Form.Item
                  label={t('title')}
                  name='name'
                  rules={[
                    {
                      required: true,
                      message: t('pleaseInsertTitle'),
                      type: 'string',
                    },
                  ]}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row style={{ paddingTop: '24px' }}>
              <Col xs={24} sm={24} md={6} lg={24}>
                <Form.Item
                  label={t('category')}
                  name='parentId'
                  rules={[
                    {
                      required: false,
                      message: t('pleaseInsertParentId'),
                    },
                  ]}
                >
                  <Select
                    placeholder={t('category')}
                    loading={false}
                    onChange={(val: any) => {
                      setParentId(val);
                    }}
                  >
                    {categories !== undefined
                      ? categories.map((_elm: { name: string; id: number }) => (
                          <Option key={_elm.id} value={_elm.id}>
                            {_elm.name}
                          </Option>
                        ))
                      : ''}
                  </Select>
                </Form.Item>
              </Col>
            </Row> */}

            <Row style={{ paddingTop: '24px' }}>
              <Col xs={24} sm={24} md={6} lg={24}>
                <Form.Item
                  label={t('slug')}
                  name='slug'
                  rules={[
                    {
                      required: true,
                      message: t('pleaseInsertSlug'),
                      type: 'string',
                    },
                  ]}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ paddingTop: '24px' }}>
              <Col xs={24} sm={24} md={6} lg={24}>
                <Form.Item label={t('description')} name='description'>
                  <Input autoComplete={'off'} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Form>
    </>
  );
};

export default ProductCategoryEdit;
