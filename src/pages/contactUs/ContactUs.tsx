import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Row, message } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { IResponse } from 'pages/widget-type';
import { CONTACTUS_API } from 'config/constantApi';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import ContactUsTable from './ContactUsTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';

let source: CancelTokenSource;

const ContactUs = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();
  const query = useQuery();

  const { getRequest, updateRequest } = useHttpRequest();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idValue, setIdValue] = useState<number | undefined>();

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const getContactUss = (page?: number, limit?: number, search?: string) => {
    setLoading(true);

    getRequest(
      `${CONTACTUS_API}?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
      }&search=${query.get('search') ? query.get('search') : ''}&DiscountType=${
        query.get('DiscountType') ? query.get('DiscountType') : ''
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

  const handleChangePage = (current: number, pageSize: number) => {
    getContactUss(current, pageSize);
  };

  useEffect(() => {
    getContactUss();

    return () => {
      source.cancel();
    };
  }, [
    query.get('DiscountType'),
    query.get('search'),
    query.get('fromDate'),
    query.get('toDate'),
  ]);

  const handleOpenDeleteDialog = (id?: number) => (event: React.MouseEvent) => {
    setOpenDialog(true);
    setIdValue(id);
  };

  const handleDeleteContactUs = () => {
    if (!!idValue) {
      setLoadingDelete(true);

      updateRequest(`${CONTACTUS_API}/delete`, { ids: [idValue] })
        .then((resp) => {
          setOpenDialog(false);
          getContactUss();
          setLoadingDelete(false);
          message.success(t('ContactUsDeleteConfirm'));
        })
        .catch(() => {
          setLoadingDelete(false);
        });
    }
  };

  return (
    <>
      <Modal
        title={t('delete')}
        visible={openDialog}
        onOk={handleDeleteContactUs}
        onCancel={() => setOpenDialog(false)}
        key={'delete_contact_us'}
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
                  : handleDeleteContactUs
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isdelete')}
      </Modal>

      <AppBreadCrumbs pageTitle={''} menuTitle={t('ContactUsManage')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <ContactUsTable
          response={valus}
          loading={loading}
          onDelete={handleOpenDeleteDialog}
          onPaginationChange={handleChangePage}
        />
      </Card>
    </>
  );
};

export default ContactUs;
