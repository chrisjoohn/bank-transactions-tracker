import { FC } from 'react';

import { Select } from 'antd';
import type { SelectProps } from 'antd';

import { tagsApi } from '../../integration/apis';

export interface TagSelectorProps extends Omit<SelectProps, 'options' | 'filterOption'> {}

const TagSelector: FC<TagSelectorProps> = (props) => {
  const { data: tags } = tagsApi.useGetTagsQuery();

  const options: SelectProps['options'] = tags?.map((item) => {
    return {
      label: item.name,
      value: item.unique_code,
    };
  });

  const filterOption: SelectProps['filterOption'] = (input, option) => {
    if (option?.label) {
      return option.label.toString().toLowerCase().includes(input.toLowerCase());
    }
    return false;
  };

  return (
    <Select options={options} style={{ width: '100%' }} filterOption={filterOption} {...props} />
  );
};

export default TagSelector;
