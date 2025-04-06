import { FC } from 'react';

import { Alert } from 'antd';

import { TagForm } from './components';

export type TagsProps = {};

import './tags.styles.scss';

const Tags: FC = () => {
  return (
    <>
      <Alert
        type="warning"
        message="TEMP implementation"
        description="This is just a temporary implementation for user tags"
        showIcon
      />
      <br />
      <TagForm />
    </>
  );
};

export default Tags;
