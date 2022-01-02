import React, { useState, useEffect } from 'react';
import { FilterOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip, Modal, Row, Form, Col, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { IToolbar } from 'pages/widget-type';
import useQuery from 'hooks/useQuery';
import { useHistory, useLocation } from 'react-router-dom';
import { DateHelper } from 'utils/dateHelper';
import CustomCalender from 'uiKits/calender/Calender';
import useFileDownload from 'hooks/useFileDownload';
import { ORDER_API } from 'config/constantApi';
import * as baseUrl from 'config/urls';

const { Option } = Select;
const { Search } = Input;

const OrderToolbar: React.FC<IToolbar> = ({ onSearch }) => {
  const orderStatuses = [
    { OrderStatus: 1, name: 'لغو شده' },
    { OrderStatus: 2, name: 'در انتظار تایید' },
    { OrderStatus: 3, name: 'تایید شده' },
    { OrderStatus: 4, name: 'در حال ارسال' },
    { OrderStatus: 5, name: 'تحویل داده شده' },
    { OrderStatus: 6, name: 'در سبد خرید' },
    { OrderStatus: 7, name: 'آماده پرداخت' },
  ];

  const { downloadFile } = useFileDownload();

  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const query = useQuery();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (query!.get('fromDate')) {
      form.setFieldsValue({
        from: query.get('fromDate') as string,
      });
    }

    if (query!.get('toDate')) {
      form.setFieldsValue({
        to: query.get('toDate') as string,
      });
    }

    if (query!.get('OrderStatus')) {
      form.setFieldsValue({
        DiscountType: query.get('OrderStatus') as string,
      });
    }
    if (query!.get('search')) {
      setValue(query.get('search') as string);
    }
  }, []);

  const handleFromDate = (fromDate: string) => {
    if (!fromDate.length) {
      form.setFieldsValue({
        from: '',
      });
    } else {
      form.setFieldsValue({
        from: DateHelper.persianToIsoDate(fromDate),
      });
    }
  };

  const handleToDate = (toDate: string) => {
    if (!toDate.length) {
      form.setFieldsValue({
        to: '',
      });
    } else {
      form.setFieldsValue({
        to: DateHelper.persianToIsoDate(toDate),
      });
    }
  };

  const handleRemoveFilters = () => {
    history.replace(
      `${location.pathname}?query=${
        query!.get('query') ? query!.get('query') : ''
      }&OrderStatus=&fromDate=&toDate=`
    );
    form.resetFields();

    setOpenModal(false);
  };

  const handleApplyFilter = () => {
    form
      .validateFields()
      .then((values) => {
        history.replace(
          `${location.pathname}?search=${
            query!.get('search') ? query!.get('search') : ''
          }&OrderStatus=${
            values.OrderStatus !== undefined ? values.OrderStatus : ''
          }&fromDate=${values.from ? values.from : ''}&toDate=${
            values.to ? values.to : ''
          }`
        );

        setOpenModal(false);
      })
      .catch((info) => {
        return;
      });
  };

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
      `${ORDER_API}/excelreport`,
      `search=${query.get('search') ? query.get('search') : ''}&OrderStatus=${
        query.get('OrderStatus') ? query.get('OrderStatus') : ''
      }&fromDate=${query.get('fromDate') ? query.get('fromDate') : ''}&toDate=${
        query.get('toDate') ? query.get('toDate') : ''
      }`
    );
  };

  return (
    <>
      <Modal
        title={'فیلتر'}
        visible={openModal}
        onOk={handleApplyFilter}
        onCancel={() => setOpenModal(false)}
        key={'modal_create'}
        width={450}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button type={'primary'} onClick={handleApplyFilter}>
              اعمال
            </Button>

            <Button onClick={handleRemoveFilters}>حذف فیلتر</Button>
          </Row>,
        ]}
      >
        <Form className={'w-100'} form={form} layout='vertical'>
          <Row>
            <Col xs={24} sm={24} md={24}>
              <Form.Item label={'از تاریخ'} name='from'>
                <CustomCalender
                  placeholder={'انتخاب تاریخ'}
                  EditDate={query.get('from') ? query.get('from') : ''}
                  onDate={handleFromDate}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item label={'تا تاریخ'} name='to'>
                <CustomCalender
                  placeholder={'انتخاب تاریخ'}
                  EditDate={query.get('to') ? query.get('to') : ''}
                  onDate={handleToDate}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item label={t('status')} name='OrderStatus'>
                <Select placeholder={t('status')} loading={false}>
                  {orderStatuses.map(
                    (_elm: { OrderStatus: number; name: string }) => (
                      <Option key={_elm.OrderStatus} value={_elm.OrderStatus}>
                        {_elm.name}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <div className={'toolbar__Wrapper'}>
        <div className={'d-flex row-reverse-flex'}>
          <Search
            placeholder={t('search')}
            onSearch={() => handleSearch(value)}
            onChange={(event) => setValue(event.target.value)}
            value={value}
            style={{ width: 200 }}
          />
        </div>
        <div className={'d-flex'} style={{ width: '8%', gap: '10px' }}>
          <Tooltip title={'فیلتر'}>
            <FilterOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => setOpenModal(true)}
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

export default OrderToolbar;
