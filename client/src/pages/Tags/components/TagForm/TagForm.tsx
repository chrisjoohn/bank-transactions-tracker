import { FC, useState } from 'react';

import { Input, Button, Row, Col } from 'antd';

import { tagsApi } from '../../../../integration/apis';

import type { InputProps } from 'antd';

export type TagFormProps = {
  value?: string; // could be undefined if to be used for update
};

import './tagForm.styles.scss';

const TagForm: FC<TagFormProps> = (props) => {
  const { value } = props;

  const [createTag, createState] = tagsApi.useCreateTagMutation();

  const [tagName, setTagName] = useState<string>(value || '');

  const _inputChangeHandler: InputProps['onChange'] = (e) => {
    setTagName(e.target.value);
  };

  const _submitHandler = async () => {
    setTagName(''); // reset input
    await createTag({
      name: tagName,
    });
  };

  return (
    <Row>
      <Col span={16}>
        <Input placeholder="Add tag" value={tagName} onChange={_inputChangeHandler} />
      </Col>
      <Col span={8}>
        <Button onClick={_submitHandler} disabled={createState.isLoading}>
          Submit
        </Button>
      </Col>
    </Row>
  );
};

export default TagForm;
