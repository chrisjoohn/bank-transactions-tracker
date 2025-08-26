import { Form } from 'antd';

import type { EditableAccount } from './AccountForm';

const useAccountForm = () => {
  const [form] = Form.useForm<EditableAccount>();

  const _submitHandler = (values: EditableAccount) => {
    console.log('values', values);
  };

  return {
    form,
    _submitHandler,
  };
};

export default useAccountForm;
