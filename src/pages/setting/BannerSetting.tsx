import React, { useEffect, useState } from 'react';
import useHttpRequest from 'hooks/useHttpRequest';
import { SETTING_API } from './../../config/constantApi';
import MainPageBanner from './banners/MainPageBanner';
import AboutUsPageBanner from './banners/AboutUsPageBanner';
import LoginPageBanner from './banners/LoginPageBanner';
import { Col, Row } from 'antd';

function BannerSetting() {
  const { getRequest } = useHttpRequest();

  const [mainBannerUrl, setMainBannerUrl] = useState('');
  const [loginBannerUrl, setLoginBannerUrl] = useState('');
  const [aboutUsBannerUrl, setAboutBannerUrl] = useState('');

  useEffect(() => {
    getRequest(`${SETTING_API}/getallbannerspath`)
      .then((resp) => {
        setMainBannerUrl(resp.data.homePageMiddleBanner);
        setAboutBannerUrl(resp.data.aboutUsMiddleBanner);
        setLoginBannerUrl(resp.data.loginBanner);
      })
      .catch();
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <MainPageBanner url={mainBannerUrl} />
          <AboutUsPageBanner url={aboutUsBannerUrl} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <LoginPageBanner url={loginBannerUrl} />
        </Col>
      </Row>
    </>
  );
}
export default BannerSetting;
