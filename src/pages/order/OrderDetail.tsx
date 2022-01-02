import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Spin,
  Row,
  Col,
  Avatar,
  Divider,
} from 'antd';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { ORDER_URL } from 'config/constantUrl';
import { BASE_URL } from 'config/urls';
import { ORDER_API } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import './style.scss';

const OrderDetail = () => {
  const { t } = useTranslation();

  // tslint:disable
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { getRequest } = useHttpRequest();

  const [orderItems, setOrderItems] = useState([]);
  const [loadingById, setLoadingById] = useState<boolean>(false);

  useEffect(() => {
    if (!!id) {
      setLoadingById(true);

      getRequest(`${ORDER_API}/${id}`)
        .then((resp) => {
          setLoadingById(false);
          form.setFieldsValue({
            deliveryName: resp.data.deliveryName,
            shipmentPrice: resp.data.shipmentPrice,
            quotationNumber: resp.data.quotationNumber,
            finalAmount: resp.data.finalAmount,
            discountPrice: resp.data.discountPrice,
            address: resp.data.address,
            description: resp.data.description,
          });
          console.log(resp.data);
          setOrderItems(resp.data.orderItems);
        })
        .catch(() => {
          setLoadingById(false);
        });
    }
  }, [id]);

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
                icon={<MdArrowBack />}
                type={'primary'}
                ghost={true}
                className={'btn__back'}
                onClick={() => history.push(`${ORDER_URL}${location.search}`)}
              />
            </div>

            <h2>{t('orderDetail')}</h2>
          </div>
        </Card>

        <Spin spinning={loadingById}>
          <Card
            bodyStyle={{ padding: '24px', paddingBottom: '45px' }}
            bordered={false}
          >
            <Row gutter={24}>
              <Row gutter={24} style={{ paddingTop: '24px' }}>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item label={t('deliveryName')} name='deliveryName'>
                    <Input autoComplete={'off'} disabled={true} />
                  </Form.Item>
                </Col>

                {/* <Col xs={24} sm={24} md={24}>
                                    <Form.Item
                                        label={t('shipmentPrice')}
                                        name='shipmentPrice'
                                    >
                                        <Input autoComplete={'off'} disabled={true} />
                                    </Form.Item>
                                </Col> */}

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('quotationNumber')}
                    name='quotationNumber'
                  >
                    <Input autoComplete={'off'} disabled={true} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item label={t('finalAmount')} name='finalAmount'>
                    <Input autoComplete={'off'} disabled={true} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item label={t('discountPrice')} name='discountPrice'>
                    <Input autoComplete={'off'} disabled={true} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item label={t('address')} name='address'>
                    <Input autoComplete={'off'} disabled={true} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item label={t('description')} name='description'>
                    <Input.TextArea autoComplete={'off'} disabled={true} />
                  </Form.Item>
                </Col>
              </Row>
              <Divider />

              <div className='Items'>
                <h2>اقلام سفارش</h2>
                {orderItems.length > 0 ? (
                  <ul>
                    {orderItems.map((item: any, index) => {
                      return (
                        <li key={index + 1}>
                          <div className='title'>
                            <Avatar
                              src={`${BASE_URL}${item.productImage}`}
                              size={'large'}
                            />
                            <p className='name'>{item.productName}</p>
                          </div>
                          <p className='count'>
                            <span className='lable'> تعداد:</span>
                            <span className='value'>{item.count}</span>
                          </p>
                          <p className='price'>
                            <span className='lable'> قیمت:</span>
                            <span className='value'>
                              <span>{item.price}</span>
                              تومان
                            </span>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  ''
                )}
              </div>
            </Row>
          </Card>
        </Spin>
      </Form>
    </>
  );
};

export default OrderDetail;
