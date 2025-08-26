import { Form } from 'antd';

import { accountsApi } from '../../integration/apis';

import type { AccountFormProps } from './AccountForm';
import type { EditableAccount } from '../../integration/apis/accounts';

const useAccountForm = (props: AccountFormProps) => {
  const { defaultValue } = props;
  const [form] = Form.useForm<EditableAccount>();

  const [createAccount] = accountsApi.useCreateAccountMutation();

  const _submitHandler = (values: EditableAccount) => {
    if (defaultValue) {
      // perform update
      return;
    }

    createAccount(values);
  };

  return {
    form,
    _submitHandler,
  };
};

export default useAccountForm;
