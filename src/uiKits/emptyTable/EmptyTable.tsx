import React from 'react';

import { IEmptyTable } from './widget-type';
import EmptySvg from 'assets/img/EmptyIcon';
import './style.scss';

const EmptyTable: React.FC<IEmptyTable> = ({ caption }) => {
  return (
    <div className={'wrapper'}>
      <div className={'empty__svg'}>
        <EmptySvg />
      </div>
      <p className={'empty__text'}>{caption}</p>
    </div>
  );
};

export default EmptyTable;
