import React, { useState, useEffect } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useQuery from 'hooks/useQuery';
import { ITable } from 'pages/widget-type';
import { IContactusModel } from './widget-type';
import { CONTACTUS_ADD_URL } from 'config/constantUrl';
import { DateHelper } from 'utils/dateHelper';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';

const DiscountCodeTable: React.FC<ITable<IContactusModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const query = useQuery();
  const { t } = useTranslation();

  const tableColumns = [
    {
      title: t('name'),
      dataIndex: 'name',
    },
    {
      title: t('email'),
      dataIndex: 'email',
    },
    {
      title: t('phoneNumber'),
      dataIndex: 'phoneNumber',
    },
    {
      title: t('ContactUsSubject'),
      dataIndex: 'subject',
    },
    {
      title: t('createDate'),
      dataIndex: 'createDate',
      render: (_elm: string, _record) => {
        let modifyTime: string = '';

        if (!!_elm) {
          const timeSplit = _elm.slice(11).split(':');

          modifyTime = `${timeSplit[0]}:${timeSplit[1]}`;
        }

        return _elm && _elm.length
          ? `${DateHelper.isoDateTopersian(_elm)}`
          : '';
      },
    },
    {
      title: t('actions'),
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='d-flex'>
          <Tooltip title={t('view')}>
            <Button
              danger={true}
              className='d-flex justify-content-center align-items-center btn-outline-primary'
              icon={<EyeOutlined />}
              onClick={() => history.push(`${CONTACTUS_ADD_URL}/${record.id}`)}
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
    onPaginationChange!(page, pageSize ? pageSize : 1);
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
