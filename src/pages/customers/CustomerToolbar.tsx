import React, { useState, useEffect } from 'react';
import {
  FileExcelOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import {
  Input,
  Tooltip,
  Button,
  Row,
  Form,
  Col,
  message,
  Modal,
  Radio,
  Space,
  Divider,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { IToolbar } from 'pages/widget-type';
import useQuery from 'hooks/useQuery';
import { useHistory, useLocation } from 'react-router-dom';
import { CUSTOMERS_CRUD } from 'config/constantApi';
import useFileDownload from 'hooks/useFileDownload';
import * as baseUrl from 'config/urls';
import useHttpRequest from 'hooks/useHttpRequest';
import { map } from 'highcharts';

const { Search } = Input;

const CustomerToolbar: React.FC<IToolbar> = ({ onSearch }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const query = useQuery();
  const [value, setValue] = useState<string>('');
  const [SortValue, setSortValue] = useState<string>('');
  const [DescValue, setDescValue] = useState<string>('');
  const { downloadFile } = useFileDownload();
  const { postRequest } = useHttpRequest();
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [SortModal, setSortModal] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<number>();

  const SortType = [
    { id: 1, name: 'fullName' },
    { id: 2, name: 'cityCode' },
    { id: 3, name: 'solicoCustomerId' },
  ];

  useEffect(() => {
    if (query!.get('search')) {
      setValue(query.get('search') as string);
    }

    if (query!.get('Sort')) {
      setSortValue(query.get('Sort') as string);
    }

    if (query!.get('Desc')) {
      setDescValue(query.get('Desc') as string);
    }
  }, []);

  const handleSearch = (searchValue) => {
    history.replace(
      `${location.pathname}?search=${searchValue ? searchValue : ''}${
        location.search.split('&').length > 1
          ? `&${location.search.split('&').slice(1).join('&')}`
          : ''
      }`
    );
  };

  const handleDownloadExcel = () => {
    downloadFile(
      baseUrl.BASE_URL,
      `${CUSTOMERS_CRUD}/excelreport`,
      `search=${query.get('search') ? query.get('search') : ''}`
    );
  };

  const addCustomer = () => {
    form
      .validateFields()
      .then((values) => {
        postRequest(`${CUSTOMERS_CRUD}`, values)
          .then((resp) => {
            setOpenAddModal(false);
            message.success(t('Success'));
          })
          .catch(() => {
            return;
          });
      })
      .catch((info) => {
        return;
      });
  };

  const handleRemoveSort = () => {
    history.replace(
      `${location.pathname}?query=${
        query!.get('query') ? query!.get('query') : ''
      }&Sort=&Desc=`
    );
    form.resetFields();

    setSortModal(false);
  };

  const handleApplySort = () => {
    form
      .validateFields()
      .then((values) => {
        history.replace(
          `${location.pathname}?Sort=${SortValue ? SortValue : ''}&Desc=${
            DescValue === 'Desc' || DescValue === '' ? true : false
          }`
        );

        setSortModal(false);
      })
      .catch((info) => {
        return;
      });
  };

  const onChangeSort = (e) => {
    setSortValue(e.target.value);
  };

  const onChangeDesc = (e) => {
    setDescValue(e.target.value);
  };

  return (
    <>
      <Modal
        title={t('addCustomer')}
        visible={openAddModal}
        onOk={addCustomer}
        onCancel={() => setOpenAddModal(false)}
        key={'modal_history'}
        width={450}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button type={'primary'} onClick={addCustomer}>
              اعمال
            </Button>

            <Button
              onClick={() => {
                setOpenAddModal(false);
              }}
            >
              انصراف
            </Button>
          </Row>,
        ]}
      >
        <Form className={'w-100'} form={form} layout='vertical'>
          <Row>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={t('solicoCustomerId')}
                name='solicoCustomerId'
                rules={[
                  {
                    required: true,
                    message: t('pleaseInsertId'),
                    type: 'string',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title={'مرتب سازی'}
        visible={SortModal}
        onOk={handleApplySort}
        onCancel={() => setSortModal(false)}
        key={'modal_create'}
        width={450}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button type={'primary'} onClick={handleApplySort}>
              اعمال
            </Button>

            <Button onClick={handleRemoveSort}>حذف فیلتر</Button>
          </Row>,
        ]}
      >
        <Form className={'w-100'} form={form} layout='vertical'>
          <Row>
            <Col xs={24} sm={24} md={24}>
              <Form.Item label={''} name='Sort'>
                <Radio.Group onChange={onChangeSort} value={SortValue}>
                  <Space direction='vertical'>
                    {SortType.map((item, index) => {
                      return (
                        <Radio key={index} value={item.name}>
                          {t(item.name)}
                        </Radio>
                      );
                    })}
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Divider />
            <Col xs={24} sm={24} md={24}>
              <Form.Item label={''} name='Desc'>
                <Radio.Group onChange={onChangeDesc} value={DescValue}>
                  <Space direction='vertical'>
                    <Radio value={'asc'}>{t('asc')}</Radio>
                    <Radio value={'Desc'}>{t('Desc')}</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <div className={'toolbar__Wrapper'}>
        <div className={'d-flex row-reverse-flex'}>
          <Button
            className={'d-flex align-items-center btn_create'}
            onClick={() => {
              setOpenAddModal(true);
            }}
            type='primary'
            icon={<PlusOutlined />}
          >
            {t('addCustomer')}
          </Button>

          <Search
            placeholder={t('search')}
            onSearch={() => handleSearch(value)}
            onChange={(event) => setValue(event.target.value)}
            value={value}
            style={{ width: 200 }}
          />
        </div>
        <div className={'d-flex'} style={{ width: '8%', gap: '10px' }}>
          <Tooltip title={'مرتب سازی'}>
            <SortAscendingOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => setSortModal(true)}
            />
          </Tooltip>
          <Tooltip title={'خروجی اکسل'}>
            <FileExcelOutlined
              style={{ cursor: 'pointer' }}
              onClick={handleDownloadExcel}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default CustomerToolbar;
