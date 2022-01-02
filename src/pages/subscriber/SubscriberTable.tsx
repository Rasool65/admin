import React from 'react';
import { Button, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { DateHelper } from 'utils/dateHelper';
import { UsersListModel, ITable, ColorMode } from 'pages/widget-type';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import { StatusMode } from 'pages/style';

const SubscriberTable: React.FC<ITable<UsersListModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
  onDelete,
  onActive,
}) => {
  const { t } = useTranslation();

  const tableColumns = [
    {
      title: t('email'),
      dataIndex: 'email',
    },

    {
      title: t('registerDate'),
      dataIndex: 'createDate',
      render: (_elm: string, _record) => {
        let modifyTime: string = '';

        if (!!_elm) {
          const timeSplit = _elm.slice(11).split(':');

          modifyTime = `${timeSplit[0]}:${timeSplit[1]}`;
        }

        return _elm.length
          ? `${DateHelper.isoDateTopersian(_elm)} ${modifyTime}`
          : '';
      },
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
              onClick={onDelete!(record.id)}
              size='small'
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleChange = (page: number, pageSize?: number) => {
    onPaginationChange!(page, pageSize ? pageSize : 1);
  };

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
          hideOnSinglePage: false,
          showSizeChanger: true,
          position: ['bottomLeft'],
          onChange: handleChange,
        }}
      />
    </>
  );
};

export default SubscriberTable;
