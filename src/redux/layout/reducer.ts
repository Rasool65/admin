import { ILayoutState, ILayoutType } from './type';
import { COLLAPSE_SIDER, LOGIN_PAGE, USER_PROFILE } from '../types';
import { LOGIN } from 'config/constantUrl';

const initState: ILayoutState = {
  openSider: false,
  loginPage: true,
  userProfile: undefined,
};

export const layoutReducer = (state = initState, action: ILayoutType) => {
  switch (action.type) {
    case COLLAPSE_SIDER:
      return {
        ...state,
        openSider: action.payload,
      };
    case LOGIN_PAGE:
      return {
        ...state,
        loginPage: action.payload,
      };
    case USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };

    default:
      return state;
  }
};
