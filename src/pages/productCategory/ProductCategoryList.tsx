import React, { useState } from 'react';
import { Button, Collapse, Modal, Row, message, Form, Col, Input } from 'antd';
import { RiDeleteBin5Line, RiEditBoxLine, RiAddLine } from 'react-icons/ri';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ProductCategoryListModel, ICategoryList } from '../widget-type';
import { PRODUCT_CATEGORY_API } from 'config/constantApi';
import { PRODUCT_CATEGORY_EDIT_URL } from 'config/constantUrl';
import useHttpRequest from 'hooks/useHttpRequest';

const { Panel } = Collapse;

const ProductCategoryList: React.FC<ICategoryList> = ({
  data,
  onRefreshApi,
}) => {
  const { updateRequest, postRequest } = useHttpRequest();
  const history = useHistory();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [subCatLoading, setSubCatLoading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [OpenSubCat, setOpenSubCat] = useState<boolean>(false);
  const [idCat, setIdCat] = useState<number | undefined>(undefined);

  const handleOpenDeleteDialog =
    (idValue?: number) => (event: React.MouseEvent) => {
      if (idValue) {
        setIdCat(idValue);

        setOpen(true);
      }
    };
  const RecursiveComponent = ({ recData, key }) => {
    const hasChild = recData.children.length > 0;
    return (
      <>
        {hasChild ? (
          <Collapse key={key}>
            <Panel header={recData.name} key={key} extra={GenExtra(recData.id)}>
              {hasChild &&
                recData.children.map((item) => (
                  <RecursiveComponent key={item.id} recData={item} />
                ))}
            </Panel>
          </Collapse>
        ) : (
          <li key={key}>
            <div className={'item'}>
              <p>{recData.name}</p>
              <div>{GenExtra(recData.id)}</div>
            </div>
          </li>
        )}
      </>
    );
  };
  const reset = () => {
    form.setFieldsValue({
      name: '',
    });
  };
  const handleAddSubCat = () => {
    form
      .validateFields()
      .then((values) => {
        if (idCat) {
          setSubCatLoading(true);
          console.log(idCat);

          postRequest(`${PRODUCT_CATEGORY_API}/addchildren`, {
            parentId: idCat,
            name: values.name,
          })
            .then(() => {
              setSubCatLoading(false);

              setOpenSubCat(false);

              message.success('زیر مجموعه جدید با موفقیت اضافه شد');

              onRefreshApi!();
            })
            .catch(() => {
              setSubCatLoading(false);
            });
        }
        reset();
      })
      .catch((err) => console.log('error-create-sub-cat', err));
  };

  const handleDelete = () => {
    if (idCat) {
      setDeleteLoading(true);

      updateRequest(`${PRODUCT_CATEGORY_API}/delete`, { ids: [idCat] })
        .then(() => {
          setDeleteLoading(false);

          setOpen(false);

          message.success(t('deleteSuccessCategory'));

          onRefreshApi!();
        })
        .catch(() => {
          setDeleteLoading(false);
        });
    }
  };

  const GenExtra = (idValue?: number) => (
    <>
      <RiAddLine
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          setIdCat(idValue);
          setOpenSubCat(true);
        }}
      />
      <RiEditBoxLine
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          setIdCat(idValue);
          setOpen(true);
          history.push(`${PRODUCT_CATEGORY_EDIT_URL}/${idValue}`);
        }}
      />
      <RiDeleteBin5Line
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          setIdCat(idValue);
          setOpen(true);
        }}
      />
    </>
  );

  return (
    <>
      <Modal
        title={'افزودن زیر مجموعه'}
        visible={OpenSubCat}
        onOk={handleAddSubCat}
        onCancel={() => setOpenSubCat(false)}
        key={'create_sub_cat'}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button
              color={'red'}
              type={'primary'}
              danger={true}
              loading={subCatLoading}
              onClick={
                deleteLoading
                  ? () => {
                      return;
                    }
                  : handleAddSubCat
              }
            >
              افزودن
            </Button>

            <Button onClick={() => setOpenSubCat(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        <Form
          className={'w-100'}
          form={form}
          layout='vertical'
          autoComplete='off'
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item
                label={'نام'}
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'لطفا نام وارد وارد نمایید',
                  },
                ]}
              >
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title={t('deleteCategory')}
        visible={open}
        onOk={handleDelete}
        onCancel={() => setOpen(false)}
        key={'delete_slide_show'}
        footer={[
          <Row justify={'end'} key={'row_footer'}>
            <Button
              color={'red'}
              type={'primary'}
              danger={true}
              loading={deleteLoading}
              onClick={
                deleteLoading
                  ? () => {
                      return;
                    }
                  : handleDelete
              }
            >
              {t('delete')}
            </Button>

            <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
          </Row>,
        ]}
      >
        {t('isDeleteCategory')}
      </Modal>
      <div className={'list__container'}>
        <Collapse defaultActiveKey={['0']} expandIconPosition={'right'}>
          {!!data &&
            data?.length > 0 &&
            data.map((_elm: ProductCategoryListModel) => (
              <Panel
                header={_elm.name}
                key={_elm.id!}
                extra={GenExtra(_elm.id)}
              >
                <ul className={'list'}>
                  {_elm.children!.length > 0 &&
                    _elm.children!.map((_x: ProductCategoryListModel) => (
                      <RecursiveComponent key={_x.id} recData={_x} />
                    ))}
                </ul>
              </Panel>
            ))}
        </Collapse>
      </div>
    </>
  );
};

export default ProductCategoryList;
