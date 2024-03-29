import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderTable from './OrderTable';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import {
  SUBMIT_TO_ORDER_LIST,
  CUSTOMERS_CRUD,
  PRODUCTS_CRUD,
  CART_GET_PRODUCTS_WITH_PRICE,
  CART_API,
} from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import { UtilsHelper } from 'utils/UtilsHelper';
const { Option } = Select;

function CreateOrders() {
  const { t } = useTranslation();
  const productFocus = useRef<any>(null);
  const customerFocus = useRef<any>(null);
  const numberFocus = useRef<any>(null);

  const { postRequest, getRequest } = useHttpRequest();

  const [open, setOpen] = useState<boolean>(false);

  const [searchProductValue, setSearchProductValue] = useState<any>();
  const [searchCustomerValue, setSearchCustomerValue] = useState<any>();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const [selectCustomer, setSelectCustomer] = useState<boolean>(false);

  const [productDisabled, setProductDisabled] = useState<boolean>(true);
  const [numberDisabled, setNumberDisabled] = useState<boolean>(true);
  const [confirmBtn, setConfirmBtn] = useState<boolean>(false);

  const [nameRequired, setNameRequired] = useState<boolean>(true);

  const [customerName, setCustomerName] = useState('');
  const [customers, setCustomers] = useState<any>([
    {
      label: '',
      value: '',
    },
  ]);
  const [customerId, setCustomerId] = useState('');
  const [currentProduct, setCurrentProduct] = useState<any>(undefined);

  const [productCounter, setProductCounter] = useState<any>(undefined);

  const [finalInvoice, setFinalInvoice] = useState<any>({
    count: 0,
    totalPrice: '0',
    totalDiscount: 0,
    totalTax: 0,
  });

  const [products, setProducts] = useState<any>([]);
  const [productsList, setProductsList] = useState<any>([
    {
      key: 0,
      productId: 0,
      productName: '',
      materialId: '',
      count: 0,
      price: 0,
      focIndicator: false,
      discount: 0,
      tax: 0,
    },
  ]);

  const [form] = Form.useForm();

  const handleGetPrice = (event) => {
    if (productsList.length === 0) {
      message.error(t('orderEmpty'));
      return;
    }
    const newProductList = productsList.map(
      ({ productName, price, key, unitPrice, productId, ...item }) => item
    );
    const body = {
      customerId,
      carts: newProductList,
    };
    setLoading(true);
    postRequest(`${CART_GET_PRODUCTS_WITH_PRICE}`, body)
      .then((result) => {
        setProductsList(result.data.data); // new list
        setLoading(false);
        setConfirmBtn(true);
        message.success(t('محاسبه قیمت ها از SAP دریافت شد'));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleConfirmOrder = (event) => {
    if (productsList.length === 0) {
      message.error(t('orderEmpty'));
      return;
    }
    const newProductList = productsList.map(
      ({
        tax,
        discount,
        productName,
        price,
        key,
        unitPrice,
        materialId,
        ...item
      }) => item
    );
    const body = {
      customerId,
      carts: newProductList,
    };
    setLoading(true);
    postRequest(`${CART_API}`, body)
      .then((result) => {
        setConfirmBtn(false);
        setLoading(false);
        resetForm();
        setProductsList([]);
        setProductDisabled(true);
        setNumberDisabled(true);
        setProductCounter(null);
        setCurrentProduct(null);
        setConfirmBtn(true);
        message.success(t('سفارش با موفقیت ثبت شد'));
        customerFocus.current.focus();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const resetForm = () => {
    setConfirmBtn(false);
    localStorage.setItem('CUSTOMER', '');
    setFinalInvoice({
      count: 0,
      totalPrice: 0,
      totalDiscount: 0,
      totalTax: 0,
    });
    // setProductsList([]);
    setCustomers([]);
    setProducts([]);
    setSelectCustomer(false);
    setLoading(false);
    setNameRequired(true);
    setCustomerId('');
    form.setFieldsValue({
      customerId: '',
      productId: '',
      productNumber: '',
    });
  };
  const cancellation = () => {
    setOpen(false);
    resetForm();
    setProductsList([]);
    setProductDisabled(true);
    setNumberDisabled(true);
    setProductCounter(null);
    setCurrentProduct(null);
    message.warning(t('orderCancellation'));
    setTimeout(() => {
      customerFocus.current.focus();
    }, 500);
  };

  const handleAddItems = (event) => {
    event.stopPropagation();
    form.validateFields().then((values) => {
      setConfirmBtn(false);
      const productIndex = productsList.findIndex(
        (item) => item.productId === currentProduct.id
      );
      if (productIndex !== -1) {
        // if there is product in array ...
        const currentItem = productsList[productIndex];
        const items = [...productsList].filter(
          (item) => item.focIndicator !== true
        );
        currentItem.count = values.productNumber;
        currentItem.focIndicator = false;
        // currentItem.price = UtilsHelper.threeDigitSeparator(
        //   currentItem.unitPrice.replace(/\,/g, '') * values.productNumber
        // );
        items[productIndex] = currentItem;
        setProductsList(items);
      } else {
        setProductsList(
          [
            {
              key: currentProduct.id,
              productId: currentProduct.id,
              materialId: currentProduct.materialId,
              productName: currentProduct.name,
              count: values.productNumber,
              focIndicator: false,
              price: 0,
              tax: 0,
              discount: 0,
              // unitPrice: UtilsHelper.threeDigitSeparator(currentProduct.price),
              // price: UtilsHelper.threeDigitSeparator(
              //   currentProduct.price * values.productNumber
              // ),
            },
            ...productsList,
          ].filter((item) => item.focIndicator !== true)
        );
      }
      setProducts([]);
      setCurrentProduct(null);
      setProductCounter(null);
      productFocus.current.focus();
    });
  };

  const handleSearchCustomer = (val) => {
    if (!!val) {
      setLoadingSearch(true);
      getRequest(`${CUSTOMERS_CRUD}?search=${val}`)
        .then((resp) => {
          setSearchCustomerValue(val);
          setCustomers(resp.data.items);
          setLoadingSearch(false);
        })
        .catch((err) => {
          setLoadingSearch(false);
        });
    } else {
      setSearchCustomerValue(val);
      setCustomers([]);
      setLoadingSearch(false);
    }
  };

  const handleSearchProduct = (val) => {
    if (!!val) {
      setLoadingSearch(true);
      getRequest(`${PRODUCTS_CRUD}?CustomerId=${customerId}&search=${val}`)
        .then((resp) => {
          setSearchProductValue(val);
          setProducts(resp.data.items);
          setLoadingSearch(false);
        })
        .catch((err) => {
          setLoadingSearch(false);
        });
    } else {
      setSearchProductValue(val);
      setProducts([]);
      setLoadingSearch(false);
    }
  };

  const handleDeleteProductsItem = (id?) => (event: React.MouseEvent) => {
    setConfirmBtn(false);
    const filtered = productsList.filter(
      (item) => item.productId !== id && item.focIndicator !== true
    );
    setProductsList(filtered);
  };

  const getFinalInvoice = () => {
    let sumPrice = 0;
    let sumDiscount = 0;
    let sumTax = 0;
    let sumCount = 0;
    if (productsList.length > 0) {
      productsList.forEach((item) => {
        // sumPrice += item.count * item.unitPrice.replace(/\,/g, '');
        sumPrice += item.price;
        sumCount += item.count;
        sumTax += item.tax;
        sumDiscount += item.discount;
      });
    }
    setFinalInvoice({
      count: sumCount,
      totalPrice: sumPrice,
      totalDiscount: sumDiscount,
      totalTax: sumTax,
    });
  };
  const getCustomerInfo = () => {
    const cashedCustomer = localStorage.getItem('CUSTOMER');
    if (!!cashedCustomer) {
      const JSONcustomer = JSON.parse(cashedCustomer);
      setProductDisabled(false);
      setNumberDisabled(false);
      setCustomerName(JSONcustomer.label);
      setCustomers([
        {
          value: JSONcustomer.value,
          label: JSONcustomer.label,
        },
      ]);
      setCustomerId(JSONcustomer.value);
      setNameRequired(false);
      setSelectCustomer(true);
      setTimeout(() => {
        productFocus.current.focus();
      }, 500);
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
    form.setFieldsValue({
      productId: '',
      productNumber: '',
      materialId: '',
    });
  }, [productsList]);

  return (
    <>
      <Modal
        title={'لغو سفارش'}
        visible={open}
        onCancel={() => setOpen(false)}
        key={'modal_create'}
        width={275}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button onClick={() => setOpen(false)}>خیر</Button>

            <Button type={'primary'} onClick={cancellation}>
              بله
            </Button>
          </Row>,
        ]}
      >
        <Row>
          <Col xs={24} sm={24} md={24}>
            آیا از لغو این سفارش اطمینان دارید ؟
          </Col>
        </Row>
      </Modal>

      <AppBreadCrumbs pageTitle={'ایجاد سفارش برای مشتری'} />
      <Form form={form} layout='vertical'>
        <Row style={{ paddingTop: '24px' }} gutter={24}>
          <Col xs={24} sm={24} md={24} lg={15}>
            <Card style={{ minHeight: '230px' }}>
              <Row>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
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
                      ref={customerFocus}
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
                        setProductDisabled(false);
                        setNumberDisabled(false);
                        if (customers && productFocus.current.disabled == true)
                          productFocus.current.disabled = false;
                        setTimeout(() => {
                          productFocus.current.focus();
                        }, 500);
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
                </Col>
              </Row>
              <Row align='middle' gutter={24}>
                <Col xs={24} sm={24} md={24} lg={12}>
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
                      disabled={productDisabled}
                      ref={productFocus}
                      autoFocus={false}
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
                        setCurrentProduct(
                          products.find((item) => item.id === val.value)
                        );

                        numberFocus.current.focus();
                      }}
                      onSearch={handleSearchProduct}
                      notFoundContent={
                        loadingSearch ? <Spin size='small' /> : undefined
                      }
                    >
                      {products.length > 0 &&
                        customerName.length > 0 &&
                        products.map((_elm: any, index) => {
                          return (
                            <Option key={index} value={_elm.id}>
                              {_elm.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={7}>
                  <Form.Item
                    className='product_count'
                    name='productNumber'
                    label={t('تعداد')}
                  >
                    <InputNumber
                      disabled={numberDisabled}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      ref={numberFocus}
                      width={100}
                      style={{
                        width: '100%',
                      }}
                      min={1}
                      onChange={(e: number) => {
                        setProductCounter(e);
                      }}
                      onPressEnter={handleAddItems}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={5}>
                  <Button
                    disabled={
                      productCounter === null || currentProduct === null
                    }
                    style={{ justifyContent: 'center' }}
                    block={true}
                    type='primary'
                    onClick={handleAddItems}
                  >
                    {t('افزودن')}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={9}>
            <Card className='responsive_card'>
              <Row>
                {/* <h5>
                  {t('sumCount')}: {finalInvoice.count}
                </h5> */}
                <h5>
                  {t('sumCount')}: {productsList.length}
                </h5>
              </Row>
              <p></p>
              <Row>
                <h5>
                  {t('تخفیف')}:{' '}
                  {finalInvoice.totalDiscount
                    ? UtilsHelper.threeDigitSeparator(
                        finalInvoice.totalDiscount
                      )
                    : '0'}
                </h5>
              </Row>
              <p></p>
              <Row>
                <h5>
                  {t('مالیات بر ارزش افزوده')}:{' '}
                  {finalInvoice.totalTax
                    ? UtilsHelper.threeDigitSeparator(finalInvoice.totalTax)
                    : '0'}
                </h5>
              </Row>
              <p></p>
              <Row>
                <h5>
                  {t('sumTotalPrice')}:{' '}
                  {finalInvoice.totalPrice
                    ? UtilsHelper.threeDigitSeparator(finalInvoice.totalPrice)
                    : '0'}
                </h5>
              </Row>

              <Row className='btns_container' justify='end'>
                <Col xs={24} sm={24} md={8} lg={8} className='btn_container'>
                  <Button
                    hidden={confirmBtn}
                    block={true}
                    type='primary'
                    style={{
                      justifyContent: 'center',
                    }}
                    onClick={
                      loading
                        ? () => {
                            return;
                          }
                        : handleGetPrice
                    }
                    loading={loading}
                  >
                    {t('مشاهده قیمت')}
                  </Button>
                  <Button
                    hidden={!confirmBtn}
                    block={true}
                    type='primary'
                    style={{
                      justifyContent: 'center',
                    }}
                    onClick={
                      loading
                        ? () => {
                            return;
                          }
                        : handleConfirmOrder
                    }
                    loading={loading}
                  >
                    {t('تایید نهایی')}
                  </Button>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} className='btn_container'>
                  <Button
                    block={true}
                    style={{
                      backgroundColor: 'gray',
                      borderColor: 'gray',
                      justifyContent: 'center',
                    }}
                    type='primary'
                    onClick={() => {
                      if (!customerId || customerId === '') {
                        message.error(t('orderNotInit'));
                        return;
                      }
                      setOpen(true);
                    }}
                    loading={loading}
                  >
                    {t('لغو سفارش')}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>

      <OrderTable response={productsList} onDelete={handleDeleteProductsItem} />
    </>
  );
}

export default CreateOrders;
