import React, { useState, useEffect } from 'react';
import { Card, Modal, Row, Button, Form, message, Spin } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { PRODUCT_CATEGORY_API } from 'config/constantApi';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import ProductCategoryToolbar from './ProductCategoryToolbar';
import ProductCategoryAdd from './ProductCategoryAdd';
import useHttpRequest from 'hooks/useHttpRequest';
import ProductCategoryList from './ProductCategoryList';
import useQuery from 'hooks/useQuery';

import './style.scss';

let source: CancelTokenSource;

const ProductCategory = () => {
  source = axios.CancelToken.source();

  const [form] = Form.useForm();
  const { postRequest, getRequest } = useHttpRequest();
  const { t } = useTranslation();

  const [openCategory, setOpenCatetgory] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [loadingValue, setLoadingValue] = useState<boolean>(false);
  const [value, setValue] = useState<any>([]);

  const query = useQuery();

  const handleAddCategory = () => {
    form.validateFields().then((values) => {
      const body = {
        ...values,
        ChildrenNames: values.ChildrenNames.map((_elm) => _elm.item),
      };

      setLoading(true);

      postRequest(PRODUCT_CATEGORY_API, body)
        .then(() => {
          setLoading(false);

          setOpenCatetgory(false);

          message.success(t('addSuccessCategory'));

          getCategories();
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  const getCategories = (page?: number, limit?: number, search?: string) => {
    setLoadingValue(false);

    getRequest(
      `${PRODUCT_CATEGORY_API}/list?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
      }&search=${query.get('search') ? query.get('search') : ''}`
    )
      .then((resp) => {
        setLoadingValue(false);

        setValue(resp.data);
      })
      .catch(() => {
        setLoadingValue(false);
      });
  };

  useEffect(() => {
    getCategories();

    return () => {
      source.cancel();
    };
  }, [query.get('search')]);

  const handleRefresh = () => {
    getCategories();
  };

  const handleSearch = (valueSearch: string) => {
    getCategories(1, 10, valueSearch);
  };

  const openAddCategoryModal = () => {
    console.log('heare');
    form.setFieldsValue({
      name: '',
      ChildrenNames: '',
    });
    setOpenCatetgory(true);
  };
  return (
    <>
      <Form
        className={'w-100'}
        form={form}
        layout='vertical'
        autoComplete='off'
      >
        <Modal
          title={t('addCategory')}
          visible={openCategory}
          className={'modal__category'}
          onOk={handleAddCategory}
          onCancel={() => {
            setOpenCatetgory(false);
          }}
          key={'modal_create_category'}
          footer={[
            <Row justify={'end'} key={'row_footer'}>
              <Button
                type={'primary'}
                htmlType={'submit'}
                loading={loading}
                onClick={
                  loading
                    ? () => {
                        return;
                      }
                    : handleAddCategory
                }
              >
                {t('submit')}
              </Button>

              <Button onClick={() => setOpenCatetgory(false)}>
                {t('cancel')}
              </Button>
            </Row>,
          ]}
        >
          <ProductCategoryAdd />
        </Modal>
      </Form>

      <AppBreadCrumbs pageTitle={''} menuTitle={t('manageCategory')} />

      <Spin spinning={loadingValue}>
        <Card
          bodyStyle={{ padding: '16px', userSelect: 'none' }}
          bordered={false}
        >
          <ProductCategoryToolbar
            onNew={openAddCategoryModal}
            onSearch={handleSearch}
          />

          <ProductCategoryList data={value} onRefreshApi={handleRefresh} />
        </Card>
      </Spin>
    </>
  );
};

export default ProductCategory;
