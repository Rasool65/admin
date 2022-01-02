import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { TOKEN_NAME, _UUID } from 'config/constantApi';
import { LOGIN } from 'config/constantUrl';
import { BASE_URL } from 'config/urls';

const baseUrl = BASE_URL;

export const useApi = (isLoc?: boolean) => {
  const { i18n } = useTranslation();

  const history = useHistory();

  let instance: any;

  const token = localStorage.getItem(TOKEN_NAME) || '';

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    debugger;
  }

  instance = axios.create({
    baseURL: baseUrl,
    headers,
  });

  // API Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const jwtToken = localStorage.getItem(TOKEN_NAME);

      // if (jwtToken) {
      //     config.headers['Authorization'] = `Bearer ${token}`;
      // }

      //   if (!jwtToken && !config.headers['public-request']) {
      //     this.history.push('/')
      //     window.location.reload();
      //   }

      return config;
    },
    (error) => {
      //   Do something with request error here

      Promise.reject(error);
    }
  );

  // API response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Remove token and redirect
      if (error.response.status === 403 || error.response.status === 401) {
        message.error('لطفا مجدد لاگین کنید', 4);

        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(_UUID);
        history.push(LOGIN);

        return;
      }

      return Promise.reject(error);
    }
  );

  const get = (url: string, config?: any): Promise<AxiosResponse> => {
    return instance.get(url, config);
  };

  const post = (
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse> => {
    return instance.post(url, data, config);
  };

  const put = (
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse> => {
    return instance.put(url, data, config);
  };

  const remove = (url: string, config?: any): Promise<AxiosResponse> => {
    return instance.delete(url, config);
  };

  return {
    get,
    post,
    put,
    remove,
  };
};
