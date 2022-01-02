import React, { useState } from 'react';

import { UPLOAD_FILE } from 'config/constantApi';
import { message } from 'antd';
import useHttpRequest from './useHttpRequest';

const useUploadFileApi = () => {
  const { postRequest } = useHttpRequest();
  const [uploadValue, setUploadValue] = useState<any>();

  const uploadFile = async (files: any) => {
    postRequest(UPLOAD_FILE, files)
      .then((resp) => {
        setUploadValue(resp.data);
      })
      .catch((err) => {
        if (err) {
          message.error(err.response.data.message);
        }
      });
  };

  return {
    uploadFile,
    uploadValue,
  };
};

export default useUploadFileApi;
