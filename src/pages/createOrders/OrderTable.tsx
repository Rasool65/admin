import React, { useState, useEffect } from 'react';
import { Button, Table, Tooltip, Avatar } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ColorMode, ITable } from 'pages/widget-type';
import { OrderModel } from './widget-type';
import useQuery from 'hooks/useQuery';

const OrderTable: React.FC<ITable<OrderModel>> = ({
  response: { items },
  loading,
  onPaginationChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const { t } = useTranslation();

  const tableColumns = [
    // {
    //   title: t('record'),
    //   dataIndex: 'Id',
    // },
    {
      title: t('کد محصول'),
      dataIndex: 'code',
    },
    {
      title: t('نام محصول'),
      dataIndex: 'name',
    },
    {
      title: t('تعداد'),
      dataIndex: 'number',
    },
    {
      title: t('price'),
      dataIndex: 'price',
    },
    {
      title: t('actions'),
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='d-flex'>
          <Tooltip title={t('delete')}>
            <Button
              danger={true}
              className='mr-2 d-flex justify-content-center align-items-center'
              icon={<DeleteOutlined />}
              // onClick={onDelete!(record.id)}
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

  // const changeUrl = (Id) => {
  //   if (location.search.includes('?')) {
  //     if (!!query.get('prevPage')) {
  //       query.set('prevPage', String(currentPage));
  //       history.push(`${PRODUCT_EDIT_URL}/${Id}?${query.toString()}`);
  //     } else {
  //       history.push(
  //         `${PRODUCT_EDIT_URL}/${Id}${location.search}&prevPage=${currentPage}`
  //       );
  //     }
  //   } else {
  //     history.push(`${PRODUCT_EDIT_URL}/${Id}?prevPage=${currentPage}`);
  //   }
  // };

  // useEffect(() => {
  //   if (!!query.get('prevPage')) {
  //     setCurrentPage(Number(query.get('prevPage')));
  //   }
  // }, [query.get('prevPage')]);

  // useEffect(() => {
  //   return;
  // }, [currentPage]);

  return (
    <>
      <Table
        columns={tableColumns}
        dataSource={items ? items : []}
        rowKey='id'
        // showSorterTooltip={false}
        // locale={{
        //   emptyText: <EmptyTable caption={t('EmptyProduct')} />,
        // }}
        // loading={loading}
        // pagination={{
        //   total: totalSize,
        //   current: !!currentPage ? currentPage : 1,
        //   hideOnSinglePage: false,
        //   showSizeChanger: true,
        //   position: ['bottomLeft'],
        //   // onChange: handleChange,
        // }}
      />
    </>
  );
};

export default OrderTable;
