import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Tooltip,
  Avatar,
  message,
  Switch,
  Modal,
  Row,
  Col,
} from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EyeOutlined, ApiOutlined } from '@ant-design/icons';

import { DateHelper } from 'utils/dateHelper';
import { StatusMode } from 'pages/style';
import { ColorMode, ITable } from 'pages/widget-type';
import { OrderModel } from './widget-type';
import { ORDER_DETAIL_URL } from 'config/constantUrl';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import { UtilsHelper } from 'utils/UtilsHelper';
import useHttpRequest from 'hooks/useHttpRequest';
import { ORDER_API } from 'config/constantApi';
import useQuery from 'hooks/useQuery';

const ProductTable: React.FC<ITable<OrderModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const { t } = useTranslation();
  const { updateRequest } = useHttpRequest();

  const [open, setOpen] = useState<boolean>(false);
  const [id, setOrderId] = useState<string>('');

  const cancelationOrderOpenModal = (idRow) => {
    setOpen(true);
    setOrderId(idRow);
  };

  const cancelationOrder = () => {
    updateRequest(`${ORDER_API}/${id}/cancelorder`)
      .then((resp) => {
        setOpen(false);

        message.success(t('Success'));
      })
      .catch(() => {
        return;
      });
  };

  const renderStatus = (item) => {
    if (item === 1) {
      return (
        <StatusMode colorType={ColorMode.RED}>
          <span>لغو شده</span>
        </StatusMode>
      );
    } else if (item === 2) {
      return (
        <StatusMode colorType={ColorMode.YELLOW}>
          <span>در انتظار تایید</span>
        </StatusMode>
      );
    } else if (item === 3) {
      return (
        <StatusMode colorType={ColorMode.BLUE}>
          <span>تایید شده</span>
        </StatusMode>
      );
    } else if (item === 4) {
      return (
        <StatusMode colorType={ColorMode.PURPLE}>
          <span>در حال ارسال</span>
        </StatusMode>
      );
    } else if (item === 5) {
      return (
        <StatusMode colorType={ColorMode.GREEN}>
          <span>تحویل داده شده</span>
        </StatusMode>
      );
    } else if (item === 6) {
      return (
        <StatusMode colorType={ColorMode.ORANGE}>
          <span>در سبد خرید</span>
        </StatusMode>
      );
    } else if (item === 7) {
      return (
        <StatusMode colorType={ColorMode.LIGHT_GREEN}>
          <span>آماده پرداخت</span>
        </StatusMode>
      );
    }
  };

  const tableColumns = [
    {
      title: t('orderNumber'),
      dataIndex: 'orderNumber',
    },
    {
      title: t('finalAmount'),
      dataIndex: 'finalAmount',
      render: (_item: string, _record) =>
        _item ? UtilsHelper.threeDigitSeparator(_item) : '',
    },
    {
      title: t('quotationNumber'),
      dataIndex: 'quotationNumber',
    },
    {
      title: t('orderStatus'),
      dataIndex: 'orderStatus',
      render: (_item: boolean, _record) => renderStatus(_item),
    },
    {
      title: t('isSuccess'),
      dataIndex: 'isSuccess',
      render: (_item: boolean, _record) =>
        _item ? (
          <StatusMode colorType={ColorMode.GREEN}>
            <span>بله</span>
          </StatusMode>
        ) : (
          <StatusMode colorType={ColorMode.RED}>
            <span>خیر</span>
          </StatusMode>
        ),
    },
    {
      title: t('createDate'),
      dataIndex: 'createDate',
      render: (_item: string, _record) =>
        _item ? DateHelper.isoDateTopersian(_item) : '',
    },
    // {
    //     title: t('actions'),
    //     dataIndex: 'actions',
    //     render: (_, _record) => (
    //         <Switch defaultChecked={_record.isActive} onChange={() => { cancelationOrder(_record.id); }} />
    //     )
    // },
    {
      title: t('actions'),
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='d-flex'>
          <Tooltip title={'لغو سفارش'}>
            <Button
              danger={true}
              className='d-flex justify-content-center align-items-center btn-outline-primary'
              icon={<ApiOutlined />}
              onClick={() => {
                cancelationOrderOpenModal(record.id);
              }}
              size='small'
            />
          </Tooltip>

          <Tooltip title={t('detail')}>
            <Button
              danger={true}
              className='mr-2 d-flex justify-content-center align-items-center btn-outline-primary'
              icon={<EyeOutlined />}
              onClick={() => changeUrl(record.id)}
              size='small'
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    onPaginationChange!(page, pageSize ? pageSize : 1);
  };

  const changeUrl = (Id) => {
    if (location.search.includes('?')) {
      if (!!query.get('prevPage')) {
        query.set('prevPage', String(currentPage));
        history.push(`${ORDER_DETAIL_URL}/${Id}?${query.toString()}`);
      } else {
        history.push(
          `${ORDER_DETAIL_URL}/${Id}${location.search}&prevPage=${currentPage}`
        );
      }
    } else {
      history.push(`${ORDER_DETAIL_URL}/${Id}?prevPage=${currentPage}`);
    }
  };

  useEffect(() => {
    if (!!query.get('prevPage')) {
      setCurrentPage(Number(query.get('prevPage')));
    }
  }, [query.get('prevPage')]);

  useEffect(() => {
    return;
  }, [currentPage]);

  return (
    <>
      <Modal
        title={'لغو سفارش'}
        visible={open}
        onCancel={() => setOpen(false)}
        key={'modal_create'}
        width={275}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button onClick={() => setOpen(false)}>بستن</Button>

            <Button type={'primary'} onClick={cancelationOrder}>
              اعمال
            </Button>
          </Row>,
        ]}
      >
        <Row>
          <Col xs={24} sm={24} md={24}>
            آیا از لغو این سفارش اطمینان دارید ؟
          </Col>
        </Row>
      </Modal>

      <Table
        columns={tableColumns}
        dataSource={items ? items : []}
        rowKey='id'
        showSorterTooltip={false}
        locale={{
          emptyText: <EmptyTable caption={t('EmptyOrder')} />,
        }}
        loading={loading}
        pagination={{
          total: totalSize,
          current: !!currentPage ? currentPage : 1,
          hideOnSinglePage: false,
          showSizeChanger: true,
          position: ['bottomLeft'],
          onChange: handleChange,
        }}
      />
    </>
  );
};

export default ProductTable;
