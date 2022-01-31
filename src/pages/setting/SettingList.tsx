import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Upload,
  message,
  Form,
  Select,
  Input,
  Switch,
  Button,
  Modal,
  Popover,
  Spin,
  InputNumber,
} from 'antd';
import {
  FaInstagram,
  FaLinkedin,
  FaPlus,
  FaRegTimesCircle,
  FaTwitter,
  FaYoutube,
  FaTelegram,
} from 'react-icons/fa';
import { BASE_URL } from 'config/urls';
import Icon from '@ant-design/icons';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { ImageHelper } from 'utils/imageConvertion';
import { SETTING_API, UPLOAD_FILE, USERS_CRUD } from 'config/constantApi';
import UploadIcon from 'assets/img/UploadIcon';
import useHttpRequest from 'hooks/useHttpRequest';
import CustomIcon from 'uiKits/customIcon/Main';
import { IAvatar, SocialEnum } from './widget-type';
import { UtilsHelper } from 'utils/UtilsHelper';

const { Dragger } = Upload;
const { Option } = Select;

// const languages = [
//     { name: 'فارسی (ایران)', value: 'fa-IR' },
//     { name: 'English(United States)', value: 'en_US' },
//     { name: 'Arabic', value: 'ar-UA' },
// ];

const socialsAvatar: IAvatar[] = [
  { id: 1, name: SocialEnum.LINKED_IN, url: '', icon: FaInstagram },
  { id: 2, name: SocialEnum.INSTAGRAM, url: '', icon: FaLinkedin },
  { id: 3, name: SocialEnum.TWITTER, url: '', icon: FaTwitter },
  { id: 4, name: SocialEnum.YOUTUBE, url: '', icon: FaYoutube },
  { id: 5, name: SocialEnum.TELEGRAM, url: '', icon: FaTelegram },
];

let source: CancelTokenSource;

