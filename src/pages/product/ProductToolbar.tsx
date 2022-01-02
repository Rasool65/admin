import React, { useState, useEffect } from 'react';
import {
  FilterOutlined,
  FileExcelOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Input,
  Tooltip,
  Modal,
  Row,
  Form,
  Col,
  Select,
  Radio,
  Space,
  Divider,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { IToolbar } from 'pages/widget-type';
import useQuery from 'hooks/useQuery';
import { useHistory, useLocation } from 'react-router-dom';
import { PRODUCT_API, PRODUCT_CATEGORY_API } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import useFileDownload from 'hooks/useFileDownload';
import * as baseUrl from 'config/urls';

const { Option } = Select;
const { Search } = Input;

const ProductToolbar: React.FC<IToolbar> = ({ onSearch }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [SortValue, setSortValue] = useState<string>('');
  const [DescValue, setDescValue] = useState<string>('');
  const [form] = Form.useForm();
  const query = useQuery();
  const [categories, setCategories] = useState<any>([]);
  const { getRequest } = useHttpRequest();
  const [value, setValue] = useState<string>('');
  const { downloadFile } = useFileDownload();
  const [SortModal, setSortModal] = useState<boolean>(false);

  const SortType = [
    { id: 1, name: 'name' },
    { id: 2, name: 'materialId' },
    { id: 3, name: 'materialType' },
  ];

  useEffect(() => {
    if (query!.get('ProductCategoryId')) {
      form.setFieldsValue({
        DiscountType: query.get('ProductCategoryId') as string,
      });
    }
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

  const gerCategories = () => {
    setOpenModal(true);
    getRequest(`${PRODUCT_CATEGORY_API}`)
      .then((resp) => {
        setCategories(resp.data.items);
      })
      .catch(() => {
        return;
      });
  };

  const handleRemoveFilters = () => {
    history.replace(
      `${location.pathname}?query=${
        query!.get('query') ? query!.get('query') : ''
      }&ProductCategoryId=`
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
          }&ProductCategoryId=${
            values.ProductCategoryId !== undefined
              ? values.ProductCategoryId
              : ''
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
      `${PRODUCT_API}/excelreport`,
      `search=${
        query.get('search') ? query.get('search') : ''
      }&ProductCategoryId=${
        query.get('ProductCategoryId') ? query.get('ProductCategoryId') : ''
      }`
    );
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
        title={'فیلتر'}
        visible={openModal}
        onOk={handleApplyFilter}
        onCancel={() => setOpenModal(false)}
        key={'modal_filter'}
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
              <Form.Item label={t('category')} name='ProductCategoryId'>
                <Select placeholder={t('categoryName')} loading={false}>
                  {categories.map((_elm: { id: number; name: string }) => (
                    <Option key={_elm.id} value={_elm.id}>
                      {_elm.name}
                    </Option>
                  ))}
                </Select>
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
        key={'modal_sort'}
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
          <Tooltip title={'فیلتر'}>
            <FilterOutlined
              style={{ cursor: 'pointer' }}
              onClick={gerCategories}
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

export default ProductToolbar;
