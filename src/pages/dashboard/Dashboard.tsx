import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TeamOutlined,
  BarcodeOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';

import {
  StyledCardTitle,
  StyledCard,
  HDivider,
  StyleCardBody,
  StyledInfoContainer,
  StyledCardsContainer,
  CardInfo,
  CardHeader,
  CardContent,
  CardFooter,
} from './style';
import { DASHBOARD_API } from 'config/constantApi';
import { IDashboard } from './widget-type';
import useHttpRequest from 'hooks/useHttpRequest';
import LastOrder from './LastOrder';
import WeeklySailedOrders from './WeeklySailedOrders';

const Dashboard = () => {
  const { t } = useTranslation();

  const { getRequest } = useHttpRequest();

  const [dashboard, setDashboard] = useState<IDashboard>({});
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(false);

  const getDashboard = () => {
    setLoadingDashboard(true);
    getRequest(`${DASHBOARD_API}?limit=10`)
      .then((resp) => {
        setLoadingDashboard(false);
        setDashboard(resp.data);
      })
      .catch((err) => {
        setLoadingDashboard(false);
      });
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <>
      <StyledCardsContainer>
        <CardInfo borderColor='#21ea71'>
          <CardHeader>
            <TeamOutlined />
          </CardHeader>
          <CardContent>
            <p>تعداد مشتریان</p>
          </CardContent>
          <CardFooter>
            <p>
              {dashboard && dashboard.customerCount
                ? dashboard.customerCount
                : 0}
            </p>
          </CardFooter>
        </CardInfo>
        <CardInfo borderColor='#e6129b'>
          <CardHeader>
            <BarcodeOutlined />
          </CardHeader>
          <CardContent>
            <p>تعداد محصولات</p>
          </CardContent>
          <CardFooter>
            <p>
              {dashboard && dashboard.productCount ? dashboard.productCount : 0}
            </p>
          </CardFooter>
        </CardInfo>
        <CardInfo borderColor='#11ded5'>
          <CardHeader>
            <FileDoneOutlined />
          </CardHeader>
          <CardContent>
            <p>تعداد سفارشات</p>
          </CardContent>
          <CardFooter>
            <p>
              {dashboard && dashboard.orderCount ? dashboard.orderCount : 0}
            </p>
          </CardFooter>
        </CardInfo>
      </StyledCardsContainer>
      <StyledInfoContainer>
        <StyledCard>
          <StyledCardTitle>
            <p>{t('latestOrders')}</p>
          </StyledCardTitle>

          <HDivider />

          <StyleCardBody customStyle={{ height: '490px', overflowY: 'scroll' }}>
            <LastOrder
              lastOrderProduct={
                dashboard && dashboard.latestOrders
                  ? dashboard.latestOrders
                  : []
              }
              loading={loadingDashboard}
            />
          </StyleCardBody>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>
            <p>{t('weeklySailedOrders')}</p>
          </StyledCardTitle>

          <HDivider />

          <StyleCardBody customStyle={{ height: '490px', overflowY: 'scroll' }}>
            <WeeklySailedOrders
              weeklySailedOrders={
                dashboard && dashboard.weeklySailedOrders
                  ? dashboard.weeklySailedOrders
                  : []
              }
              loading={loadingDashboard}
            />
          </StyleCardBody>
        </StyledCard>
      </StyledInfoContainer>
    </>
  );
};

export default Dashboard;
