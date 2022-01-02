import React from 'react';
import Icon from '@ant-design/icons';

import { ICustomIcon } from './widget-type';

const CustomIcon = React.forwardRef((props: ICustomIcon, _) => (
  <Icon component={props.svg} className={props.className} />
));

export default CustomIcon;
