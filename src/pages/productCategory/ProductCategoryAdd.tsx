
import React, { Fragment } from 'react';
import { Form, Input, Button } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const CategoryAdd = () => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Item
        label={t('title')}
        name={'name'}
        style={{ flexDirection: 'column' }}
      >
        <Input autoComplete={'off'} />
      </Form.Item>

      <Form.List name={'ChildrenNames'}>
        {(fields, { add, remove }) => {
          return (
            <div key={Math.random().toString()}>
              <Form.Item>
                <Button
                  type='dashed'
                  onClick={() => add()}
                  style={{
                    width: '100%',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t('addSubCategory')}
                </Button>
              </Form.Item>

              {fields.map((field, index) => {
                return (
                  <Fragment key={index.toString() + 12}>
                    <div className={'subcategory__wrapper'}>
                      <Form.Item
                        className={'input'}
                        name={[field.name, 'item']}
                      >
                        <Input
                          placeholder={t('SubCategoryName')}
                          autoComplete={'off'}
                        />
                      </Form.Item>

                      <MinusCircleOutlined
                        className='remove__org__user'
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </div>
                  </Fragment>
                );
              })}
            </div>
          );
        }}
      </Form.List>
    </>
  );
};

export default CategoryAdd;
