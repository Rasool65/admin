import React from 'react';
import cx from 'classnames';
import { validate as uuidValidate } from 'uuid';
import { useSelector } from 'react-redux';

import { IContent } from '../widget-type';
import '../style.scss';
import { TOKEN_NAME, _UUID } from 'config/constantApi';

const Content: React.FC<IContent> = ({ children, isCollapsed }) => {
  const { loginPage } = useSelector((state: any) => state.layoutReducer);

  return (
    <div
      className={cx(
        { content__wrapper: !loginPage },
        { content__collapsed: !isCollapsed && !loginPage }
      )}
      style={{ width: '100%' }}
    >
      {children}
    </div>
  );
};

export default Content;
