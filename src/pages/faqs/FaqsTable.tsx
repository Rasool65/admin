import React, { useEffect, useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { ITable } from 'pages/widget-type';
import { IFaqsModel } from './widget-type';
import { FAQS_ADD_URL } from 'config/constantUrl';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import useQuery from 'hooks/useQuery';

const DiscountCodeTable: React.FC<ITable<IFaqsModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const { t } = useTranslation();

  const tableColumns = [
    {
      title: t('question'),
      dataIndex: 'question',
    },
    {
      title: t('answer'),
      dataIndex: 'answer',
    },
    {
      title: t('actions'),
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='d-flex'>
          <Tooltip title={t('edit')}>
            <Button
              danger={true}
              className='d-flex justify-content-center align-items-center btn-outline-primary'
              icon={<EditOutlined />}
              onClick={() => changeUrl(record.id)}
              size='small'
            />
          </Tooltip>
          <Tooltip title={t('delete')}>
            <Button
              danger={true}
              className='mr-2 d-flex justify-content-center align-items-center'
              icon={<DeleteOutlined />}
              onClick={onDelete!(record.id)}
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
        history.push(`${FAQS_ADD_URL}/${Id}?${query.toString()}`);
      } else {
        history.push(
          `${FAQS_ADD_URL}/${Id}${location.search}&prevPage=${currentPage}`
        );
      }
    } else {
      history.push(`${FAQS_ADD_URL}/${Id}?prevPage=${currentPage}`);
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
      <Table
        columns={tableColumns}
        dataSource={items ? items : []}
        rowKey='id'
        showSorterTooltip={false}
        locale={{
          emptyText: <EmptyTable caption={t('EmptyUser')} />,
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

export default DiscountCodeTable;
