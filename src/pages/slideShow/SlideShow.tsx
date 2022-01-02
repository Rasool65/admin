import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Row, message, Spin } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { SLIDE_SHOW_CRUD } from 'config/constantApi';
import { IResponse } from 'pages/widget-type';
import AppBreadCrumbs from 'layouts/appBreadcrumbs/AppBreadcrumbs';
import useHttpRequest from 'hooks/useHttpRequest';
import SlideShowToolbar from './SlideShowToolbar';
import SlideShowList from './SlideShowList';

import './style.scss';

let source: CancelTokenSource;

const SlideShow = () => {
  source = axios.CancelToken.source();

  const { getRequest, updateRequest } = useHttpRequest();
  const { t } = useTranslation();

  const [idValue, setIdValue] = useState<number | undefined>();

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [valus, setValue] = useState<IResponse<any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getSlides = (page?: number, limit?: number, search?: string) => {
    setLoading(true);

    getRequest(
      `${SLIDE_SHOW_CRUD}?page=${page ? page : 1}&Limit=${
        limit ? limit : 100
      }&search=${search ? search : ''}`,
      { cancelToken: source.token }
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
    getSlides();

    return () => {
      source.cancel();
    };
  }, []);

  const handleOpenDeleteDialog = (id?: number) => (event: React.MouseEvent) => {
    setOpenDialog(true);
    setIdValue(id);
  };

  const handleDelete = () => {
    if (!!idValue) {
      setLoadingDelete(true);

      updateRequest(`${SLIDE_SHOW_CRUD}/delete`, { ids: [idValue] })
        .then((resp) => {
          setOpenDialog(false);

          getSlides(1, 100);

          setLoadingDelete(false);

          message.success(t('deleteSuccessSlide'));
        })
        .catch(() => {
          setLoadingDelete(false);
        });
    }
  };

  return (
    <>
      <Modal
        title={t('deleteSlide')}
        visible={openDialog}
        onOk={handleDelete}
        onCancel={() => setOpenDialog(false)}
        key={'delete_slide_show'}
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
                  : handleDelete
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isdeleteSlide')}
      </Modal>

      <AppBreadCrumbs pageTitle={''} menuTitle={t('slideShow')} />

      <Spin spinning={loading}>
        <Card
          bodyStyle={{ padding: '16px', userSelect: 'none' }}
          bordered={false}
        >
          <SlideShowToolbar />

          <SlideShowList response={valus} onDelete={handleOpenDeleteDialog} />
        </Card>
      </Spin>
    </>
  );
};

export default SlideShow;
