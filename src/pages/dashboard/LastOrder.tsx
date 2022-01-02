import React from 'react';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';

import { ColorMode } from 'pages/widget-type';
import { StatusMode } from 'pages/style';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import { ProductStatus } from './widget-type';
import { UtilsHelper } from 'utils/UtilsHelper';

const LastOrder = ({ lastOrderProduct, loading }) => {
  const { t } = useTranslation();

  const tableColumns = [
    {
      title: t('customerName'),
      dataIndex: 'customerName',
    },

    {
      title: t('finalPrice'),
      dataIndex: 'finalPrice',
      render: (_item: string, _record) =>
        _item ? UtilsHelper.threeDigitSeparator(_item) : '',
    },

    {
      title: t('orderStatus'),
      dataIndex: 'orderStatus',
      render: (_elm: number, _record) => {
        if (_elm === ProductStatus.Canceled) {
          return (
            <StatusMode colorType={ColorMode.RED}>
              <span>لغو شده</span>
            </StatusMode>
          );
        }

        if (_elm === ProductStatus.Pending) {
          return (
            <StatusMode colorType={ColorMode.YELLOW}>
              <span>در انتظار تایید</span>
            </StatusMode>
          );
        }

        if (_elm === ProductStatus.Approved) {
          return (
            <StatusMode colorType={ColorMode.BLUE}>
              <span>تایید شده</span>
            </StatusMode>
          );
        }

        if (_elm === ProductStatus.Posted) {
          return (
            <StatusMode colorType={ColorMode.PURPLE}>
              <span>در حال ارسال</span>
            </StatusMode>
          );
        }

        if (_elm === ProductStatus.Delivered) {
          return (
            <StatusMode colorType={ColorMode.GREEN}>
              <span>تحویل داده شده</span>
            </StatusMode>
          );
        }

        if (_elm === ProductStatus.InBasket) {
          return (
            <StatusMode colorType={ColorMode.ORANGE}>
              <span>در سبد خرید</span>
            </StatusMode>
          );
        }

        if (_elm === ProductStatus.ReadyForPay) {
          return (
            <StatusMode colorType={ColorMode.LIGHT_GREEN}>
              <span>آماده پرداخت</span>
            </StatusMode>
          );
        }
      },
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
  ];

  return (
    <>
      <Table
        columns={tableColumns}
        dataSource={lastOrderProduct ? lastOrderProduct : []}
        rowKey='id'
        showSorterTooltip={false}
        locale={{
          emptyText: <EmptyTable caption={t('EmptyOrder')} />,
        }}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default LastOrder;
