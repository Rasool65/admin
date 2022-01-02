import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { IResponse } from 'pages/widget-type';
import { PRODUCT_API } from 'config/constantApi';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import ProductTable from './ProductTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';

import ProductToolbar from './ProductToolbar';

let source: CancelTokenSource;

const Product = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();
  const query = useQuery();

  const { getRequest } = useHttpRequest();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getProducts = (
    page?: number,
    limit?: number,
    search?: string,
    Sort?: string,
    Desc?: boolean
  ) => {
    setLoading(true);

    getRequest(
      `${PRODUCT_API}?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
      }&search=${
        query.get('search') ? query.get('search') : ''
      }&ProductCategoryId=${
        query.get('ProductCategoryId') ? query.get('ProductCategoryId') : ''
      }&Sort=${query.get('Sort') ? query.get('Sort') : 'name'}&Desc=${
        query.get('Desc') ? query.get('Desc') : true
      }`
    )
      .then((resp) => {
        setLoading(false);
        setValue(resp.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!query.get('prevPage')) {
      getProducts();
    }
    return () => {
      source.cancel();
    };
  }, [
    query.get('search'),
    query.get('ProductCategoryId'),
    query.get('Sort'),
    query.get('Desc'),
  ]);

  const handleChangePage = (current: number, pageSize: number) => {
    getProducts(current, pageSize);
  };

  const handleSearch = (valueSearch: string) => {
    getProducts(1, 10, valueSearch);
  };

  useEffect(() => {
    if (!!query.get('prevPage')) {
      handleChangePage(Number(query.get('prevPage')), 10);
    }
  }, []);

  return (
    <>
      <AppBreadCrumbs pageTitle={''} menuTitle={t('ProductsManage')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <ProductToolbar onSearch={handleSearch} />

        <ProductTable
          response={valus}
          loading={loading}
          onPaginationChange={handleChangePage}
        />
      </Card>
    </>
  );
};

export default Product;
