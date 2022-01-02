import React from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import { ITable } from 'pages/widget-type';
import { SlideShowListModel } from './widget-type';
import { BASE_URL } from 'config/urls';
import { SLIDE_SHOW_ADD } from 'config/constantUrl';

const SlideShowList: React.FC<ITable<SlideShowListModel>> = ({
  response: { items, meta },
  onDelete,
}) => {
  const history = useHistory();

  return (
    <section className={'list__container'}>
      {items?.length > 0 &&
        items.map((_elm: SlideShowListModel) => (
          <div
            className={'item'}
            style={{ backgroundImage: `url(${BASE_URL}${_elm.image})` }}
            key={_elm.id?.toString()}
          >
            <div className={'icons'}>
              <MdModeEdit
                onClick={() => history.push(`${SLIDE_SHOW_ADD}/${_elm.id}`)}
              />
              <MdDelete onClick={onDelete!(_elm.id)} />
            </div>
            <div className={'content'}>
              <span className={'title'}>{_elm.name}</span>
            </div>
          </div>
        ))}
    </section>
  );
};

export default SlideShowList;
