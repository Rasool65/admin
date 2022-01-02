import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { PRE_REGISTRATION_CUSTOMER_API } from 'config/constantApi';
import { IResponse } from 'pages/widget-type';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import CustomersTable from './CustomersTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';

let source: CancelTokenSource;

const PreRegistrationCustomer = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();

  const { getRequest } = useHttpRequest();
  const query = useQuery();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getCustomers = (page?: number, limit?: number) => {
    setLoading(true);

    getRequest(
      `${PRE_REGISTRATION_CUSTOMER_API}?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
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
    getCustomers();

    return () => {
      source.cancel();
    };
  }, []);

  const handleChangePage = (current: number, pageSize: number) => {
    getCustomers(current, pageSize);
  };

  return (
    <>
      <AppBreadCrumbs
        pageTitle={''}
        menuTitle={t('pre-registration-customer')}
      />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <CustomersTable
          response={valus}
          loading={loading}
          onPaginationChange={handleChangePage}
          isMain={false}
        />
      </Card>
    </>
  );
};

export default PreRegistrationCustomer;
