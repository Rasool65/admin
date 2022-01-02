import React, { useState } from 'react';
import closeIcon from './../../assets/img/close.png';
import { Form, Input, Button, Upload, Spin } from 'antd';
import { UPLOAD_FILE } from 'config/constantApi';
import useHttpRequest from 'hooks/useHttpRequest';
import { BASE_URL } from 'config/urls';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { ImageHelper } from 'utils/imageConvertion';
import {
  StyleTodoList,
  StyleList,
  ListItem,
  StyleForm,
  StyleResult,
} from './style';

const TodoList = ({ data, handleChange, deleteItem }) => {
  const { postRequest } = useHttpRequest();
  const [desc, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [imgUpload, setImgUpload] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const imageUploadProps: {
    name: string;
    multiple: boolean;
    listType: any;
    showUploadList: boolean;
    accept: string;
    customRequest: any;
  } = {
    name: 'file',
    multiple: false,
    accept: 'image/png, image/jpeg',
    listType: 'text',
    showUploadList: false,
    customRequest: ({ onSuccess, onError, file }) => {
      setLoading(true);
      const formData = new FormData() as any;

      formData.append('Files', file);
      formData.append('type', 'image');

      postRequest(`${UPLOAD_FILE}`, formData)
        .then((res) => {
          setLoading(false);
          setIconUrl(res.data.url);
          setImgUpload(formData.get('Files').name);
        })
        .catch((err) => {
          return;
        });
    },
  };

  const handleInputChange = (event) => {
    setDescription(event.target.value);
  };

  const deleteImage = () => {
    setImgUpload('');
    setIconUrl('');
  };

  const antIcon = (
    <LoadingOutlined style={{ fontSize: 20, marginRight: 5 }} spin={true} />
  );

  const handleSubmit = () => {
    handleChange({ icon: iconUrl, description: desc });
    setDescription('');
    setImgUpload('');
    setIconUrl('');
  };

  return (
    <StyleTodoList>
      <StyleForm>
        <Form.Item label='آپلود آیکن' style={{ width: '100%' }}>
          <Upload maxCount={1} {...imageUploadProps}>
            <Button icon={<UploadOutlined />}>کلیک کنید</Button>
          </Upload>
          {loading && <Spin indicator={antIcon} />}
          {!!imgUpload && (
            <StyleResult>
              <p>{imgUpload}</p>
              <img alt='remove' src={closeIcon} onClick={deleteImage} />
            </StyleResult>
          )}
        </Form.Item>
        <Form.Item label='توضیحات' style={{ width: '100%' }}>
          <Input
            name='description'
            value={desc}
            onChange={handleInputChange}
            autoComplete={'off'}
          />
        </Form.Item>
        <Button className='add' danger={true} onClick={handleSubmit}>
          افزودن
        </Button>
      </StyleForm>
      <StyleList>
        {!!data &&
          data.map((item, index) => {
            return (
              <ListItem
                key={index}
                onClick={() => {
                  deleteItem(item);
                }}
              >
                <img
                  alt={item.description}
                  className='icon'
                  src={`${BASE_URL}${item.icon}`}
                />
                <p className='name'>{item.description}</p>
                <img alt='remove' src={closeIcon} />
              </ListItem>
            );
          })}
      </StyleList>
    </StyleTodoList>
  );
};
export default TodoList;