const SettingList = () => {
  source = axios.CancelToken.source();

  // tslint:disable
  const [form] = Form.useForm();
  const { postRequest, updateRequest, getRequest } = useHttpRequest();

  const { t } = useTranslation();

  const [uploadedImg, setImage] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [loadingPage, setLoadingPage] = useState<boolean>(false);

  const [social, setSocial] = useState<IAvatar[]>(socialsAvatar);
  const [addSocial, setAddSocial] = useState<IAvatar[]>([]);
  const [socialUrl, setSocialUrl] = useState('');

  const [users, setUsers] = useState<any>([]);
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState('');
  const [searchValue, setSearchValue] = useState<any>();
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const options =
    users.length > 0 &&
    users.map((_elm: any, index) => {
      return (
        <Option key={index} value={_elm.id}>
          {_elm.fullName}
        </Option>
      );
    });

  const handleSearch = (val) => {
    setSearchValue(val);
    if (!!val && val.length > 2) {
      setLoadingSearch(true);
      getRequest(`${USERS_CRUD}?search=${!!searchValue ? searchValue : ''}`)
        .then((resp) => {
          setUsers(resp.data.items);
          setLoadingSearch(false);
        })
        .catch((err) => {
          setLoadingSearch(false);
        });
    }
  };

  const getSettings = () => {
    setLoading(true);

    getRequest(SETTING_API, { cancelToken: source.token })
      .then((resp) => {
        setLoading(false);
        setUserName(resp.data.userName);
        setUsers([{ id: resp.data.userId, fullName: resp.data.userName }]);

        form.setFieldsValue(resp.data);

        setImage(resp.data.image);

        if (resp.data.socialMedia) {
          setAddSocial(JSON.parse(resp.data.socialMedia));
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSettings();

    return () => {
      source.cancel();
    };
  }, []);

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

  const handleAddSocial = (idSocial: number) => (event: React.MouseEvent) => {
    // [...prev.map((_x) => idSocial === _x.id ? ({ ..._x, url: socialUrl }) : ({ ..._x }))]

    if (addSocial.every((_f) => _f.id !== idSocial) || addSocial.length === 0) {
      setSocial((prev) => {
        const selected = prev
          .filter((_elm) => _elm.id === idSocial)
          .map((_x) =>
            idSocial === _x.id ? { ..._x, url: socialUrl } : { ..._x }
          );

        setAddSocial([...addSocial, ...selected]);

        setSocialUrl('');

        setOpenDialog(false);

        return [
          ...prev.map((_x) =>
            idSocial === _x.id ? { ..._x, url: socialUrl } : { ..._x }
          ),
        ];
      });
    }
  };

  const handleRmoveSocial =
    (idSocialRemove: number) => (event: React.MouseEvent) => {
      setAddSocial([...addSocial.filter((_elm) => _elm.id !== idSocialRemove)]);
    };

  const handleSubmit = (event) => {
    event.stopPropagation();

    form
      .validateFields()
      .then((values) => {
        const body = {
          ...values,
          userId: !!userId ? userId : values.userId,
          userName: userName,
          image: uploadedImg ? uploadedImg : null,
          socialMedia:
            addSocial && addSocial?.length > 0 ? JSON.stringify(addSocial) : '',
        };

        setLoading(true);

        updateRequest(SETTING_API, body)
          .then(() => {
            setLoading(false);
            debugger;
            message.success(t('settingSuccessUpdate'));
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
      <Modal
        title={t('addSocial')}
        visible={openDialog}
        onCancel={() => setOpenDialog(false)}
        key={'delete_slide_show'}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button onClick={() => setOpenDialog(false)}>{t('close')}</Button>
          </Row>,
        ]}
      >
        <div className={'social__modal__body'}>
          {social.map((_elm: IAvatar) => (
            <Popover
              key={_elm.id}
              title={t('addSocialAddress')}
              content={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Input
                    value={socialUrl}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSocialUrl(event.target.value)
                    }
                  />
                  <Button
                    type='primary'
                    style={{ width: '60px', marginRight: '16px' }}
                    onClick={handleAddSocial(_elm.id)}
                  >
                    {t('submit')}
                  </Button>
                </div>
              }
            >
              <Icon component={_elm.icon} className={'svg__social'} />
            </Popover>
          ))}
        </div>
      </Modal>

      <Form className={'w-100'} form={form} layout='vertical'>
        <Spin spinning={loadingPage}>
          <Row>
            <Col xs={24} sm={24} md={6} lg={6}>
              <p style={{ padding: '8px 0px' }}>{t('logo')}</p>
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
                        <CustomIcon className='display-3' svg={UploadIcon} />
                        <p>{t('selectPic')}</p>
                      </div>
                    )}
                  </div>
                )}
              </Dragger>
            </Col>
          </Row>

          <Row style={{ paddingTop: '100px' }}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={
                  'نام ادمین مدیر پیام ها: (طول نام وارد شده نباید کمتر از 2 باشد)'
                }
                name='userId'
                rules={[
                  {
                    required: true,
                    message: t('pleaseInsertName'),
                  },
                ]}
              >
                <Select
                  showSearch={true}
                  labelInValue={true}
                  placeholder={
                    !!userName ? userName : 'نام مورد نظر خود را واردکنید '
                  }
                  style={{ width: '100%' }}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onChange={(val: any) => {
                    setUserId(val.value);
                    setUserName(
                      users.find((item) => item.id === val.value).fullName
                    );
                  }}
                  onSearch={handleSearch}
                  notFoundContent={
                    loadingSearch ? <Spin size='small' /> : undefined
                  }
                >
                  {users.length > 0 &&
                    users.map((_elm: any, index) => {
                      return (
                        <Option key={index} value={_elm.id}>
                          {_elm.fullName}
                        </Option>
                      );
                    })}
                </Select>
                {!!searchValue && (
                  <p style={{ color: '#EA2125' }}>
                    {searchValue.length < 3
                      ? 'طول نام وارد شده نباید کمتر از 2 باشد'
                      : ''}
                  </p>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ paddingTop: '54px' }}>
            <Col xs={24} sm={24} md={6} lg={24}>
              <Form.Item label={t('title')} name='title'>
                <Input.TextArea maxLength={60} autoComplete={'off'} />
              </Form.Item>
              <p className={'caption'}>{t('captionTitle')}</p>
            </Col>
          </Row>

          <Row style={{ paddingTop: '24px' }}>
            <Col xs={24} sm={24} md={6} lg={24}>
              <Form.Item label={t('description')} name='description'>
                <Input.TextArea maxLength={160} autoComplete={'off'} />
              </Form.Item>
              <p className={'caption'}>{t('captionDesc')}</p>
            </Col>
          </Row>

          <Row style={{ paddingTop: '24px' }}>
            <Col xs={24} sm={24} md={6} lg={24}>
              <Form.Item label={t('copyRight')} name='copyRight'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ paddingTop: '24px' }}>
            <Col xs={24} sm={24} md={6} lg={24}>
              <Form.Item label={t('address')} name='address'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ paddingTop: '24px' }}>
            <Col xs={24} sm={24} md={6} lg={24}>
              <Form.Item label={t('terminalId')} name='terminalId'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ paddingTop: '24px' }} gutter={24}>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={t('phoneNumber')} name='phoneNumber'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={t('email')} name='email'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={t('eNamad')} name='eNamad'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>

            {/* <Col xs={24} sm={24} md={6} lg={6} >

                        <Form.Item
                            label={t('maxSlideShow')}
                            name='maxSlideShow'
                        >
                            <Input type={'number'} autoComplete={'off'} />
                        </Form.Item>
                    </Col> */}

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={t('googleAnalytic')} name='googleAnalytic'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={t('googleMaster')} name='googleMaster'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={t('longitude')} name='longitude'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={t('latitude')} name='latitude'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={t('postalCode')} name='postalCode'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item
                label={t('maxSizeUploadFile')}
                name='maxSizeUploadFile'
              >
                <Input type={'number'} autoComplete={'off'} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item label={'کد بانک'} name='merchantId'>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item
                label={t('defaultBaseOrderAmount')}
                name='defaultBaseOrderAmount'
              >
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  controls={true}
                  formatter={(value) => UtilsHelper.threeDigitSeparator(value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Form.Item
                label={t('maintenanceMode')}
                name='maintenanceMode'
                valuePropName={'checked'}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item label={t('socialSetting')}>
                <div className={'social__container'}>
                  <div className={'social__modal__body'}>
                    {!!addSocial &&
                      addSocial?.length > 0 &&
                      addSocial.map((_elm: IAvatar, index) => (
                        <div className={'avatar__container'} key={index}>
                          <Icon
                            component={
                              _elm.id === 1
                                ? FaInstagram
                                : _elm.id === 2
                                ? FaLinkedin
                                : _elm.id === 3
                                ? FaTwitter
                                : FaYoutube
                            }
                            className={'svg__social'}
                          />
                          <FaRegTimesCircle
                            className={'social__remove'}
                            onClick={handleRmoveSocial(_elm.id)}
                          />
                        </div>
                      ))}
                  </div>

                  <Button
                    shape='circle'
                    className={'d-flex align-center justify-center'}
                    icon={<FaPlus />}
                    onClick={() => setOpenDialog(true)}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Button
            type='primary'
            htmlType='submit'
            style={{ width: '120px', minWidth: '120px' }}
            onClick={
              loading
                ? () => {
                    return;
                  }
                : handleSubmit
            }
            loading={loading}
            className={'btn__shadow'}
          >
            {t('updateSetting')}
          </Button>
        </Spin>
      </Form>
    </>
  );
};

export default SettingList;
