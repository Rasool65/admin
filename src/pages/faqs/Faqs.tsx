import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Row, message } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { IResponse } from 'pages/widget-type';
import { FAQS_API } from 'config/constantApi';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import FaqsTable from './FaqsTable';
import useHttpRequest from 'hooks/useHttpRequest';
import useQuery from 'hooks/useQuery';
import FaqsToolbar from './FaqsToolbar';

let source: CancelTokenSource;

const Faqs = () => {
  source = axios.CancelToken.source();

  const { t } = useTranslation();
  const query = useQuery();

  const { getRequest, updateRequest } = useHttpRequest();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idValue, setIdValue] = useState<number | undefined>();

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const getFaqs = (page?: number, limit?: number, search?: string) => {
    setLoading(true);

    getRequest(
      `${FAQS_API}?page=${page ? page : 1}&Limit=${limit ? limit : 10}`
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
      getFaqs();
    }
    return () => {
      source.cancel();
    };
  }, []);

  const handleOpenDeleteDialog = (id?: number) => (event: React.MouseEvent) => {
    setOpenDialog(true);
    setIdValue(id);
  };

  const handleDeleteFaqs = () => {
    if (!!idValue) {
      setLoadingDelete(true);

      updateRequest(`${FAQS_API}/delete`, { ids: [idValue] })
        .then((resp) => {
          setOpenDialog(false);

          getFaqs();

          setLoadingDelete(false);

          message.success(t('FaqsDeleteConfirm'));
        })
        .catch(() => {
          setLoadingDelete(false);
        });
    }
  };

  const handleChangePage = (current: number, pageSize: number) => {
    getFaqs(current, pageSize);
  };

  useEffect(() => {
    if (!!query.get('prevPage')) {
      handleChangePage(Number(query.get('prevPage')), 10);
    }
  }, []);

  return (
    <>
      <Modal
        title={t('FaqsDelete')}
        visible={openDialog}
        onOk={handleDeleteFaqs}
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
                  : handleDeleteFaqs
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isDeleteFaqs')}
      </Modal>

      <AppBreadCrumbs pageTitle={''} menuTitle={t('FaqsManage')} />

      <Card
        bodyStyle={{ padding: '16px', userSelect: 'none' }}
        bordered={false}
      >
        <FaqsToolbar />

        <FaqsTable
          response={valus}
          loading={loading}
          onDelete={handleOpenDeleteDialog}
          onPaginationChange={handleChangePage}
        />
      </Card>
    </>
  );
};

export default Faqs;
