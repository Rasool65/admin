import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Row, message, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import axios, { CancelTokenSource } from 'axios';

import { CONSULT_API } from 'config/constantApi';
import { IResponse } from 'pages/widget-type';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import useHttpRequest from 'hooks/useHttpRequest';
import ConsultTable from './ConsultTable';
import ConsultToolbar from './ConsultToolbar';
import useQuery from 'hooks/useQuery';

let source: CancelTokenSource;

function Consult() {
  source = axios.CancelToken.source();

  const { t } = useTranslation();
  const query = useQuery();

  const { getRequest, updateRequest, deleteRequest } = useHttpRequest();

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [idValue, setIdValue] = useState<number | undefined>();

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingActive, setLoadingActive] = useState<boolean>(false);

  const getCounsult = (page?: number, limit?: number, search?: string) => {
    setLoading(true);

    getRequest(
      `${CONSULT_API}?page=${page ? page : 1}&Limit=${
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
    getCounsult();

    return () => {
      source.cancel();
    };
  }, [
    query.get('DiscountType'),
    query.get('search'),
    query.get('fromDate'),
    query.get('toDate'),
  ]);

  const handleChange = (value: string) => {
    getCounsult(1, 10, value);
  };

  const handleChangePage = (current: number, pageSize: number) => {
    getCounsult(current, pageSize);
  };

  const handleSearch = (value: string) => {
    getCounsult(1, 10, value);
  };

  const handleOpenDeleteDialog = (id?: number) => (event: React.MouseEvent) => {
    setOpenDialog(true);
    setIdValue(id);
  };

  const handleDeleteCounsult = () => {
    if (!!idValue) {
      setLoadingDelete(true);

      deleteRequest(`${CONSULT_API}/${idValue}`)
        .then((resp) => {
          setOpenDialog(false);

          getCounsult(1, 10);

          setLoadingDelete(false);

          message.success(t('ConsultSuccessDelete'));
        })
        .catch(() => {
          setLoadingDelete(false);
        });
    }
  };

  const handleActivation = (activeValue: boolean, id: string) => {
    setLoadingActive(true);

    updateRequest(`${CONSULT_API}/${id}/activation`)
      .then((resp) => {
        setLoadingActive(false);

        message.success('عملیات با موفقیت انجام شد');
      })
      .catch(() => {
        setLoadingActive(false);
      });
  };

  return (
    <>
      <Modal
        title={t('ConsultDelete')}
        visible={openDialog}
        onOk={handleDeleteCounsult}
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
                  : handleDeleteCounsult
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isDeleteConsult')}
      </Modal>

      <Spin spinning={loadingActive}>
        <AppBreadCrumbs pageTitle={''} menuTitle={t('ConsultManage')} />

        <Card
          bodyStyle={{ padding: '16px', userSelect: 'none' }}
          bordered={false}
        >
          <ConsultToolbar onSearch={handleChange} />

          <ConsultTable
            response={valus}
            loading={loading}
            onPaginationChange={handleChangePage}
            onDelete={handleOpenDeleteDialog}
            onActive={handleActivation}
          />
        </Card>
      </Spin>
    </>
  );
}

export default Consult;
