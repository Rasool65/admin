import React, { useState, useEffect } from 'react';
import {
  Card,
  Spin,
  Button,
  Form,
  Input,
  message,
  Row,
  Col,
  InputNumber,
  Select,
  Switch,
} from 'antd';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdArrowBack } from 'react-icons/md';

import { FAQS_API } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import { FAQS_URL } from 'config/constantUrl';

const FaqsAddEdit = () => {
  // tslint:disable
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const { getRequest, postRequest, updateRequest } = useHttpRequest();
  const { id } = useParams();
  const [form] = Form.useForm();

  const [loadingById, setLoadingById] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!!id) {
      setLoadingById(true);

      getRequest(`${FAQS_API}/${id}`)
        .then((resp) => {
          form.setFieldsValue({
            answer: resp.data.answer,
            question: resp.data.question,
          });

          setLoadingById(false);
        })
        .catch((err) => {
          setLoadingById(false);
        });
    }
  }, [id]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const body = {
          answer: values.answer,
          question: values.question,
        };

        if (!id) {
          setLoading(true);

          postRequest(FAQS_API, body)
            .then(() => {
              setLoading(false);

              history.push(FAQS_URL);

              message.success(t('questionSuccessAdd'));
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          body['id'] = id;

          setLoading(true);

          updateRequest(FAQS_API, body)
            .then(() => {
              setLoading(false);

              history.push(FAQS_URL);

              message.success(t('questionSuccessEdit'));
            })
            .catch(() => {
              setLoading(false);
            });
        }
      })
      .catch((info) => {
        return;
      });
  };

  return (
    <>
      <Form className={'w-100'} form={form} layout='vertical'>
        <Card
          bodyStyle={{ padding: '24px' }}
          className={'card__header'}
          bordered={false}
        >
          <div className={'card__header__wrapper'}>
            <div className={'card__header__btn__container'}>
              <Button
                type='primary'
                htmlType='submit'
                style={{ width: '95px', minWidth: '95px' }}
                onClick={
                  loading
                    ? () => {
                        return;
                      }
                    : handleSubmit
                }
                loading={loading}
                className={'btn_addEdit'}
              >
                {!id ? t('add') : t('edit')}
              </Button>

              <Button
                icon={<MdArrowBack />}
                type={'primary'}
                ghost={true}
                className={'btn__back'}
                onClick={() => history.push(`${FAQS_URL}${location.search}`)}
              />
            </div>

            <h2>{!id ? t('addNewQuestion') : t('editQuestion')}</h2>
          </div>
        </Card>

        <Spin spinning={loadingById}>
          <Card bodyStyle={{ padding: '24px' }} bordered={false}>
            <Row>
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  label={t('question')}
                  name='question'
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: t('pleaseInsertQuestion'),
                    },
                  ]}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  label={t('answer')}
                  name='answer'
                  rules={[
                    {
                      required: true,
                      message: t('pleaseInsertAnswer'),
                    },
                  ]}
                >
                  <Input.TextArea autoComplete={'off'} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Form>
    </>
  );
};

export default FaqsAddEdit;
