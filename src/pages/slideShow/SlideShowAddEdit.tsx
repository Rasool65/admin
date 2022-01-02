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
  Switch,
} from 'antd';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { useHistory, useParams } from 'react-router-dom';
import { MdArrowBack, MdDirections } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { DateHelper } from 'utils/dateHelper';
import CustomCalender from 'uiKits/calender/Calender';

import { ImageHelper } from 'utils/imageConvertion';
import { SLIDE_SHOW } from 'config/constantUrl';
import { BASE_URL } from 'config/urls';
import { SLIDE_SHOW_CRUD } from 'config/constantApi';
import { SlideShowListModel } from './widget-type';
import CustomIcon from 'uiKits/customIcon/Main';
import UploadIcon from 'assets/img/UploadIcon';
import useHttpRequest from 'hooks/useHttpRequest';
import useUploadFileApi from 'hooks/useUploadFileApi';
import useQuery from 'hooks/useQuery';
import {
  OptionData,
  OptionGroupData,
  OptionsType,
} from 'rc-select/lib/interface';

const { Dragger } = Upload;
const { Option } = Select;

const SlideShowAddEdit = () => {
  const { t } = useTranslation();

  const status = [
    { name: t('active'), value: 1 },
    { name: t('deActive'), value: 2 },
  ];

  const urlTargets = [
    { name: t('urlTargetNone'), value: 'none' },
    { name: t('urlTargetBlank'), value: '_blank' },
    { name: t('urlTargetSelf'), value: '_self' },
  ];

  // tslint:disable
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();
  const { postRequest, updateRequest, getRequest } = useHttpRequest();
  const { uploadFile, uploadValue } = useUploadFileApi();
  const query = useQuery();

  const [uploadedImg, setImage] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [slideByIdValue, setSlideByIdValue] = useState<SlideShowListModel>({});
  const [loadingById, setLoadingById] = useState<boolean>(false);

  const [urlEnable, setUrlEnable] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!!id) {
      setLoadingById(true);

      getRequest(`${SLIDE_SHOW_CRUD}/${id}`)
        .then((resp) => {
          form.setFieldsValue({
            name: resp.data.name,
            title: resp.data.title,
            description: resp.data.description,
            sortOrder: resp.data.sortOrder,
            isVisible: resp.data.isVisible ? 1 : 2,
            image: resp.data.image,
            url: resp.data.url,
            urlTarget: resp.data.urlTarget,
          });

          setLoadingById(false);
          setSlideByIdValue(resp.data);
          console.log(resp.data.urlTarget);
          if (resp.data.urlTarget !== urlTargets[0].value) setUrlEnable(true);
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

  const handleUrlTargetChange = (
    value: string,
    option: OptionsType | OptionData | OptionGroupData
  ) => {
    if (value === urlTargets[0].value) {
      form.setFieldsValue({
        url: '',
      });
      setUrlEnable(false);
    } else setUrlEnable(true);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const body = {
          name: values.name,
          title: values.title,
          description: values.description,
          startDateTime: startDate.length
            ? DateHelper.persianToIsoDate(startDate)
            : slideByIdValue?.startDateTime
            ? slideByIdValue?.startDateTime
            : null,
          endDateTime: endDate.length
            ? DateHelper.persianToIsoDate(endDate)
            : slideByIdValue?.endDateTime
            ? slideByIdValue?.endDateTime
            : null,
          isVisible: values.isVisible === 1 ? true : false,
          sortOrder: values.sortOrder,
          image: !!uploadValue
            ? uploadValue.url
            : slideByIdValue?.image
            ? slideByIdValue?.image
            : '',
          url: values.url,
          urlTarget: values.urlTarget,
        };

        if (!id) {
          setLoading(true);

          postRequest(SLIDE_SHOW_CRUD, body)
            .then(() => {
              setLoading(false);

              history.push(SLIDE_SHOW);

              message.success(t('addNewSuccessSlide'));
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          body['id'] = id;

          setLoading(true);

          updateRequest(SLIDE_SHOW_CRUD, body)
            .then(() => {
              setLoading(false);

              history.push(SLIDE_SHOW);

              message.success(t('EditSuccessSlide'));
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
                onClick={() => history.push(SLIDE_SHOW)}
              />
            </div>

            <h2>{!id ? t('addNewSlide') : t('EditSlide')}</h2>
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
                    {uploadedImg || slideByIdValue?.image ? (
                      <img
                        src={
                          uploadedImg
                            ? uploadedImg
                            : `${BASE_URL}${slideByIdValue.image}`
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
                      label={t('title')}
                      name='title'
                      rules={[
                        {
                          required: true,
                          message: t('pleaseInsertTitle'),
                        },
                      ]}
                    >
                      <Input autoComplete={'off'} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item label={t('startDateTime')} name='startDateTime'>
                      <CustomCalender
                        placeholder={t('selectDate')}
                        EditDate={DateHelper.isoDateTopersian(
                          slideByIdValue.startDateTime
                        )}
                        onDate={(value) => setStartDate(value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item label={t('endDateTime')} name='endDateTime'>
                      <CustomCalender
                        placeholder={t('selectDate')}
                        EditDate={DateHelper.isoDateTopersian(
                          slideByIdValue.endDateTime
                        )}
                        onDate={(value) => setEndDate(value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={t('isVisible')}
                      name='isVisible'
                      rules={[
                        {
                          required: true,
                          message: t('pleaseInsertVisibile'),
                        },
                      ]}
                    >
                      <Select placeholder={t('status')} loading={false}>
                        {status.map((_elm: { name: string; value: number }) => (
                          <Option key={_elm.name} value={_elm.value}>
                            {_elm.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={t('sortOrder')}
                      name='sortOrder'
                      rules={[
                        {
                          required: true,
                          message: t('pleaseInsertOrder'),
                        },
                      ]}
                    >
                      <Input type='number' autoComplete={'off'} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item label={t('urlTarget')} name='urlTarget'>
                      <Select
                        onChange={(value, event) =>
                          handleUrlTargetChange(value, event)
                        }
                        defaultValue={urlTargets[0].value}
                        placeholder={t('urlTarget')}
                        loading={false}
                      >
                        {urlTargets.map(
                          (_elm: { name: string; value: string }) => (
                            <Option key={_elm.name} value={_elm.value}>
                              {_elm.name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={t('url')}
                      name='url'
                      rules={[
                        {
                          type: 'url',
                          message: t('urlMustBeValid'),
                        },
                      ]}
                    >
                      <Input disabled={!urlEnable} autoComplete={'off'} />
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

export default SlideShowAddEdit;
