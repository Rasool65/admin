import React, { useState, useEffect } from 'react';
import {
  Table,
  Tooltip,
  Button,
  Modal,
  Row,
  Form,
  Col,
  Input,
  message,
  List,
  Switch,
} from 'antd';
import {
  AlertTwoTone,
  EyeOutlined,
  LockOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UsersListModel, ITable, ColorMode } from 'pages/widget-type';
import { DateHelper } from 'utils/dateHelper';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import useHttpRequest from 'hooks/useHttpRequest';
import { CUSTOMERS_CRUD, CUSTOMERS_SET_PASSWORD } from 'config/constantApi';
import { StatusMode } from 'pages/style';
import { CUSTOMER_DETAIL_URL } from 'config/constantUrl';
import useQuery from 'hooks/useQuery';

const CustomersTable: React.FC<ITable<UsersListModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
  onDelete,
  onActive,
  isMain,
  getCustomers,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const query = useQuery();
  const [form] = Form.useForm();
  const { updateRequest, getRequest } = useHttpRequest();
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<number>();

  const [detailModal, setDetailModal] = useState<boolean>(false);
  const [details, setDetails] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const getDetail = (item) => {
    setDetails(item);
    setDetailModal(true);
  };
  const changeUrl = (Id) => {
    if (location.search.includes('?')) {
      if (!!query.get('prevPage')) {
        query.set('prevPage', String(currentPage));
        history.push(`${CUSTOMER_DETAIL_URL}/${Id}?${query.toString()}`);
      } else {
        history.push(
          `${CUSTOMER_DETAIL_URL}/${Id}${location.search}&prevPage=${currentPage}`
        );
      }
    } else {
      history.push(`${CUSTOMER_DETAIL_URL}/${Id}?prevPage=${currentPage}`);
    }
  };

  const activationCustomer = (id) => {
    updateRequest(`${CUSTOMERS_CRUD}/${id}/activation`)
      .then((resp) => {
        message.success(t('Success'));
        if (getCustomers) getCustomers();
      })
      .catch(() => {
        return;
      });
  };

  const tableMainColumns = [
    {
      title: t('CustomerId'),
      dataIndex: 'solicoCustomerId',
    },
    {
      title: t('نام مشتری'),
      dataIndex: 'fullName',
    },
    {
      title: t('phoneNumber'),
      dataIndex: 'mobile',
    },
    {
      title: t('country'),
      dataIndex: 'country',
    },
    {
      title: t('region'),
      dataIndex: 'region',
    },
    {
      title: t('cityCode'),
      dataIndex: 'cityCode',
    },
    {
      title: t('آیدی پرداخت کننده'),
      dataIndex: 'payerId',
    },

    {
      title: t('active'),
      dataIndex: 'isActive',
      render: (_, _record) => {
        return (
          <Switch
            defaultChecked={_record.isActive}
            onChange={() => {
              activationCustomer(_record.id);
            }}
          />
        );
      },
    },
    {
      title: t('تاریخ'),
      dataIndex: 'syncDate',
      render: (_elm: string, _record) => {
        let modifyTime: string = '';

        if (!!_elm) {
          const timeSplit = _elm.slice(11).split(':');

          modifyTime = `${timeSplit[0]}:${timeSplit[1]}`;
        }

        return _elm.length ? `${DateHelper.isoDateTopersian(_elm)}` : '';
      },
    },
    {
      title: t('ساعت'),
      dataIndex: 'syncDate',
      render: (_elm: string, _record) => {
        let modifyTime: string = '';

        if (!!_elm) {
          const timeSplit = _elm.slice(11).split(':');

          modifyTime = `${timeSplit[0]}:${timeSplit[1]}`;
        }
        return _elm.length ? ` ${modifyTime}` : '';
      },
    },
    {
      title: t('actions'),
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='d-flex'>
          <Tooltip title={t('detail')}>
            <Button
              danger={true}
              className='mr-2 justify-content-center align-items-center btn-outline-primary'
              icon={<EyeOutlined />}
              onClick={() => {
                getDetail(record);
              }}
              size='small'
            />
          </Tooltip>
          <Tooltip title={t('edit')}>
            <Button
              danger={true}
              className='mr-2 d-flex justify-content-center align-items-center btn-outline-primary'
              icon={<EditOutlined />}
              onClick={() => {
                changeUrl(record.id);
              }}
              size='small'
            />
          </Tooltip>
          <Tooltip title={t('createPassword')}>
            <Button
              danger={true}
              className='mr-2 d-flex justify-content-center align-items-center btn-outline-primary'
              icon={<LockOutlined />}
              onClick={() => {
                handleOpenHistoryModal(record.id, record.mobile);
              }}
              size='small'
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: t('solicoCustomerId'),
      dataIndex: 'solicoCustomerId',
    },
    {
      title: t('isDone'),
      dataIndex: 'isDone',
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
  ];

  const handleChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    onPaginationChange!(page, pageSize ? pageSize : 1);
  };

  const handleOpenHistoryModal = (id, mobile) => {
    form.setFieldsValue({
      mobile,
    });
    setCustomerId(id);
    setOpenEditModal(true);
  };

  const handleSetPassword = () => {
    form
      .validateFields()
      .then((values) => {
        const body = { id: customerId, ...values };
        updateRequest(`${CUSTOMERS_SET_PASSWORD}`, body)
          .then((resp) => {
            setOpenEditModal(false);
            message.success(t('Success'));
            if (getCustomers) getCustomers();
          })
          .catch(() => {
            return;
          });
      })
      .catch((info) => {
        return;
      });
  };
  useEffect(() => {
    if (!!query.get('prevPage')) {
      setCurrentPage(Number(query.get('prevPage')));
    }
  }, [query.get('prevPage')]);
  return (
    <>
      <Modal
        title={t('detail')}
        visible={detailModal}
        onCancel={() => setDetailModal(false)}
        key={'modal_create'}
        width={450}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button onClick={() => setDetailModal(false)}>بستن</Button>
          </Row>,
        ]}
      >
        <Row>
          <Col xs={24} sm={24} md={24}>
            <List itemLayout='horizontal'>
              <List.Item>
                <List.Item.Meta
                  title={<a>نام کامل :</a>}
                  description={details.fullName}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>آیدی مشتری :</a>}
                  description={details.solicoCustomerId}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>کد شهر :</a>}
                  description={details.cityCode}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>منطقه :</a>}
                  description={details.region}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>کشور :</a>}
                  description={details.country}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>موبایل :</a>}
                  description={details.mobile}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>شماره آدرس :</a>}
                  description={details.addressNumber}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>آدرس :</a>}
                  description={details.address}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>تلفن :</a>}
                  description={details.phone}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>آیدی پرداخت کننده</a>}
                  description={details.payerId}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>تاریخ ایجاد :</a>}
                  description={DateHelper.isoDateTopersian(details.syncDate)}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title={<a>فعال :</a>}
                  description={
                    details.isActive ? (
                      <StatusMode colorType={ColorMode.GREEN}>
                        <span>بله</span>
                      </StatusMode>
                    ) : (
                      <StatusMode colorType={ColorMode.RED}>
                        <span>خیر</span>
                      </StatusMode>
                    )
                  }
                />
              </List.Item>
            </List>
          </Col>
        </Row>
      </Modal>

      <Modal
        title={t('createPassword')}
        visible={openEditModal}
        onOk={handleSetPassword}
        onCancel={() => setOpenEditModal(false)}
        key={'modal_history'}
        width={450}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button type={'primary'} onClick={handleSetPassword}>
              اعمال
            </Button>

            <Button
              onClick={() => {
                setOpenEditModal(false);
              }}
            >
              انصراف
            </Button>
          </Row>,
        ]}
      >
        <Form className={'w-100'} form={form} layout='vertical'>
          <Row>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={t('mobile')}
                name='mobile'
                rules={[
                  {
                    type: 'regexp',
                  },
                  {
                    required: true,
                    pattern: /^(?:0)?(9\d{9})$/,
                    message: t('لطفا شماره موبایل را به درستی وارد نمایید'),
                  },
                ]}
              >
                <Input placeholder='09xxxxxxxxx' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                name='password'
                label={t('password')}
                rules={[
                  {
                    required: true,
                    message: t('pleaseInsertPassword'),
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className='text-primary' />}
                  autoComplete={'off'}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Table
        columns={isMain ? tableMainColumns : columns}
        dataSource={items ? items : []}
        rowKey='id'
        showSorterTooltip={false}
        locale={{
          emptyText: <EmptyTable caption={t('EmptyCustomers')} />,
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

export default CustomersTable;
