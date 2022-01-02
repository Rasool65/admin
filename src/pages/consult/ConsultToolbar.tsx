import React, { useState, useEffect } from 'react';
import {
  FilterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { Button, Input, Tooltip, Modal, Row, Form, Col, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomCalender from 'uiKits/calender/Calender';
import { IToolbar } from 'pages/widget-type';
import useQuery from 'hooks/useQuery';
import { useHistory, useLocation } from 'react-router-dom';
import { DateHelper } from 'utils/dateHelper';
import useFileDownload from 'hooks/useFileDownload';
import { CONSULT_API } from 'config/constantApi';
import * as baseUrl from 'config/urls';

const { Search } = Input;

const ConsultToolbar: React.FC<IToolbar> = ({ onSearch }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const query = useQuery();
  const [value, setValue] = useState<string>('');
  const { downloadFile } = useFileDownload();

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
      }&fromDate=&toDate=`
    );
    form.resetFields();

    setOpenModal(false);
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

  const handleApplyFilter = () => {
    form
      .validateFields()
      .then((values) => {
        let IsSuccess;
        if (values.IsSuccess === 1) {
          IsSuccess = true;
        } else if (values.IsSuccess === 0) {
          IsSuccess = false;
        }
        history.replace(
          `${location.pathname}?search=${
            query!.get('search') ? query!.get('search') : ''
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
        </div>
      </div>
    </>
  );
};

export default ConsultToolbar;
