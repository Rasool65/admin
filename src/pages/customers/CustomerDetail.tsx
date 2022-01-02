import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Spin,
  Row,
  Col,
  message,
  InputNumber,
} from 'antd';
import { MdArrowBack } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { CUSTOMERS_LIST } from 'config/constantUrl';
import { useHistory, useParams } from 'react-router-dom';
import useHttpRequest from 'hooks/useHttpRequest';
import { CUSTOMERS_CRUD, CUSTOMER_EDIT_API } from 'config/constantApi';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { UtilsHelper } from 'utils/UtilsHelper';
function CustomerDetail() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const { getRequest, updateRequest } = useHttpRequest();
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      updateRequest(CUSTOMERS_CRUD, {
        id,
        baseOrderAmount: values.baseOrderAmount,
      })
        .then(() => {
          message.success(t('editSuccessBaseAmount'));
          setLoading(false);
          history.push(`${CUSTOMERS_LIST}${location.search}`);
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };
  useEffect(() => {
    getRequest(`${CUSTOMER_EDIT_API}/${id}`).then((resp) => {
      console.log(resp.data);
      form.setFieldsValue({
        name: resp.data.fullName,
        solicoCustomerId: resp.data.solicoCustomerId,
        phoneNumber: resp.data.phone,
        mobile: resp.data.mobile,
        baseOrderAmount: resp.data.baseOrderAmount,
      });
    });
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
                type='primary'
                htmlType='submit'
                style={{ width: '95px', minWidth: '95px' }}
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
                {t('edit')}
              </Button>

              <Button
                icon={<MdArrowBack />}
                type={'primary'}
                ghost={true}
                className={'btn__back'}
                onClick={() =>
                  history.push(`${CUSTOMERS_LIST}${location.search}`)
                }
              />
            </div>

            <h2>{t('editCustomer')}</h2>
          </div>
        </Card>

        <Spin spinning={false}>
          <Card
            bodyStyle={{ padding: '24px', paddingBottom: '45px' }}
            bordered={false}
          >
            <Row gutter={24}>
              <Row gutter={24} style={{ paddingTop: '24px' }}>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item label={t('name')} name='name'>
                    <Input disabled={true} autoComplete={'off'} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('solicoCustomerId')}
                    name='solicoCustomerId'
                  >
                    <Input disabled={true} autoComplete={'off'} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item label={t('phoneNumber')} name='phoneNumber'>
                    <Input disabled={true} autoComplete={'off'} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item label={t('mobile')} name='mobile'>
                    <Input disabled={true} autoComplete={'off'} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={t('baseOrderAmount')}
                    name='baseOrderAmount'
                    rules={[
                      {
                        required: true,
                        message: t('pleaseInsertBaseOrderAmount'),
                      },
                    ]}
                  >
                    <InputNumber
                      style={{
                        width: '100%',
                      }}
                      controls={true}
                      formatter={(value) =>
                        UtilsHelper.threeDigitSeparator(value)
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Row>
          </Card>
        </Spin>
      </Form>
    </>
  );
}

export default CustomerDetail;
