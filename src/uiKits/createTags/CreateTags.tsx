import React, { useState, useEffect } from 'react';
import { Tag, Input } from 'antd';

import { StyleTagContainer, StyleTags } from './style';

const CreateTags: React.FC<{ onChange?: (arg: any) => void; value?: any }> = ({
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [tagValues, setTagVlues] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      setTagVlues(value);
    }
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputConfirm = (event) => {
    event.preventDefault();

    if (inputValue && tagValues.indexOf(inputValue) === -1) {
      setTagVlues([...tagValues, inputValue]);

      setInputValue('');

      onChange?.([...tagValues, inputValue]);
    }
  };

  const handleClose = (removedTag: string) => {
    setTagVlues([...tagValues.filter((_tag) => _tag !== removedTag)]);
  };

  return (
    <StyleTagContainer>
      <Input
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onPressEnter={handleInputConfirm}
      />

      <StyleTags>
        {tagValues.length > 0 &&
          tagValues.map((_tag: string, index: number) => (
            <Tag
              key={index.toString()}
              closable={true}
              onClose={(e) => {
                e.preventDefault();
                handleClose(_tag);
              }}
            >
              {_tag}
            </Tag>
          ))}
      </StyleTags>
    </StyleTagContainer>
  );
};

export default CreateTags;
