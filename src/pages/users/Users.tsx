import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Row, message } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { USERS_CRUD } from 'config/constantApi';
import { IResponse } from 'pages/widget-type';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import UserToolbar from './UserToolbar';
import UserTable from './UserTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';

let source: CancelTokenSource;

const Users = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();
  const query = useQuery();

  const { getRequest, updateRequest } = useHttpRequest();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idValue, setIdValue] = useState<number | undefined>();

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const getUsers = (page?: number, limit?: number) => {
    setLoading(true);

    getRequest(
      `${USERS_CRUD}?page=${page ? page : 1}&Limit=${
        limit ? limit : 10
      }&search=${query.get('search') ? query.get('search') : ''}&roleId=${
        query.get('roleId') ? query.get('roleId') : ''
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
      getUsers();
    }
    return () => {
      source.cancel();
    };
  }, [
    query.get('roleId'),
    query.get('search'),
    query.get('fromDate'),
    query.get('toDate'),
  ]);

  const handleChangePage = (current: number, pageSize: number) => {
    getUsers(current, pageSize);
  };

  const handleOpenDeleteDialog = (id?: number) => (event: React.MouseEvent) => {
    setOpenDialog(true);
    setIdValue(id);
  };

  const handleDeleteUser = () => {
    if (!!idValue) {
      setLoadingDelete(true);

      updateRequest(`${USERS_CRUD}/delete`, { ids: [idValue] })
        .then((resp) => {
          setOpenDialog(false);

          getUsers(1, 10);

          setLoadingDelete(false);

          message.success(t('userSuccessDelete'));
        })
        .catch(() => {
          setLoadingDelete(false);
        });
    }
  };

  useEffect(() => {
    if (!!query.get('prevPage')) {
      handleChangePage(Number(query.get('prevPage')), 10);
    }
  }, []);

  return (
    <>
      <Modal
        title={t('userDelete')}
        visible={openDialog}
        onOk={handleDeleteUser}
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
                  : handleDeleteUser
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isUserDelete')}
      </Modal>

      <AppBreadCrumbs pageTitle={''} menuTitle={t('userManagement')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <UserToolbar />

        <UserTable
          response={valus}
          loading={loading}
          onPaginationChange={handleChangePage}
          onDelete={handleOpenDeleteDialog}
        />
      </Card>
    </>
  );
};

export default Users;
