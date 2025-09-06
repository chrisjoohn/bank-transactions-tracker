import { Form } from 'antd';

import { accountsApi } from '../../integration/apis';

import type { AccountFormProps } from './AccountForm';
import type { EditableAccount } from '../../integration/apis/accounts';

const useAccountForm = (props: AccountFormProps) => {
  const { defaultValue, submitCallback } = props;
  const [form] = Form.useForm<EditableAccount>();

  const [createAccount] = accountsApi.useCreateAccountMutation();

  const _submitHandler = async (values: EditableAccount) => {
    if (defaultValue) {
      // perform update
      return;
    }

    const result = await createAccount(values);

    submitCallback && submitCallback('create', result.data!.unique_code);
  };

  return {
    form,
    _submitHandler,
  };
};

export default useAccountForm;
