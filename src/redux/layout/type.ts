import { COLLAPSE_SIDER, LOGIN_PAGE, USER_PROFILE } from '../types';

export interface ILayoutState {
  openSider: boolean;
  loginPage: boolean;
  userProfile: any;
}

export interface ISiderStatusAction {
  type?: typeof COLLAPSE_SIDER;
  payload?: boolean;
}
export interface ILoginPageAction {
  type?: typeof LOGIN_PAGE;
  payload?: boolean;
}
export interface IUserProfileAction {
  type?: typeof USER_PROFILE;
  payload?: any;
}

export type ILayoutType =
  | ISiderStatusAction
  | ILoginPageAction
  | IUserProfileAction;
