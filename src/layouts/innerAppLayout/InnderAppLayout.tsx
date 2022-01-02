import React from 'react';

import './style.scss';

const SideContent = (props) => {
  const { sideContent, sideContentWidth = 250, border } = props;
  return (
    <div
      className={`side-content ${border ? 'with-border' : ''}`}
      style={{ width: `${sideContentWidth}px` }}
    >
      {sideContent}
    </div>
  );
};

const InnderAppLayout = (props) => {
  const { mainContent, pageHeader, sideContentGutter = true } = props;
  return (
    <div className='inner-app-layout'>
      <SideContent {...props} />

      <div
        className={`main-content ${pageHeader ? 'has-page-header' : ''} ${
          sideContentGutter ? 'gutter' : 'no-gutter'
        }`}
      >
        {mainContent}
      </div>
    </div>
  );
};

export default InnderAppLayout;
