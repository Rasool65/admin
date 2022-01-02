import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Tooltip,
  Switch,
  Modal,
  Row,
  Form,
  Col,
  Input,
  message,
  Select,
  Divider,
} from 'antd';
import { DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useHttpRequest from 'hooks/useHttpRequest';
import { CONSULT_API } from 'config/constantApi';

import { DateHelper } from 'utils/dateHelper';
import { UsersListModel, ITable, ColorMode } from 'pages/widget-type';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import { StatusMode } from 'pages/style';
import { UtilsHelper } from 'utils/UtilsHelper';
import '../commonStyle.scss';

const { Option } = Select;

const ConsultTable: React.FC<ITable<UsersListModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
  onDelete,
  onActive,
}) => {
  const { t } = useTranslation();
  const [openHistoryModal, setOpenHistoryModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { postRequest, getRequest } = useHttpRequest();
  const [historyValue, setHistoryValue] = useState<any>([]);
  const [consultId, setConsultId] = useState<number>();

  const statuses = [
    { status: 1, name: t('علاقه مند') },
    { status: 2, name: t('عدم تمایل') },
    { status: 3, name: t('خریداری شده') },
    { status: 4, name: t('عدم پاسخگویی') },
  ];

  const tableColumns = [
    {
      title: t('customerName'),
      dataIndex: 'customerName',
    },
    {
      title: t('phoneNumber'),
      dataIndex: 'customerPhone',
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
      title: t('isSettle'),
      dataIndex: 'isSettle',
      render: (_, elm) => (
        <Switch
          defaultChecked={elm.isSettle}
          onChange={(e) => onActive!(e, elm.id)}
        />
      ),
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
          {/* <Tooltip title={t('تاریخچه')}>
                        <Button
                            danger={true}
                            className='mr-2 d-flex justify-content-center align-items-center btn-outline-primary'
                            icon={<HistoryOutlined />}
                            onClick={() => { handleOpenHistoryModal(record.id); }}
                            size='small'

                        />
                    </Tooltip> */}
        </div>
      ),
    },
  ];

  const handleChange = (page: number, pageSize?: number) => {
    onPaginationChange!(page, pageSize ? pageSize : 1);
  };

  const handleAddComment = () => {
    form
      .validateFields()
      .then((values) => {
        const body = { consultId: consultId, ...values };
        postRequest(`${CONSULT_API}/addconsulthistory`, body)
          .then((resp) => {
            setOpenHistoryModal(false);
            message.success(t('Success'));
          })
          .catch(() => {
            return;
          });
      })
      .catch((info) => {
        return;
      });
  };
  const handleOpenHistoryModal = (id) => {
    setConsultId(id);
    getRequest(`${CONSULT_API}/${id}/consulthistory`)
      .then((resp) => {
        setHistoryValue(resp.data);
      })
      .catch(() => {
        return;
      });
    setOpenHistoryModal(true);
  };

  const renderStatus = (id) => {
    if (id === 1) {
      return (
        <StatusMode colorType={ColorMode.BLUE}>
          <span>{statuses[0].name}</span>
        </StatusMode>
      );
    } else if (id === 2) {
      return (
        <StatusMode colorType={ColorMode.YELLOW}>
          <span>{statuses[1].name}</span>
        </StatusMode>
      );
    } else if (id === 3) {
      return (
        <StatusMode colorType={ColorMode.GREEN}>
          <span>{statuses[2].name}</span>
        </StatusMode>
      );
    } else if (id === 4) {
      return (
        <StatusMode colorType={ColorMode.RED}>
          <span>{statuses[3].name}</span>
        </StatusMode>
      );
    }
  };

  return (
    <>
      <Modal
        title={'تاریخچه'}
        visible={openHistoryModal}
        onOk={handleAddComment}
        onCancel={() => setOpenHistoryModal(false)}
        key={'modal_history'}
        width={450}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button type={'primary'} onClick={handleAddComment}>
              اعمال
            </Button>

            <Button
              onClick={() => {
                setOpenHistoryModal(false);
              }}
            >
              انصراف
            </Button>
          </Row>,
        ]}
      >
        <Form className={'w-100'} form={form} layout='vertical'>
          <Row>
            {historyValue.length > 0 ? (
              <Col className='messages' xs={24} sm={24} md={24}>
                {historyValue.map((item, index) => {
                  return (
                    <div className={'banck'} key={index}>
                      <div className={'banck__detail'}>
                        <span> نام : </span>
                        <span>{item.userName}</span>
                      </div>
                      <div className={'banck__detail'}>
                        <span> پیام : </span>
                        <span>{item.comment}</span>
                      </div>
                      <div className={'banck__detail'}>
                        <span> تاریخ : </span>
                        <span>
                          {DateHelper.isoDateTopersian(item.createDate)}
                        </span>
                      </div>
                      <div className={'banck__detail'}>
                        <span> وضعیت : </span>
                        {renderStatus(item.status)}
                      </div>
                      <Divider />
                    </div>
                  );
                })}
              </Col>
            ) : (
              ''
            )}

            <Col xs={24} sm={24} md={24}>
              <Form.Item label={'وضعیت'} name='status'>
                <Select placeholder={t('وضعیت')} loading={false}>
                  {statuses.map((_elm: { status: number; name: string }) => (
                    <Option key={_elm.status} value={_elm.status}>
                      {_elm.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={t('پیام')}
                name='comment'
                rules={[
                  {
                    required: true,
                    message: t('متن مورد نظر خود را وارد کنید...'),
                    type: 'string',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

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

export default ConsultTable;
