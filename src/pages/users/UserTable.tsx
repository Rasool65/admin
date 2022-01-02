import React, { useState, useEffect } from 'react';
import { Button, Table, Tooltip, Avatar } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from 'config/urls';

import { UsersListModel, ITable, ColorMode } from 'pages/widget-type';
import { StatusMode } from 'pages/style';
import { ADD_USER, USERS_PASS } from 'config/constantUrl';
import { DateHelper } from 'utils/dateHelper';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import useQuery from 'hooks/useQuery';

const UserTable: React.FC<ITable<UsersListModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
  onDelete,
  onActive,
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);

  const tableColumns = [
    {
      title: t('avatar'),
      dataIndex: 'avatar',
      render: (_elm: string, _record) => (
        <Avatar src={`${BASE_URL}${_elm}`} size={'large'} />
      ),
    },
    {
      title: t('fullName'),
      dataIndex: 'fullName',
    },
    {
      title: t('email'),
      dataIndex: 'email',
    },

    {
      title: t('phoneNumber'),
      dataIndex: 'phoneNumber',
    },

    // {
    //     title: t('isEmailConfirmed'),
    //     dataIndex: 'isEmailConfirmed',
    //     render: (_item: boolean, _record) => (
    //         _item ?
    //             (
    //                 <StatusMode colorType={ColorMode.GREEN} >
    //                     <span>تایید شده</span>
    //                 </StatusMode >
    //             )
    //             :
    //             (
    //                 <StatusMode colorType={ColorMode.RED} >
    //                     <span>تایید نشده</span>
    //                 </StatusMode >
    //             )
    //     )

    // },
    // {
    //     title: t('isPhoneConfirmed'),
    //     dataIndex: 'isPhoneConfirmed',
    //     render: (_item: boolean, _record) => (
    //         _item ?
    //             (
    //                 <StatusMode colorType={ColorMode.GREEN} >
    //                     <span>تایید شده</span>
    //                 </StatusMode >
    //             )
    //             :
    //             (
    //                 <StatusMode colorType={ColorMode.RED} >
    //                     <span>تایید نشده</span>
    //                 </StatusMode >
    //             )
    //     )

    // },
    {
      title: t('roleName'),
      dataIndex: 'roleName',
      render: (_item: string, _record) => (
        <StatusMode colorType={ColorMode.GREEN}>
          <span>{_item}</span>
        </StatusMode>
      ),
    },
    {
      title: t('registerDate'),
      dataIndex: 'registerDate',
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
        history.push(`${ADD_USER}/${Id}?${query.toString()}`);
      } else {
        history.push(
          `${ADD_USER}/${Id}${location.search}&prevPage=${currentPage}`
        );
      }
    } else {
      history.push(`${ADD_USER}/${Id}?prevPage=${currentPage}`);
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

export default UserTable;
