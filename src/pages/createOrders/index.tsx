import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
} from 'antd';
import { IResponseOrder } from 'pages/widget-type';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderTable from './OrderTable';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import { CART_API, CUSTOMERS_CRUD, PRODUCTS_CRUD } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';

function CreateOrders() {
  const { t } = useTranslation();
  const { Option } = Select;
  const query = useQuery();

  const { postRequest, updateRequest, getRequest } = useHttpRequest();
  const [valus, setValue] = useState<any>({});

  const [searchProductValue, setSearchProductValue] = useState<any>();
  const [searchCustomerValue, setSearchCustomerValue] = useState<any>();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const [selectCustomer, setSelectCustomer] = useState<boolean>(false);

  const [customerName, setCustomerName] = useState('');
  const [customers, setCustomers] = useState<any>([]);
  const [customerId, setCustomerId] = useState();

  const [productNumber, setProductNumber] = useState<number>(1);

  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState();
  const [products, setProducts] = useState<any>([]);

  const [form] = Form.useForm();

  // const addToCart = (event) => {
  //   event.stopPropagation();

  //   form
  //     .validateFields()
  //     .then((values) => {
  //       const body = {
  //         ...values,
  //         customerId: !!customerId ? customerId : values.customerId,

  //       };

  //       setLoading(true);

  //       postRequest(CART_API, body)
  //         .then(() => {
  //           setLoading(false);
  //           message.success(t('settingSuccessUpdate'));
  //         })
  //         .catch(() => {
  //           setLoading(false);
  //         });
  //     })
  //     .catch((info) => {
  //       return;
  //     });
  // };

  const handleSubmit = (event) => {
    //add to table
    event.stopPropagation();
    form
      .validateFields()
      .then((products) => {
        const body = {
          ...products,
          code: '321231asdasdas-a-sd',
          name: 'شسی',
          price: 125000,
          number: 250,
        };

        setValue(body);

        //setLoading(true);
        // postRequest(CART_API, body)
        //   .then(() => {
        //     setLoading(false);
        //     message.success(t('محصول اضافه شد'));
        //   })
        //   .catch(() => {
        //     setLoading(false);
        //   });
      })
      .catch((info) => {
        return;
      });
  };

  const handleSearchCustomer = (val) => {
    setSearchCustomerValue(val);
    if (!!val && val.length > 2) {
      setLoadingSearch(true);
      getRequest(
        `${CUSTOMERS_CRUD}?search=${
          !!searchCustomerValue ? searchCustomerValue : ''
        }`
      )
        .then((resp) => {
          setCustomers(resp.data.items);
          setLoadingSearch(false);
        })
        .catch((err) => {
          setLoadingSearch(false);
        });
    }
  };

  const handleSearchProduct = (val) => {
    setSearchProductValue(val);
    if (!!val && val.length > 2) {
      setLoadingSearch(true);
      getRequest(
        `${PRODUCTS_CRUD}?search=${
          !!searchProductValue ? searchProductValue : ''
        }`
      )
        .then((resp) => {
          setCustomers(resp.data.items);
          setLoadingSearch(false);
        })
        .catch((err) => {
          setLoadingSearch(false);
        });
    }
  };
  // const getCustomers = (search?: string) => {
  //   setLoading(true);

  //   getRequest(
  //     `${CUSTOMERS_CRUD}?search=${
  //       query.get('search') ? query.get('search') : ''
  //     }`
  //   )
  //     .then((resp) => {
  //       debugger;
  //       setLoading(false);
  //       setCustomers(resp.data.items);
  //     })
  //     .catch(() => {
  //       setLoading(false);
  //     });
  // };
  useEffect(() => {
    //getCustomers();
  }, []);
  return (
    <>
      <AppBreadCrumbs pageTitle={'ایجاد سفارش برای مشتری'} />
      <Row style={{ paddingTop: '24px' }} gutter={24}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label={t('customer')}
            name='customerId'
            rules={[
              {
                required: true,
                message: t('pleaseInsertName'),
              },
            ]}
          >
            <Select
              disabled={selectCustomer}
              showSearch={true}
              labelInValue={true}
              placeholder={
                !!customerName ? customerName : 'نام مشتری را واردکنید '
              }
              style={{ width: '100%' }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onChange={(val: any) => {
                setCustomerId(val.value);
                setCustomerName(
                  customers.find((item) => item.id === val.value).fullName
                );
                setSelectCustomer(true);
              }}
              onSearch={handleSearchCustomer}
              notFoundContent={
                loadingSearch ? <Spin size='small' /> : undefined
              }
              onSelect={() => {}}
            >
              {customers.length > 0 &&
                customers.map((_elm: any, index) => {
                  return (
                    <Option key={index} value={_elm.id}>
                      {_elm.fullName}
                    </Option>
                  );
                })}
            </Select>
            {!!searchCustomerValue && (
              <p style={{ color: '#EA2125' }}>
                {searchCustomerValue.length < 3
                  ? 'طول نام وارد شده نباید کمتر از 2 باشد'
                  : ''}
              </p>
            )}
          </Form.Item>
          <Form.Item
            label={t('productName')}
            name='productId'
            rules={[
              {
                required: true,
                message: t('pleaseInsertProductName'),
              },
            ]}
          >
            <Select
              showSearch={true}
              labelInValue={true}
              placeholder={
                !!productName ? productName : 'نام محصول را واردکنید '
              }
              style={{ width: '100%' }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onChange={(val: any) => {
                setProductId(val.value);
                setProductName(products.find((item) => item.id === val.value));
              }}
              onSearch={handleSearchProduct}
              notFoundContent={
                loadingSearch ? <Spin size='small' /> : undefined
              }
            >
              {products.length > 0 &&
                products.map((_elm: any, index) => {
                  return (
                    <Option key={index} value={_elm.id}>
                      {_elm.name}
                    </Option>
                  );
                })}
            </Select>
            {!!searchProductValue && (
              <p style={{ color: '#EA2125' }}>
                {searchProductValue.length < 3
                  ? 'طول نام محصول وارد شده نباید کمتر از 2 باشد'
                  : ''}
              </p>
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6}>
          <Form.Item />
          <Form.Item label={t('تعداد')}>
            <InputNumber min={1} defaultValue={1} name='productNumber' />
          </Form.Item>
        </Col>
        <Form.Item>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Button
              type='primary'
              onClick={
                loading
                  ? () => {
                      return;
                    }
                  : handleSubmit
              }
              loading={loading}
            >
              {t('افزودن به لیست سفارش')}
            </Button>
          </Col>
        </Form.Item>
      </Row>

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <OrderTable
          response={valus}
          // loading={loading}
          // onPaginationChange={handleChangePage}
        />
      </Card>
      <Button
        type='primary'
        // onClick={
        //   loading
        //     ? () => {
        //         return;
        //       }
        //     : addToCart
        // }
        loading={loading}
      >
        {t('تایید نهایی')}
      </Button>
    </>
  );
}

export default CreateOrders;
