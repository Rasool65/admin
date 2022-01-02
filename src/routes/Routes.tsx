import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import {
  UsersWidget,
  UserAddEditWidget,
  CustomersWidget,
  LoginWidget,
  ForgetPassWidget,
  SlideShowWidget,
  SlideShowAddEditWidget,
  ContactUsWidget,
  ContactUsEditWidget,
  ProductCategoryWidget,
  ProductCategoryEditWidget,
  CompanyWidget,
  CompanyAddEditWidget,
  ProductWidget,
  ProductEditWidget,
  SettingWidget,
  FaqsWidget,
  FaqsAddEditWidget,
  ProfileWidget,
  SubscriberWidget,
  OrdersWidget,
  OrderDetailWidget,
  DashboardWidget,
  PreRegistrationCustomerWidget,
  MessagesAddWidget,
  MessagesWidget,
  ConsultWidget,
  TermsSetting,
  PrivaciesSetting,
  CustomerDetailWidget,
} from '../pages/index';
import {
  LOGIN,
  FORGET_PASS,
  USERS_PASS,
  CUSTOMERS_LIST,
  PRE_REGISTRATION_CUSTOMERS,
  SLIDE_SHOW,
  SLIDE_SHOW_ADD,
  CONTACTUS_URL,
  CONTACTUS_ADD_URL,
  COMPANY_URL,
  COMPANY_ADD_URL,
  PRODUCT_CATEGORY_URL,
  PRODUCT_CATEGORY_EDIT_URL,
  PRODUCT_URL,
  PRODUCT_EDIT_URL,
  SETTING_URL,
  FAQS_URL,
  FAQS_ADD_URL,
  PRODILE_URL,
  SUBSCRIBER_LIST_URL,
  ADD_USER,
  ORDER_URL,
  ORDER_DETAIL_URL,
  DASHBOARD,
  MESSAGES,
  MESSAGE_ADD,
  CONSULT_URL,
  TERM_URL,
  PRIVACY_URL,
  CUSTOMER_DETAIL_URL,
} from 'config/constantUrl';

import PrivateRoute from './PrivateRoutes';

export const MainRoutes = () => {
  return (
    <>
      <Switch>
        <Route exact={true} path={'/'} render={() => <Redirect to={LOGIN} />} />

        {/* Dashboard */}
        <PrivateRoute
          exact={true}
          path={DASHBOARD}
          component={DashboardWidget}
        />

        {/* Users*/}
        <PrivateRoute exact={true} path={USERS_PASS} component={UsersWidget} />
        <PrivateRoute
          exact={true}
          path={`${ADD_USER}/:id?`}
          component={UserAddEditWidget}
        />

        {/* Messages*/}
        <PrivateRoute exact={true} path={MESSAGES} component={MessagesWidget} />
        <PrivateRoute
          exact={true}
          path={`${MESSAGE_ADD}/:id?`}
          component={MessagesAddWidget}
        />

        {/* Consult*/}
        <PrivateRoute
          exact={true}
          path={CONSULT_URL}
          component={ConsultWidget}
        />

        {/* Order*/}
        <PrivateRoute exact={true} path={ORDER_URL} component={OrdersWidget} />
        <PrivateRoute
          exact={true}
          path={`${ORDER_DETAIL_URL}/:id?`}
          component={OrderDetailWidget}
        />

        <Route exact={true} path={LOGIN} component={LoginWidget} />
        <Route exact={true} path={FORGET_PASS} component={ForgetPassWidget} />

        {/* Customers */}
        <PrivateRoute
          exact={true}
          path={CUSTOMERS_LIST}
          component={CustomersWidget}
        />
        <PrivateRoute
          exact={true}
          path={PRE_REGISTRATION_CUSTOMERS}
          component={PreRegistrationCustomerWidget}
        />
        <PrivateRoute
          exact={true}
          path={`${CUSTOMER_DETAIL_URL}/:id?`}
          component={CustomerDetailWidget}
        />
        {/* Slide Show */}
        <PrivateRoute
          exact={true}
          path={SLIDE_SHOW}
          component={SlideShowWidget}
        />
        <PrivateRoute
          exact={true}
          path={`${SLIDE_SHOW_ADD}/:id?`}
          component={SlideShowAddEditWidget}
        />

        {/* Company */}
        <PrivateRoute
          exact={true}
          path={COMPANY_URL}
          component={CompanyWidget}
        />
        <PrivateRoute
          exact={true}
          path={`${COMPANY_ADD_URL}/:id?`}
          component={CompanyAddEditWidget}
        />

        {/* ContactUs */}
        <PrivateRoute
          exact={true}
          path={CONTACTUS_URL}
          component={ContactUsWidget}
        />
        <PrivateRoute
          exact={true}
          path={`${CONTACTUS_ADD_URL}/:id?`}
          component={ContactUsEditWidget}
        />

        {/* Setting */}
        <PrivateRoute
          exact={true}
          path={SETTING_URL}
          component={SettingWidget}
        />
        <PrivateRoute exact={true} path={TERM_URL} component={TermsSetting} />

        <PrivateRoute
          exact={true}
          path={PRIVACY_URL}
          component={PrivaciesSetting}
        />

        {/* ProductCategory */}
        <PrivateRoute
          exact={true}
          path={PRODUCT_CATEGORY_URL}
          component={ProductCategoryWidget}
        />
        <PrivateRoute
          exact={true}
          path={`${PRODUCT_CATEGORY_EDIT_URL}/:id?`}
          component={ProductCategoryEditWidget}
        />

        {/* Product */}
        <PrivateRoute
          exact={true}
          path={PRODUCT_URL}
          component={ProductWidget}
        />
        <PrivateRoute
          exact={true}
          path={`${PRODUCT_EDIT_URL}/:id?`}
          component={ProductEditWidget}
        />

        {/* Subscriber Code */}
        <PrivateRoute
          exact={true}
          path={SUBSCRIBER_LIST_URL}
          component={SubscriberWidget}
        />

        {/* profile */}
        <PrivateRoute path={PRODILE_URL} component={ProfileWidget} />

        {/* Faqs */}
        <PrivateRoute exact={true} path={FAQS_URL} component={FaqsWidget} />
        <PrivateRoute
          exact={true}
          path={`${FAQS_ADD_URL}/:id?`}
          component={FaqsAddEditWidget}
        />

        <Route path={'*'} component={() => <div>Not Found</div>} />
      </Switch>
    </>
  );
};
