import { FC } from 'react';

import { Form, Input, Select, Button, Space, ColorPicker } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';

import TagSelector from '../../TagSelector';

import type { FormProps } from 'antd';
import type { ChartShape } from '../TagChartsBuilder/TagChartsBuilder';

interface ChartFormProps {
  form?: FormProps['form'];
  onSubmit?: (values: any) => void;
  defaultValues?: ChartShape;
  actionButton?: boolean;
}

const ChartForm: FC<ChartFormProps> = (props) => {
  const { onSubmit, defaultValues, form, actionButton = true } = props;

  const [chartForm] = Form.useForm<ChartShape>();

  const _onSubmit = (formValues: ChartShape) => {
    onSubmit &&
      onSubmit({
        ...formValues,
        data: {
          tags: formValues.series.map((key) => key.tagId),
        },
      });
  };

  return (
    <Form<ChartShape>
      name="chart-form"
      layout="vertical"
      onFinish={_onSubmit}
      initialValues={defaultValues}
      form={form ?? chartForm}
    >
      <Form.Item
        name={'title'}
        label="Chart Title"
        rules={[{ required: true, message: 'This field is required.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'chartType'}
        rules={[{ required: true, message: 'This field is required.' }]}
        label="Chart Type"
      >
        <Select
          placeholder="Account Type"
          options={[
            { value: 'bar', label: 'Bar' },
            { value: 'line', label: 'Line' },
          ]}
        />
      </Form.Item>
      <Form.Item name={['preFilter', 'mainTag']} label="Main Tag">
        <TagSelector allowClear />
      </Form.Item>
      <Form.List name={['series']}>
        {(fields, { add, remove }) => (
          <>
            <span>Tags</span>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                <Form.Item
                  {...restField}
                  name={[name, 'tagId']}
                  rules={[{ required: true, message: 'Tag is required' }]}
                  noStyle
                  label="Tag"
                >
                  <TagSelector />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'style', 'color']}
                  rules={[{ required: true, message: 'Missing color' }]}
                  noStyle
                  getValueFromEvent={(color) => {
                    return color.toHexString();
                  }}
                  label="Color"
                >
                  <ColorPicker format="hex" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} color="red" />
              </Space>
            ))}
            <Button type="dashed" onClick={() => add()} block>
              Add Tag
            </Button>
          </>
        )}
      </Form.List>
      {!!actionButton && <Button htmlType="submit">Submit</Button>}
    </Form>
  );
};

export default ChartForm;
