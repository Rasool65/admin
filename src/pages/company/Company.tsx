import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Row, message } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { IResponse } from 'pages/widget-type';
import { COMPANY_API } from 'config/constantApi';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import CompanyTable from './CompanyTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';

import './style.scss';
import CompanyToolbar from './CompanyToolbar';

let source: CancelTokenSource;

const Company = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();
  const query = useQuery();

  const { getRequest, deleteRequest } = useHttpRequest();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idValue, setIdValue] = useState<number | undefined>();

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const getCompanys = (page?: number, limit?: number, search?: string) => {
    setLoading(true);

    getRequest(
      `${COMPANY_API}?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
      }&search=${query.get('search') ? query.get('search') : ''}`
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
      getCompanys();
    }
    return () => {
      source.cancel();
    };
  }, [query.get('search')]);

  const handleChange = (value: string) => {
    getCompanys(1, 10, value);
  };

  const handleOpenDeleteDialog = (id?: number) => (event: React.MouseEvent) => {
    setOpenDialog(true);
    setIdValue(id);
  };

  const handleDeleteCompany = () => {
    if (!!idValue) {
      setLoadingDelete(true);

      deleteRequest(`${COMPANY_API}/${idValue}`)
        .then((resp) => {
          setOpenDialog(false);

          getCompanys();

          setLoadingDelete(false);

          message.success(t('CompanyDeleteConfirm'));
        })
        .catch(() => {
          setLoadingDelete(false);
        });
    }
  };

  const handleChangePage = (current: number, pageSize: number) => {
    getCompanys(current, pageSize);
  };

  useEffect(() => {
    if (!!query.get('prevPage')) {
      handleChangePage(Number(query.get('prevPage')), 10);
    }
  }, []);

  return (
    <>
      <Modal
        title={t('CompanyDelete')}
        visible={openDialog}
        onOk={handleDeleteCompany}
        onCancel={() => setOpenDialog(false)}
        key={'modal_delete_message'}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button
              color={'red'}
              type={'primary'}
              danger={true}
              loading={loadingDelete}
              onClick={
                loadingDelete
                  ? () => {
                      return;
                    }
                  : handleDeleteCompany
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isDeleteCompany')}
      </Modal>

      <AppBreadCrumbs pageTitle={''} menuTitle={t('CompanysManage')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <CompanyToolbar onSearch={handleChange} />

        <CompanyTable
          response={valus}
          loading={loading}
          onDelete={handleOpenDeleteDialog}
          onPaginationChange={handleChangePage}
        />
      </Card>
    </>
  );
};

export default Company;
