import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Row, message } from 'antd';
import { useTranslation } from 'react-i18next';
import axios, { CancelTokenSource } from 'axios';
import useQuery from 'hooks/useQuery';

import { IResponse } from 'pages/widget-type';
import { SUBSCRIBER_API } from 'config/constantApi';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import SubscriberTable from './SubscriberTable';
import useHttpRequest from 'hooks/useHttpRequest';

let source: CancelTokenSource;

const Subscriber = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();
  const query = useQuery();

  const { getRequest, updateRequest } = useHttpRequest();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idValue, setIdValue] = useState<number | undefined>();

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const getUsers = (page?: number, limit?: number, search?: string) => {
    setLoading(true);

    getRequest(
      `${SUBSCRIBER_API}?page=${page ? page : 1}&Limit=${limit ? limit : 10}`
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
    getUsers();

    return () => {
      source.cancel();
    };
  }, []);

  const handleChangePage = (current: number, pageSize: number) => {
    getUsers(current, pageSize);
  };

  const handleOpenDeleteDialog = (id?: number) => (event: React.MouseEvent) => {
    setOpenDialog(true);
    setIdValue(id);
  };

  const handleDeleteSubscriber = () => {
    if (!!idValue) {
      setLoadingDelete(true);

      updateRequest(`${SUBSCRIBER_API}/delete`, { ids: [idValue] })
        .then((resp) => {
          setOpenDialog(false);

          getUsers(1, 10);

          setLoadingDelete(false);

          message.success(t('subscriberSuccessDelete'));
        })
        .catch(() => {
          setLoadingDelete(false);
        });
    }
  };

  return (
    <>
      <Modal
        title={t('subscriberDelete')}
        visible={openDialog}
        onOk={handleDeleteSubscriber}
        onCancel={() => setOpenDialog(false)}
        key={'modal_create'}
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
                  : handleDeleteSubscriber
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isDeleteSubscriber')}
      </Modal>

      <AppBreadCrumbs pageTitle={''} menuTitle={t('subscriber')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <SubscriberTable
          response={valus}
          loading={loading}
          onPaginationChange={handleChangePage}
          onDelete={handleOpenDeleteDialog}
        />
      </Card>
    </>
  );
};

export default Subscriber;
