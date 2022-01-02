import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import axios, { CancelTokenSource } from 'axios';

import { Wrapper, BodyWrapper } from './pages/style';
import { MainRoutes } from './routes/Routes';
import {
  _UUID,
  ACCOUNT_PROFILE,
  PROFILE_API,
  TOKEN_NAME,
} from 'config/constantApi';
import { loginPageAction, userProfileAction } from 'redux/layout/actions';
import HeaderLayout from './layouts/header/Header';
import SiderLayout from './layouts/sideBar/SideBar';
import Content from 'layouts/content/Content';
import useHttpRequest from 'hooks/useHttpRequest';

let source: CancelTokenSource;

const App = () => {
  source = axios.CancelToken.source();
  const { getRequest } = useHttpRequest();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const { openSider } = useSelector((state: any) => state.layoutReducer);

  const getProfileApi = () => {
    setLoading(true);

    getRequest(PROFILE_API)
      .then((resp) => {
        dispatch(userProfileAction(resp.data));
        setLoading(false);
      })
      .catch((err) => setLoading(true));
  };

  useEffect(() => {
    if (location.pathname === '/admin/login') {
      dispatch(loginPageAction(true));

      return;
    }

    if (location.pathname === '/admin/reset-password') {
      dispatch(loginPageAction(true));

      return;
    }
    dispatch(loginPageAction(false));
  }, [location.pathname]);

  useEffect(() => {
    if (localStorage.getItem(TOKEN_NAME)) {
      getProfileApi();
    }

    return () => {
      source.cancel();
    };
  }, [localStorage.getItem(TOKEN_NAME)]);

  return (
    <>
      {false ? (
        <Spin tip={'در حال بارگذاری ...'} className={'spin__loading'} />
      ) : (
        <Router>
          <Wrapper>
            <HeaderLayout />

            <BodyWrapper>
              <SiderLayout />

              <Content isCollapsed={openSider}>
                <Route component={MainRoutes} />
              </Content>
            </BodyWrapper>
          </Wrapper>
        </Router>
      )}
    </>
  );
};

export default App;
