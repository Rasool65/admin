import React, { useState, useEffect } from 'react';
import { Button, Table, Tooltip, Avatar } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { DateHelper } from 'utils/dateHelper';
import { StatusMode } from 'pages/style';
import { ColorMode, ITable } from 'pages/widget-type';
import { ProductModel } from './widget-type';
import { PRODUCT_EDIT_URL, PRODUCT_URL } from 'config/constantUrl';
import { BASE_URL } from 'config/urls';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import useQuery from 'hooks/useQuery';

const ProductTable: React.FC<ITable<ProductModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const { t } = useTranslation();

  const tableColumns = [
    {
      title: t('image'),
      dataIndex: 'image',
      render: (_elm: string, _record) => (
        <Avatar src={`${BASE_URL}${_elm}`} size={'large'} />
      ),
    },
    {
      title: t('کدمحصول'),
      dataIndex: 'materialId',
    },
    {
      title: t('نام محصول'),
      dataIndex: 'name',
    },
    {
      title: 'division',
      dataIndex: 'division',
    },

    // {
    //     title: t('materialType'),
    //     dataIndex: 'materialType',

    // },
    {
      title: t('unit'),
      dataIndex: 'unit',
    },
    {
      title: t('categoryName'),
      dataIndex: 'categoryName',
    },
    {
      title: t('isSpecial'),
      dataIndex: 'isSpecial',
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
    //     title: t('longDescription'),
    //     dataIndex: 'longDescription',
    //     render: (_item: string, _record) => (
    //         <div dangerouslySetInnerHTML={{ __html: _record.longDescription }} />
    //     )

    // },
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
        history.push(`${PRODUCT_EDIT_URL}/${Id}?${query.toString()}`);
      } else {
        history.push(
          `${PRODUCT_EDIT_URL}/${Id}${location.search}&prevPage=${currentPage}`
        );
      }
    } else {
      history.push(`${PRODUCT_EDIT_URL}/${Id}?prevPage=${currentPage}`);
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
          emptyText: <EmptyTable caption={t('EmptyProduct')} />,
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
