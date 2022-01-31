import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderTable from './OrderTable';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import {
  SUBMIT_TO_ORDER_LIST,
  CUSTOMERS_CRUD,
  PRODUCTS_CRUD,
} from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import { UtilsHelper } from 'utils/UtilsHelper';
const { Option } = Select;

function CreateOrders() {
  const { t } = useTranslation();

  const { postRequest, getRequest } = useHttpRequest();

  const [searchProductValue, setSearchProductValue] = useState<any>();
  const [searchCustomerValue, setSearchCustomerValue] = useState<any>();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const [selectCustomer, setSelectCustomer] = useState<boolean>(false);

  const [nameRequired, setNameRequired] = useState<boolean>(true);

  const [customerName, setCustomerName] = useState('');
  const [customers, setCustomers] = useState<any>([]);
  const [customerId, setCustomerId] = useState('');
  const [currentProduct, setCurrentProduct] = useState<any>('');

  const [finalInvoice, setFinalInvoice] = useState<any>({
    count: 0,
    totalPrice: 0,
  });

  const [productId, setProductId] = useState();
  const [products, setProducts] = useState<any>([]);
  const [productsList, setProductsList] = useState<any>([]);

  const [form] = Form.useForm();

  const handleSubmitForm = (event) => {
    const newProductList = productsList.map(
      ({ name, price, key, unitPrice, ...item }) => item
    );
    const body = {
      customerId,
      productList: newProductList,
    };
    setLoading(true);
    postRequest(`${SUBMIT_TO_ORDER_LIST}`, body)
      .then(() => {
        resetForm();
        message.success(t('orderSuccessCreated'));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const resetForm = () => {
    localStorage.setItem('CUSTOMER', '');
    setFinalInvoice({
      count: 0,
      totalPrice: 0,
    });
    setProductsList([]);
    setCustomers([]);
    setProducts([]);
    setSelectCustomer(false);
    setLoading(false);
    setNameRequired(true);
    form.setFieldsValue({
      customerId: '',
      productId: '',
      productNumber: 1,
    });
  };
  const cancellation = () => {
    resetForm();
    setLoading(false), message.warning(t('orderCancellation'));
  };
  const handleAddItems = (event) => {
    event.stopPropagation();
    form.validateFields().then((values) => {
      const productIndex = productsList.findIndex(
        (item) => item.productId === currentProduct.id
      );
      if (productIndex !== -1) {
        // if there is product in array ...
        const currentItem = productsList[productIndex];
        const items = [...productsList];
        currentItem.count = values.productNumber;
        currentItem.price = UtilsHelper.threeDigitSeparator(
          currentItem.unitPrice.replace(/\,/g, '') * values.productNumber
        );
        items[productIndex] = currentItem;
        setProductsList(items);
      } else {
        setProductsList([
          {
            key: currentProduct.id,
            productId: currentProduct.id,
            name: currentProduct.name,
            count: values.productNumber,
            unitPrice: UtilsHelper.threeDigitSeparator(currentProduct.price),
            price: UtilsHelper.threeDigitSeparator(
              currentProduct.price * values.productNumber
            ),
          },
          ...productsList,
        ]);
      }
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
    console.log(val);
    setSearchProductValue(val);
    if (!!val && val.length > 2) {
      setLoadingSearch(true);
      getRequest(
        `${PRODUCTS_CRUD}?CustomerId=${customerId}&search=${
          !!searchProductValue ? searchProductValue : ''
        }`
      )
        .then((resp) => {
          setProducts(resp.data.items);
          setLoadingSearch(false);
        })
        .catch((err) => {
          setLoadingSearch(false);
        });
    }
  };

  const handleDeleteProductsItem = (id?) => (event: React.MouseEvent) => {
    const filtered = productsList.filter((item) => item.productId !== id);
    setProductsList(filtered);
  };

  const getFinalInvoice = () => {
    let sumPrice = 0;
    let sumCount = 0;
    if (productsList.length > 0) {
      productsList.forEach((item) => {
        sumPrice += item.count * item.unitPrice.replace(/\,/g, '');
        sumCount += item.count;
      });
      setFinalInvoice({
        count: sumCount,
        totalPrice: sumPrice,
      });
    }
  };
  const getCustomerInfo = () => {
    const cashedCustomer = localStorage.getItem('CUSTOMER');
    if (!!cashedCustomer) {
      const JSONcustomer = JSON.parse(cashedCustomer);
      setCustomerName(JSONcustomer.label);
      setCustomerId(JSONcustomer.key);
      setNameRequired(false);
      setSelectCustomer(true);
    }
  };

  const getProductListInfo = () => {
    const cashedProductList = localStorage.getItem('ORDER_TABLE');
    const cashedProductListArray = !!cashedProductList
      ? JSON.parse(cashedProductList)
      : [];
    setProductsList(cashedProductListArray);
  };
  useEffect(() => {
    getCustomerInfo();
    getProductListInfo();
  }, []);
  useEffect(() => {
    getFinalInvoice();
    localStorage.setItem('ORDER_TABLE', JSON.stringify(productsList));
  }, [productsList]);

  return (
    <>
      <AppBreadCrumbs pageTitle={'ایجاد سفارش برای مشتری'} />
      <Form form={form} layout='vertical'>
        <Row style={{ paddingTop: '24px' }} gutter={24}>
          <Col xs={24} sm={24} md={15} lg={15}>
            <Card style={{ maxHeight: '230px' }}>
              <Row>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  style={{ maxHeight: '95px' }}
                >
                  <Form.Item
                    label={t('customer')}
                    name='customerId'
                    rules={[
                      {
                        required: nameRequired,
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
                          customers.find((item) => item.id === val.value)
                            .fullName
                        );
                        setSelectCustomer(true);
                        localStorage.setItem('CUSTOMER', JSON.stringify(val));
                      }}
                      onSearch={handleSearchCustomer}
                      notFoundContent={
                        loadingSearch ? <Spin size='small' /> : undefined
                      }
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
                  </Form.Item>

                  {!!searchCustomerValue && (
                    <p style={{ color: '#EA2125' }}>
                      {searchCustomerValue.length < 3
                        ? 'طول نام وارد شده نباید کمتر از 2 باشد'
                        : ''}
                    </p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={12} lg={12}>
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
                        !!currentProduct
                          ? currentProduct
                          : 'نام محصول را واردکنید '
                      }
                      style={{ width: '100%' }}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onChange={(val: any) => {
                        setProductId(val.value);
                        setCurrentProduct(
                          products.find((item) => item.id === val.value)
                        );
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
                  </Form.Item>
                  {!!searchProductValue && (
                    <p style={{ color: '#EA2125' }}>
                      {searchProductValue.length < 3
                        ? 'طول نام محصول وارد شده نباید کمتر از 2 باشد'
                        : ''}
                    </p>
                  )}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Row>
                    <Form.Item
                      style={{ marginRight: '15px' }}
                      name='productNumber'
                      rules={[{ required: true, message: 'تعداد اجباریست' }]}
                      label={t('تعداد')}
                    >
                      <InputNumber min={1} onPressEnter={handleAddItems} />
                    </Form.Item>

                    <Button
                      type='primary'
                      onClick={handleAddItems}
                      style={{ marginRight: '10px', marginTop: '28px' }}
                    >
                      {t('افزودن +')}
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Card>
            <br />
            <br />
          </Col>

          <Col xs={24} sm={24} md={9} lg={9}>
            <Card style={{ height: '230px' }}>
              <Row>
                <h5>
                  {t('sumCount')}: {finalInvoice.count}
                </h5>
              </Row>
              <br />
              <Row>
                <h5>
                  {t('sumTotalPrice')}:{' '}
                  {UtilsHelper.threeDigitSeparator(finalInvoice.totalPrice)}
                </h5>
              </Row>
              <br />
              <br />
              <br />
              <Row style={{ direction: 'ltr' }}>
                <Button
                  type='primary'
                  onClick={
                    loading
                      ? () => {
                          return;
                        }
                      : handleSubmitForm
                  }
                  loading={loading}
                >
                  {t('ثبت سفارش')}
                </Button>
                <br />
                <Button
                  style={{
                    backgroundColor: 'gray',
                    borderColor: 'gray',
                    width: '110px',
                    marginLeft: '10px',
                  }}
                  type='primary'
                  onClick={
                    loading
                      ? () => {
                          return;
                        }
                      : cancellation
                  }
                  loading={loading}
                >
                  {t('لغو سفارش')}
                </Button>
              </Row>
              <br />
            </Card>
          </Col>
        </Row>
      </Form>

      <OrderTable
        response={productsList}
        onDelete={handleDeleteProductsItem}
        // onPaginationChange={() => {
        //   return;
        // }}
        // loading={loading}
      />
    </>
  );
}

export default CreateOrders;
