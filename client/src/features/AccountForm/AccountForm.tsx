import { FC } from 'react';

import { Button, Select, Input, Form } from 'antd';

import useAccountForm from './useAccountForm.hooks';
import type { EditableAccount } from '../../integration/apis/accounts';

export type AccountFormProps = {
  defaultValue?: EditableAccount;
};

const AccountForm: FC<AccountFormProps> = (props) => {
  const { defaultValue } = props;
  const { form, _submitHandler } = useAccountForm(props);

  return (
    <div className="btt-account-form">
      <Form
        name="account-form"
        layout="vertical"
        form={form}
        onFinish={_submitHandler}
        initialValues={defaultValue}
      >
        <Form.Item
          name={'name'}
          label="Name"
          rules={[{ required: true, message: 'This field is required.' }]}
        >
          <Input placeholder="Account name" />
        </Form.Item>
        <Form.Item
          name={'description'}
          label="Description"
          rules={[{ required: true, message: 'This field is required.' }]}
        >
          <Input name="description" placeholder="Description" />
        </Form.Item>
        <Form.Item name={'type'} label="Account type" initialValue={'DEPOSIT'}>
          <Select
            placeholder="Account Type"
            style={{ width: '100%' }}
            options={[
              {
                value: 'DEPOSIT',
                label: 'Deposit',
              },
              {
                value: 'CREDIT',
                label: 'Credit',
              },
            ]}
          />
        </Form.Item>
        <Button htmlType="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default AccountForm;
