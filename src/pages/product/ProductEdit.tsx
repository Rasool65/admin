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
import { PlusOutlined } from '@ant-design/icons';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { ImageHelper } from 'utils/imageConvertion';
import { PRODUCT_URL } from 'config/constantUrl';
import { BASE_URL } from 'config/urls';
import {
  PRODUCT_CATEGORY_API,
  PRODUCT_API,
  UPLOAD_FILE,
} from 'config/constantApi';
import { ProductModel } from './widget-type';
import CustomIcon from 'uiKits/customIcon/Main';
import TodoList from 'uiKits/todoList/TodoList';
import UploadIcon from 'assets/img/UploadIcon';
import useHttpRequest from 'hooks/useHttpRequest';
import useUploadFileApi from 'hooks/useUploadFileApi';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/fa.js';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';

import './style.scss';

const { Dragger } = Upload;
const { Option } = Select;

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

// ClassicEditor
//     .create(document.querySelector('#editor'), {
//         plugins: [HtmlEmbed, HorizontalLine],
//         toolbar: ['HtmlEmbed', 'HorizontalLine']
//     })
//     .then(editor => {
//         console.log('Editor was initialized', editor);
//     })
//     .catch(error => {
//         console.error(error.stack);
//     });

const ProductEdit = () => {
  const { t } = useTranslation();

  const editorConfiguration = {
    language: 'fa',
    extraPlugins: [uploadPlugin],
    // plugins: [HtmlEmbed, HorizontalLine],
    // toolbar: ['HtmlEmbed', 'HorizontalLine']
  };

  // tslint:disable
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { updateRequest, getRequest, postRequest } = useHttpRequest();
  const { uploadFile, uploadValue } = useUploadFileApi();

  const [uploadedImg, setImage] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [imgMultiUrl, setImageMultiUrl] = useState<any[]>([]);

  const [productByIdValue, setProductByIdValue] = useState<ProductModel>({});
  const [loadingById, setLoadingById] = useState<boolean>(false);

  const [longdescription, setLongdiscription] = useState('');

  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [productMedia, setProductMedia] = useState<any>([]);

  const [searchValue, setSearchValue] = useState<string>('');
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const getCategories = () => {
    getRequest(`${PRODUCT_CATEGORY_API}?limit=100`)
      .then((resp) => {
        setCategories(resp.data.items);
      })
      .catch(() => {
        return;
      });
  };
  useEffect(() => {
    if (!!id) {
      setLoadingById(true);

      getRequest(`${PRODUCT_API}/${id}`)
        .then((resp) => {
          form.setFieldsValue({
            name: resp.data.name,
            description: resp.data.description,
            longDescription: resp.data.longDescription,
            productCategoryId: resp.data.productCategoryId,
            materialId: resp.data.materialId,
            materialType: resp.data.materialType,
            lang: resp.data.lang,
            isSpecial: resp.data.isSpecial ? 1 : 0,
            image: resp.data.image,
            unit: resp.data.unit,
            tag: resp.data.tag,
            galleries: resp.data.galleries,
            division: resp.data.division,
          });
          setProductMedia(resp.data.productMedias);
          setLongdiscription(resp.data.longDescription);
          setImageMultiUrl(resp.data.galleries);
          setLoadingById(false);
          setProductByIdValue(resp.data);
        })
        .catch(() => {
          setLoadingById(false);
        });

      getCategories();
    }
  }, [id]);

  const addProductMedia = (item) => {
    const medias = !!productMedia
      ? [
          ...productMedia,
          {
            icon: item.icon,
            description: item.description,
          },
        ]
      : [{ icon: item.icon, description: item.description }];

    setProductMedia(medias);
  };

  const deleteProductMedia = (item) => {
    const medias = [...productMedia];
    setProductMedia(
      medias.filter(
        (_item) =>
          _item.icon !== item.icon || _item.description !== item.description
      )
    );
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

  const multiImageUploadProps: {
    name: string;
    multiple: boolean;
    listType: any;
    showUploadList: boolean;
    accept: string;
    customRequest: any;
  } = {
    name: 'file',
    multiple: true,
    accept: 'image/png, image/jpeg',
    listType: 'text',
    showUploadList: true,
    customRequest: ({ onSuccess, onError, file }) => {
      const formData = new FormData() as any;

      formData.append('Files', file);
      formData.append('type', 'image');
      setLoadingById(true);
      postRequest(UPLOAD_FILE, formData)
        .then((resp) => {
          onSuccess('Ok');

          if (imgMultiUrl === undefined) {
            setImageMultiUrl([resp.data.url]);
          } else {
            setImageMultiUrl([...imgMultiUrl, resp.data.url]);
          }
          setLoadingById(false);
        })
        .catch((err) => {
          onError({ err });
          setLoadingById(false);
        });
    },
  };

  const handleDeleteGallary = (item: any) => (event: React.MouseEvent) => {
    if (item !== undefined) {
      setImageMultiUrl([...imgMultiUrl.filter((_x, index) => index !== item)]);
    }
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
    setProductByIdValue({});
    setImage('');
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append('files', file);
            postRequest(`${UPLOAD_FILE}`, body)
              .then((res) => {
                resolve({
                  default: `${BASE_URL}${res.data.url}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }
  const handleSearch = (val) => {
    setSearchValue(val);
    if (!val) {
      getCategories();
    }
    if (!!val && val.length > 2) {
      setLoadingSearch(true);
      getRequest(
        `${PRODUCT_CATEGORY_API}?search=${!!searchValue ? searchValue : ''}`
      )
        .then((resp) => {
          setCategories(resp.data.items);
          setLoadingSearch(false);
        })
        .catch((err) => {
          setLoadingSearch(false);
        });
    }
  };
  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const body = {
          name: values.name,
          description: values.description,
          longDescription: longdescription,
          productCategoryId: values.productCategoryId,
          unit: values.unit,
          tag: values.tag,
          isSpecial: values.isSpecial === 1 ? true : false,
          materialType: values.materialType,
          galleries: imgMultiUrl,
          updateProductMedia: productMedia,
        };

        if (uploadedImg) {
          body['image'] = uploadValue.url;
        } else {
          body['image'] = productByIdValue?.image
            ? productByIdValue?.image
            : '';
        }

        body['id'] = id;
        setLoading(true);

        updateRequest(PRODUCT_API, body)
          .then(() => {
            setLoading(false);

            history.push(PRODUCT_URL);

            message.success(t('EditSuccessProduct'));
          })
          .catch(() => {
            setLoading(false);
          });
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
                {t('edit')}
              </Button>

              <Button
                icon={<MdArrowBack />}
                type={'primary'}
                ghost={true}
                className={'btn__back'}
                onClick={() => history.push(`${PRODUCT_URL}${location.search}`)}
              />
            </div>

            <h2>{t('editProduct')}</h2>
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
                  name='image'
                  rules={[
                    {
                      required: !id,
                      message: t('uploadPicNecessary'),
                    },
                  ]}
                >
                  <Dragger
                    style={{ width: '100%' }}
                    {...imageUploadProps}
                    beforeUpload={beforeUpload}
                    onChange={handleUploadChange}
                  >
                    {uploadedImg || productByIdValue?.image ? (
                      <img
                        src={
                          uploadedImg
                            ? uploadedImg
                            : `${BASE_URL}${productByIdValue.image}`
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
                  {uploadedImg || productByIdValue?.image ? (
                    <div className='deleteImage'>
                      <MdDelete onClick={handleDeleteImage} />
                    </div>
                  ) : (
                    ''
                  )}
                </Form.Item>
              </Col>

              <Row gutter={24} style={{ paddingTop: '24px' }}>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={
                      t('category') +
                      ' (طول دسته بندی وارد شده نباید کمتر از 2 باشد)'
                    }
                    name='productCategoryId'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertCategory'),
                      },
                    ]}
                  >
                    <Select
                      showSearch={true}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={handleSearch}
                      notFoundContent={
                        loadingSearch ? <Spin size='small' /> : undefined
                      }
                      placeholder={t('category')}
                    >
                      {categories.length > 0 &&
                        categories.map((_elm: { name: string; id: number }) => (
                          <Option key={_elm.id} value={_elm.id}>
                            {_elm.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>

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
                    label={t('unit')}
                    name='unit'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertUnit'),
                      },
                    ]}
                  >
                    <Input disabled={true} autoComplete={'off'} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item label={t('tag')} name='tag'>
                    <Select loading={false} mode={'tags'} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
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

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('longDescription')}
                    name='longDescription'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertLongDescription'),
                      },
                    ]}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={longdescription ? longdescription : ''}
                      config={editorConfiguration}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setLongdiscription(data);
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('materialId')}
                    name='materialId'
                    style={{ width: '100%' }}
                  >
                    <Input autoComplete={'off'} disabled={true} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={'division'}
                    name='division'
                    style={{ width: '100%' }}
                  >
                    <Input autoComplete={'off'} disabled={true} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('materialType')}
                    name='materialType'
                    style={{ width: '100%' }}
                  >
                    <Input autoComplete={'off'} disabled={false} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('isSpecial')}
                    name='isSpecial'
                    style={{ width: '100%' }}
                  >
                    <Select placeholder={t('isSpecial')} loading={false}>
                      <Option value={1}>بله</Option>
                      <Option value={0}>خیر</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('updateProductMedia')}
                    style={{ flexDirection: 'column' }}
                    className={'upload__gallery__form'}
                  >
                    <TodoList
                      data={productMedia}
                      handleChange={addProductMedia}
                      deleteItem={deleteProductMedia}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('addGallery')}
                    style={{ flexDirection: 'column' }}
                    className={'upload__gallery__form'}
                  >
                    {imgMultiUrl !== undefined
                      ? imgMultiUrl.length > 0 &&
                        imgMultiUrl.map((_elm, index) => (
                          <div
                            className={'img__container'}
                            key={index.toString()}
                          >
                            <img
                              src={`${BASE_URL}${_elm}`}
                              alt='avatar'
                              style={{
                                width: '106px',
                                height: '106px',
                                borderRadius: '4px',
                                display: 'inline-block',
                              }}
                            />
                            <MdDelete onClick={handleDeleteGallary(index)} />
                          </div>
                        ))
                      : ''}
                    <Upload
                      style={{ marginRight: '20px' }}
                      {...multiImageUploadProps}
                      listType='picture-card'
                      accept='image/png, image/jpeg'
                      showUploadList={false}
                      fileList={imgMultiUrl}
                    >
                      {uploadButton}
                    </Upload>
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

export default ProductEdit;
