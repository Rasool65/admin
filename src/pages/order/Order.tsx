import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { IResponse } from 'pages/widget-type';
import { ORDER_API } from 'config/constantApi';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import OrderTable from './OrderTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';

import OrderToolbar from './OrderToolbar';

let source: CancelTokenSource;

const Order = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();
  const query = useQuery();

  const { getRequest } = useHttpRequest();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getOrders = (page?: number, limit?: number, search?: string) => {
    setLoading(true);

    getRequest(
      `${[ORDER_API]}?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
      }&search=${query.get('search') ? query.get('search') : ''}&OrderStatus=${
        query.get('OrderStatus') ? query.get('OrderStatus') : ''
      }&fromDate=${query.get('fromDate') ? query.get('fromDate') : ''}&toDate=${
        query.get('toDate') ? query.get('toDate') : ''
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
      getOrders();
    }
    return () => {
      source.cancel();
    };
  }, [
    query.get('OrderStatus'),
    query.get('search'),
    query.get('fromDate'),
    query.get('toDate'),
  ]);

  const handleChangePage = (current: number, pageSize: number) => {
    getOrders(current, pageSize);
  };

  const handleSearch = (valueSearch: string) => {
    getOrders(1, 10, valueSearch);
  };

  useEffect(() => {
    if (!!query.get('prevPage')) {
      handleChangePage(Number(query.get('prevPage')), 10);
    }
  }, []);

  return (
    <>
      <AppBreadCrumbs pageTitle={''} menuTitle={t('orderManagment')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <OrderToolbar onSearch={handleSearch} />

        <OrderTable
          response={valus}
          loading={loading}
          onPaginationChange={handleChangePage}
        />
      </Card>
    </>
  );
};

export default Order;
