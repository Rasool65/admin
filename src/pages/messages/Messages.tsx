import React, { useEffect, useState } from 'react';
import { Card, Modal, Button, Row, message } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { MESSAGE_API } from 'config/constantApi';
import { IResponse } from 'pages/widget-type';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import MessagesTable from './MessagesTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';
import MessagesToolbar from './MessagesToolbar';

let source: CancelTokenSource;

const Messages = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();

  const { getRequest, deleteRequest } = useHttpRequest();
  const query = useQuery();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idValue, setIdValue] = useState<number | undefined>();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const getMessages = (page?: number, limit?: number, search?: string) => {
    setLoading(true);

    getRequest(
      `${MESSAGE_API}?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
      }&search=${query.get('search') ? query.get('search') : ''}&fromDate=${
        query.get('fromDate') ? query.get('fromDate') : ''
      }&toDate=${query.get('toDate') ? query.get('toDate') : ''}`
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
    getMessages();

    return () => {
      source.cancel();
    };
  }, [query.get('search'), query.get('fromDate'), query.get('toDate')]);

  const handleChangePage = (current: number, pageSize: number) => {
    getMessages(current, pageSize);
  };

  const handleSearch = (valueSearch: string) => {
    getMessages(1, 10, valueSearch);
  };

  const handleOpenDeleteDialog = (id?: number) => (event: React.MouseEvent) => {
    setOpenDialog(true);
    setIdValue(id);
  };

  const handleDeleteUser = () => {
    if (!!idValue) {
      setLoadingDelete(true);

      deleteRequest(`${MESSAGE_API}/${idValue}`)
        .then((resp) => {
          setOpenDialog(false);

          getMessages(1, 10);

          setLoadingDelete(false);

          message.success(t('Success'));
        })
        .catch(() => {
          setLoadingDelete(false);
        });
    }
  };

  return (
    <>
      <Modal
        title={t('deleteMessage')}
        visible={openDialog}
        onOk={handleDeleteUser}
        onCancel={() => setOpenDialog(false)}
        key={'modal_delete'}
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
                  : handleDeleteUser
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isMessageDelete')}
      </Modal>

      <AppBreadCrumbs pageTitle={''} menuTitle={t('messageManagment')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <MessagesToolbar onSearch={handleSearch} />

        <MessagesTable
          response={valus}
          loading={loading}
          onPaginationChange={handleChangePage}
          onDelete={handleOpenDeleteDialog}
        />
      </Card>
    </>
  );
};

export default Messages;
