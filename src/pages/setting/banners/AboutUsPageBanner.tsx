import { LoadingOutlined } from '@ant-design/icons';
import { Button, message, Spin } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomIcon from 'uiKits/customIcon/Main';
import useUploadFileApi from 'hooks/useUploadFileApi';
import { ImageHelper } from 'utils/imageConvertion';
import UploadIcon from 'assets/img/UploadIcon';
import useHttpRequest from 'hooks/useHttpRequest';
import { BASE_URL } from 'config/urls';
import { BANNERS_SETTING } from 'config/constantApi';

function AboutUsPageBanner({ url }) {
  const { t } = useTranslation();
  const { updateRequest } = useHttpRequest();
  const { uploadFile, uploadValue } = useUploadFileApi();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [uploadedImg, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(t('formatPic'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t('sizePic'));
    }
    return isJpgOrPng && isLt2M;
  };

  const imageUploadProps: {
    name: string;
    listType: any;
    showUploadList: boolean;
    accept: string;
    customRequest: any;
  } = {
    name: 'file',
    accept: 'image/png, image/jpeg',
    listType: 'text',
    showUploadList: false,
    customRequest: ({ onSuccess, onError, file }) => {
      const formData = new FormData() as any;

      formData.append('Files', file);
      formData.append('type', 'image');

      uploadFile(formData);
    },
  };
  const handleUploadChange = async (info) => {
    setUploadLoading(true);

    if (!!info.file) {
      const result = await ImageHelper.getBase64(info.file.originFileObj);

      if (!!result) {
        setImage(result as string);
        setUploadLoading(false);
      }
    }
  };

  const handleSubmit = () => {
    const body = {
      bannerType: 1,
      src: !!uploadValue ? uploadValue.url : url,
    };
    setLoading(true);
    updateRequest(BANNERS_SETTING, body)
      .then(() => {
        setLoading(false);
        message.success(t('aboutUsPageSuccessBanner'));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Spin spinning={loading}>
        <h3>{t('aboutUsPageBanner')}</h3>
        <br />
        <Dragger
          style={{ width: '100%' }}
          {...imageUploadProps}
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
        >
          {uploadedImg || url ? (
            <img
              style={{ maxHeight: '155px' }}
              src={uploadedImg ? uploadedImg : `${BASE_URL}${url}`}
              alt='avatar'
              className='img-fluid'
            />
          ) : (
            <div>
              {uploadLoading ? (
                <div>
                  <LoadingOutlined className='font-size-xxl text-primary' />
                  <div className='mt-3'>{t('uploading')}</div>
                </div>
              ) : (
                <div>
                  <CustomIcon className='display-3' svg={UploadIcon} />
                  <p>{t('selectPic')}</p>
                </div>
              )}
            </div>
          )}
        </Dragger>
        <br />
        <div className={'card__header__wrapper'}>
          <div className={'card__header__btn__container'}>
            <Button
              type='primary'
              style={{ width: '105px', minWidth: '95px' }}
              onClick={
                loading
                  ? () => {
                      return;
                    }
                  : handleSubmit
              }
              loading={loading}
            >
              {t('Update')}
            </Button>
          </div>
        </div>
      </Spin>
    </>
  );
}
export default AboutUsPageBanner;
