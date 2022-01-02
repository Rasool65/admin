import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-datepicker2';
import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment-jalaali';
import OutsideClickHandler from 'react-outside-click-handler';

import { ICalender } from './type-widget';
import { CalenderContainer } from './style';
import { DateHelper } from 'utils/dateHelper';

moment.locale('fa');

const CustomCalender: React.FC<ICalender> = ({
  placeholder,
  EditDate,
  onDate,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const [value, setValue] = useState('');

  useEffect(() => {
    if (EditDate) {
      setValue(EditDate);
    }
  }, [EditDate]);

  const handleClean = () => {
    setValue('');
    onDate!('');
    setOpen(false);
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setOpen(false);
      }}
    >
      <CalenderContainer>
        <Input
          placeholder={placeholder ? placeholder : ''}
          value={value ? value : ''}
          onChange={(event) => setValue(event.target.value)}
          onClick={() => setOpen(!open)}
          autoComplete='off'
          readOnly={true}
        />
        {open && (
          <Calendar
            isGregorian={false}
            onChange={(date) => {
              setValue(moment(date).format('jYYYY/jMM/jDD'));
              setOpen(false);
              onDate!(moment(date).format('jYYYY/jMM/jDD'));
            }}
          />
        )}

        <CloseOutlined className={'clean__calender'} onClick={handleClean} />
      </CalenderContainer>
    </OutsideClickHandler>
  );
};

export default CustomCalender;
