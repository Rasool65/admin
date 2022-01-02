import React from 'react';
import { Avatar } from 'antd';

import { IAvatarStatus } from './widget-type';
import './style.scss';

const AvatarStatus: React.FC<IAvatarStatus> = ({
  pic,
  title,
  caption,
  size,
  customstyle,
  onClick,
}) => {
  return (
    <div className={'profile__header'} style={customstyle} onClick={onClick}>
      <Avatar src={pic} className={'header__avatar'} size={size} />

      <div className={'info'}>
        <p className={'profile__name'}>{title}</p>
        <p className={'profile__expert'}>{caption}</p>
      </div>
    </div>
  );
};

export default AvatarStatus;
