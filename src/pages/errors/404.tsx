import React from 'react';
import { Row, Col } from 'antd';
import '../commonStyle.scss';
import Error_Image from 'assets/img/404.jpg';

const Error404 = () => {
  return (
    <>
      <div className='static-page'>
        <div className='container text-center d-flex flex-column justify-content-center h-100'>
          <Row justify='center'>
            <Col xs={20} sm={20} md={20} lg={10}>
              <img src={Error_Image} alt='404 Error' />
              <h3>هیچ صفحه ای پیدا نشد!</h3>
              <div className='mt-15'>
                <a href='/'>بازگشت به صفحه اصلی</a>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Error404;
