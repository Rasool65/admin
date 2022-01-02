import { Dispatch } from 'redux';

import { COLLAPSE_SIDER, LOGIN_PAGE, USER_PROFILE } from '../types';

export const siderMode = (mode: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: COLLAPSE_SIDER,
    payload: mode,
  });
};

export const loginPageAction = (value: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: LOGIN_PAGE,
    payload: value,
  });
};

export const userProfileAction = (value: any) => (dispatch: Dispatch) => {
  dispatch({
    type: USER_PROFILE,
    payload: value,
  });
};
