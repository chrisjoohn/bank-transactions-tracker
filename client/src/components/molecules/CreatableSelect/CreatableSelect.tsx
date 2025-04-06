/**
 * a creatable dropdown input component implementation
 * using ant.design's Select component
 */

import { FC, useState } from 'react';

import { Select } from 'antd';

import type { SelectProps } from 'antd';

export type CreatableSelectProps = { value: SelectProps['value']; options: SelectProps['options'] };

import './creatableSelect.styles.scss';
import { OptionProps } from 'antd/es/select';

const CreatableSelect: FC<CreatableSelectProps> = (props) => {
  const { options, value } = props;

  const [selectValue, _setSelectValue] = useState<SelectProps['value']>(null);
  const [searchValue, _setSearchValue] = useState('');

  const _changeHandler: SelectProps['onChange'] = (value, option) => {
    console.log({
      value,
      option,
    });
  };

  const _searchHandler: SelectProps['onSearch'] = (value) => {
    _setSearchValue(value);
  };

  const showCreateOption =
    searchValue &&
    options &&
    !options.every((option) => option.label?.toString().includes(searchValue));

  if (showCreateOption) {
    options.unshift({
      label: `Create ${searchValue}`,
      value: `__create__${searchValue}`,
    });
  }

  return (
    <Select
      mode="multiple"
      style={{
        width: '400px',
      }}
      value={value}
      options={options}
      filterOption={(input, option) => {
        console.log({
          input,
          option,
        });
        return (option as { label: string; value: string })?.label
          ?.toLowerCase()
          .toString()
          .includes(input.toLowerCase());
      }}
      showSearch
      onChange={_changeHandler}
      onSearch={_searchHandler}
    />
  );
};

export default CreatableSelect;
