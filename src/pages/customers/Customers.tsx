import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { CUSTOMERS_CRUD } from 'config/constantApi';
import { IResponse } from 'pages/widget-type';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import CustomersTable from './CustomersTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';
import CustomerToolbar from './CustomerToolbar';

let source: CancelTokenSource;

const Customers = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();

  const { getRequest } = useHttpRequest();
  const query = useQuery();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getCustomers = (
    page?: number,
    limit?: number,
    search?: string,
    Sort?: string,
    Desc?: boolean
  ) => {
    setLoading(true);

    getRequest(
      `${CUSTOMERS_CRUD}?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
      }&search=${query.get('search') ? query.get('search') : ''}&Sort=${
        query.get('Sort') ? query.get('Sort') : 'fullName'
      }&Desc=${query.get('Desc') ? query.get('Desc') : true}`
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
      getCustomers();
    }

    return () => {
      source.cancel();
    };
  }, [query.get('search'), query.get('Sort'), query.get('Desc')]);

  const handleChangePage = (current: number, pageSize: number) => {
    getCustomers(current, pageSize);
  };

  const handleSearch = (valueSearch: string) => {
    getCustomers(1, 10, valueSearch);
  };
  useEffect(() => {
    if (!!query.get('prevPage')) {
      handleChangePage(Number(query.get('prevPage')), 10);
    }
  }, []);
  return (
    <>
      <AppBreadCrumbs pageTitle={''} menuTitle={t('CustomerManagement')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <CustomerToolbar onSearch={handleSearch} />

        <CustomersTable
          getCustomers={getCustomers}
          response={valus}
          loading={loading}
          onPaginationChange={handleChangePage}
          isMain={true}
        />
      </Card>
    </>
  );
};

export default Customers;
