import React from 'react';
import { message } from 'antd';
import { AxiosResponse } from 'axios';

import { useApi } from './useApi';

const useHttpRequest = () => {
  const { get, post, remove, put } = useApi();

  const getRequest = (url: string, config?: any): Promise<AxiosResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res: AxiosResponse = await get(url, {
          validateStatus: (status) => {
            if (status >= 200 && status <= 204) {
              return true;
            }
          },
          ...config,
        });

        resolve(res);
      } catch (error: any) {
        message.error(error?.response?.data?.message, 4);

        reject(error);
      }
    });
  };

  const postRequest = (
    url: string,
    body: any,
    config?: any
  ): Promise<AxiosResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res: AxiosResponse = await post(url, body, {
          validateStatus: (status) => {
            if (status >= 200 && status <= 204) {
              return true;
            }
          },
          ...config,
        });
        resolve(res);
      } catch (error: any) {
        message.error(error?.response?.data?.message, 4);

        reject(error);
      }
    });
  };

  const deleteRequest = (url: string, body?: any): Promise<AxiosResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res: AxiosResponse = await remove(url, {
          validateStatus: (status) => {
            if (status >= 200 && status <= 204) {
              return true;
            }
          },
          data: body,
        });

        resolve(res);
      } catch (error: any) {
        message.error(error?.response?.data?.message, 4);
        reject(error);
      }
    });
  };

  const updateRequest = (url: string, body?: any): Promise<AxiosResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res: AxiosResponse = await put(url, body, {
          validateStatus: (status) => {
            if (status >= 200 && status <= 204) {
              return true;
            }
          },
        });

        resolve(res);
      } catch (error: any) {
        message.error(error?.response?.data?.message, 4);

        reject(error);
      }
    });
  };

  return {
    getRequest,
    postRequest,
    deleteRequest,
    updateRequest,
  };
};

export default useHttpRequest;
