import React, { useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ITable } from 'pages/widget-type';
import { OrderModel } from './widget-type';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';

const OrderTable: React.FC<ITable<OrderModel>> = ({
  response: productsList,
  onDelete,
  loading,
  // onPaginationChange,
}) => {
  // const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const tableColumns = [
    {
      title: t('record'),
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: t('کد محصول'),
      dataIndex: 'productId',
      width: 100,
    },
    {
      title: t('نام محصول'),
      dataIndex: 'name',
    },
    {
      title: t('تعداد'),
      dataIndex: 'count',
      width: 70,
    },
    {
      title: t('unitPriceProduct'),
      dataIndex: 'unitPrice',
      width: 130,
    },
    {
      title: t('sumPrice'),
      dataIndex: 'price',
      width: 150,
    },
    {
      title: t('actions'),
      dataIndex: 'actions',
      width: 100,
      render: (_, record) => (
        <div className='d-flex'>
          <Tooltip title={t('delete')}>
            <Button
              danger={true}
              className='mr-2 d-flex justify-content-center align-items-center'
              icon={<DeleteOutlined />}
              onClick={onDelete!(record.productId)}
              size='small'
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // const handleChange = (page: number, pageSize?: number) => {
  //   setCurrentPage(page);
  //   onPaginationChange!(page, pageSize ? pageSize : 1);
  // };

  return (
    <>
      <Table
        scroll={{ x: 1024, y: 240 }}
        columns={tableColumns}
        dataSource={productsList ? productsList : []}
        rowKey='id'
        showSorterTooltip={false}
        locale={{
          emptyText: <EmptyTable caption={t('EmptyProduct')} />,
        }}
        loading={loading}
        pagination={false}
        // pagination={{
        //   total: productsList.length,
        //   current: !!currentPage ? currentPage : 1,
        //   hideOnSinglePage: false,
        //   showSizeChanger: true,
        //   position: ['bottomLeft'],
        //   onChange: handleChange,
        // }}
      />
    </>
  );
};

export default OrderTable;
