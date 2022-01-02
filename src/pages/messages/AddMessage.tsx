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
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdArrowBack } from 'react-icons/md';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { ImageHelper } from 'utils/imageConvertion';
import { COMPANY_URL, MESSAGES } from 'config/constantUrl';
import { COMPANY_API, CUSTOMERS_CRUD, MESSAGE_API } from 'config/constantApi';
import { MdDelete } from 'react-icons/md';
import useHttpRequest from 'hooks/useHttpRequest';
import useUploadFileApi from 'hooks/useUploadFileApi';
import useQuery from 'hooks/useQuery';
import { BASE_URL } from 'config/urls';
import CustomIcon from 'uiKits/customIcon/Main';
import UploadIcon from 'assets/img/UploadIcon';

const { Dragger } = Upload;
const { Option } = Select;

const AddMessage = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const { getRequest, postRequest, updateRequest } = useHttpRequest();
  const { id } = useParams();
  const [form] = Form.useForm();

  const [loadingById, setLoadingById] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState([]);
  const [searchValue, setSearchValue] = useState<any>();

  const handleSearch = (val) => {
    setSearchValue(val);
    form.setFieldsValue({ customerId: val });
    if (!!val && val.length > 2) {
      setLoadingSearch(true);
      getRequest(`${CUSTOMERS_CRUD}?search=${!!searchValue ? searchValue : ''}`)
        .then((resp) => {
          setCustomers(resp.data.items);
          setLoadingSearch(false);
        })
        .catch((err) => {
          setLoadingSearch(false);
        });
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const body = {
          customerId: customerId,
          title: values.title,
          content: values.content,
          file: '',
        };
        setLoading(true);

        postRequest(MESSAGE_API, body)
          .then(() => {
            setLoading(false);

            history.push(MESSAGES);

            message.success(t('Success'));
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
                style={{ width: '80px', minWidth: '80px' }}
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
                {t('add')}
              </Button>

              <Button
                icon={<MdArrowBack />}
                type={'primary'}
                ghost={true}
                className={'btn__back'}
                onClick={() => history.push(MESSAGES)}
              />
            </div>

            <h2>{t('addMessage')}</h2>
          </div>
        </Card>

        <Spin spinning={loadingById}>
          <Card bodyStyle={{ padding: '24px' }} bordered={false}>
            <Col xs={24} sm={24} md={19}>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={
                      'نام مشتری : (طول نام وارد شده نباید کمتر از 2 باشد)'
                    }
                    name='customerId'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertcustomerId'),
                      },
                    ]}
                  >
                    <Select
                      showSearch={true}
                      labelInValue={true}
                      placeholder={'نام مورد نظر خود را واردکنید '}
                      style={{ width: '100%' }}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onChange={(val: any) => {
                        setCustomerId(val.value);
                      }}
                      onSearch={handleSearch}
                      notFoundContent={
                        loadingSearch ? <Spin size='small' /> : undefined
                      }
                    >
                      {!!customers &&
                        customers.map((_elm: any, index) => {
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
                <Col xs={24} sm={24} md={24}>
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

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('content')}
                    name='content'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertcontent'),
                      },
                    ]}
                  >
                    <Input.TextArea autoComplete={'off'} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Card>
        </Spin>
      </Form>
    </>
  );
};

export default AddMessage;
