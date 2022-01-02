import React from 'react';
import styled from 'styled-components';
import { ConfigProvider } from 'antd';

import faIR from 'antd/lib/locale/fa_IR';

const Provider = styled(ConfigProvider)`
  font-family: IRANSans !important;
`;
const AntProvider: any = ({ children }) => {
  return (
    <Provider direction='rtl' locale={faIR}>
      {children}
    </Provider>
  );
};

export default AntProvider;
