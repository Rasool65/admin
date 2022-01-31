import React, { useState } from 'react';
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
  Select,
  Divider,
} from 'antd';
import { DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UsersListModel, ITable, ColorMode } from 'pages/widget-type';
import { DateHelper } from 'utils/dateHelper';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import useHttpRequest from 'hooks/useHttpRequest';
import { MESSAGE_API } from 'config/constantApi';
import { StatusMode } from 'pages/style';
import { StyleNewMessageCount } from './style';

const MessagesTable: React.FC<ITable<UsersListModel>> = ({
  response: { items, totalSize },
  loading,
  onPaginationChange,
  onDelete,
  onActive,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { getRequest, postRequest } = useHttpRequest();

  const [openReplyModal, setOpenReplyModal] = useState<boolean>(false);
  const [lastViewMessageIds, setLastViewMessageIds] = useState<string[]>([]);
  const [messageId, setMessageId] = useState<number>();
  const [conversationValue, setConversationValue] = useState<any>([]);

  const existMessageIdInLastView = (messageId: string) => {
    return lastViewMessageIds.some((item) => item === messageId);
  };

  const handleOpenReplyModal = (id) => {
    setMessageId(id);
    getRequest(`${MESSAGE_API}/${id}/conversation`)
      .then((resp) => {
        setConversationValue(resp.data);
      })
      .catch(() => {
        return;
      });
    setOpenReplyModal(true);
  };

  const handleAddComment = () => {
    form
      .validateFields()
      .then((values) => {
        const body = {
          parentMessageId: messageId,
          file: '',
          ...values,
        };
        postRequest(`${MESSAGE_API}/replymessage`, body)
          .then((resp) => {
            setOpenReplyModal(false);
            message.success(t('Success'));
            form.setFieldsValue({
              content: '',
            });
          })
          .catch(() => {
            return;
          });
      })
      .catch((info) => {
        return;
      });
  };

  const Columns = [
    {
      title: t('userName'),
      dataIndex: 'userName',
    },
    {
      title: t('customerName'),
      dataIndex: 'customerName',
    },
    {
      title: t('title'),
      dataIndex: 'title',
    },
    {
      title: t('sendDate'),
      dataIndex: 'sendDate',
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
          <Tooltip title={t('پاسخ')}>
            <StyleNewMessageCount
              isHidden={
                record.notSeenMessagesCount <= 0 ||
                existMessageIdInLastView(record.messageId.toString())
              }
            >
              {record.notSeenMessagesCount}
            </StyleNewMessageCount>
            <Button
              danger={true}
              className='mr-2 d-flex justify-content-center align-items-center btn-outline-primary'
              icon={<MessageOutlined />}
              onClick={() => {
                handleOpenReplyModal(record.messageId);
                if (!existMessageIdInLastView(record.messageId.toString())) {
                  setLastViewMessageIds([
                    ...lastViewMessageIds,
                    record.messageId,
                  ]);
                }
              }}
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

  return (
    <>
      <Modal
        title={'پاسخ'}
        visible={openReplyModal}
        onOk={handleAddComment}
        onCancel={() => setOpenReplyModal(false)}
        key={'modal_history'}
        width={450}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button type={'primary'} onClick={handleAddComment}>
              اعمال
            </Button>

            <Button
              onClick={() => {
                setOpenReplyModal(false);
              }}
            >
              انصراف
            </Button>
          </Row>,
        ]}
      >
        <Form className={'w-100'} form={form} layout='vertical'>
          <Row>
            {conversationValue.length > 0 ? (
              <Col className='messages' xs={24} sm={24} md={24}>
                {conversationValue.map((item, index) => {
                  return (
                    <div className={'banck'} key={index}>
                      <div className={'banck__detail'}>
                        <span> نام ادمین : </span>
                        <span>{item.userName}</span>
                      </div>
                      <div className={'banck__detail'}>
                        <span> نام مشتری : </span>
                        <span>{item.customerName}</span>
                      </div>
                      <div className={'banck__detail'}>
                        <span> پیام : </span>
                        <span>{item.content}</span>
                      </div>
                      <div className={'banck__detail'}>
                        <span> تاریخ ارسال : </span>
                        <span>
                          {DateHelper.isoDateToPersianDateTime(item.sendDate)}
                        </span>
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
              <Form.Item
                label={t('پیام')}
                name='content'
                rules={[
                  {
                    message: t('پیام مورد نظر خود را وارد کنید...'),
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
        columns={Columns}
        dataSource={items ? items : []}
        rowKey='id'
        showSorterTooltip={false}
        locale={{
          emptyText: <EmptyTable caption={t('EmptyMessages')} />,
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

export default MessagesTable;
